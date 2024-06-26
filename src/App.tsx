import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminButaca from './components/AdminButaca';
import AdminCartelera from './components/AdminCartelera';
import AdminRoom from './components/AdminRoom';
import { ReservationContextProvider } from './contexts/ReservationContext';
import AdminMovie from './components/AdminMovie';

const App: React.FC = () => {
  return (
    <ReservationContextProvider>
      <Router>
        <Routes>
          {/* <Route path="/butaca" element={<AdminButaca />} /> */}
          <Route index path="/cartelera" element={<AdminCartelera />} />
          <Route path="/peliculas" element={<AdminMovie />} />
          <Route path="/salas" element={<AdminRoom />} /> 
        </Routes>
      </Router>
    </ReservationContextProvider>
  );
};

export default App;
