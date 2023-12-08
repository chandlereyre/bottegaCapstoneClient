import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import Sidebar from "../components/sidebar";
import ChatList from "../components/chatList";
import Profile from "../components/profile";
import Chat from "../components/chat";
import logo from "../assets/chat.png";

export default function Main(props) {
  const [activeChat, setActiveChat] = useState([]);
  const [msgListChats, setMsgListChats] = useState([]);
  const listRef = useRef();

  useEffect(() => {
    // props.type == "home" ? getChats() : null;

    let webSocket = null;

    if (props.type == "home") {
      axios({
        url: "https://clumpusapi.duckdns.org/get-chats",
        method: "get",
        withCredentials: true,
      })
        .then((response) => {
          setMsgListChats(response.data);

          webSocket = io("https://clumpusapi.duckdns.org/");

          webSocket.on("chatMessage", (data) => {
            console.log(data);
            updateMessages(data);
          });

          Object.keys(response.data).forEach((message) => {
            webSocket.emit("joinWithRoom", {
              room: message,
            });
          });

          listRef.current = response.data;
        })
        .catch((error) => {
          console.log("Error getting chats: ", error);
        });
    }

    return () => {
      if (webSocket != null) {
        Object.keys(msgListChats).forEach((message) => {
          webSocket.emit("leaveWithRoom", {
            room: message,
          });
        });

        webSocket.disconnect();
      }
    };
  }, [props.type]);

  /**
   * Updates chatList preview messages
   * @param {*} data
   */
  function updateMessages(data) {
    let tempArray = listRef.current;
    console.log(tempArray);

    Object.keys(tempArray).forEach((key) => {
      console.log(key);
      if (key == data.room) {
        tempArray[key].lastMessage = data.message;
      }
    });
    setMsgListChats({ ...tempArray });
  }

  /**
   * Opens a chat with a given user
   * @param {*} users arr of potential users to chat with
   */
  async function handleUpdateChat(users) {
    // for 2 people
    if (users.length == 1) {
      if (users.toString() !== activeChat.toString()) {
        await setActiveChat([]);
        setActiveChat(users);
      }
    }

    // for groups
    if (users.toString() !== activeChat.toString()) {
      await setActiveChat([]);
      setActiveChat(users);
    }
  }

  /**
   * Gets list of potential users to chat with
   */
  function getChats() {
    axios({
      url: "https://clumpusapi.duckdns.org/get-chats",
      method: "get",
      withCredentials: true,
    })
      .then((response) => {
        setMsgListChats({ ...response.data });
      })
      .catch((error) => {
        console.log("Error getting chats: ", error);
      });
  }

  function handleLogout() {
    props.handleSuccessfulLogout();
  }

  // displays if a chat isn't open
  const message = (
    <div className="main-filler">
      <img src={logo}></img>
      <div className="title">Hey there, {props.username}</div>
    </div>
  );

  return (
    <div className="main-wrapper">
      <div>
        <Sidebar handleSuccessfulLogout={() => handleLogout()} />
      </div>
      {props.type == "home" ? (
        <div className="home">
          <ChatList
            handleUpdateChat={handleUpdateChat}
            thisUser={props.username}
            chatList={msgListChats}
            getChats={getChats}
          />
          {activeChat.length > 0 ? (
            <Chat
              otherUsers={activeChat}
              handleUpdateChat={handleUpdateChat}
              username={props.username}
              updateMessages={updateMessages}
            />
          ) : (
            message
          )}
        </div>
      ) : (
        <div>
          <Profile username={props.username} />
        </div>
      )}
    </div>
  );
}
