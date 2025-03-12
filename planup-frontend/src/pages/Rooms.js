import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Rooms.css';
import { v4 as uuidv4 } from 'uuid'; // Szobakód generálás

function Rooms({ apiUrl, userId }) {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${apiUrl}/rooms`);
      setRooms(response.data);
    } catch (err) {
      setError('Nem sikerült betölteni a szobákat.');
    }
  };

  const createRoom = async () => {
    if (!roomName) return;
    const generatedRoomCode = uuidv4().substring(0, 8).toUpperCase(); // Egyedi szobakód
    try {
        const response = await axios.post(`${apiUrl}/rooms`, { name: roomName, userId, roomCode: generatedRoomCode });
        setRoomName('');
        setRoomCode(generatedRoomCode);
        setSuccessMessage(`Szoba létrehozva! Kód: ${generatedRoomCode}`);
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchRooms();
    } catch (err) {
        console.error('Hiba történt a szoba létrehozásakor:', err.message);
    }
};


  const joinRoom = async () => {
    if (!roomCode) return;
    try {
      await axios.post(`${apiUrl}/rooms/join`, { roomCode, userId });
      setSuccessMessage(`Sikeresen csatlakoztál a szobához (${roomCode})!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Nem sikerült csatlakozni a szobához.');
    }
  };

  return (
    <div className="rooms-container">
      <h2 className="title">Szobák</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="create-room">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Új szoba neve"
          className="room-input"
        />
        <button onClick={createRoom} className="create-room-button">
          Szoba létrehozása
        </button>
      </div>

      <div className="join-room">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Szobakód beírása"
          className="room-input"
        />
        <button onClick={joinRoom} className="join-room-button">
          Csatlakozás
        </button>
      </div>

      <div className="rooms-list">
        {rooms.length === 0 ? (
          <p className="no-rooms">Nincs elérhető szoba.</p>
        ) : (
          rooms.map((room) => (
            <div key={room.RoomID} className="room-item">
              <span className="room-name">Kód: {room.RoomCode} - {room.RoomName}</span>
              <div className="room-actions">
                <button className="join-button" onClick={() => setRoomCode(room.RoomCode)}>
                  Másolás
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;