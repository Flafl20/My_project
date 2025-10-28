import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

// Auth pages
import LoginPage from "./Pages/LoginPage"
import RegisterPage from "./Pages/RgisterPage"
import LandingPage from "./Pages/LandinPage"

// Protected Route compontent
import ProtectedRoute from "./components/ProtectedRoute"

// dashboards
import PatientDashboard from "./components/patientDashboard"
import DoctorDashboard from "./components/DoctorDashboard"
import PharmacistDashboard from "./components/PharmacistDashboard"
import BioAnalystDashboard from "./components/Bio-AnalystDashboard"

// Patient Pages
import PatientProfile from "./Pages/Patient/PatientProfile"
import PatientPrescriptions from "./Pages/Patient/PatientPrescriptions"
import PatientLabTests from "./Pages/Patient/PatientLabTests"

//Doctor Pages
import DoctorProfile from "./Pages/Doctor/DoctorProfile"
import DoctorPatients from "./Pages/Doctor/DoctorPatients"
import CreatePrescription from "./Pages/Doctor/CreatePrescription"
import PatientDetails from "./Pages/Doctor/PatientDetails"

//Pharmacist Pages
import PrescriptionList from "./Pages/Pharmacist/PerscriptionList"
import PrescriptionDetails from "./Pages/Pharmacist/perscriptionDetail"

// Bio Analyst Pages
import LabTestList from "./Pages/BioAnalyst/LabTestList"
import LabTestUpload from "./Pages/BioAnalyst/LabTestUpload"

function App() {
  const { isAuthenticated, authRole, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/home" element={<LandingPage />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />
        }
      />

      {/* Root route - redirect to landing page or dashboard based on auth */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
        }
      />

      {/* Dashboard route - redirect based on role */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            authRole === "PATIENT" ? (
              <Navigate to="/patient" />
            ) : authRole === "DOCTOR" ? (
              <Navigate to="/doctor" />
            ) : authRole === "PHARMACIST" ? (
              <Navigate to="/pharmacist" />
            ) : authRole === "BI0_ANALYST" ? (
              <Navigate to="/bio-analyst" />
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowRole="PATIENT" />}>
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route
          path="/patient/prescriptions"
          element={<PatientPrescriptions />}
        />
        <Route path="/patient/lab-tests" element={<PatientLabTests />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowRole="DOCTOR" />}>
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route
          path="/doctor/patients/:patientId"
          element={<PatientDetails />}
        />
        <Route path="/doctor/prescribe" element={<CreatePrescription />} />
      </Route>

      {/* Pharmacist Routes */}
      <Route element={<ProtectedRoute allowRole="PHARMACIST" />}>
        <Route path="/pharmacist" element={<PharmacistDashboard />} />
        <Route
          path="/pharmacist/prescriptions"
          element={<PrescriptionList />}
        />
        <Route
          path="/pharmacist/prescriptions/:prescriptionId"
          element={<PrescriptionDetails />}
        />
      </Route>

      {/* Bio Analyst Routes */}
      <Route element={<ProtectedRoute allowRole="BI0_ANALYST" />}>
        <Route path="/bio-analyst" element={<BioAnalystDashboard />} />
        <Route path="/bio-analyst/upload" element={<LabTestUpload />} />
        <Route path="/bio-analyst/tests" element={<LabTestList />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
