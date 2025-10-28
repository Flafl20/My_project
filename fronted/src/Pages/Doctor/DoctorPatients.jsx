import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getAllPatients } from "../../services/api"

const DoctorPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      const response = await getAllPatients()
      setPatients(response.data)
    } catch (err) {
      console.error("Failed to load patients", err)
      setError("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.user?.first_name || ""} ${
      patient.user?.last_name || ""
    }`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return <DashboardLayout>Loading patients...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Patients</h2>
          <Link
            to="/doctor/prescribe"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            New Prescription
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {filteredPatients.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No patients found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <li key={patient.id}>
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-medium text-blue-600">
                            Patient ID: {patient.id}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="text-sm text-gray-900">
                                {patient.phone_number}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Blood Type
                              </p>
                              <p className="text-sm text-gray-900">
                                {patient.blood_type || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Date of Birth
                              </p>
                              <p className="text-sm text-gray-900">
                                {patient.date_of_birth}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Allergies</p>
                              <p className="text-sm text-gray-900">
                                {patient.allergies || "None"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DoctorPatients
