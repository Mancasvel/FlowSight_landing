export default function FinalCtaSection() {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white section-padding">
      <div className="container-max text-center px-4 sm:px-6 lg:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
          Ready to Give Your Team Complete Task Visibility?
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          Schedule a live demo or download the free agent to see FlowSight in action.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 px-4">
          <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1 text-sm sm:text-base">
            Schedule 15-Minute Demo
          </button>
          <button className="border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base">
            Download Free Agent
          </button>
        </div>
      </div>
    </section>
  )
}