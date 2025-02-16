import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the shared state
interface StateContextType {
  sharedState: number;
  setSharedState: React.Dispatch<React.SetStateAction<number>>; 
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

// Default values for the context
const defaultContextValues: StateContextType = {
  sharedState: 0,
  setSharedState: () => {},
  phoneNumber: '',
  setPhoneNumber: () => {},
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
  const [sharedState, setSharedState] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // New state for phone number

  return (
    <StateContext.Provider value={{ sharedState, setSharedState, phoneNumber, setPhoneNumber }}>
      {children}
    </StateContext.Provider>
  );
};
