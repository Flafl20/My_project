import React from "react"
import { useAuth } from "../context/AuthContext"

const DashboardLayout = ({ children }) => {
  const { logout, authRole } = useAuth()

  const getTitle = () => {
    if (authRole === "BIO_ANALYST") return "Bio Analyset"
    return authRole.charAt(0).toUpperCase() + authRole.slice(1).toLowerCase()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: App Title & Role */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                HealthApp
              </span>
              <span className="ml-4 text-lg font-medium text-gray-700">
                | {getTitle()} Portal
              </span>
            </div>

            {/* Right Side: Logout Button */}
            <div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <div className="py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* The content of your dashboard page (e.g., DoctorDashboard) will be injected here */}
          <div className="p-8 bg-white rounded-lg shadow">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
