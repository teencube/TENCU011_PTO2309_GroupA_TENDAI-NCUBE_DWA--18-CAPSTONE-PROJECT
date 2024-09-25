
import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SearchPage from './Pages/SearchPage';
import ShowPage from './Pages/PodShows';
import LoginPage from './Pages/Login';
import SignUpPage from './Pages/Signup';
import FavoritesPage from './Pages/FavoitesPage';
import PrivateRoute from './Components/PrivateRoutes';
import { AuthProvider } from './Pages/Auth';
import PodshowsDisplay from './Components/DisplayShows';
import ProfilePage from './Pages/UserProfilePage';
import Navbar from './Components/MyNavbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<PodshowsDisplay />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/SearchPage" element={<SearchPage />} />
            <Route path="/id/:id" element={<ShowPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Signup" element={<SignUpPage />} />
            <Route path="/UserProfilePage" element={<ProfilePage />} />
            <Route
              path="/FavoritesPage"
              element={<PrivateRoute element={<FavoritesPage />} />}
            />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
