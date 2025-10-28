import React from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"

const BioAnalystDashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold text-gray-900">
        Bio Analyst Dashboard
      </h2>
      <p className="mt-2 text-gray-700">
        Welcome, Bio Analyst! Manage patient lab tests here.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2">
        <Link
          to="/bio-analyst/upload"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-green-600">Upload Lab Test</h3>
          <p className="mt-2 text-gray-600">
            Upload new lab test results for patients.
          </p>
        </Link>

        <Link
          to="/bio-analyst/tests"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
        >
          <h3 className="text-xl font-bold text-blue-600">View Lab Tests</h3>
          <p className="mt-2 text-gray-600">
            Browse and manage all lab test records.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  )
}

export default BioAnalystDashboard
