import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getPrescriptionById, fillPrescription } from "../../services/api"

const PrescriptionDetails = () => {
  const { prescriptionId } = useParams()
  const navigate = useNavigate()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showFillForm, setShowFillForm] = useState(false)
  const [fillData, setFillData] = useState({
    quantity_dispensed: "",
    notes: "",
  })

  useEffect(() => {
    loadPrescription()
  }, [prescriptionId])

  const loadPrescription = async () => {
    try {
      const response = await getPrescriptionById(prescriptionId)
      setPrescription(response.data)
    } catch (err) {
      console.error("Failed to load prescription", err)
      setError("Failed to load prescription details")
    } finally {
      setLoading(false)
    }
  }

  const handleFillSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await fillPrescription(prescriptionId, fillData)
      setSuccess("Prescription filled successfully!")
      setShowFillForm(false)
      setFillData({ quantity_dispensed: "", notes: "" })
      loadPrescription()
    } catch (err) {
      console.error("Failed to fill prescription", err)
      setError(err.response?.data?.detail || "Failed to fill prescription")
    }
  }

  const canFill = () => {
    if (!prescription) return false
    const totalAllowed = prescription.max_refills + 1
    return prescription.times_filled < totalAllowed
  }

  if (loading) {
    return <DashboardLayout>Loading prescription details...</DashboardLayout>
  }

  if (error && !prescription) {
    return (
      <DashboardLayout>
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Prescription Details
          </h2>
          <button
            onClick={() => navigate("/pharmacist/prescriptions")}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to List
          </button>
        </div>

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

        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Prescription Information
            </h3>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                prescription.is_filled
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {prescription.is_filled ? "Fully Filled" : "Available"}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Prescription ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{prescription.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Patient Name
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {prescription.patient_name || `ID: ${prescription.patient_id}`}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Medication</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {prescription.medication_name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dosage</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.dosage}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Frequency</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.frequency}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.duration}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Prescribed Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(prescription.prescribed_date).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.expiry_date
                  ? new Date(prescription.expiry_date).toLocaleDateString()
                  : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fills</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.times_filled} / {prescription.max_refills + 1}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Instructions
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {prescription.instructions || "None"}
              </dd>
            </div>
          </dl>
        </div>

        {canFill() && !showFillForm && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowFillForm(true)}
              className="px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Fill Prescription
            </button>
          </div>
        )}

        {!canFill() && (
          <div className="p-4 mb-6 text-yellow-700 bg-yellow-100 rounded-md">
            This prescription has reached its maximum number of fills.
          </div>
        )}

        {showFillForm && (
          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Fill Prescription
            </h3>
            <form onSubmit={handleFillSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity Dispensed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fillData.quantity_dispensed}
                  onChange={(e) =>
                    setFillData({
                      ...fillData,
                      quantity_dispensed: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                  placeholder="e.g., 30 tablets"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={fillData.notes}
                  onChange={(e) =>
                    setFillData({ ...fillData, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                  placeholder="Additional notes (optional)"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Confirm Fill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFillForm(false)
                    setFillData({ quantity_dispensed: "", notes: "" })
                  }}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PrescriptionDetails
