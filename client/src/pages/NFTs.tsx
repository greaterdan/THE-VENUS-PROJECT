export default function NFTs() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-6 py-16" style={{ paddingTop: '80px' }}>
        <h1 className="text-5xl font-bold mb-8 tracking-tight">
          Venus Project NFTs
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed mb-12 text-gray-700">
            Discover unique digital assets representing the future of sustainable cities. 
            Each NFT contributes directly to AI-powered urban development research.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-64 bg-gradient-to-br from-slate-500 to-green-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Genesis Cities</h3>
              <p className="text-gray-600 mb-4">
                The first collection of AI-designed sustainable city concepts. 
                Limited edition of 1,000 unique urban blueprints.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">0.5 ETH</span>
                <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded">
                  View Collection
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Neural Networks</h3>
              <p className="text-gray-600 mb-4">
                Visualizations of the AI systems powering urban planning decisions. 
                Each piece represents computational pathways.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">0.3 ETH</span>
                <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded">
                  View Collection
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-64 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">GPU Contributions</h3>
              <p className="text-gray-600 mb-4">
                Commemorative NFTs for computational power contributors. 
                Proof of participation in the distributed computing network.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">0.1 ETH</span>
                <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded">
                  View Collection
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-black text-white p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-semibold mb-4">Utility & Benefits</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-3 text-slate-500">Governance Rights</h3>
                <p className="text-gray-300">
                  NFT holders participate in key project decisions, including 
                  city design priorities and resource allocation votes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3 text-slate-500">Early Access</h3>
                <p className="text-gray-300">
                  Exclusive access to new AI models, city simulations, and 
                  beta features before public release.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3 text-slate-500">Revenue Sharing</h3>
                <p className="text-gray-300">
                  Percentage of project revenue distributed to NFT holders 
                  based on rarity and contribution level.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3 text-slate-500">Virtual Land</h3>
                <p className="text-gray-300">
                  Future access to virtual city plots in the metaverse 
                  representation of Venus Project cities.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Join the Future</h2>
            <p className="text-xl text-gray-700 mb-8">
              Be part of the world's first AI-powered sustainable city initiative. 
              Your NFT purchase directly funds cutting-edge urban research.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors rounded-lg text-lg">
                Browse Collections
              </button>
              <button className="px-8 py-4 border-2 border-black text-black hover:border-slate-600 hover:text-slate-600 transition-colors rounded-lg text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}