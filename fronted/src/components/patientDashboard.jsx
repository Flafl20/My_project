import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"
import { checkPatientProfileStatus } from "../services/api"

const PatientDashboard = () => {
  const [profileStatus, setProfileStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkPatientProfileStatus()
      .then((response) => {
        setProfileStatus(response.data)
        if (!response.data.has_profile) {
          navigate("/patient/profile")
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile status", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [navigate])

  if (loading) {
    return <DashboardLayout>Loading dashboard...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">
        Patient Dashboard
      </h2>
      <p className="mt-2 text-gray-700">
        Welcome! Manage your health information here.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/patient/profile"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-blue-600">My Profile</h3>
          <p className="mt-2 text-gray-600">
            View and update your personal and medical information.
          </p>
        </Link>

        <Link
          to="/patient/prescriptions"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-green-600">My Prescriptions</h3>
          <p className="mt-2 text-gray-600">
            View your prescriptions and medication history.
          </p>
        </Link>

        <Link
          to="/patient/lab-tests"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-purple-600">Lab Tests</h3>
          <p className="mt-2 text-gray-600">
            Access your lab test results and reports.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  )
}

export default PatientDashboard
