import { React, useEffect, useState, useRef, useCallback } from "react";
import ChatBox from "./chatBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import axios from "axios";
import ChatInfoModal from "./chatInfoModal";

export default function Chat({
  username,
  otherUsers,
  handleUpdateChat,
  updateMessages,
}) {
  const [socket, setSocket] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [modal, setModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [pageCounter, setPageCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef();
  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView();
  };

  function toggleModal() {
    if (modal) setModal(false);
    if (!modal) setModal(true);
  }

  useEffect(() => {
    // get messages
    setIsLoading(true);

    axios({
      url: "https://clumpusapi.duckdns.org/get-messages",
      method: "post",
      data: {
        users: [username].concat(otherUsers),
        page: pageCounter,
      },
      withCredentials: true,
    })
      // put messages in messageData array
      .then((response) => {
        setPageCounter(pageCounter + 1);

        setMessageCount(response.data.messageCount);

        let tempArray = messageData;
        response.data.messages.forEach((message) => {
          tempArray.push(message);
        });

        setMessageData(tempArray);
      })
      // get profile pictures
      .then(() => {
        [username].concat(otherUsers).forEach((user) => {
          axios({
            url: "https://clumpusapi.duckdns.org/get-profile-pic",
            method: "post",
            data: {
              username: user,
            },
            withCredentials: true,
          })
            // set profile pics and render message divs
            .then((response) => {
              const tempDict = profilePics;
              tempDict[user] = response.data;
              setProfilePics(tempDict);

              mapMessages(messageData, true);
              setIsLoading(false);
            });
        });
      })
      .catch((err) => {
        console.log("Error getting messages for this chat: ", err);
      });

    // socketio
    const newSocket = io("https://clumpusapi.duckdns.org/");

    newSocket.emit("joinWithUsers", {
      users: [username].concat(otherUsers),
    });

    newSocket.on("chatMessage", (data) => {
      let tempArray = messageData;
      tempArray.push(data);
      setMessageData(tempArray);

      mapMessages(tempArray, true);
      updateMessages(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leave", {
        users: [username].concat(otherUsers),
      });

      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  /**
   * Scroll Handler
   * Gets new messages if there are more to get on scroll to top
   */
  const handleScroll = useCallback(() => {
    if (scrollRef.current.scrollTop == 0) {
      if (messageData.length < messageCount) {
        // get next page of messages

        setIsLoading(true);
        const beforeHeight = scrollRef.current.scrollHeight;

        setTimeout(() => {
          axios({
            url: "https://clumpusapi.duckdns.org/get-messages",
            method: "post",
            data: {
              users: [username].concat(otherUsers),
              page: pageCounter,
            },
            withCredentials: true,
          })
            .then((response) => {
              setPageCounter(pageCounter + 1);

              let tempArray = [];

              response.data.messages.forEach((message) => {
                tempArray.push(message);
              });

              setMessageData(tempArray.concat(messageData));
              mapMessages(tempArray.concat(messageData));
              setIsLoading(false);
            })
            .then(() => {
              setTimeout(() => {
                const afterHeight = scrollRef.current.scrollHeight;
                scrollRef.current.scrollTo(0, afterHeight - beforeHeight);
              }, 50);
            });
        }, 1000);
      }
    }
  });

  /**
   * Maps messages from the messageData array to divs to be rendered
   */
  function mapMessages(messageArr, scroll) {
    let chatMSG = messageArr.map((message, index, array) => {
      // check when to assign a profile pic / header
      let useProfilePic = false;
      let useHeader = false;
      if (array[index - 1] && array[index - 1].from != message.from) {
        useHeader = true;
        useProfilePic = true;
      } else if (!array[index - 1]) {
        useHeader = true;
        useProfilePic = true;
      }

      // return message div based on sender
      if (message.from == username) {
        return (
          <div key={nanoid()} className="chat-message-wrapper">
            {useHeader ? (
              <div className="message-header" style={{ textAlign: "right" }}>
                {" "}
                {message.from}{" "}
              </div>
            ) : null}
            <div className="chat-flex-blue chat-flex">
              <div className={"blue-message chat-message"}>
                {message.message}
              </div>
              {useProfilePic ? (
                <img
                  className="chat-profile-pic"
                  src={profilePics[message.from]}
                />
              ) : (
                <div className="white-space-no-pfp" />
              )}
            </div>
          </div>
        );
      } else {
        return (
          <div key={nanoid()} className="chat-message-wrapper">
            <div className="chat-top">
              {useHeader ? (
                <div className="message-header" style={{ textAlign: "left" }}>
                  {" "}
                  {message.from}{" "}
                </div>
              ) : null}
            </div>
            <div className="chat-flex-grey chat-flex">
              {useProfilePic ? (
                <img
                  className="chat-profile-pic"
                  src={profilePics[message.from]}
                />
              ) : (
                <div className="white-space-no-pfp" />
              )}
              <div className={" grey-message chat-message"}>
                {message.message}
              </div>
            </div>
          </div>
        );
      }
    });

    setChatMessages(chatMSG);

    if (messageArr.length == chatMSG.length && scroll) {
      setTimeout(() => scrollToBottom(), 50);
    }
  }

  function sendMessage(message) {
    socket.emit("chatMessage", {
      message: message,
      sender: username,
      recipients: otherUsers,
    });
  }

  /**
   * Generates a name for a group chat
   * @returns A string for this group chat's header
   */
  function groupChatName() {
    let chatName = "Chat with ";
    if (otherUsers.length == 2) {
      chatName += otherUsers[0] + " and " + otherUsers[1] + ".";
    } else if (otherUsers.length == 3) {
      chatName +=
        otherUsers[0] + ", " + otherUsers[1] + ", and " + otherUsers[2] + ".";
    } else if (otherUsers.length > 3) {
      chatName +=
        otherUsers[0] +
        ", " +
        otherUsers[1] +
        ", and " +
        (otherUsers.length - 2) +
        " others.";
    }
    return chatName;
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-top-bar">
        <div className="chat-top-bar-space"></div>
        {otherUsers.length == 1 ? (
          <div className="chat-user-info">
            <img
              className="chat-profile-pic chat-top-pic"
              src={profilePics[otherUsers]}
              onClick={() => toggleModal()}
            />
            <div className="chat-header">Chat with {otherUsers}</div>
          </div>
        ) : (
          <div>
            <img
              className="chat-profile-pic chat-top-pic"
              src={"http://3.15.224.228/img/defaultGroupPic.png"}
              onClick={() => toggleModal()}
            ></img>
            <div className="chat-header">{groupChatName()}</div>
          </div>
        )}
        <div className="chat-close" onClick={() => handleUpdateChat([])}>
          <FontAwesomeIcon icon="fa-solid fa-x" />
        </div>
      </div>
      <div
        className="chat-messages-wrapper"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {isLoading ? <div className="loader"></div> : null}
        {chatMessages}
        <div ref={bottomRef}></div>
      </div>

      <div className="chatbox-wrapper">
        <ChatBox sendMessage={sendMessage} />
      </div>
      {modal ? (
        <ChatInfoModal
          userList={[username].concat(otherUsers)}
          group={otherUsers.length > 1}
        />
      ) : null}
    </div>
  );
}
