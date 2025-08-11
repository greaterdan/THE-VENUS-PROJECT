import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Application submitted:', formData);
    alert('Thank you for your application! We will review it and get back to you soon.');
    setIsOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      experience: '',
      coverLetter: ''
    });
  };
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
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="px-6 py-2 bg-lime-600 text-white hover:bg-lime-700 transition-colors rounded-md font-medium">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-4">Reinforcement Learning Engineer</DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                              Join our cutting-edge team to develop AI systems that optimize sustainable city planning 
                              and resource management. You'll be implementing learning agents in both simulations and 
                              real-world applications, contributing to the future of autonomous urban development.
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                            <ul className="space-y-2 text-gray-700">
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                <span>Design and implement reinforcement learning algorithms for city optimization</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                <span>Develop multi-agent systems for distributed urban planning</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                <span>Create simulation environments for testing AI-driven city solutions</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                                <span>Collaborate with cross-functional teams on infrastructure integration</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                            <ul className="space-y-2 text-gray-700">
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>PhD/Masters in Computer Science, AI, or related field</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>3+ years experience with reinforcement learning frameworks (PyTorch, TensorFlow)</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Strong background in multi-agent systems and distributed computing</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Experience with simulation environments (OpenAI Gym, Unity ML-Agents)</span>
                              </li>
                              <li className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Proficiency in Python, C++, and cloud computing platforms</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-lime-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">What We Offer</h3>
                            <ul className="text-gray-700 space-y-1">
                              <li>• Competitive salary ($120k - $180k)</li>
                              <li>• Equity participation in groundbreaking technology</li>
                              <li>• Remote work flexibility</li>
                              <li>• Access to high-performance computing resources</li>
                              <li>• Opportunity to shape the future of sustainable cities</li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold mb-4">Apply for this Position</h3>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Your full name"
                              />
                            </div>

                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="your.email@example.com"
                              />
                            </div>

                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>

                            <div>
                              <Label htmlFor="experience">Years of RL Experience *</Label>
                              <Input
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., 5 years"
                              />
                            </div>

                            <div>
                              <Label htmlFor="coverLetter">Cover Letter *</Label>
                              <Textarea
                                id="coverLetter"
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                placeholder="Tell us why you're interested in this role and how your experience makes you a great fit..."
                              />
                            </div>

                            <div className="flex space-x-3 pt-4">
                              <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700">
                                Submit Application
                              </Button>
                              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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