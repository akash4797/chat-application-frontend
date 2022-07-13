import React, { useEffect } from "react";
import UserImageOrWithout from "./userImageOrWithout";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Message from "./Message";
import {
  useConversations,
  useConversationsDispatch,
} from "../context/CoversationsContext";
import { IoSend } from "react-icons/io5";
import { useFormik } from "formik";
import * as yup from "yup";

const GET_MESSAGES = gql`
  query GetMessages($input: GetMessageInput) {
    getMessages(input: $input) {
      id
      content
      from
      to
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessageToReddots($userinput: SendMessage) {
    sendMessage(userinput: $userinput) {
      id
      content
      from
      to
      createdAt
    }
  }
`;

export default function Messages() {
  const { users } = useConversations();
  const allUserDispatch = useConversationsDispatch();
  const selectedUser = users?.find((u) => u.selected == true);
  const messages = selectedUser?.messages;

  const [
    getMessages,
    { loading: meassagesLoading, data: messagesData, error },
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => window.location.href = "/login"
  });

  if (error) window.location.href = "/login";

  useEffect(() => {
    if (selectedUser && !selectedUser?.messages) {
      const variables = {
        input: {
          // @ts-ignore
          from: selectedUser.username,
        },
      };
      getMessages({ variables });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      allUserDispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesData]);

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: yup.object({
      content: yup.string().min(1).required(),
    }),
    onSubmit: (values, { resetForm }) => {
      let variables = {
        userinput: {
          to: selectedUser.username,
          content: values.content.trim(),
        },
      };
      sendMessage({ variables });
      resetForm();
    },
  });

  return (
    <div className="col-span-3">
      {selectedUser ? (
        <div className="h-full relative flex flex-col">
          <div className="py-3 bg-gray-200 px-5 flex gap-2 items-center rounded-tr-xl">
            <div className="w-10">
              <UserImageOrWithout
                // @ts-ignore
                userImage={selectedUser.imageurl}
                // @ts-ignore
                userName={selectedUser.username}
              />
            </div>
            <span className="text-xl font-semibold">
              {
                // @ts-ignore
                selectedUser.username
              }
            </span>
          </div>
          <div className="h-[500px] overflow-y-scroll px-5 flex flex-col-reverse gap-4">
            {!meassagesLoading && messages && messages.length > 0 ? (
              messages.map((message, index) => {
                return (
                  <Message
                    key={message.id}
                    message={message}
                    index={index}
                    length={messages.length}
                  />
                );
              })
            ) : (
              <div className="h-full flex justify-center items-center">
                Loading...
              </div>
            )}
          </div>
          <div className="h-20"></div>
          <div className="h-20 absolute bottom-0 w-full bg-gray-200 rounded-br-xl">
            <form
              className="w-full h-full px-5 flex justify-center items-center gap-3"
              onSubmit={formik.handleSubmit}
            >
              <input
                type="text"
                name="content"
                className="w-full px-3 py-2 rounded-lg"
                placeholder="Write Message"
                onChange={formik.handleChange}
                value={formik.values.content}
              />
              <button type="submit">
                <IoSend className="w-7 h-7 text-purple-700" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className=" h-full flex justify-center items-center">
          <span>Create or select a conversation</span>
        </div>
      )}
    </div>
  );
}
