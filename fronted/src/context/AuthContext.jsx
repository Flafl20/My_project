import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Children,
} from "react"
import { verifyToken } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ Children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [authRole, setAuthRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const data = await verifyToken()
          if (data.is_valid) {
            setAuthRole(data.role)
          } else {
            logout()
          }
        } catch (error) {
          console.error("Token validation failed", error)
          logout()
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [token])

  const login = (newToken, role) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setAuthRole(role)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setAuthRole(null)
  }

  const value = {
    token,
    authRole,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token,
  }
  return (
    <AuthContext.Provider value={value}>
      {isLoading && Children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
