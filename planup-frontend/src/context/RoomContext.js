import React, { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <RoomContext.Provider value={{ roomId, setRoomId, userId, setUserId }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
