import React from "react";
import { useUser } from "../context/AuthContext";
import Popup from "reactjs-popup";
import moment from "moment";

export default function Message({ message, index, length }) {
  const { user } = useUser();
  return (
    <>
      <div
        className={`flex ${index === 0 ? "mb-4" : "mb-0"} ${
          index === length - 1 ? "mt-4 pt-4" : "mt-0"
        }`}
      >
        <Popup
          trigger={
            <div
              className={`${
                message.from === user.username
                  ? "bg-purple-700 ml-auto text-white"
                  : "mr-auto bg-gray-200 text-black"
              } p-3 rounded-lg`}
            >
              {message.content}
            </div>
          }
          on={["hover"]}
          position={message.from === user.username ? "top left" : "top right"}
          arrow={false}
        >
          <span className="text-xs px-2 py-1 bg-black opacity-80 text-white rounded">
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </span>
        </Popup>
      </div>
    </>
  );
}
