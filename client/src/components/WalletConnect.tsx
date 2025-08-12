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
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
        <div className="text-sm text-lime-600 font-mono font-medium">
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
          className="bg-white border-gray-200 text-black hover:bg-lime-50 hover:border-lime-400 hover:text-lime-600 transition-all duration-300"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border border-gray-200">
        <DropdownMenuItem
          onClick={() => connectWallet('phantom')}
          className="text-black hover:bg-lime-50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            </div>
            Phantom Wallet
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => connectWallet('metamask')}
          className="text-black hover:bg-lime-50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
            </div>
            MetaMask
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}