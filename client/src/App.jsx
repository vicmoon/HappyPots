import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlantLibrary from './pages/PlantLibrary';
import PlantDetail from './pages/PlantDetails';
import MyGarden from './pages/MyGarden';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import './App.css';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<PlantLibrary />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-garden"
            element={
              <ProtectedRoute>
                <MyGarden />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
