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
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">AI Swarm Architecture</h1>

      <div className="space-y-6">
        <p className="text-lg leading-relaxed">
          The Venus Project operates through a distributed AI swarm architecture where thousands of specialized agents collaborate to design, build, and maintain autonomous cities. Each agent possesses unique capabilities and contributes to the collective intelligence of the system.
        </p>

        <p className="leading-relaxed">
          <strong>Coordination Layer:</strong> Master orchestration agents coordinate high-level city planning, resource allocation, and strategic decision-making. These agents maintain the overall vision while allowing for emergent behavior and local optimization.
        </p>

        <p className="leading-relaxed">
          <strong>Specialized Agents:</strong> Domain-specific agents handle everything from energy management and transportation optimization to social dynamics and environmental monitoring. Each agent learns continuously and shares knowledge with the broader network.
        </p>

        <p className="leading-relaxed">
          <strong>Execution Network:</strong> Ground-level agents interface with physical infrastructure, IoT devices, and robotic systems to implement the decisions made by higher-level planning agents. This creates a seamless connection between digital intelligence and physical reality.
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Example City Plan JSON</h2>
          <pre className="bg-gray-900 text-white p-6 rounded-lg text-sm overflow-x-auto">
            <code>{cityPlanJson}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
