import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import Bet from './pages/Bet';
import Rules from './pages/Rules';
import MyAccount from './pages/MyAccount';
import Leaderboard from './pages/Leaderboard';



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/bet" element={<Bet />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </BrowserRouter>
    );


}

export default App;