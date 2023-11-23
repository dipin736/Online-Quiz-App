import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './Auth/AuthContext';
import PrivateRoute from './Component/PrivateRoute';
import QuizComponent from './Component/Quiz';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Navbar from './Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Router>
      <Navbar/>
        <Routes>
          <Route element={<PrivateRoute/>}>
          <Route path="quiz/" element={<QuizComponent />} />
          </Route>
          <Route path="/" element={<Login />} />
          <Route path="register/" element={<Register />} />
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
