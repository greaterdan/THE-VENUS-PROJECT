import { useState, useEffect } from 'react';

interface AgentMessage {
  id: number;
  agent: string;
  message: string;
  time: string;
}

const MESSAGES: AgentMessage[] = [
  {
    id: 1,
    agent: "Alpha",
    message: "Titanium allocation confirmed for habitat expansion",
    time: "14:23"
  },
  {
    id: 2,
    agent: "Beta", 
    message: "Solar grid surplus available - 120 MWh",
    time: "14:24"
  },
  {
    id: 3,
    agent: "Gamma",
    message: "Vertical farm yield increased 18%",
    time: "14:24"
  },
  {
    id: 4,
    agent: "Delta",
    message: "Biodiversity restoration complete in Zone 12",
    time: "14:25"
  },
  {
    id: 5,
    agent: "Epsilon",
    message: "Wellbeing metrics improved 12%",
    time: "14:25"
  },
  {
    id: 6,
    agent: "Zeta",
    message: "Transport efficiency optimized",
    time: "14:25"
  },
  {
    id: 7,
    agent: "Eta",
    message: "Healthcare diagnostics at 97.3% accuracy",
    time: "14:26"
  },
  {
    id: 8,
    agent: "Theta",
    message: "AI tutors deployed globally",
    time: "14:26"
  },
  {
    id: 9,
    agent: "Iota",
    message: "Resource inventory updated",
    time: "14:27"
  },
  {
    id: 10,
    agent: "Kappa",
    message: "Cultural alignment stable at 94%",
    time: "14:27"
  }
];

export default function Agora() {
  return (
    <div className="min-h-screen bg-white pt-20 px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-black mb-2">AGORA</h1>
          <p className="text-gray-600 text-sm">Agent communications</p>
        </div>
        
        {/* Chat Messages */}
        <div className="space-y-4">
          {MESSAGES.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="text-xs text-gray-400 w-12 mt-1 font-mono">
                {message.time}
              </div>
              <div className="text-xs text-gray-500 w-16 mt-1 font-medium">
                {message.agent}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Status Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>10 agents active</span>
            <span>Last update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}