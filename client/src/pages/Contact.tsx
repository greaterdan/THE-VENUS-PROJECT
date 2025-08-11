export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-8 tracking-tight">
          Contact Us
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed mb-8 text-gray-700">
            Get in touch with The Venus Project team. We welcome your questions, 
            feedback, and collaboration opportunities.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 mt-12">
            <div>
              <h2 className="text-3xl font-semibold mb-6">General Inquiries</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">info@thevenusproject.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    21 Valley Lane<br />
                    Venus, FL 33960<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-semibold mb-6">Technical Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">GPU Contribution</h3>
                  <p className="text-gray-600">gpu-support@thevenusproject.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">AI Research</h3>
                  <p className="text-gray-600">research@thevenusproject.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Partnerships</h3>
                  <p className="text-gray-600">partnerships@thevenusproject.com</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold mb-6">Work for Us</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Careers</h3>
                  <p className="text-gray-600">careers@thevenusproject.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Current Opening</h3>
                  <h4 className="font-semibold text-gray-900 mt-3">Reinforcement Learning Engineer</h4>
                  <p className="text-gray-600 text-sm">
                    Implements learning agents in simulations and real-world applications. 
                    Join our team to develop AI systems that optimize sustainable city planning 
                    and resource management.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 p-8 bg-gray-50 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4">Join Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              The Venus Project represents a new paradigm for sustainable city development 
              powered by artificial intelligence and distributed computing. We're always 
              looking for passionate individuals to join our cause.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors rounded-md">
                Join Our Community
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-venus-lime hover:text-venus-lime transition-colors rounded-md">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}