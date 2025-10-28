import React from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"

const PharmacistDashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">
        Pharmacist Dashboard
      </h2>
      <p className="mt-2 text-gray-700">
        Welcome, Pharmacist! Manage prescriptions and fills here.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2">
        <Link
          to="/pharmacist/prescriptions"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-blue-600">
            View Prescriptions
          </h3>
          <p className="mt-2 text-gray-600">
            Browse all prescriptions and fill them for patients.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  )
}

export default PharmacistDashboard
