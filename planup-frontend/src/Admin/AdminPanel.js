import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const durations = [
    { label: 'Egész hétvégés', value: 3 },
    { label: 'Egész napos', value: 2 },
    { label: 'Fél napos', value: 1 },
];

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    min-height: 100vh; /* A tartalom mindig kitölti a rendelkezésre álló helyet */
`;

const FormContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin-bottom: 20px; /* Egy kis margó a footer előtt */
`;

const Label = styled.label`
    display: block;
    margin-bottom: 10px;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Select = styled.select`
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Button = styled.button`
    background-color: #4CAF50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const Footer = styled.div`
    background-color: #333;
    color: #fff;
    padding: 10px;
    text-align: center;
    position: relative; /* Ha szükséges, hogy mindig lent legyen */
    bottom: 0; /* Ha fix pozícióban akarod tartani */
`;

const AdminPanel = () => {
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

    const handleAddProgram = async () => {
        try {
            await axios.post('http://localhost:3001/api/admin/add-program', {
                ...newProgram,
                cost: newProgram.cost ? true : false,
            }, { withCredentials: true });
            setNewProgram({
                name: '',
                description: '',
                duration: '',
                cost: false,
                location: '',
                city: '',
                image: '',
                moreInfoLink: '',
            });
            alert('✅ Program sikeresen hozzáadva!');
        } catch (error) {
            console.error('Hiba történt:', error);
            alert('❌ Hiba történt a program hozzáadásakor.');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kép formátum ellenőrzése
        const validFormats = ['image/jpeg', 'image/jpg'];
        if (!validFormats.includes(file.type)) {
            alert('❌ Nem megfelelő formátum! Csak JPG/JPEG képeket tölthetsz fel.');
            return;
        }

        // Kép méret ellenőrzése
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            if (img.width !== 1024 || img.height !== 1024) {
                alert('❌ Nem megfelelő képméret! A kép méretének 1024x1024 pixelnek kell lennie.');
                URL.revokeObjectURL(img.src);
                return;
            }

            // Ha minden ellenőrzés sikeres, folytatjuk a feltöltést
            URL.revokeObjectURL(img.src);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await axios.post('http://localhost:3001/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setNewProgram(prevState => ({ ...prevState, image: response.data.filePath }));
                alert('✅ Kép sikeresen feltöltve!');
            } catch (error) {
                console.error('Hiba történt:', error);
                alert('❌ Hiba történt a képfeltöltés során.');
            }
        };
    };

    const [cities, setCities] = useState([]);
    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/admin/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Hiba történt a városok betöltésekor:', error);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    return (
        <Container>
            <FormContainer>
                <h2>Új program hozzáadása</h2>
                <Label>Név:</Label>
                <Input type="text" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} />
                <Label>Leírás:</Label>
                <Input type="text" value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} />
                <Label>Időtartam:</Label>
                <Select value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}>
                    <option value="">Válassz időtartamot</option>
                    {durations.map((duration) => (
                        <option key={duration.value} value={duration.value}>{duration.label}</option>
                    ))}
                </Select>
                <Label>Költség:</Label>
                <Input type="checkbox" checked={newProgram.cost} onChange={(e) => setNewProgram({ ...newProgram, cost: e.target.checked })} />
                <Label>Helyszín:</Label>
                <Input type="text" value={newProgram.location} onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value })} />
                <Label>Város:</Label>
                <Select value={newProgram.city} onChange={(e) => setNewProgram({ ...newProgram, city: e.target.value })}>
                    <option value="">Válassz várost</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </Select>
                <Label>Kép:</Label>
                <Input type="file" onChange={handleImageChange} />
                <Label>További információk link:</Label>
                <Input type="text" value={newProgram.moreInfoLink} onChange={(e) => setNewProgram({ ...newProgram, moreInfoLink: e.target.value })} />
                <Button onClick={handleAddProgram}>Hozzáadás</Button>
            </FormContainer>
            <Footer>
                Footer tartalom
            </Footer>
        </Container>
    );
};

export default AdminPanel;
