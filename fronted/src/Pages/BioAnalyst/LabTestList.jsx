import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import {
  getAllPatients,
  getPatientLabTests,
  getLabTestFile,
} from "../../services/api"

const LabTestList = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      loadLabTests(selectedPatient)
    } else {
      setLabTests([])
    }
  }, [selectedPatient])

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

  const loadLabTests = async (patientId) => {
    setLoading(true)
    try {
      const response = await getPatientLabTests(patientId)
      setLabTests(response.data)
    } catch (err) {
      console.error("Failed to load lab tests", err)
      setError("Failed to load lab tests")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (testId, fileName) => {
    try {
      const response = await getLabTestFile(testId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download file", err)
      alert("Failed to download file")
    }
  }

  if (loading && !selectedPatient) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Lab Tests</h2>
          <Link
            to="/bio-analyst/upload"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Upload New Test
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Patient
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">-- Select a patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                Patient ID: {patient.id} - Phone: {patient.phone_number}
              </option>
            ))}
          </select>
        </div>

        {selectedPatient && (
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading tests...
              </div>
            ) : labTests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No lab tests found for this patient
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {labTests.map((test) => (
                  <li key={test.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900">
                          {test.test_name}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-3">
                          <div>
                            <p className="text-sm text-gray-500">Test ID</p>
                            <p className="text-sm text-gray-900">{test.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Test Date</p>
                            <p className="text-sm text-gray-900">
                              {new Date(test.test_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">File Type</p>
                            <p className="text-sm text-gray-900">
                              {test.content_type}
                            </p>
                          </div>
                          {test.notes && (
                            <div className="md:col-span-3">
                              <p className="text-sm text-gray-500">Notes</p>
                              <p className="text-sm text-gray-900">
                                {test.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            handleDownload(test.id, test.original_filename)
                          }
                          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default LabTestList
