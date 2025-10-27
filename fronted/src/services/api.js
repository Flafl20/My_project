import axios from "axios"
const API_BASE_URL = "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// -- Auth Functions --

export const loginUser = async (email, password) => {
  const params = new URLSearchParams()

  params.append("username", email)
  params.append("password", password)

  const response = await api.post("/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return response.data
}

// registers a new user //

export const registerUser = async (
  firstName,
  lastName,
  email,
  password,
  role
) => {
  const userData = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    role: role,
  }
  const response = await api.post("/register", userData)
  return response.data
}

// verifies ther current token //

export const verifyToken = async () => {
  const response = await api.get("/verify-token")
  return response.data
}

// DOCTOR Endpoints //

export const checkDoctorProfileStatus = () => api.get("/doctor/profile/status")
export const getDoctorProfile = () => api.get("/doctor/profile")
export const createDoctorProfile = (data) => api.post("/doctor/profile", data)
export const updateDoctorProfile = (data) => api.put("/doctor/profile", data)
export const getAllPatients = () => api.get("/doctor/patients")
export const createPrescription = (data) =>
  api.post("/doctor/prescriptions", data)

// Pharmacist Functions

export const getAllPrescriptions = () => api.get("/pharmacist/prescriptions")
export const getPrescriptionById = (id) =>
  api.get(`/pharmacist/prescriptions/${id}`)
export const fillPrescription = (id, data) =>
  api.post(`/pharmacist/prescriptions/${id}/fill`, data)

// BIo-Analyst Endpoints //

export const getLabTests = () => api.get("/bio-analyst/tests")
export const uploadLabTest = (formData) => {
  return api.post("/bio-analyst/tests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
export const getLabTestFile = (id) =>
  api.get(`/bio-analyst/tests/${id}/file`, { responseType: "blob" })

export default api
