import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ apiUrl, children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(apiUrl, { withCredentials: true });

            socketRef.current.on("connect", () => {
                console.log("✅ Socket.io kapcsolat létrejött.");
            });

            socketRef.current.on("disconnect", () => {
                console.log("🚪 Socket.io kapcsolat lezárult.");
            });
        }

        return () => {
            // A kapcsolatot NEM zárjuk le itt, hogy más oldalak is használhassák
        };
    }, [apiUrl]);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
