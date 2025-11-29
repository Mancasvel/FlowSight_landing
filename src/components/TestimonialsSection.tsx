// Commented out for future use
/*
export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "\"We went from 45-minute standups guessing who's blocked to 15-minute meetings with real context. That's 5 hours per week saved for a 50-person team. At €40/hour, that's €10,000/month value.\"",
      attribution: "Engineering Manager at StartupX",
      rating: 5
    },
    {
      quote: "\"Our CTO rejected Clockify for privacy reasons. FlowSight gave us visibility without the surveillance. Deployed to 50 developers in one week.\"",
      attribution: "Security Lead at EnterpriseY",
      rating: 5
    },
    {
      quote: "\"The AI explains not just 'what' but 'why'—'John is stuck on API timeout' not just 'John is idle.' Context changes everything.\"",
      attribution: "Tech Lead at ScaleupZ",
      rating: 5
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="bg-gray-50 section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Teams Love FlowSight
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Real feedback from engineering leaders using automatic task traceability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <blockquote className="text-lg text-navy-900 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>

              <cite className="text-muted font-medium">
                — {testimonial.attribution}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
*/

export default function TestimonialsSection() {
  return null
}
