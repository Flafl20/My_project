import React, { useState, useEffect } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { getPatientProfile } from "../../services/api"

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    try {
      const response = await getPatientProfile()
      // Note: Backend returns patient with prescriptions relationship
      // You may need to adjust based on actual API response
      setPrescriptions(response.data.prescriptions || [])
    } catch (err) {
      console.error("Failed to load prescriptions", err)
      setError("Failed to load prescriptions")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading prescriptions...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          My Prescriptions
        </h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {prescriptions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You don't have any prescriptions yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <li key={prescription.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900">
                        {prescription.medication_name}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                        <div>
                          <p className="text-sm text-gray-500">Dosage</p>
                          <p className="text-sm text-gray-900">
                            {prescription.dosage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Frequency</p>
                          <p className="text-sm text-gray-900">
                            {prescription.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="text-sm text-gray-900">
                            {prescription.duration}
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
                            {prescription.is_filled ? "Filled" : "Not Filled"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Prescribed Date
                          </p>
                          <p className="text-sm text-gray-900">
                            {new Date(
                              prescription.prescribed_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fills</p>
                          <p className="text-sm text-gray-900">
                            {prescription.times_filled} /{" "}
                            {prescription.max_refills + 1}
                          </p>
                        </div>
                        {prescription.instructions && (
                          <div className="md:col-span-4">
                            <p className="text-sm text-gray-500">
                              Instructions
                            </p>
                            <p className="text-sm text-gray-900">
                              {prescription.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PatientPrescriptions
