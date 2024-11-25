import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './mvp.css';

import Itineraries from './components/Itineraries.tsx';
import Itinerary from './components/Itinerary.tsx';
import CreateItinerary from './components/CreateItinerary.tsx';
import CreateActivity from './components/CreateActivity.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Itineraries />} />
        <Route path="/new" element={<CreateItinerary />} />
        <Route path="/:id" element={<Itinerary />} />
        <Route path="/:id/create" element={<CreateActivity />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
