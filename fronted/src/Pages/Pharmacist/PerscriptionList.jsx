import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getAllPrescriptions } from "../../services/api"

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    try {
      const response = await getAllPrescriptions()
      setPrescriptions(response.data)
    } catch (err) {
      console.error("Failed to load prescriptions", err)
      setError("Failed to load prescriptions")
    } finally {
      setLoading(false)
    }
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "filled" && prescription.is_filled) ||
      (filterStatus === "unfilled" && !prescription.is_filled)

    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      prescription.medication_name.toLowerCase().includes(searchLower) ||
      prescription.patient_name?.toLowerCase().includes(searchLower) ||
      prescription.patient_id.toString().includes(searchLower)

    return matchesStatus && matchesSearch
  })

  if (loading) {
    return <DashboardLayout>Loading prescriptions...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Prescriptions</h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by medication, patient name, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Prescriptions</option>
            <option value="unfilled">Unfilled</option>
            <option value="filled">Filled</option>
          </select>
        </div>

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {filteredPrescriptions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No prescriptions found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <li key={prescription.id}>
                  <Link
                    to={`/pharmacist/prescriptions/${prescription.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-medium text-blue-600">
                            {prescription.medication_name}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Patient Name
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {prescription.patient_name ||
                                  `ID: ${prescription.patient_id}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Dosage</p>
                              <p className="text-sm text-gray-900">
                                {prescription.dosage}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <p
                                className={`text-sm font-medium ${
                                  prescription.is_filled
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {prescription.is_filled ? "Filled" : "Unfilled"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fills</p>
                              <p className="text-sm text-gray-900">
                                {prescription.times_filled} /{" "}
                                {prescription.max_refills + 1}
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

export default PrescriptionList
