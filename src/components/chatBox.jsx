import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function chatBox({ sendMessage }) {
  const [message, setMessage] = useState("");

  function handleChange(event) {
    setMessage(event.target.value);
  }

  function handleMessage(sendMessage) {
    sendMessage(message);
    setMessage("");
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleMessage(sendMessage);
    }
  };

  return (
    <div className="chatBox">
      <input
        type="text"
        className="input chat-input"
        placeholder="Send message. . ."
        onChange={handleChange}
        value={message}
        onKeyDown={(event) => handleKeyPress(event)}
      ></input>
      <button
        className="chat-button"
        onClick={() => handleMessage(sendMessage)}
      >
        <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
      </button>
    </div>
  );
}
