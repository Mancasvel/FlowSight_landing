'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12 pt-12 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 leading-tight">
                Task Visibility Without
                <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Developer Surveillance
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Automatic task traceability powered by AI context understanding.
                Replaces invasive time tracking and manual updates with local, privacy-first architecture.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="group bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
                <span className="flex items-center justify-center">
                  See Live Demo
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="group border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                Download Free Agent
              </button>
            </div>

            {/* Stats */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">+50</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">90%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">€4.8K</div>
                <div className="text-sm text-gray-600">Saved/Team</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5">
                        <Image
                          src="/flowsight_sinfondo.png"
                          alt="FlowSight"
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">FlowSight Dashboard</h3>
                        <p className="text-sm text-gray-500">Real-time task insights</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Task Cards */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">TASK-482 (Frontend)</h4>
                          <p className="text-sm text-gray-600">Debugging API integration</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-teal-600">2.5h today</div>
                          <div className="text-xs text-gray-500">In Progress</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">TASK-491 (Backend)</h4>
                          <p className="text-sm text-gray-600">Waiting for design approval</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-orange-600">45m today</div>
                          <div className="text-xs text-gray-500">Blocked</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">87%</div>
                      <div className="text-xs text-gray-600">Context Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">100%</div>
                      <div className="text-xs text-gray-600">Local Processing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
