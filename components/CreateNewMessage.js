import React, { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import Popup from "reactjs-popup";
import { AiOutlineClose } from "react-icons/ai";
import UserImageOrWithout from "./UserImageOrWithout";
import { BiArrowBack } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useConversationsDispatch } from "../context/CoversationsContext";

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

export default function CreateNewMessage({ alluser }) {
  const [searchAllUser, setSearchAllUser] = useState(null);
  const [selectedUserForMessage, setSelectedUserForMessage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const allUserDispatch = useConversationsDispatch();

  const allSearchHandler = (value) => {
    if (value.trim() === "") {
      setSearchAllUser(null);
    } else {
      setSearchAllUser(value.trim());
    }
  };

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => console.log(error),
  });

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: yup.object({
      content: yup.string().min(1).required(),
    }),
    onSubmit: (values, { resetForm }) => {
      if (selectedUserForMessage) {
        let variables = {
          userinput: {
            // @ts-ignore
            to: selectedUserForMessage?.username,
            content: values.content.trim(),
          },
        };
        sendMessage({ variables });
        resetForm();
        setSelectedUserForMessage(null);
        setOpenModal(false);
        allUserDispatch({
          type: "SET_SELECTED_USER",
          payload: selectedUserForMessage,
        });
      }
    },
  });

  return (
    <>
      <Popup
        trigger={
          <button>
            <IoCreateOutline size={20} />
          </button>
        }
        modal
        onClose={() => {
          setSelectedUserForMessage(null);
          setOpenModal(false);
        }}
        closeOnDocumentClick={false}
        open={openModal}
        onOpen={() => {
          setOpenModal(true);
        }}
      >
        {
          // @ts-ignore
          (close) => (
            <div className="backdrop-blur-sm bg-black/30 h-screen w-screen flex justify-center items-center">
              {/* Message Part */}
              <div
                className={`${
                  selectedUserForMessage ? "block" : "hidden"
                } relative bg-gray-200 w-96 h-48 rounded-xl shadow-2xl`}
              >
                <button
                  className="absolute top-0 right-0 -translate-y-2  translate-x-2 bg-red-600 rounded-full p-1 focus:outline-none"
                  onClick={close}
                >
                  <AiOutlineClose className="w-4 h-4 text-white" />
                </button>
                <div className="h-full flex flex-col">
                  <div className="p-3 bg-gray-500 text-white rounded-t-xl flex items-center gap-2">
                    <button onClick={() => setSelectedUserForMessage(null)}>
                      <BiArrowBack className="w-5 h-5 text-gray-300" />
                    </button>
                    <span>Send Message</span>
                  </div>
                  <div className="flex gap-2 items-center p-5">
                    <div className="w-10">
                      {selectedUserForMessage && (
                        <UserImageOrWithout
                          // @ts-ignore
                          userImage={selectedUserForMessage?.imageurl}
                          // @ts-ignore
                          userName={selectedUserForMessage?.username}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {
                          // @ts-ignore
                          selectedUserForMessage?.username
                        }
                      </span>
                    </div>
                  </div>
                  <form
                    className="flex gap-2 items-center px-5"
                    onSubmit={formik.handleSubmit}
                  >
                    <input
                      type="text"
                      name="content"
                      className="w-full py-1 px-3 rounded-lg text-black focus:ring-purple-700"
                      placeholder="Write Message"
                      onChange={formik.handleChange}
                      value={formik.values.content}
                    />
                    <button type="submit">
                      <IoSend className="w-6 h-6" />
                    </button>
                  </form>
                </div>
              </div>
              {/* all user part */}
              <div
                className={`modal ${
                  selectedUserForMessage ? "hidden" : "block"
                } bg-gray-200 w-96 rounded-xl shadow-2xl relative`}
              >
                <button
                  className="absolute top-0 right-0 -translate-y-2  translate-x-2 bg-red-600 rounded-full p-1 focus:outline-none"
                  onClick={close}
                >
                  <AiOutlineClose className="w-4 h-4 text-white" />
                </button>
                <div className="header p-5 rounded-t-xl flex justify-center items-center bg-gray-500 text-white flex-col gap-3">
                  <span className="text-lg font-semibold">
                    Create or start conversation
                  </span>
                  <input
                    className="w-full py-1 px-3 rounded-full text-black focus:ring-purple-700"
                    placeholder="Search User"
                    type="text"
                    value={searchAllUser ? searchAllUser : ""}
                    onChange={(e) => allSearchHandler(e.target.value)}
                    autoFocus
                  />
                </div>
                <hr />
                <div className="overflow-auto h-80">
                  {alluser?.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className={`${
                          searchAllUser == null ||
                          user.username.includes(searchAllUser)
                            ? "flex"
                            : "hidden"
                        } flex w-full items-center gap-2 px-5 py-4 hover:bg-gray-100 cursor-pointer`}
                        onClick={() => {
                          setSelectedUserForMessage(user);
                        }}
                      >
                        <div className="w-10">
                          <UserImageOrWithout
                            userImage={user.imageurl}
                            userName={user.username}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span>{user.username}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        }
      </Popup>
    </>
  );
}
