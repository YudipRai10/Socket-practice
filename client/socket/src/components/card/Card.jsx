import React from "react";
import "./Card.css";
import Heart from "../../assets/heart.svg";
import HeartFilled from "../../assets/heartFilled.svg";
import Comment from "../../assets/comment.svg";
import Share from "../../assets/share.svg";
import Info from "../../assets/info.svg";
import { useState } from "react";

const Card = ({ post, socket, user }) => {
  const [liked, setLiked] = useState(false);

  const handleNotification = (type) => {
    if (socket) {
      setLiked(true);
      socket.emit("sendNotification", {
        senderName: user,
        receiverName: post.username,
        type,
      });
    } else {
      console.error("Socket is not available");
    }
  };

  return (
    <div className="card">
      <div className="info">
        <img src={post.userImg} alt="" className="userImg" />
        <span>{post.fullname}</span>
      </div>
      <img src={post.postImg} alt="" className="postImg" />
      <div className="interaction">
        {liked ? (
          <img src={HeartFilled} className="cardIcon" alt="" />
        ) : (
          <img
            src={Heart}
            className="cardIcon"
            onClick={() => handleNotification(1)}
            alt=""
          />
        )}

        <img
          src={Comment}
          className="cardIcon"
          alt=""
          onClick={() => handleNotification(2)}
        />
        <img
          src={Share}
          className="cardIcon"
          alt=""
          onClick={() => handleNotification(3)}
        />
        <img src={Info} className="cardIcon infoIcon" alt="" />
      </div>
    </div>
  );
};

export default Card;
