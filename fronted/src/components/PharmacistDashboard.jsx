import React from "react"
import DashboardLayout from "../components/DashboardLayout"

const PharmacistDashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">
        Pharmacist Dashboard
      </h2>
      <p className="mt-2 text-gray-700">
        Welcome, Pharmacist! This is your protected page.
      </p>
      {/* Your dashboard-specific content goes here */}
    </DashboardLayout>
  )
}

export default PharmacistDashboard
