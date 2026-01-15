import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './Pages/LoginPage';
import Register from './Pages/RegisterPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

<Routes>
 <Route path="/register" element={<Register />} />
 <Route path="/login" element={<Login />} />
</Routes>

      </BrowserRouter>
    </>
  )
}

export default App
