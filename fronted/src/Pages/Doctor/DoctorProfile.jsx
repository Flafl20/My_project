import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import {
  checkDoctorProfileStatus,
  getDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
} from "../../services/api"

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  //   const navigate = useNavigate()

  const [formData, setFormData] = useState({
    specialty: "",
    license_number: "",
    phone_number: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const statusRes = await checkDoctorProfileStatus()
      setHasProfile(statusRes.data.has_profile)

      if (statusRes.data.has_profile) {
        const profileRes = await getDoctorProfile()
        setProfile(profileRes.data)
        setFormData({
          specialty: profileRes.data.specialty || "",
          license_number: profileRes.data.license_number || "",
          phone_number: profileRes.data.phone_number || "",
        })
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
        await updateDoctorProfile(formData)
        setSuccess("Profile updated successfully!")
      } else {
        await createDoctorProfile(formData)
        setSuccess("Profile created successfully!")
        setHasProfile(true)
      }
      setEditing(false)
      loadProfile()
    } catch (err) {
      console.error("Failed to save profile", err)
      setError(err.response?.data?.detail || "Failed to save profile")
    }
  }

  if (loading) {
    return <DashboardLayout>Loading profile...</DashboardLayout>
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
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                  placeholder="e.g., Cardiology, Pediatrics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  required
                  disabled={hasProfile}
                  className="w-full px-3 py-2 mt-1 border rounded-md disabled:bg-gray-100"
                />
                {hasProfile && (
                  <p className="mt-1 text-sm text-gray-500">
                    License number cannot be changed after creation
                  </p>
                )}
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
            <dl className="grid grid-cols-1 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.full_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Specialty</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.specialty}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  License Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.license_number}
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
            </dl>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DoctorProfile
