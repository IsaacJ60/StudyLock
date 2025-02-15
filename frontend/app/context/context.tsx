// context/StateContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the shared state
interface StateContextType {
  sharedState: number;
  setSharedState: React.Dispatch<React.SetStateAction<number>>; // This allows function updates
}

// Default values for the context
const defaultContextValues: StateContextType = {
  sharedState: 0,
  setSharedState: () => {}, // Placeholder for default
};

// Create the context with default values
const StateContext = createContext<StateContextType>(defaultContextValues);

// Hook to use the context
export const useStateContext = () => useContext(StateContext);

// Provider component to wrap the app
interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [sharedState, setSharedState] = useState<number>(0); // Ensure sharedState is a number

  return (
    <StateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </StateContext.Provider>
  );
};
