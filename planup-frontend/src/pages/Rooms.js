import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../Style/Rooms.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
            console.log('🔄 Mindenki készen áll:', status);
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
    
            console.log("📢 API válasz:", response.data);
    
            if (!response.data || response.data.success !== true) {
                throw new Error("Érvénytelen válasz az API-tól");
            }
    
            // 🔥 Az allReady státuszt frissítjük
            setAllReady(response.data.allReady);
            
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
                    <div className="ready-toggle" onClick={toggleReadyStatus} style={{ fontSize: '2rem', cursor: 'pointer' }}>
                        {isReady ? <FaCheckCircle className="ready-icon ready" style={{ fontSize: '3rem' }} /> : <FaTimesCircle className="ready-icon not-ready" style={{ fontSize: '3rem' }} />}
                    </div>
                    <button 
                        onClick={() => navigate('/programswipe')} 
                        disabled={!allReady} 
                        className={`program-button ${allReady ? 'active' : 'disabled'}`} 
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
