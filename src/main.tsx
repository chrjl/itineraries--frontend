import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './mvp.css';

import App from './App.tsx';
import Itineraries from './components/Itineraries.tsx';
import Itinerary from './components/Itinerary.tsx';
import CreateItinerary from './components/CreateItinerary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/itineraries/new" element={<CreateItinerary />} />
        <Route path="/itineraries/:id" element={<Itinerary />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
