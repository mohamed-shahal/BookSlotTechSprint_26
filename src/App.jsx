import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage";
import Register from "./Pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
