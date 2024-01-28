import React, { useEffect, useState } from "react";
import Users from "../components/Users";
import Messages from "../components/Messages";
import { gql, useSubscription } from "@apollo/client";
import { useConversationsDispatch } from "../context/CoversationsContext";
import { useUser } from "../context/AuthContext";
import Head from "next/head";
import { useSwipeable } from "react-swipeable";

const NEW_MESSAGE = gql`
  subscription NewMessage {
    newMessage {
      id
      content
      from
      to
      createdAt
    }
  }
`;

export default function Inbox() {
  const allUserDispatch = useConversationsDispatch();
  const { user } = useUser();
  const SwipeHandlerOnRight = useSwipeable({
    onSwipedRight: () => setUserBar(true),
  });
  const SwipeHandlerOnLeft = useSwipeable({
    onSwipedLeft: () => setUserBar(false),
  });
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  const [userBar, setUserBar] = useState(false);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const otherUser =
        user?.username === messageData.newMessage.to
          ? messageData.newMessage.from
          : messageData.newMessage.to;

      allUserDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message: messageData.newMessage,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageData, messageError]);

  return (
    <div
      {...SwipeHandlerOnRight}
      className="h-screen bg-purple-700  px-5 lg:px-32 py-20 flex justify-center items-center relative"
    >
      <Head>
        <title>Inbox</title>
        <meta name="description" content="Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        {...SwipeHandlerOnLeft}
        className={`block md:hidden left-0 absolute w-full h-full py-20 ${
          !userBar ? "-translate-x-full" : "translate-x-0"
        } transition-all duration-200 ease-in-out bg-gray-700/50 backdrop-blur-sm z-40`}
      >
        <div className="flex flex-col bg-gray-200 rounded-r-xl overflow-x-hidden w-3/4 h-full">
          <Users />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg grid grid-cols-4 h-full w-full">
        <div className="col-span-1 hidden md:flex flex-col bg-gray-200 rounded-l-xl overflow-x-hidden">
          <Users />
        </div>
        <div className="col-span-4 md:col-span-3">
          <Messages />
        </div>
      </div>
    </div>
  );
}
