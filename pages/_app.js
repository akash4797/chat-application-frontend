import React from "react";
import "../styles/globals.css";
import "../styles/popup.css";
import { AuthProvider } from "../context/AuthContext";
import { ConversationsProvider } from "../context/CoversationsContext";
import ApolloProvider from "../context/ApolloProvider";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider>
      <AuthProvider>
        <ConversationsProvider>
          <Component {...pageProps} />
        </ConversationsProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
