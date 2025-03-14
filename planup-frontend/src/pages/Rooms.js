import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Rooms.css';

function Rooms({ apiUrl, userId }) {
    const [roomCode, setRoomCode] = useState('');
    const [generatedRoomCode, setGeneratedRoomCode] = useState('');
    const [roomUsers, setRoomUsers] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            const response = await axios.post(`${apiUrl}/rooms`, { userId });
            setGeneratedRoomCode(response.data.roomCode);
            setSuccessMessage(`Szoba létrehozva! Kód: ${response.data.roomCode}`);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setError('Nem sikerült létrehozni a szobát.');
        }
    };

    const joinRoom = async () => {
        if (!roomCode) return;
        try {
            await axios.post(`${apiUrl}/rooms/join`, { roomCode, userId });
            setSuccessMessage(`Sikeresen csatlakoztál a szobához (${roomCode})!`);
            fetchRoomUsers(roomCode); 
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Nem sikerült csatlakozni a szobához.');
        }
    };

    const fetchRoomUsers = async (roomCode) => {
        try {
            const response = await axios.get(`${apiUrl}/rooms/${roomCode}/users`);
            setRoomUsers(response.data);
        } catch (err) {
            console.error('Nem sikerült lekérni a szobában lévő felhasználókat:', err.message);
        }
    };

    return (
        <div className="rooms-container">
            <h2 className="title">Szobák</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="create-room">
                <button onClick={createRoom} className="create-room-button">Szoba létrehozása</button>
                {generatedRoomCode && <p className="room-code-display">Szoba létrehozva: {generatedRoomCode}</p>}
            </div>
            <div className="join-room">
                <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Szobakód beírása" className="room-input" />
                <button onClick={joinRoom} className="join-room-button">Csatlakozás</button>
            </div>
            {roomUsers.length > 0 && (
                <div className="room-users">
                    <h3>Szobában lévő felhasználók:</h3>
                    <ul>
                        {roomUsers.map(user => (
                            <li key={user.Username}>{user.Username}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/programswipe')} className="program-button">Válogass a programok közül</button>
                </div>
            )}
        </div>
    );
}

export default Rooms;