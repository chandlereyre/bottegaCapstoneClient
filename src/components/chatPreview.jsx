import { useState, useEffect } from "react";

export default function chatPreview({
  users,
  handleUpdateChat,
  previewMessage,
  profilePic,
  group,
}) {
  const [prevMSG, setPrevMSG] = useState(previewMessage);

  useEffect(() => {
    if (previewMessage.length > 20) {
      setPrevMSG(previewMessage.substring(0, 16) + "...");
    } else {
      setPrevMSG(previewMessage);
    }
  }, [previewMessage]);

  function updateChat() {
    handleUpdateChat(users);
  }

  function getPFPURL() {
    let profilePicURL;

    if (profilePic != "") {
      profilePicURL = profilePic;
    } else {
      profilePicURL = "http://3.15.224.228/img/defaultProfilePic.png";
    }
    if (group) {
      profilePicURL = "http://3.15.224.228/img/defaultGroupPic.png";
    }
    return profilePicURL;
  }

  function groupChatName() {
    let chatName = "";
    if (users.length == 2) {
      chatName += users[0] + " and " + users[1] + ".";
    } else if (users.length == 3) {
      chatName += users[0] + ", " + users[1] + ", and " + users[2] + ".";
    } else if (users.length > 3) {
      chatName +=
        users[0] + ", " + users[1] + ", and " + (users.length - 2) + " others.";
    }
    return chatName;
  }

  return (
    <div
      className="chat-preview-wrapper"
      onClick={() => {
        updateChat();
      }}
    >
      <div className="chat-preview-pfp">
        <img src={getPFPURL()}></img>
      </div>
      <div>
        {group ? (
          <div className="person-name">{groupChatName()}</div>
        ) : (
          <div className="person-name">{users}</div>
        )}
        <div className="text">{prevMSG}</div>
      </div>
    </div>
  );
}
