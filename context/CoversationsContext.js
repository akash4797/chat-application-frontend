import React, { useContext, useReducer } from "react";

// @ts-ignore
const ConversationContext = React.createContext();
// @ts-ignore
const ConversationDispachContext = React.createContext();

export function useConversations() {
  return useContext(ConversationContext);
}

export function useConversationsDispatch() {
  return useContext(ConversationDispachContext);
}

function messageReducer(state, action) {
  let usersCopy, userIndex;
  const { username, messages, message } = action.payload;
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_USER_MESSAGES":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((u) => u.username === username);
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };
      return { ...state, users: usersCopy };
    case "SET_SELECTED_USER":
      usersCopy = state?.users.map((user) => ({
        ...user,
        selected: user?.username == action.payload.username,
      }));
      return { ...state, users: usersCopy };
    case "ADD_MESSAGE":
      usersCopy = [...state.users];
      userIndex = usersCopy.findIndex((u) => u.username === username);
      let newMessageInjection;
      if(usersCopy[userIndex]?.messages){
        newMessageInjection = {
          ...usersCopy[userIndex],
          messages: [message, ...usersCopy[userIndex]?.messages],
          latestMessage : message
        };
      }else{
        newMessageInjection = {
          ...usersCopy[userIndex],
          latestMessage : message
        };
      }
      usersCopy[userIndex] = newMessageInjection;
      return {
        ...state,
        users: usersCopy,
      };

    default:
      break;
  }
}

export function ConversationsProvider({ children }) {
  const [state, dispatch] = useReducer(messageReducer, { users: null });
  return (
    <ConversationContext.Provider value={state}>
      <ConversationDispachContext.Provider value={dispatch}>
        {children}
      </ConversationDispachContext.Provider>
    </ConversationContext.Provider>
  );
}
