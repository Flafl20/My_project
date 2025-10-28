import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import { getPatientById } from "../../services/api"

const PatientDetails = () => {
  const { patientId } = useParams()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPatient()
  }, [patientId])

  const loadPatient = async () => {
    try {
      const response = await getPatientById(patientId)
      setPatient(response.data)
    } catch (err) {
      console.error("Failed to load patient", err)
      setError("Failed to load patient details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading patient details...</DashboardLayout>
  }

  if (error || !patient) {
    return (
      <DashboardLayout>
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error || "Patient not found"}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Patient Details</h2>
          <Link
            to="/doctor/patients"
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to Patients
          </Link>
        </div>

        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Personal Information
          </h3>
          <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Date of Birth
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.date_of_birth}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Phone Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.phone_number}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.blood_type || "N/A"}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Allergies</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.allergies || "None"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Emergency Contact
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.emergency_contact_name} -{" "}
                {patient.emergency_contact_number}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Medical History
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.medical_history || "None"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-center">
          <Link
            to={`/doctor/prescribe?patientId=${patient.id}`}
            className="px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Create Prescription for this Patient
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PatientDetails
