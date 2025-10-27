import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"
import { checkDoctorProfileStatus } from "../services/api"

const DoctorDashboard = () => {
  const [profileStatus, setProfileStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkDoctorProfileStatus()
      .then((response) => {
        setProfileStatus(response.data)

        if (!response.data.has_profile) {
          navigate("/doctor/profile")
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
    return <DashboardLayout> loading dashboard ...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">Doctor Dashboard</h2>
      <p className="mt-2 text-gray-700">
        Welcome, Dr. {profileStatus?.full_name}!
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2">
        {/* Navigation Card: View Patients */}
        <Link
          to="/doctor/patients"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-blue-600">View Patients</h3>
          <p className="mt-2 text-gray-600">
            Browse your patient list and manage their records.
          </p>
        </Link>

        {/* Navigation Card: Create Prescription */}
        <Link
          to="/doctor/prescribe"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-green-600">New Prescription</h3>
          <p className="mt-2 text-gray-600">
            Create and assign a new prescription for a patient.
          </p>
        </Link>

        {/* Navigation Card: Manage Profile */}
        <Link
          to="/doctor/profile"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-gray-600">Manage Profile</h3>
          <p className="mt-2 text-gray-600">
            Update your specialty, license number, or phone.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  )
}

export default DoctorDashboard
