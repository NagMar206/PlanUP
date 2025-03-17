import React, { useState, useEffect } from 'react';
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
    const navigate = useNavigate();
    const socket = io(apiUrl);

    useEffect(() => {
        socket.on('updateUsers', (updatedUsers) => {
            if (Array.isArray(updatedUsers)) {
                setRoomUsers(updatedUsers);
            } else {
                setRoomUsers([]);
            }
        });
    }, [socket]);

    useEffect(() => {
        const checkExistingRoom = async () => {
            try {
                const response = await axios.get(`${apiUrl}/rooms/current`, { withCredentials: true });
                setRoomCode(response.data.roomCode);
                fetchRoomUsers(response.data.roomCode);
                setIsInRoom(true);
                socket.emit('joinRoom', response.data.roomCode);
            } catch (err) {
                console.log('Nincs aktív szoba.');
            }
        };
        checkExistingRoom();
    }, []);

    const createRoom = async () => {
        try {
            const response = await axios.post(`${apiUrl}/rooms`, { userId });
            setRoomCode(response.data.roomCode);
            setSuccessMessage(`Szoba létrehozva! Kód: ${response.data.roomCode}`);
            fetchRoomUsers(response.data.roomCode);
            setIsInRoom(true);
            socket.emit('joinRoom', response.data.roomCode);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setError('Nem sikerült létrehozni a szobát.');
        }
    };

    const joinRoom = async () => {
        if (!roomCode) return;
        try {
            const response = await axios.post(`${apiUrl}/rooms/join`, { roomCode, userId });
            setSuccessMessage(response.data.message);
            setIsInRoom(true);
            socket.emit('joinRoom', roomCode);
            fetchRoomUsers(roomCode);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Nem sikerült csatlakozni a szobához.');
        }
    };

    const leaveRoom = async () => {
        try {
            await axios.post(`${apiUrl}/rooms/leave`, { userId, roomCode });
            setSuccessMessage('Kiléptél a szobából.');
            setRoomUsers([]);
            setRoomCreator('');
            setRoomCode('');
            setIsInRoom(false);
            socket.emit('leaveRoom', roomCode);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Nem sikerült kilépni a szobából.');
        }
    };

    const fetchRoomUsers = async (roomCode) => {
        try {
            const response = await axios.get(`${apiUrl}/rooms/${roomCode}/users`);
            const uniqueUsers = Array.isArray(response.data.users) ? [...new Map(response.data.users.map(user => [user.UserID, user])).values()] : [];
            setRoomUsers(uniqueUsers);
            setRoomCreator(response.data.creator || 'Ismeretlen felhasználó');
            socket.emit('refreshUsers', roomCode);
        } catch (err) {
            console.error('Nem sikerült lekérni a szobában lévő felhasználókat:', err.message);
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
                    <ul>
                        {roomUsers.length > 0 ? roomUsers.map(user => (
                            <li key={user.UserID}>{user.Username}</li>
                        )) : <li>Nincs jelenleg másik felhasználó a szobában.</li>}
                    </ul>
                    <button onClick={() => navigate('/programswipe')} className="program-button">Válogass a programok közül</button>
                    <button onClick={leaveRoom} className="leave-room-button">Kilépés a szobából</button>
                </div>
            )}
        </div>
    );
}

export default Rooms;