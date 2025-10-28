import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getAllPatients, createPrescrpiton } from "../../services/api"

const CreatePrescription = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    patient_id: searchParams.get("patientId") || "",
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    max_refills: 0,
    expiry_date: "",
  })

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
    const value =
      e.target.type === "number" ? parseInt(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      await createPrescrpiton(formData)
      setSuccess("Prescription created successfully!")
      setTimeout(() => {
        navigate("/doctor/patients")
      }, 2000)
    } catch (err) {
      console.error("Failed to create prescription", err)
      setError(err.response?.data?.detail || "Failed to create prescription")
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
          Create New Prescription
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medication Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="medication_name"
                value={formData.medication_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
                placeholder="e.g., Amoxicillin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
                placeholder="e.g., 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frequency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Refills
              </label>
              <input
                type="number"
                name="max_refills"
                value={formData.max_refills}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="Additional instructions for the patient..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Prescription"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/doctor/patients")}
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

export default CreatePrescription
