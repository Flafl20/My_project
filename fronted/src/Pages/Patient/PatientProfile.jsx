import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import {
  checkPatientProfileStatus,
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
} from "../../services/api"

const PatientProfile = () => {
  const [profile, setProfile] = useState(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  //   const navigate = useNavigate()

  const [formData, setFormData] = useState({
    date_of_birth: "",
    phone_number: "",
    address: "",
    blood_type: "",
    allergies: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    medical_history: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const statusRes = await checkPatientProfileStatus()
      setHasProfile(statusRes.data.has_profile)

      if (statusRes.data.has_profile) {
        const profileRes = await getPatientProfile()
        setProfile(profileRes.data)
        setFormData({
          date_of_birth: profileRes.data.date_of_birth || "",
          phone_number: profileRes.data.phone_number || "",
          address: profileRes.data.address || "",
          blood_type: profileRes.data.blood_type || "",
          allergies: profileRes.data.allergies || "",
          emergency_contact_name: profileRes.data.emergency_contact_name || "",
          emergency_contact_number:
            profileRes.data.emergency_contact_number || "",
          medical_history: profileRes.data.medical_history || "",
        })
        setEditing(false)
      } else {
        setEditing(true)
      }
    } catch (err) {
      console.error("Failed to load profile", err)
      setError("Failed to load profile")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (hasProfile) {
        await updatePatientProfile(formData)
        setSuccess("profile updated successfully!")
      } else {
        await createPatientProfile(formData)
        setSuccess("profile created successfully")
        setHasProfile(true)
      }
      setEditing(false)
      loadProfile()
    } catch (err) {
      console.error("failed to save profile", err)
      setError(err.response?.data?.detail || "Failed to set profile")
    }
  }

  if (loading) {
    return <DashboardLayout>loading profile ...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          {hasProfile && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
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

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  name="emergency_contact_number"
                  value={formData.emergency_contact_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Medical History
                </label>
                <textarea
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                  placeholder="Previous surgeries, chronic conditions, etc."
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                {hasProfile ? "Update Profile" : "Create Profile"}
              </button>
              {hasProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    loadProfile()
                  }}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow">
            <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date of Birth
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.date_of_birth}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.phone_number}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Blood Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.blood_type || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.allergies || "None"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Emergency Contact
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.emergency_contact_name} -{" "}
                  {profile?.emergency_contact_number}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Medical History
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.medical_history || "None"}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PatientProfile
