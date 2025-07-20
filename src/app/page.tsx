export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-black">yourehired.ai</div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border border-black text-black bg-white hover:bg-gray-50 rounded-md">
              Sign In
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-black mb-6">
            AI-Powered Resume Builder That Gets You{" "}
            <span className="text-blue-600">Hired</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create tailored, ATS-optimized resumes in minutes. Our AI analyzes job descriptions 
            and crafts the perfect resume for each application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md">
              ⚡ Start Building Your Resume
            </button>
            <button className="px-8 py-4 border border-black text-black bg-white hover:bg-gray-50 text-lg rounded-md">
              View Sample Resumes
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            Why Choose yourehired.ai?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-3">Tailored for Each Job</h3>
              <p className="text-gray-600">
                Paste any job description and our AI creates a perfectly matched resume 
                highlighting your most relevant skills and experience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📄
              </div>
              <h3 className="text-xl font-semibold mb-3">ATS-Optimized</h3>
              <p className="text-gray-600">
                Built to pass Applicant Tracking Systems with proper formatting, 
                keywords, and structure that recruiters love.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate professional resumes in under 2 minutes. 
                No more hours spent tweaking layouts and wording.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-black mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choose the plan that works best for your job search
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 hover:border-blue-300 transition-colors rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold text-black mb-4">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>10 resume generations</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Save up to 3 resumes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>PDF export</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>GPT-3.5 AI model</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Basic Plan */}
            <div className="border-2 border-blue-500 hover:border-blue-600 transition-colors rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="text-4xl font-bold text-black mb-4">
                  $9.99<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>500 GPT-3.5 or 40 GPT-4 resumes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Save up to 10 resumes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Cover letter generation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>LinkedIn import</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Priority support</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Start Basic Plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-gray-200 hover:border-blue-300 transition-colors rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold text-black mb-4">
                  $29.99<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>1500 GPT-3.5 or 120 GPT-4 resumes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Save up to 100 resumes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Job matching & alerts</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>Advanced AI optimization</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span>VIP support</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-sm text-gray-600">
            © 2024 yourehired.ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
