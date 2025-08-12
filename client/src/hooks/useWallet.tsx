import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

interface WalletContextType {
  wallet: WalletAdapter | null;
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connection: Connection;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  connecting: false,
  publicKey: null,
  connect: async () => {},
  disconnect: async () => {},
  connection: new Connection(clusterApiUrl('devnet')),
});

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  
  // Initialize connection to Solana devnet
  const connection = new Connection(clusterApiUrl('devnet'));

  useEffect(() => {
    const phantomWallet = new PhantomWalletAdapter();
    setWallet(phantomWallet);

    // Listen for wallet events
    phantomWallet.on('connect', (pubKey: PublicKey) => {
      console.log('Wallet connected:', pubKey.toString());
      setConnected(true);
      setPublicKey(pubKey);
      setConnecting(false);
    });

    phantomWallet.on('disconnect', () => {
      console.log('Wallet disconnected');
      setConnected(false);
      setPublicKey(null);
      setConnecting(false);
    });

    phantomWallet.on('error', (error: any) => {
      console.error('Wallet error:', error);
      setConnecting(false);
    });

    return () => {
      phantomWallet.removeAllListeners();
    };
  }, []);

  const connect = async () => {
    if (!wallet) return;
    
    try {
      setConnecting(true);
      await wallet.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!wallet) return;
    
    try {
      await wallet.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        publicKey,
        connect,
        disconnect,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};