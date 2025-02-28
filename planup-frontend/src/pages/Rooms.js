import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Rooms.css';

function Rooms({ apiUrl, userId }) {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
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
    try {
      await axios.post(`${apiUrl}/rooms`, { name: roomName, userId });
      setRoomName('');
      fetchRooms(); // Frissíti a szobák listáját
    } catch (err) {
      console.error('Hiba történt a szoba létrehozásakor:', err.message);
    }
  };
  

  const deleteRoom = async (roomId) => {
    try {
      await axios.delete(`${apiUrl}/rooms/${roomId}`);
      setSuccessMessage('Szoba sikeresen törölve!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchRooms();
    } catch (err) {
      setError('Nem sikerült törölni a szobát.');
    }
  };

  const joinRoom = async (roomId) => {
    try {
      await axios.post(`${apiUrl}/rooms/join`, { roomId, userId });
      setSuccessMessage('Sikeresen csatlakoztál a szobához!');
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
    value={roomName} // Az input mező értéke a roomName állapot
    onChange={(e) => setRoomName(e.target.value)} // Az állapot frissítése az onChange esemény alapján
    placeholder="Új szoba neve"
    className="room-input" // Opcionális osztály a stílushoz
  />
  <button onClick={createRoom} className="create-room-button">
    Szoba létrehozása
  </button>
</div>


      <div className="rooms-list">
        {rooms.length === 0 ? (
          <p className="no-rooms">Nincs elérhető szoba.</p>
        ) : (
          rooms.map((room) => (
            <div key={room.RoomID} className="room-item">
              <span className="room-name">{room.RoomCode || 'Névtelen szoba'}</span>
              <div className="room-actions">
                <button className="join-button" onClick={() => joinRoom(room.RoomID)}>
                  Csatlakozás
                </button>
                <button className="delete-button" onClick={() => deleteRoom(room.RoomID)}>
                  Törlés
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

