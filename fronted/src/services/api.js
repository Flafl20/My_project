import axios from "axios"
const API_BASE_URL = "http;//localhost:8000"

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

// --- Auth Functions --- //

export const loginUser = async (email, password) => {
  const params = new URLSearchParams()
  params.append("username", email)
  params.append("password", password)

  const respone = await api.post("/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return respone.data
}

export const regusterUser = async (
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

export const verifyToken = async () => {
  const response = await api.get("/verify-token")
  return response.data
}

// --- PATIENT Endpoints --- //

export const checkPatientProfileStatus = () =>
  api.get("/patient/profile/status")
export const getPatientProfile = () => api.get("/patient/profile/info")
export const createPatientProfile = (data) => api.post("/patient/profile", data)
export const updatePatientProfile = (data) => api.put("/patient/profile", data)

// --- DOCTOR Endpoints --- //

export const checkDoctorProfileStatus = () => api.get("/doctor/profile/status")
export const getDoctorProfile = () => api.get("/doctor/profile")
export const createDoctorProfile = (data) => api.post("/doctor/profile", data)
export const updateDoctorProfile = (data) => api.put("/doctor/profile", data)
export const getAllPatients = () => api.get("/doctor/patients")
export const getPatientById = (id) => api.get(`/doctor/patients/${id}`)
export const createPrescrpiton = (data) =>
  api.post("/doctor/prescriptions", data)
export const getPrescription = (id) => api.get(`doctor/prescriptions/${id}`)

// --- PHARMACIST Endpoints --- //

export const getAllPrescriptions = () => api.get("/pharmacist/prescriptions")
export const getPrescriptionsById = (id) =>
  api.get(`/pharmacist/prescriptions/${id}`)
export const fillPrescription = (id, data) =>
  api.post(`/pharmacist/prescriptions/${id}/fill`, data)

// --- BIO-ANALYST Endpoints --- //

export const createLabTest = (FormData) => {
  return api.post("/bio-analyst/test", FormData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export const getPatientLabTests = (patientId) =>
  api.get(`/bio-analyst/patients/${patientId}/tests`)
export const getLabTest = (id) => api.get(`/bio-analyst/test/${id}`)
export const getLabTestFile = (id) =>
  api.get(`/bio-analyst/tests/${id}/file`, { responseType: "blob" })

export default api
