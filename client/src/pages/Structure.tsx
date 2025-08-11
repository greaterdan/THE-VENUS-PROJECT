export default function Structure() {
  const cityPlanJson = `{
  "city_id": "venus_alpha_001",
  "version": "1.2.3",
  "timestamp": "2024-03-15T10:30:00Z",
  "districts": [
    {
      "id": "residential_core",
      "type": "residential",
      "population_capacity": 50000,
      "housing_units": 18500,
      "green_space_ratio": 0.35,
      "energy_systems": [
        "solar_grid",
        "wind_farm",
        "geothermal_plant"
      ],
      "transportation": {
        "autonomous_pods": 1200,
        "hyperloop_stations": 3,
        "walking_paths_km": 45.2
      }
    },
    {
      "id": "innovation_hub",
      "type": "commercial_research",
      "facilities": [
        "ai_research_center",
        "biotech_labs",
        "fabrication_workshops"
      ],
      "workforce_capacity": 25000,
      "collaboration_spaces": 150
    }
  ],
  "infrastructure": {
    "water_management": {
      "recycling_efficiency": 0.98,
      "sources": ["atmospheric", "recycled", "desalination"]
    },
    "waste_systems": {
      "zero_waste_target": true,
      "recycling_rate": 0.95,
      "composting_facilities": 12
    },
    "communication": {
      "mesh_network": "city_wide",
      "bandwidth_tbps": 100,
      "latency_ms": 0.5
    }
  },
  "governance": {
    "decision_model": "consensus_ai_human",
    "voting_mechanisms": ["liquid_democracy", "futarchy"],
    "citizen_participation_rate": 0.87
  }
}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-8 tracking-tight">AI Swarm Architecture</h1>
          <p className="text-xl leading-relaxed text-gray-700 max-w-4xl mx-auto">
            The Venus Project operates through a distributed AI swarm architecture where thousands of 
            specialized agents collaborate to design, build, and maintain autonomous cities. Each agent 
            possesses unique capabilities and contributes to the collective intelligence of the system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Architecture Layers</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Coordination Layer</h3>
                  <p className="leading-relaxed text-gray-700">
                    Master orchestration agents coordinate high-level city planning, resource allocation, 
                    and strategic decision-making. These agents maintain the overall vision while allowing 
                    for emergent behavior and local optimization.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Specialized Agents</h3>
                  <p className="leading-relaxed text-gray-700">
                    Domain-specific agents handle everything from energy management and transportation 
                    optimization to social dynamics and environmental monitoring. Each agent learns 
                    continuously and shares knowledge with the broader network.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Execution Network</h3>
                  <p className="leading-relaxed text-gray-700">
                    Ground-level agents interface with physical infrastructure, IoT devices, and robotic 
                    systems to implement the decisions made by higher-level planning agents. This creates 
                    a seamless connection between digital intelligence and physical reality.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                  <p className="leading-relaxed text-gray-700">
                    <strong>Distributed Intelligence:</strong> No single point of failure, with intelligence 
                    distributed across thousands of autonomous agents.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                  <p className="leading-relaxed text-gray-700">
                    <strong>Continuous Learning:</strong> Agents adapt and improve through reinforcement 
                    learning and collective knowledge sharing.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                  <p className="leading-relaxed text-gray-700">
                    <strong>Real-time Optimization:</strong> Dynamic resource allocation and system 
                    optimization based on current conditions and future projections.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Example City Plan JSON</h2>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-white p-6 text-sm overflow-x-auto leading-relaxed">
                  <code>{cityPlanJson}</code>
                </pre>
              </div>
            </div>

            <div className="bg-lime-50 p-8 rounded-lg border-2 border-lime-200">
              <h2 className="text-2xl font-semibold mb-4">Implementation Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Core Architecture</span>
                  <span className="text-lime-700 font-semibold">95% Complete</span>
                </div>
                <div className="w-full bg-lime-200 rounded-full h-2">
                  <div className="bg-lime-600 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Agent Training</span>
                  <span className="text-lime-700 font-semibold">78% Complete</span>
                </div>
                <div className="w-full bg-lime-200 rounded-full h-2">
                  <div className="bg-lime-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Physical Integration</span>
                  <span className="text-yellow-700 font-semibold">45% Complete</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
