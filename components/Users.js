import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Profile from "./Profile";
import { IoLogOutOutline } from "react-icons/io5";
import UserImageOrWIthout from "./userImageOrWithout";
import { useUser, useUserUpdate } from "../context/AuthContext";
import { useRouter } from "next/router";
import {
  useConversationsDispatch,
  useConversations,
} from "../context/CoversationsContext";
import CreateNewMessage from "./CreateNewMessage";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      username
      email
      imageurl
      updatedAt
      id
      latestMessage {
        content
        createdAt
        from
      }
    }
  }
`;

export default function Users() {
  //NOTE init hooks
  const userDetail = useUser();
  const userUpdate = useUserUpdate();
  const router = useRouter();
  const allUserDispatch = useConversationsDispatch();
  const { users } = useConversations();
  const selectedUser = users?.find(u=> u.selected == true)

  const selectUserHandler = (user)=>{
    setSearchUser(null)
    allUserDispatch({type:"SET_SELECTED_USER",payload:user}); 
  }

  //NOTE init states
  const [user, setUser] = useState(null);
  const [searchUser,setSearchUser] = useState(null)

  //NOTE graphql qurey
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      allUserDispatch({ type: "SET_USERS", payload: data.getUsers });
    },
    onError: (error) => {
      window.location.href = "/login"
    },
  });

  //NOTE logout user
  const LogoutHandler = () => {
    userUpdate({ type: "logout" });
    window.location.href = "/login"
  };

  //NOTE get all the users for conversation also select user handler
  let userConv;
  if (!users || loading) {
    userConv = <div className="h-full justify-center items-center">Loading...</div>
  } else {
    const filterUserByLastMessage = users.filter((user) => {
      return user.latestMessage != null;
    });
    filterUserByLastMessage.sort((a,b)=>{return Number(new Date(b.latestMessage.createdAt))-Number(new Date(a.latestMessage.createdAt))})
    if (filterUserByLastMessage.length === 0) {
      userConv = <div className="h-full flex justify-center items-center">No Conversation</div>;
    } else {
      userConv = (
        <div className="flex flex-col">
          {filterUserByLastMessage.map((item) => {
            return (
              <div
                className={` cursor-pointer select-none ${searchUser == null || item.username.includes(searchUser) ? "flex" : "hidden"} gap-3 p-3 items-center ${
                  selectedUser?.username == item.username ? "bg-gray-100" : ""
                }`}
                key={item.id}
                onClick={() => selectUserHandler(item)}
              >
                <div className="w-10">
                  <UserImageOrWIthout
                    userImage={item.imageurl}
                    userName={item.username}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <span className="font-semibold">{item.username}</span>
                  <span className="text-xs truncate overflow-hidden w-1/2 lg:w-4/5">
                    {item.latestMessage.from ==
                    // @ts-ignore
                    user?.username
                      ? "You: "
                      : ""}{" "}
                    {item.latestMessage.content}
                  </span>
                  {/* <span className="text-gray-400 text-xs">
                    {item.latestMessage.createdAt}
                  </span> */}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  const searchHandler = (value)=>{
    if(value.trim() === ""){
      setSearchUser(null)
    }else{
      setSearchUser(value.trim())
    }
  }

  useEffect(() => {
    if (userDetail.user) {
      setUser(userDetail?.user);
    } else {
      router.push("/login");
    }
  }, [userDetail, router]);


  return (
    <div className="col-span-1 flex flex-col bg-gray-200 rounded-l-xl overflow-x-hidden">
      <div className="bg-gray-300 py-4 px-3 rounded-tl-xl flex flex-col gap-3">
        <div className="flex justify-between px-3">
          <span className="font-semibold text-lg">Chats</span>
          <CreateNewMessage alluser={users} />
        </div>
        <input
          type="text"
          name=""
          className="py-1 px-3 rounded-full"
          placeholder="Search User"
          onChange={(e)=> searchHandler(e.target.value)}
          value={searchUser ? searchUser : ""}
        />
      </div>
      <div className="h-full">
        {!loading && users ? userConv : <div className="flex h-full justify-center items-center">Loading ...</div>}
      </div>
      <div className="bg-gray-300 py-5 rounded-bl-xl px-3">
        <div className="flex justify-between items-center px-2">
          {user && <Profile user={user} />}
          <button
            className="bg-red-700 p-2 text-white rounded-full"
            onClick={LogoutHandler}
          >
            <IoLogOutOutline size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
