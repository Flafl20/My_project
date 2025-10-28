import React, { useState, useEffect } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { getPatientProfile, getLabTestFile } from "../../services/api"

const PatientLabTests = () => {
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadLabTests()
  }, [])

  const loadLabTests = async () => {
    try {
      const response = await getPatientProfile()
      // Note: Backend returns patient with lab_tests relationship
      setLabTests(response.data.lab_tests || [])
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

  if (loading) {
    return <DashboardLayout>Loading lab tests...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">My Lab Tests</h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {labTests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You don't have any lab test results yet
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
                        <div>
                          <p className="text-sm text-gray-500">Uploaded</p>
                          <p className="text-sm text-gray-900">
                            {new Date(test.created_at).toLocaleDateString()}
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
      </div>
    </DashboardLayout>
  )
}

export default PatientLabTests
