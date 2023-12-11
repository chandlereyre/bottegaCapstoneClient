import { React, useEffect, useState } from "react";
import axios from "axios";

export default function ChatInfoModal({ userList, group }) {
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!group) {
      setIsLoading(true);
      axios({
        url: "https://clumpusapi.duckdns.org/get-profile-info",
        method: "post",
        data: { username: userList[1] },
        withCredentials: true,
      })
        .then((response) => {
          setBio(response.data.bio);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Error getting information for this user: ", error);
        });
    }
  }, []);

  return (
    <div className="chat-info-modal-wrapper">
      <div className="chat-info-modal">
        {isLoading ? (
          <div className="loader"></div>
        ) : group ? (
          <div className="title">Members</div>
        ) : (
          <div className="title">{userList[1]}</div>
        )}
        {group ? (
          <ul>
            {userList.map((user) => {
              return <li key={user}>{user}</li>;
            })}
          </ul>
        ) : bio == "" ? (
          <div className="bio">
            This user doesn't have a bio. You should tell them to make one!
          </div>
        ) : (
          <div className="bio">{bio}</div>
        )}
        {}
      </div>
    </div>
  );
}
