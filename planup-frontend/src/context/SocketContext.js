import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3001", {
            withCredentials: true,
            transports: ["websocket"],  // 🔥 FONTOS, hogy NE fallbackeljen pollingra!
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("WebSocket kapcsolat létrejött:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log(" WebSocket kapcsolat megszakadt!");
        });

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
