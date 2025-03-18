import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../Style/Rooms.css';

function Rooms({ apiUrl, userId }) {
    const [roomCode, setRoomCode] = useState('');
    const [roomUsers, setRoomUsers] = useState([]);
    const [roomCreator, setRoomCreator] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [allReady, setAllReady] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(apiUrl, { withCredentials: true });

        socketRef.current.on('connect', () => {
            console.log('✅ Sikeres Socket.io kapcsolat');
        });

        socketRef.current.on('updateUsers', (updatedUsers) => {
            setRoomUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
        });

        socketRef.current.on('updateReadyStatus', (status) => {
            setAllReady(status);
        });

        return () => {
            socketRef.current.disconnect();
            console.log('🚪 Socket.io kapcsolat lezárva.');
        };
    }, [apiUrl]);

    useEffect(() => {
        const checkExistingRoom = async () => {
            try {
                const response = await axios.get(`${apiUrl}/rooms/current`, { withCredentials: true });
                if (response.data.roomCode) {
                    setRoomCode(response.data.roomCode);
                    fetchRoomUsers(response.data.roomCode);
                    checkReadyStatus(response.data.roomCode);
                    setIsInRoom(true);
                    socketRef.current.emit('joinRoom', response.data.roomCode);
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
            socketRef.current.emit('joinRoom', response.data.roomCode);
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
            socketRef.current.emit('joinRoom', roomCode);
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
            socketRef.current.emit('leaveRoom', roomCode);
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
            socketRef.current.emit('refreshUsers', roomCode);
        } catch (err) {
            console.error('Nem sikerült lekérni a szobában lévő felhasználókat:', err.message);
        }
    };

    const toggleReadyStatus = async () => {
        const newReadyState = !isReady;
        setIsReady(newReadyState);
    
        try {
            const response = await axios.post(`${apiUrl}/rooms/ready`, {
                roomCode, 
                userId, 
                isReady: newReadyState 
            }, { withCredentials: true });
    
            console.log("📢 API válasz:", response.data); // 🔹 LOGOLJUK A VÁLASZT
    
            if (!response.data || response.data.success !== true) {
                throw new Error("Érvénytelen válasz az API-tól");
            }
    
            setAllReady(response.data.allReady); // 🔹 ÁLLÍTSA BE AZ ÁLLAPOTOT
    
            // 🔹 GYŐZŐDJ MEG RÓLA, HOGY A KOMPONENS FRISSÜL
            setTimeout(() => {
                console.log("✅ Frissített állapot:", response.data.allReady);
            }, 500);
    
            socketRef.current.emit('updateReady', roomCode);
            console.log("✅ ReadyState sikeresen frissítve:", response.data);
    
        } catch (err) {
            console.error('❌ Nem sikerült frissíteni a készenléti állapotot:', err.message);
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

    return (
        <div className="rooms-container">
            <h2 className="title">Szobák</h2>
            {error && <div className="error-message">{error}</div>}
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
                    <p className="room-code-display">Szobakód: {roomCode}</p>
                    <p><strong>Szoba létrehozója:</strong> {roomCreator || 'Ismeretlen felhasználó'}</p>
                    <button className="refresh-button" onClick={() => fetchRoomUsers(roomCode)}>🔄 Lista frissítése</button>
                    <ul>
                        {roomUsers.length > 0 ? roomUsers.map((user, index) => (
                            <li key={user.UserID || index}>{user.Username}</li>
                        )) : <li key="no-users">Nincs jelenleg másik felhasználó a szobában.</li>}
                    </ul>
                    <button 
                        onClick={toggleReadyStatus} 
                        className={`ready-button ${isReady ? 'ready' : 'not-ready'}`}
                    >
                        {isReady ? "✔ Készen állok" : "✖ Nem állok készen"}
                    </button>
                    <button 
                        onClick={() => navigate('/programswipe')} 
                        disabled={!allReady} 
                        className={`program-button ${allReady ? 'active' : 'disabled'}`} // 🔹 Osztály hozzáadása a CSS-hez
                    >
                        Válogass a programok közül
                    </button>
                    <button onClick={leaveRoom} className="leave-room-button">Kilépés a szobából</button>
                </div>
            )}
        </div>
    );
}

export default Rooms;
