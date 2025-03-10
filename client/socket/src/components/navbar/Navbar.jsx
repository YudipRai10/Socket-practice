import React, { useEffect, useState } from "react";
import "./Navbar.css";
import Notification from "../../assets/notification.svg";
import message from "../../assets/message.svg";
import settings from "../../assets/settings.svg";

const Navbar = ({ socket }) => {
  const [notification, setNotification] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only set up the listener if socket is available
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotification((prev) => [...prev, data]);
      });

      // Cleanup on unmount to avoid memory leaks or unexpected behavior
      return () => {
        socket.off("getNotification");
      };
    }
  }, [socket]);

  console.log(notification);

  const displayNotification = ({ senderName, type }) => {
    let action;

    if (type === 1) {
      action = "liked";
    } else if (type === 2) {
      action = "commented";
    } else {
      action = "shared";
    }

    return <span className="notfi">{`${senderName} ${action} your post`}</span>;
  };

  const handleRead = () => {
    setNotification([]);
    setOpen(false);
  };

  return (
    <div className="navbar">
      <span className="logo">Wassup App</span>
      <div className="icons">
        <div className="icon" onClick={() => setOpen(!open)}>
          <img className="iconImg" src={Notification} alt="" />
          {notification.length > 0 && (
            <div className="counter">{notification.length}</div>
          )}
        </div>
        <div className="icon" onClick={() => setOpen(!open)}>
          <img className="iconImg" src={message} alt="" />
        </div>
        <div className="icon" onClick={() => setOpen(!open)}>
          <img className="iconImg" src={settings} alt="" />
        </div>
      </div>

      {open && (
        <div className="notifications">
          {notification.map((n) => displayNotification(n))}
          <button className="noti-btn" onClick={handleRead}>
            Mark as Read
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
