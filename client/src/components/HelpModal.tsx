import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent modal from closing during parent re-renders
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.style.pointerEvents = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", damping: 25, stiffness: 300 }
        }}
        exit={{ 
          scale: 0.95, 
          opacity: 0, 
          y: 10,
          transition: { duration: 0.15 }
        }}
        className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 text-xs shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-semibold text-gray-800 mb-4 text-sm">AGORA CHAIN — Help & Documentation</div>
        
        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Live Feed</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time blockchain events showing staking activities, faucet operations, and agent interactions. 
              Click any event to view detailed transaction information in the blockchain explorer.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Staking Protocols</h3>
            <p className="text-gray-600 leading-relaxed">
              Each agent represents a different domain of The Venus Project's autonomous city council. 
              Staking VPC tokens strengthens an agent's allocation capacity and grants you influence in their decision-making.
            </p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• <strong>Pool Balance:</strong> Total VPC staked in this agent's protocol</li>
              <li>• <strong>24h Net Flow:</strong> Change in staking over the last 24 hours</li>
              <li>• <strong>Active Stakers:</strong> Number of unique wallets participating</li>
              <li>• <strong>Field Strength:</strong> Impact metrics across ecological, efficiency, and resilience dimensions</li>
              <li>• <strong>Faucet Threshold:</strong> When enough VPC is staked, the agent can allocate real resources</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Staking & Unstaking</h3>
            <p className="text-gray-600 leading-relaxed">
              Use the <span className="text-green-600 underline">Stake</span> and <span className="text-red-600 underline">Unstake</span> buttons to interact with each agent's protocol.
              Staking requires a connected wallet (Phantom recommended) and locks your VPC for the specified period.
            </p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• <strong>Influence Score:</strong> Your voting power in agent decisions</li>
              <li>• <strong>Access Tickets:</strong> Special permissions for advanced features</li>
              <li>• <strong>Lock Period:</strong> Minimum time your stake remains locked (7, 30, or 90 days)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Agent Domains</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><strong>ALPHA:</strong> Infrastructure & Habitat Design</div>
              <div><strong>BETA:</strong> Energy Systems</div>
              <div><strong>GAMMA:</strong> Food & Agriculture</div>
              <div><strong>DELTA:</strong> Ecology & Restoration</div>
              <div><strong>EPSILON:</strong> Social & Wellbeing</div>
              <div><strong>ZETA:</strong> Transportation & Mobility</div>
              <div><strong>ETA:</strong> Health & Medical</div>
              <div><strong>THETA:</strong> Education & Knowledge</div>
              <div><strong>IOTA:</strong> Resource Management</div>
              <div><strong>KAPPA:</strong> Culture, Ethics & Governance</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-500 text-xs">
              <strong>Note:</strong> This is a demonstration of The Venus Project's resource-based economic system. 
              All transactions are simulated for educational purposes.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 underline text-xs"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


