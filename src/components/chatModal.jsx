import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { React, useState } from "react";
import axios from "axios";

export default function chatModal({ toggleModal, setModal, modal }) {
  const [recipient, setRecipient] = useState("");
  const [recipientArr, setRecipientArr] = useState([]);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    setRecipient(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addRecipient();
    }
  };

  function removeRecipient(event) {
    const recipient = event.target.innerHTML;
    const tempArray = recipientArr;
    tempArray.splice(recipient, 1);
    setRecipientArr([...tempArray]);
  }

  function addRecipient() {
    // TODO check if recipient is valid
    axios({
      url: "http://3.15.224.228/check-user",
      method: "post",
      data: { username: recipient },
      withCredentials: true,
    })
      .then((response) => {
        if (response.data == "user found") {
          const tempArray = recipientArr;
          tempArray.push(recipient);
          setRecipientArr(tempArray);
          setRecipient("");
          setMessage("");
        } else {
          setMessage("User not found.");
          setRecipient("");
        }
      })
      .catch((err) => {
        console.log("Error checking recipient: ", err);
      });
  }

  function createChat() {
    axios({
      url: "http://3.15.224.228/create-chat",
      method: "post",
      data: {
        recipients: recipientArr,
      },
      withCredentials: true,
    })
      .then(() => {
        setRecipientArr([]);
        toggleModal(setModal, modal, true);
      })
      .catch((err) => {
        console.log("Error creating chat: ", err);
      });
  }

  return (
    <div>
      <div
        className="chat-modal-wrapper"
        onClick={() => toggleModal(setModal, modal, false)}
      >
        <div
          className="chat-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-top-bar">
            <div className="title">New Message</div>
            <FontAwesomeIcon
              icon="fa-solid fa-x"
              className="icon"
              onClick={() => toggleModal(setModal, modal, false)}
            />
          </div>
          <div className="modal-input">
            <input
              type="text"
              className="input"
              placeholder="Recipient. . ."
              onKeyDown={(event) => handleKeyPress(event)}
              onChange={handleChange}
              value={recipient}
            />
            <a id="add-recipient-button" onClick={addRecipient}>
              <FontAwesomeIcon icon="fa-solid fa-plus" />
            </a>
          </div>
          <div id="recipients-wrapper">
            {recipientArr.map((recipient) => {
              return (
                <div
                  key={recipient}
                  className="recipient"
                  onClick={(event) => {
                    removeRecipient(event);
                  }}
                >
                  {recipient}
                </div>
              );
            })}
          </div>
          <button
            className="login-button"
            id="create-chat-button"
            onClick={createChat}
          >
            Create Chat
          </button>
        </div>
        {message != "" ? (
          <div className="error-message" id="chat-modal-message">
            <p>{message}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
