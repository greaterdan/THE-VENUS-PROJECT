import { Wallet, WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useState, useEffect } from 'react';

export const WalletButton = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" disabled>
        <WalletIcon className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  const handleClick = async () => {
    if (connected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={connecting}
      variant={connected ? "default" : "outline"}
      className={connected 
        ? "bg-green-600 hover:bg-green-700 text-white border-green-500" 
        : "border-slate-600 hover:bg-slate-800 text-slate-300"
      }
    >
      {connecting ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
          Connecting...
        </>
      ) : connected && publicKey ? (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(publicKey.toString())}
        </>
      ) : (
        <>
          <WalletIcon className="w-4 h-4 mr-2" />
          Connect Phantom
        </>
      )}
    </Button>
  );
};