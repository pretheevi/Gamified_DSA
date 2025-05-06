import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/dashboard";
import LoginRegisterPage from "./authentication/auth";
import RegistrationFlow from "./authentication/Register";
import ProfilePage from "./dashboard/profile";
import { Toaster } from 'sonner';

/**
 * Main App component for DSA Quest dashboard
 * Displays a list of coding problems with stats and progress tracking
 */
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes handlers */}
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/register" element={<RegistrationFlow />} />

          {/* Dashboard Route */}
          <Route path="/Dashboard" element={<Dashboard />} />   
          <Route path="/profile" element={<ProfilePage />} />     
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  );
}


export default App;