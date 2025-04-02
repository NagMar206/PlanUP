import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Rooms.css';
import { useRoom } from "../context/RoomContext"; // 🔹 RoomID tárolása Contextben
import { useSocket } from "../context/SocketContext"; // ✅ HOZZÁADÁS


function Rooms({ apiUrl, userId }) {
    const [roomCode, setRoomCode] = useState('');
    const [roomUsers, setRoomUsers] = useState([]);
    const [roomCreator, setRoomCreator] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const navigate = useNavigate();
    const { setRoomId } = useRoom(); // 🔹 RoomID tárolása Contextben
    const socket = useSocket(); // Ez a helyes


    useEffect(() => {
        if (!socket) return;
        console.log("✅ Socket.io kapcsolat aktív Rooms.js-ben");
    }, [socket]);


    useEffect(() => {
        const checkExistingRoom = async () => {
            try {
                const response = await axios.get(`${apiUrl}/rooms/current`, { withCredentials: true });
                if (response.data.roomCode) {
                    setRoomCode(response.data.roomCode);
                    fetchRoomUsers(response.data.roomCode);
                    checkReadyStatus(response.data.roomCode);
                    setIsInRoom(true);
                    socket.emit('joinRoom', response.data.roomCode);
                }
            } catch (err) {
                console.log('Nincs aktív szoba.');
            }
        };
        checkExistingRoom();
    }, [apiUrl]);

    const createRoom = async () => {
        try {
            const response = await axios.post(`${apiUrl}/rooms`, { userId }, { withCredentials: true });
            setRoomCode(response.data.roomCode);
            setSuccessMessage(`Szoba létrehozva! Kód: ${response.data.roomCode}`);
            fetchRoomUsers(response.data.roomCode);
            setIsInRoom(true);

            // 👇 Itt adod át a userId-t is
            socket.emit('joinRoom', response.data.roomCode, userId);

            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setError('Nem sikerült létrehozni a szobát.');
        }
    };

    const joinRoom = async () => {
        if (!roomCode) return;
        try {
            const response = await axios.post(`${apiUrl}/rooms/join`, { roomCode, userId }, { withCredentials: true });
            setSuccessMessage(response.data.message);
            setIsInRoom(true);

            // 👇 Itt adod át a userId-t is
            socket.emit('joinRoom', response.data.roomCode, userId);

            fetchRoomUsers(roomCode);
            checkReadyStatus(roomCode);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Nem sikerült csatlakozni a szobához.');
        }
    };


    const leaveRoom = async () => {
        try {
            await axios.post(`${apiUrl}/rooms/leave`, { userId, roomCode }, { withCredentials: true });
            setSuccessMessage('Kiléptél a szobából.');
            setRoomUsers([]);
            setRoomCreator('');
            setRoomCode('');
            setIsInRoom(false);
            socket.emit('joinRoom', response.data.roomCode, userId);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Nem sikerült kilépni a szobából.');
        }
    };

    const fetchRoomUsers = async (roomCode) => {
        try {
            const response = await axios.get(`${apiUrl}/rooms/${roomCode}/users`, { withCredentials: true });
            const uniqueUsers = Array.isArray(response.data.users) ? [...new Map(response.data.users.map(user => [user.UserID, user])).values()] : [];
            setRoomUsers(uniqueUsers);
            setRoomCreator(response.data.creator || 'Ismeretlen felhasználó');
            socket.emit('refreshUsers', roomCode);
        } catch (err) {
            console.error('Nem sikerült lekérni a szobában lévő felhasználókat:', err.message);
        }
    };




    const checkReadyStatus = async (roomCode) => {
        try {
            const response = await axios.get(`${apiUrl}/rooms/${roomCode}/readyStatus`, { withCredentials: true });
            setAllReady(response.data.allReady);
        } catch (err) {
            console.error('Nem sikerült ellenőrizni a készenléti állapotot.');
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Másolási hiba:', err);
        }
    };

   

    return (
        <div className="rooms-container">
            <h2 className="title">SZOBÁK</h2>
            {error && <div className="error-message">{error}</div>}
            <p className="rooms-description">
                Hozz létre <span>szobát</span> barátaiddal, vagy <span>csatlakozz</span> meglévőhöz – és válogassatok együtt a legjobb programok közül!
            </p>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {!isInRoom && (
                <div className="create-room">
                    <button onClick={createRoom} className="create-room-button">Szoba létrehozása</button>
                </div>
            )}
            {!isInRoom && (
                <div className="join-room">
                    <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Szobakód beírása" className="room-input" />
                    <button onClick={joinRoom} className="join-room-button">Csatlakozás</button>
                </div>
            )}
            {isInRoom && (
                <div className="room-users">
                    <h3>Szobában lévő felhasználók:</h3>
                    <div className="room-info">
                        <button
                            className="room-code-button"
                            onClick={() => copyToClipboard(roomCode)}
                        >
                            Szobakód: {roomCode}
                        </button>
                        {isCopied && <span className="copied-message">Másolva!</span>}
                    </div>
                    <p><strong>Szoba létrehozója:</strong> {roomCreator || 'Ismeretlen felhasználó'}</p>
                    <button className="refresh-button" onClick={() => fetchRoomUsers(roomCode)}>🔄 Lista frissítése</button>
                    <ul>
                        {roomUsers.length > 0 ? roomUsers.map((user, index) => (
                            <li key={user.UserID || index}>{user.Username}</li>
                        )) : <li key="no-users">Nincs jelenleg másik felhasználó a szobában.</li>}
                    </ul>
                    <button onClick={() => navigate(`/roomswipe/${room.RoomCode}`)}>
                        Válogass a programok közül
                    </button>



                    <button onClick={leaveRoom} className="leave-room-button">Kilépés a szobából</button>
                </div>
            )}
        </div>
    );
}

export default Rooms;
