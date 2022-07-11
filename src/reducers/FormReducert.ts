import { formTypes } from "../types/Types"

const initialState={}

export const FormReducert = (state:any , action:any) => {
    switch (action.types){
        case formTypes.reset:

        return {...initialState};

        default :
        return state;
    }
}
