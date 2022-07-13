import React from "react";
import Image from "next/image";

export default function UserImageOrWithout({ userImage, userName }) {
  return (
    <div
      className={`rounded-full w-10 h-10 overflow-hidden flex justify-center items-center bg-gray-800 text-white`}
    >
      {userImage ? (
        <Image src={userImage} width={50} height={50} alt="user profile" />
      ) : (
        <div className={` select-none cursor-default`}>
          {userName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
