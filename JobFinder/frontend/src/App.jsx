import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/login"
import Register from "./pages/register"
import Home from "./pages/home"
import Notfound from "./pages/notfound"
import ProtectedRoute from "./components/protectedRoute"
import Profile from "./pages/Profile"
import MyApplications from "./pages/MyApplications"
import BusinessPage from "./pages/BusinessPage"
import BusinessForm from "./components/businessform"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterandLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business"
              element={
                <BusinessPage />
              }
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
