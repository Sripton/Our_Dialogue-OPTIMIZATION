import React from "react";

const PostContext = React.createContext();

export default function PostContextProvider({ children }) {
  return <PostContext.Provider value={{}}>{children}</PostContext.Provider>;
}

export { PostContext };
