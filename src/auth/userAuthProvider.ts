import { useState } from "react";

export interface IUseAuthProvider {
    signIn: (cb: () => void) => void;
    signOut: (cb: () => void) => void;
    userLogIn : null | boolean;
}

const UserAuthProvider = ( ) => { 

    const [userLogIn, setUserLogIn] = useState<null | boolean>(null);

    const signIn = (cb: () => void) =>{
        setUserLogIn(true);
    }
   
    const signOut = (cb: () => void) =>{
        setUserLogIn(false);
    }

   return{ 
       userLogIn,
       signIn,
       signOut
   }


};

export default UserAuthProvider;