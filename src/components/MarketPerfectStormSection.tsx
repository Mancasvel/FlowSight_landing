'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MarketPerfectStormSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'analytics'>('overview')

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 section-padding" id="market-storm">
      <div className="container-max px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            Project Manager Dashboard
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            See exactly what your team is working on — without asking them
          </p>
        </div>

        {/* macOS Dashboard Mockup */}
        <div className="relative max-w-6xl mx-auto">
          {/* macOS Window Chrome */}
          <div className="bg-gray-800 rounded-t-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-300 text-xs sm:text-sm font-medium truncate">
              FlowSight Dashboard - Project Manager View
            </div>
            <div className="w-8 sm:w-16"></div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-slate-900 rounded-b-xl shadow-2xl overflow-hidden border border-slate-700">
            {/* Top Navigation */}
            <div className="bg-slate-800 border-b border-slate-700 px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/flowsight_sinfondo.png"
                      alt="FlowSight"
                      width={20}
                      height={20}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="font-semibold text-white text-sm sm:text-base">FlowSight</span>
                  </div>
                  <nav className="flex space-x-2 sm:space-x-4">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        activeTab === 'overview'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        activeTab === 'tasks'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        activeTab === 'analytics'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Analytics
                    </button>
                  </nav>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Image
                    src="/mc_profile.jpg"
                    alt="Manuel Castillejo"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-600"
                  />
                  <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Manuel Castillejo</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content Area */}
            <div className="p-3 sm:p-4 md:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Welcome Header */}
                  <div className="bg-gradient-to-r from-teal-900/30 to-blue-900/30 rounded-xl p-4 sm:p-6 border border-teal-500/20">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">Welcome back, Manuel!</h3>
                    <p className="text-sm sm:text-base text-gray-400">Here&apos;s what&apos;s happening with your development teams today.</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-green-400">12</div>
                      <div className="text-xs sm:text-sm text-gray-400">Tasks Completed</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-blue-400">89%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Team Velocity</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-400">3</div>
                      <div className="text-xs sm:text-sm text-gray-400">Blocked Tasks</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-purple-400">97%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Documentation Development</div>
                    </div>
                  </div>

                  {/* Active Tasks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Sprint Progress</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-400">Frontend Redesign</span>
                          <span className="text-xs sm:text-sm font-medium text-green-400">85%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
                          <div className="bg-green-500 h-1.5 sm:h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-400">API Optimization</span>
                          <span className="text-xs sm:text-sm font-medium text-blue-400">62%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
                          <div className="bg-blue-500 h-1.5 sm:h-2 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Needs Attention</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-red-400 text-xs sm:text-sm">TASK-482</div>
                            <div className="text-xs text-red-300/70 truncate">API timeout - 45min blocked</div>
                          </div>
                          <div className="text-red-400 flex-shrink-0 ml-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-yellow-400 text-xs sm:text-sm">TASK-491</div>
                            <div className="text-xs text-yellow-300/70 truncate">Waiting for design approval</div>
                          </div>
                          <div className="text-yellow-400 flex-shrink-0 ml-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Team Task Overview</h3>
                  <div className="grid gap-3 sm:gap-4">
                    {[
                      { id: 'TASK-482', title: 'Frontend Redesign', status: 'In Progress', assignee: 'John D.', context: 'Debugging API integration' },
                      { id: 'TASK-491', title: 'API Optimization', status: 'Blocked', assignee: 'Sarah M.', context: 'Waiting for design approval' },
                      { id: 'TASK-478', title: 'Database Migration', status: 'Completed', assignee: 'Mike R.', context: 'Successfully deployed' },
                      { id: 'TASK-495', title: 'Mobile App', status: 'Planning', assignee: 'Lisa K.', context: 'Requirements gathering' },
                    ].map((task, index) => (
                      <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4 hover:border-slate-600 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                              task.status === 'Completed' ? 'bg-green-500' :
                              task.status === 'In Progress' ? 'bg-blue-500' :
                              task.status === 'Blocked' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <div className="min-w-0">
                              <div className="font-medium text-white text-xs sm:text-sm truncate">{task.id}: {task.title}</div>
                              <div className="text-xs text-gray-400 truncate">{task.context}</div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex sm:block items-center space-x-2 sm:space-x-0">
                            <div className={`text-xs sm:text-sm font-medium ${
                              task.status === 'Completed' ? 'text-green-400' :
                              task.status === 'In Progress' ? 'text-blue-400' :
                              task.status === 'Blocked' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {task.status}
                            </div>
                            <div className="text-xs text-gray-500">{task.assignee}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Team Performance Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Velocity Trend</h4>
                      <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg flex items-center justify-center border border-blue-500/20">
                        <span className="text-gray-400 text-xs sm:text-sm">Chart visualization</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2">Team velocity has increased 23% this sprint</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Context Accuracy</h4>
                      <div className="h-24 sm:h-32 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg flex items-center justify-center border border-green-500/20">
                        <span className="text-gray-400 text-xs sm:text-sm">Accuracy metrics</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2">97% of task inferences are accurate</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* macOS Dock Shadow */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/20 rounded-full blur-sm"></div>
        </div>
      </div>
    </section>
  )
}