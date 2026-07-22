import Link from 'next/link'
import { Lock, Mail, MessageSquare, HelpCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:32px_32px]">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tighter text-secondary-navy">
            Flow<span className="text-primary-teal">Sight</span>
          </Link>
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-400 md:flex">
            <Lock className="h-3 w-3" aria-hidden />
            <span>privacy-first, local, yours forever</span>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-primary-teal hover:to-primary-cyan hover:shadow-lg"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
            Get in
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Touch
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Questions about local AI, cognitive analytics, or enterprise proof of work programs? We read every note, especially from
            workers, People teams, and marketplace operators.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Contact Info */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-secondary-navy mb-8">Contact Information</h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: 'Email',
                      desc: 'hello@flowsight.com',
                      gradient: 'from-cyan-500/20 to-teal-500/20',
                    },
                    {
                      icon: MessageSquare,
                      title: 'Live Chat',
                      desc: 'Available 9 AM to 6 PM EST',
                      gradient: 'from-blue-500/20 to-indigo-500/20',
                    },
                    {
                      icon: HelpCircle,
                      title: 'Support',
                      desc: 'Technical support and documentation',
                      gradient: 'from-purple-500/20 to-pink-500/20',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.gradient}`}>
                        <item.icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary-navy mb-1">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-xl font-bold text-secondary-navy mb-6">Send us a Message</h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Subject</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary-navy focus:outline-none focus:border-primary-teal transition-colors">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Sales</option>
                      <option>Partnership</option>
                      <option>Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
