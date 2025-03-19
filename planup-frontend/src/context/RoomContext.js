import { createContext, useContext, useState, useEffect } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const room = queryParams.get("room");
        if (room) {
            setRoomId(room);
        }
    }, []);

    return (
        <RoomContext.Provider value={{ roomId, setRoomId }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => useContext(RoomContext);
