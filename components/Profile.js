import React from "react";
import UserImageOrWIthout from "./userImageOrWIthout";

export default function Profile({ user }) {
  return (
    <div className="flex gap-2 justify-center items-center">
      <UserImageOrWIthout userImage={user.imageurl} userName={user.username}></UserImageOrWIthout>
      <span>
        {
          // @ts-ignore
          user?.username
        }
      </span>
    </div>
  );
}
