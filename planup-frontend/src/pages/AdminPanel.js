import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Admin.css'

const durations = [
  { label: 'Egész hétvégés', value: 3 },
  { label: 'Egész napos', value: 2 },
  { label: 'Fél napos', value: 1 },
];

const AdminPanel = () => {
  const [cities, setCities] = useState([]);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    duration: '',
    cost: false,
    location: '',
    city: '',
    image: '',
    moreInfoLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3001/api/admin/cities")
      .then(response => setCities(response.data))
      .catch(error => console.error('Hiba történt a városok betöltésekor:', error));
  }, []);

  const handleAddProgram = async () => {
    if (!newProgram.name || !newProgram.description || !newProgram.city || !newProgram.location) {
      alert('⚠️ Kérlek, töltsd ki az összes kötelező mezőt!');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3001/api/admin/add-program', {
        ...newProgram,
        duration: Number(newProgram.duration), // Ensure duration is a number
      }, { withCredentials: true });

      setNewProgram({
        name: '', description: '', duration: '', cost: false,
        location: '', city: '', image: '', moreInfoLink: '',
      });

      alert('✅ Program sikeresen hozzáadva!');
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('❌ Hiba történt a program hozzáadásakor.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewProgram(prevState => ({
        ...prevState,
        image: response.data.filePath
      }));

      alert('✅ Kép sikeresen feltöltve!');
    } catch (error) {
      console.error('Hiba történt:', error);
      alert('❌ Hiba történt a képfeltöltés során.');
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div>
      <h3>Új program hozzáadása:</h3>
      <form>
        <label>Név:
          <input type="text" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value.trimStart() })} />
        </label><br />

        <label>Leírás:
          <textarea value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} />
        </label><br />

        <label>Időtartam:
          <select
            value={newProgram.duration}
            onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
          >
            <option value="">Válassz időtartamot</option>
            {durations.map(duration => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </label><br />

        <label>Fizetős program:
          <input type="checkbox" checked={newProgram.cost} onChange={(e) => setNewProgram({ ...newProgram, cost: e.target.checked })} />
        </label><br />

        <label>Város:
          <select value={newProgram.city} onChange={(e) => setNewProgram({ ...newProgram, city: e.target.value })}>
            <option value="">Válassz várost</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label><br />

        <label>Helyszín:
          <input type="text" value={newProgram.location} onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value.trimStart() })} />
        </label><br />

        <label>Kép feltöltése 500x500:
          <input type="file" onChange={handleImageChange} disabled={imageLoading} />
          {imageLoading && <p>📤 Kép feltöltése folyamatban...</p>}
          {newProgram.image && (
            <div style={{ marginTop: "10px" }}>
              <p>Feltöltött kép:</p>
              <img src={`http://localhost:3001${newProgram.image}`} alt="Feltöltött kép" width="250px" />
            </div>
          )}
        </label><br />

        <label>További információk link:
          <input type="text" value={newProgram.moreInfoLink} onChange={(e) => setNewProgram({ ...newProgram, moreInfoLink: e.target.value.trimStart() })} />
        </label><br />

        <button type="button" onClick={handleAddProgram} disabled={loading}>
          {loading ? '⏳ Hozzáadás folyamatban...' : 'Hozzáadás'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
