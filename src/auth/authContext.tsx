import { createContext } from 'react';

interface ContextState {
    // set the type of state you want to handle with context e.g.
    name: string | null;
  }

const authContext = createContext({} as ContextState);

export default authContext;