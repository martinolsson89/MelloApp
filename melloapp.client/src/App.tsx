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
import BetOverview from './pages/BetOverview';
import AdminCenter from './pages/AdminCenter';
import AddSubCompetitionResults from './components/AddSubCompetitionResults';
import AddSubCompetitionScores from './components/AddSubCompetitionScores';
import UpdatePoints from './components/UpdatePoints';
import UpdateHomeContent from './components/UpdateHomeContent';
import AddFinalResults from './components/AddFinalResults';
import AddFinalScore from './components/AddFinalScore';
import SubCompetitions from './components/SubCompetitions';
import Artists from './components/Artists';
import ResultsManagement from './components/ResultsManagement';
import PointsManagement from './components/PointsManagement';
import DeleteAllPredictionsByUser from './components/DeleteAllPredictionsByUser';
import UserAvatar from './components/UserAvatar';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import DeleteUser from './components/DeleteUser';




function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/bet" element={<Bet />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/bet-overview" element={<BetOverview />} />
                <Route path="/admin-center" element={<AdminCenter />} />
                <Route path="/admin-center/add-results" element={<AddSubCompetitionResults />} />
                <Route path="/admin-center/add-scores" element={<AddSubCompetitionScores />} />
                <Route path="/admin-center/update-points" element={<UpdatePoints />} />
                <Route path="/admin-center/update-home-content" element={<UpdateHomeContent />} />
                <Route path="/admin-center/add-final-results" element={<AddFinalResults />} />
                <Route path="/admin-center/add-final-score" element={<AddFinalScore />} />
                <Route path="/admin-center/sub-competitions" element={<SubCompetitions />} />
                <Route path="/admin-center/artists" element={<Artists />} />
                <Route path="/admin-center/results-management" element={<ResultsManagement />} />
                <Route path='/admin-center/points-management' element={<PointsManagement />} />
                <Route path='/admin-center/delete-all-predictions-by-user' element={<DeleteAllPredictionsByUser />} />
                <Route path='/admin-center/user-avatar' element={<UserAvatar />} />
                <Route path='/admin-center/delete-user' element={<DeleteUser />} />
            </Routes>
        </BrowserRouter>
    );


}

export default App;