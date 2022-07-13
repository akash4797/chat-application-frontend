import React from "react";
import UserImageOrWithout from "./userImageOrWithout";

export default function Profile({ user }) {
  return (
    <div className="flex gap-2 justify-center items-center">
      <UserImageOrWithout userImage={user.imageurl} userName={user.username}></UserImageOrWithout>
      <span>
        {
          // @ts-ignore
          user?.username
        }
      </span>
    </div>
  );
}
