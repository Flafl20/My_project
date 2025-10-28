// fronted/src/Pages/LandingPage.jsx
import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const heroRef = useRef(null)
  const heroImageRef = useRef(null)
  const featuresRef = useRef(null)
  const benefitsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    // Hero Section Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          ".hero-button",
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )

      // Hero Image Animation
      gsap.from(heroImageRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      })

      // Floating animation for hero image
      gsap.to(heroImageRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Features Section Animation
      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 50,
        },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
        }
      )

      // Benefits Section Animation
      gsap.fromTo(
        ".benefit-item",
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      )

      // CTA Section Animation
      gsap.fromTo(
        ".cta-content",
        {
          opacity: 0,
          y: 50,
        },
        {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      ref={heroRef}
    >
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                HealthApp
              </span>
            </div>
            <div className="flex space-x-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 text-sm font-medium text-white transition-transform bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-sm font-medium text-white transition-transform bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 hero-title sm:text-6xl">
            Your Health, <span className="text-blue-600">Simplified</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600 hero-subtitle">
            A comprehensive healthcare management system connecting patients,
            doctors, pharmacists, and bio-analysts in one secure platform.
          </p>
          <div className="mt-10 hero-button">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16" ref={heroImageRef}>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-64 h-64 text-white opacity-20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white" ref={featuresRef}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need for Better Healthcare
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              Our platform provides comprehensive tools for all healthcare
              stakeholders
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
            {/* Patient Features */}
            <div className="p-6 text-center transition-all bg-blue-50 rounded-xl feature-card hover:shadow-lg hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Patients</h3>
              <ul className="mt-4 space-y-2 text-left text-gray-600">
                <li>✓ Manage your health profile</li>
                <li>✓ View prescriptions</li>
                <li>✓ Access lab test results</li>
                <li>✓ Track medical history</li>
              </ul>
            </div>

            {/* Doctor Features */}
            <div className="p-6 text-center transition-all bg-green-50 rounded-xl feature-card hover:shadow-lg hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-600 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Doctors</h3>
              <ul className="mt-4 space-y-2 text-left text-gray-600">
                <li>✓ Manage patient records</li>
                <li>✓ Create prescriptions</li>
                <li>✓ View patient history</li>
                <li>✓ Track treatments</li>
              </ul>
            </div>

            {/* Pharmacist Features */}
            <div className="p-6 text-center transition-all bg-purple-50 rounded-xl feature-card hover:shadow-lg hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-600 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                For Pharmacists
              </h3>
              <ul className="mt-4 space-y-2 text-left text-gray-600">
                <li>✓ View all prescriptions</li>
                <li>✓ Fill prescriptions</li>
                <li>✓ Track refills</li>
                <li>✓ Manage inventory</li>
              </ul>
            </div>

            {/* Bio-Analyst Features */}
            <div className="p-6 text-center transition-all bg-orange-50 rounded-xl feature-card hover:shadow-lg hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-600 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                For Bio-Analysts
              </h3>
              <ul className="mt-4 space-y-2 text-left text-gray-600">
                <li>✓ Upload lab results</li>
                <li>✓ Manage test records</li>
                <li>✓ Share results securely</li>
                <li>✓ Track patient tests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800"
        ref={benefitsRef}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose HealthApp?
            </h2>
            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
              <div className="benefit-item">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 transition-transform bg-white rounded-full bg-opacity-20 hover:scale-110">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="mt-2 text-blue-100">
                  Your health data is encrypted and protected with
                  industry-standard security
                </p>
              </div>
              <div className="benefit-item">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 transition-transform bg-white rounded-full bg-opacity-20 hover:scale-110">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Fast & Efficient</h3>
                <p className="mt-2 text-blue-100">
                  Streamlined processes save time for both patients and
                  healthcare providers
                </p>
              </div>
              <div className="benefit-item">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 transition-transform bg-white rounded-full bg-opacity-20 hover:scale-110">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Connected Care</h3>
                <p className="mt-2 text-blue-100">
                  Seamless communication between all healthcare stakeholders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white" ref={ctaRef}>
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8 cta-content">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            Join thousands of users managing their healthcare more effectively
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 text-lg font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © 2025 HealthApp. All rights reserved. | Your trusted healthcare
            management platform
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
