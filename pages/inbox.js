import React, { useEffect } from "react";
import Users from "../components/Users";
import Messages from "../components/Messages";
import { gql, useSubscription } from "@apollo/client";
import { useConversationsDispatch } from "../context/CoversationsContext";
import { useUser } from "../context/AuthContext";
import Head from "next/head";

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
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

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
    <div className="h-screen bg-purple-700 px-32 py-20 flex justify-center items-center">
      <Head>
        <title>{user?.username} | Inbox</title>
        <meta name="description" content="Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white rounded-xl shadow-lg grid grid-cols-4 h-full w-full">
        <Users />
        <Messages />
      </div>
    </div>
  );
}
