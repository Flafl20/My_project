import React from "react"
import DashboardLayout from "../components/DashboardLayout"

const BioAnalystDashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">
        Bio Analyst Dashboard
      </h2>
      <p className="mt-2 text-gray-700">
        Welcome, Bio Analyst! This is your protected page.
      </p>
      {/* Your dashboard-specific content goes here */}
    </DashboardLayout>
  )
}

export default BioAnalystDashboard
