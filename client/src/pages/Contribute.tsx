import { useState } from "react";

export default function Contribute() {
  const [nodeStatus] = useState({
    status: "Offline",
    uptime: "0h 0m",
    rewards: "0.00 VNS",
  });

  const handleConnectWallet = () => {
    // Placeholder for wallet connection
    console.log("Connect wallet clicked");
  };

  const handleDownloadNode = () => {
    // Placeholder for node download
    console.log("Download node clicked");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Contribute GPU</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Contribute your GPU power to accelerate the autonomous AI city build.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          onClick={handleConnectWallet}
          className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-venus-lime"
        >
          Connect Wallet
        </button>
        <button
          onClick={handleDownloadNode}
          className="border border-black text-black px-6 py-3 font-medium hover:bg-venus-lime hover:border-venus-lime transition-colors focus:outline-none focus:ring-2 focus:ring-venus-lime"
        >
          Download Node
        </button>
      </div>

      {/* Status Panel */}
      <div className="bg-white border border-venus-gray rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Node Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-lg font-medium">{nodeStatus.status}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Uptime</div>
            <div className="text-lg font-medium">{nodeStatus.uptime}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Estimated Rewards</div>
            <div className="text-lg font-medium">{nodeStatus.rewards}</div>
          </div>
        </div>
      </div>

      {/* CLI Example */}
      <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
        <div className="text-gray-400 mb-2"># Example CLI run</div>
        <div className="text-venus-lime">$ venus-node start --gpu --wallet 0x1234...abcd</div>
        <div className="mt-2">Starting Venus Project node...</div>
        <div>GPU detected: NVIDIA RTX 4090</div>
        <div>Connecting to swarm...</div>
        <div className="text-venus-lime">✓ Node online and contributing</div>
      </div>
    </div>
  );
}
