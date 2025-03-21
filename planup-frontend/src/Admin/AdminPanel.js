import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProgramList from './ProgramList';
import ProgramCreate from './ProgramCreate';
import ProgramEdit from './ProgramEdit';
import ProgramDelete from './ProgramDelete';
import ProgramShow from './ProgramShow';

const AdminPanel = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/programs" element={<ProgramList />} />
        <Route path="/programs/create" element={<ProgramCreate />} />
        <Route path="/programs/:id/edit" element={<ProgramEdit />} />
        <Route path="/programs/:id/delete" element={<ProgramDelete />} />
        <Route path="/programs/:id/show" element={<ProgramShow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminPanel;
