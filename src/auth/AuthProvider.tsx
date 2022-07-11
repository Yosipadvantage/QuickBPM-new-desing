import { createContext } from "react";
import userAuthProvider, { IUseAuthProvider } from "./userAuthProvider";


export const AuthContext = createContext<IUseAuthProvider | null>(null);

const AuthProvider: React.FC = ({children}) => {

    const auth = userAuthProvider();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>  

};

export default AuthProvider;