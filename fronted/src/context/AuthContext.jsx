import React, { createContext, useState, useEffect, useContext } from "react"
import { loginUser, verifyToken } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
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

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password)
      const newToken = data.access_token
      localStorage.setItem("token", newToken)
      setToken(newToken)

      const verifyData = await verifyToken()
      setAuthRole(verifyData.role)

      return verifyData
    } catch (error) {
      console.error(error)
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
