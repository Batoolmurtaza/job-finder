import React from "react"
import "./styles/App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import LoginPage from "./pages/LoginPage"
import Register from "./pages/register"
import Home from "./pages/home"
import Notfound from "./pages/notfound"
import ProtectedRoute from "./components/protectedRoute"
import Profile from "./pages/Profile"
import MyApplications from "./pages/MyApplications"
import CreateBusiness from "./pages/CreateBusiness"
import CreateJob from "./pages/CreateJob"
import ViewBusiness from "./pages/ViewBusiness"
import JobDetails from "./pages/JobDetails"

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
            <Route path="/login" element={<LoginPage />} />
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
            }/>
            <Route path="/view-business" element={<ViewBusiness />}/>
            <Route path="/create-business" element={<CreateBusiness />}/>
            <Route path="/create-job" element={<CreateJob />}/>
            <Route path="/job-details" element={<JobDetails />}/>
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
