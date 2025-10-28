import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getAllPatients, createLabTest } from "../../services/api"

const LabTestUpload = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    patient_id: "",
    test_name: "",
    notes: "",
  })
  const [file, setFile] = useState(null)

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setSubmitting(true)

    try {
      const uploadData = new FormData()
      uploadData.append("patient_id", formData.patient_id)
      uploadData.append("test_name", formData.test_name)
      uploadData.append("notes", formData.notes || "")
      uploadData.append("file", file)

      await createLabTest(uploadData)
      setSuccess("Lab test uploaded successfully!")

      // Reset form
      setFormData({ patient_id: "", test_name: "", notes: "" })
      setFile(null)
      document.getElementById("fileInput").value = ""

      setTimeout(() => {
        navigate("/bio-analyst/tests")
      }, 2000)
    } catch (err) {
      console.error("Failed to upload lab test", err)
      setError(err.response?.data?.detail || "Failed to upload lab test")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          Upload Lab Test Results
        </h2>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 bg-white rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.patient_name} (ID: {patient.id}) -{" "}
                  {patient.phone_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="e.g., Complete Blood Count, X-Ray"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Results File <span className="text-red-500">*</span>
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="Additional notes about the test results..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Uploading..." : "Upload Test Results"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/bio-analyst")}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default LabTestUpload
