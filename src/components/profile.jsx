import { React, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import defaultProfilePic from "../assets/profilePic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Profile({ username }) {
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfileInfo();
  }, [username]);

  function getProfileInfo() {
    axios({
      url: "http://3.15.224.228/get-profile-info",
      method: "post",
      data: {
        username: username,
      },
      withCredentials: true,
    })
      .then((response) => {
        setBio(response.data.bio);
        setFormUsername(response.data.username);
        response.data.profilePic != ""
          ? setProfilePic("http://3.15.224.228/" + response.data.profilePic)
          : null;
      })
      .catch((err) => {
        console.log("Error getting profile info: ", err);
      });
  }

  function handleBioChange(event) {
    setBio(event.target.value);
  }

  function handleUsernameChange(event) {
    setFormUsername(event.target.value);
  }

  function handleSubmit() {
    axios({
      url: "http://3.15.224.228/update-profile",
      method: "post",
      data: { bio: bio, profilePic: profilePic },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then(() => {
        setMessage("Profile Updated!");
      })
      .catch((err) => {
        console.log("Error updating profile: ", err);
      });
  }

  return (
    <div className="profile-wrapper">
      <div className="inner-profile-wrapper">
        <div className="profile-picture">
          <Dropzone
            onDrop={(acceptedFiles) => {
              const reader = new FileReader();
              reader.onload = () => {
                const dataURL = reader.result;
                setProfilePic(dataURL);
              };
              reader.readAsDataURL(acceptedFiles[0]);
              console.log(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <button id="profile-edit-icon">
                    <FontAwesomeIcon icon="fa-solid fa-camera" />
                  </button>
                </div>
              </section>
            )}
          </Dropzone>
          {profilePic != "" ? (
            <img src={profilePic}></img>
          ) : (
            <img src={defaultProfilePic}></img>
          )}
        </div>
        <div className="profile-item">
          <p className="title">Username</p>
          <input
            type="text"
            placeholder="username"
            className="input"
            id="profileUsername"
            name="username"
            onChange={handleUsernameChange}
            value={formUsername}
            readOnly
          ></input>
        </div>
        <div className="profile-item" id="profile-bio">
          <p className="title">Bio</p>
          <textarea
            type="text"
            placeholder="Write about yourself!"
            className="input"
            name="bio"
            onChange={handleBioChange}
            value={bio}
          ></textarea>
        </div>
        <div className="profile-item">
          <button type="submit" className="login-button" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
      {message != "" ? (
        <div className="success-message">
          <p>{message}</p>
        </div>
      ) : null}
    </div>
  );
}
