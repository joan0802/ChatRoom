import logo from './logo.svg';
import icon from './img/favicon.png';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from './Components/LoginSignUp/LoginSignUp';
import Home from './Home';

function App() {

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginSignUp />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
