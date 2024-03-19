import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from "./pages/Login/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import TuitionPage from "./pages/Tuition/TuitionPage";
import PaymentS from './pages/paymentsuccess/PaymentS';

function App() {



  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/tuition" element={<TuitionPage />} />
        <Route path="/payment/result" element={<PaymentS />} />
      </Routes>
    </Router>
  );
}

export default App;
