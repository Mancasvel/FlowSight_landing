'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import BetaSignupModal from './BetaSignupModal'
import { useBetaModal } from '@/hooks/useBetaModal'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [codeLines, setCodeLines] = useState<number>(0)
  const [taskProgress, setTaskProgress] = useState(0)
  const [currentStatus, setCurrentStatus] = useState('analyzing')
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const restartIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { isOpen, openModal, closeModal } = useBetaModal()

  // Real TypeScript authentication code
  const codeSnippets = [
    { text: 'import', type: 'keyword' },
    { text: ' { hash, compare } ', type: 'normal' },
    { text: 'from', type: 'keyword' },
    { text: ' "bcrypt"', type: 'string' },
  ]

  const allCodeLines = [
    [{ text: 'import', type: 'keyword' }, { text: ' { hash, compare } ', type: 'normal' }, { text: 'from', type: 'keyword' }, { text: ' "bcrypt"', type: 'string' }],
    [{ text: 'import', type: 'keyword' }, { text: ' { sign } ', type: 'normal' }, { text: 'from', type: 'keyword' }, { text: ' "jsonwebtoken"', type: 'string' }],
    [],
    [{ text: 'interface', type: 'keyword' }, { text: ' User {', type: 'normal' }],
    [{ text: '  id', type: 'property' }, { text: ': ', type: 'normal' }, { text: 'string', type: 'type' }],
    [{ text: '  email', type: 'property' }, { text: ': ', type: 'normal' }, { text: 'string', type: 'type' }],
    [{ text: '  passwordHash', type: 'property' }, { text: ': ', type: 'normal' }, { text: 'string', type: 'type' }],
    [{ text: '}', type: 'normal' }],
    [],
    [{ text: 'const', type: 'keyword' }, { text: ' JWT_SECRET = process.env.JWT_SECRET!', type: 'normal' }],
    [],
    [{ text: 'export', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'async', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'function', type: 'keyword' }, { text: ' authenticate(', type: 'normal' }],
    [{ text: '  email: ', type: 'normal' }, { text: 'string', type: 'type' }, { text: ',', type: 'normal' }],
    [{ text: '  password: ', type: 'normal' }, { text: 'string', type: 'type' }],
    [{ text: '): ', type: 'normal' }, { text: 'Promise', type: 'type' }, { text: '<', type: 'normal' }, { text: 'string', type: 'type' }, { text: ' | ', type: 'normal' }, { text: 'null', type: 'type' }, { text: '> {', type: 'normal' }],
    [{ text: '  ', type: 'normal' }, { text: 'const', type: 'keyword' }, { text: ' user = ', type: 'normal' }, { text: 'await', type: 'keyword' }, { text: ' db.users.', type: 'normal' }, { text: 'findByEmail', type: 'function' }, { text: '(email)', type: 'normal' }],
    [{ text: '  ', type: 'normal' }, { text: 'if', type: 'keyword' }, { text: ' (!user) ', type: 'normal' }, { text: 'return', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'null', type: 'type' }],
    [],
    [{ text: '  ', type: 'normal' }, { text: 'const', type: 'keyword' }, { text: ' valid = ', type: 'normal' }, { text: 'await', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'compare', type: 'function' }, { text: '(password, user.passwordHash)', type: 'normal' }],
    [{ text: '  ', type: 'normal' }, { text: 'if', type: 'keyword' }, { text: ' (!valid) ', type: 'normal' }, { text: 'return', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'null', type: 'type' }],
    [],
    [{ text: '  ', type: 'normal' }, { text: 'return', type: 'keyword' }, { text: ' ', type: 'normal' }, { text: 'sign', type: 'function' }, { text: '({ userId: user.id }, JWT_SECRET)', type: 'normal' }],
    [{ text: '}', type: 'normal' }],
  ]

  const statusMessages = [
    { status: 'analyzing', message: 'Analyzing code context...' },
    { status: 'detecting', message: 'Detecting task: AUTH-247' },
    { status: 'linking', message: 'Linking to Jira ticket...' },
    { status: 'updating', message: 'Updating task status...' },
    { status: 'complete', message: 'Task updated automatically' },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Typing animation for code
  useEffect(() => {
    if (codeLines < allCodeLines.length) {
      const timer = setTimeout(() => {
        setCodeLines(prev => prev + 1)
      }, 300 + Math.random() * 150)

      return () => clearTimeout(timer)
    }
  }, [codeLines])

  // Task progress animation - synced with code typing
  useEffect(() => {
    const progress = Math.min(100, Math.round((codeLines / allCodeLines.length) * 100))
    setTaskProgress(progress)
  }, [codeLines])

  // Status updates based on progress
  useEffect(() => {
    if (taskProgress < 25) setCurrentStatus('analyzing')
    else if (taskProgress < 50) setCurrentStatus('detecting')
    else if (taskProgress < 75) setCurrentStatus('linking')
    else setCurrentStatus('complete')
  }, [taskProgress])

  // Detect when animation is complete and start repeating after 5 seconds
  useEffect(() => {
    if (taskProgress === 100 && !isAnimationComplete) {
      setIsAnimationComplete(true)

      // Wait 5 seconds after completion, then restart animation
      setTimeout(() => {
        // Reset all animation states to start over
        setCodeLines(0)
        setTaskProgress(0)
        setCurrentStatus('analyzing')
        setIsAnimationComplete(false)
      }, 5000)
    }
  }, [taskProgress, isAnimationComplete])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (restartIntervalRef.current) {
        clearInterval(restartIntervalRef.current)
      }
    }
  }, [])

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'keyword': return 'text-purple-400'
      case 'type': return 'text-blue-400'
      case 'function': return 'text-yellow-300'
      case 'string': return 'text-green-400'
      case 'property': return 'text-cyan-300'
      case 'comment': return 'text-gray-500'
      default: return 'text-gray-100'
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden pt-20 pb-16 sm:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12">
        {/* Top Header Text */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 px-2">
            Code Naturally
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              We Handle the Rest
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
            Write code as you always do. FlowSight automatically understands context,
            links to tasks, and updates progress: all locally, with zero interruption.
          </p>
        </div>

        {/* Two macOS Windows Side by Side */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Left: Code Editor (VS Code style) */}
          <div className="w-full">
            {/* macOS Window Chrome */}
            <div className="bg-[#1e1e1e] rounded-t-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                </svg>
                <span className="truncate">auth.service.ts</span>
              </div>
              <div className="w-8 sm:w-16"></div>
            </div>

            {/* Code Editor Content */}
            <div className="bg-[#1e1e1e] shadow-2xl overflow-hidden">
              <div className="flex">
                {/* Line Numbers */}
                <div className="bg-[#1e1e1e] text-gray-500 text-xs sm:text-sm font-mono py-3 sm:py-4 px-2 sm:px-3 select-none border-r border-gray-800 flex-shrink-0">
                  {allCodeLines.map((_, index) => (
                    <div
                      key={index}
                      className={`leading-5 sm:leading-6 text-right pr-1 sm:pr-2 transition-opacity duration-300 ${index < codeLines ? 'opacity-100' : 'opacity-30'
                        }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Code Content */}
                <div className="flex-1 py-3 sm:py-4 px-2 sm:px-4 font-mono text-xs sm:text-sm overflow-hidden">
                  {allCodeLines.map((tokens, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`leading-5 sm:leading-6 whitespace-pre transition-all duration-300 ${lineIndex < codeLines
                          ? 'opacity-100'
                          : lineIndex === codeLines
                            ? 'opacity-50'
                            : 'opacity-0'
                        }`}
                    >
                      {lineIndex < codeLines ? (
                        tokens.length > 0 ? (
                          tokens.map((token, tokenIndex) => (
                            <span key={tokenIndex} className={getTokenColor(token.type)}>
                              {token.text}
                            </span>
                          ))
                        ) : (
                          <span>&nbsp;</span>
                        )
                      ) : lineIndex === codeLines ? (
                        <span className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-teal-400 animate-pulse"></span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-[#007acc] text-white text-[10px] sm:text-xs px-2 sm:px-4 py-1 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span>TypeScript</span>
                  <span className="hidden sm:inline">UTF-8</span>
                  <span className="hidden md:inline">Ln {codeLines}, Col 1</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>FlowSight Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FlowSight Task Tracker */}
          <div className="w-full">
            {/* macOS Window Chrome */}
            <div className="bg-slate-800 rounded-t-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-xs sm:text-sm">
                <Image
                  src="/flowsight_sinfondo.png"
                  alt="FlowSight"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
                <span className="truncate">FlowSight — Task Tracker</span>
              </div>
              <div className="w-8 sm:w-16"></div>
            </div>

            {/* FlowSight Content */}
            <div className="bg-slate-900 shadow-2xl overflow-hidden p-3 sm:p-4 md:p-5">
              {/* Current Task Card */}
              <div className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 rounded-xl p-3 sm:p-4 border border-teal-500/30 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">AUTH-247</h3>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">Implement user authentication</p>
                    </div>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border self-start sm:self-auto whitespace-nowrap transition-all duration-500 ${taskProgress >= 100
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    }`}>
                    {taskProgress >= 100 ? 'Completed' : 'In Progress'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-teal-400 font-medium">{taskProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Tracked */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Time tracked today</span>
                  <span className="text-white font-medium">2h 34m</span>
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <h4 className="text-gray-400 text-xs sm:text-sm font-medium mb-4 sm:mb-3">Live Activity</h4>

                <div className="space-y-2.5">
                  {statusMessages.map((item, index) => {
                    const isActive = item.status === currentStatus
                    const isPast = statusMessages.findIndex(s => s.status === currentStatus) > index

                    return (
                      <div
                        key={item.status}
                        className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-all duration-500 ${isActive
                            ? 'bg-teal-500/20 border border-teal-500/30'
                            : isPast
                              ? 'bg-slate-800/50 opacity-70'
                              : 'bg-slate-800/30 opacity-40'
                          }`}
                      >
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${isActive ? 'bg-teal-500/30 text-teal-300' : isPast ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-gray-500'
                          }`}>
                          {isPast ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : isActive ? (
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                          ) : (
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {item.message}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-4 pt-3 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-teal-400">97%</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Context Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-400">100%</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Local Processing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-8 md:mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={openModal}
              className="group bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center text-sm sm:text-base">
                Start Free Trial
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

          </div>

          {/* Trust Indicators */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-500 text-xs sm:text-sm px-4">

            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% local</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>2 min setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beta Signup Modal */}
      <BetaSignupModal isOpen={isOpen} onClose={closeModal} />
    </section>
  )
}