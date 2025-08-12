import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WalletConnectProps {
  onConnect: (walletType: 'phantom' | 'metamask', address: string) => void;
  isConnected: boolean;
  walletAddress?: string;
  vnsBalance?: number;
}

export function WalletConnect({ onConnect, isConnected, walletAddress, vnsBalance }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (walletType: 'phantom' | 'metamask') => {
    setIsConnecting(true);
    
    try {
      if (walletType === 'phantom') {
        // Simulate Phantom connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockAddress = '7XvQ8K2B9Gh...uM3P';
        onConnect('phantom', mockAddress);
      } else if (walletType === 'metamask') {
        // Simulate MetaMask connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockAddress = '0x742d...9C4f';
        onConnect('metamask', mockAddress);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/80">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
        <div className="text-sm text-lime-400 font-mono">
          {vnsBalance?.toFixed(2) || '0.00'} VNS
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isConnecting}
          className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10 hover:text-lime-400 transition-all duration-300"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-white/10">
        <DropdownMenuItem
          onClick={() => connectWallet('phantom')}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            Phantom Wallet
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => connectWallet('metamask')}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
            MetaMask
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}