export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
            Get in touch with The Venus Project team. We welcome your questions, 
            feedback, and collaboration opportunities.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-16 mb-20">
          <div className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-3xl font-semibold mb-8 text-center">General Inquiries</h2>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-lg">info@thevenusproject.com</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 text-lg">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600 leading-relaxed">
                  21 Valley Lane<br />
                  Venus, FL 33960<br />
                  United States
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-3xl font-semibold mb-8 text-center">Technical Support</h2>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GPU Contribution</h3>
                <p className="text-gray-600">gpu-support@thevenusproject.com</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Research</h3>
                <p className="text-gray-600">research@thevenusproject.com</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnerships</h3>
                <p className="text-gray-600">partnerships@thevenusproject.com</p>
              </div>
            </div>
          </div>

          <div className="bg-lime-50 p-8 rounded-xl border-2 border-lime-200">
            <h2 className="text-3xl font-semibold mb-8 text-center">Work for Us</h2>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Careers</h3>
                <p className="text-gray-600">careers@thevenusproject.com</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Current Opening</h3>
                <h4 className="font-semibold text-lime-700 mb-3 text-lg text-center">Reinforcement Learning Engineer</h4>
                <p className="text-gray-600 leading-relaxed text-center mb-4">
                  Implements learning agents in simulations and real-world applications. 
                  Join our team to develop AI systems that optimize sustainable city planning 
                  and resource management.
                </p>
                <div className="text-center">
                  <button className="px-6 py-2 bg-lime-600 text-white hover:bg-lime-700 transition-colors rounded-md font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
          
        <div className="mt-16 p-8 bg-black text-white rounded-xl text-center">
          <h2 className="text-4xl font-semibold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
            The Venus Project represents a new paradigm for sustainable city development 
            powered by artificial intelligence and distributed computing. We're always 
            looking for passionate individuals to join our cause.
          </p>
          <div className="flex justify-center space-x-6">
            <button className="px-8 py-3 bg-lime-500 text-black hover:bg-lime-400 transition-colors rounded-md font-semibold">
              Join Our Community
            </button>
            <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-colors rounded-md font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}