import { createContext, useState } from "react";

export const EffectContext = createContext({});

export function EffectContextProvider({ children }) {
  const [effect, setEffect] = useState(null);
  return (
    <EffectContext.Provider value={{ effect, setEffect }}>
      {children}
    </EffectContext.Provider>
  );
}
