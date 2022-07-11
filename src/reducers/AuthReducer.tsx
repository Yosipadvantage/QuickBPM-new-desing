import { TypesLogin } from "../types/Types";

const State = {
    checking: ((localStorage.getItem('c') === 't')),
    IDAccount: null,
    user: {},
    loading: false,
    bioLoading: false,
    readerType: (localStorage.getItem('readerType')),
    showDialog: false,
    showChangePassword: false
}

export const AuthReducer = (state = State, action: any) => {
    switch (action.type) {
        case TypesLogin.authLogin:
            return {
                ...state,
                checking: true,
                loading: false,
                IDAccount: action.data.IDAccount,
                Name1: action.data.Name1,
                Surname1: action.data.Surname1
            }

        case TypesLogin.authStartLoading:
            return {
                ...state,
                loading: true,
                bioLoading: action.data
            }

        case TypesLogin.authPauseLoading:
            return {
                ...state,
                loading: false,
                bioLoading: action.data
            }

        case TypesLogin.authFinishLogin:
            return {
                ...state,
                loading: false,
                checking: false
            }

        case TypesLogin.authLogout:
            return {
                ...state,
                checking: false,
                IDAccount: null
            }

        case TypesLogin.authGetBioReader:

            return {
                ...state,
                readerType: action.data,
            }

        case TypesLogin.authChangePasswordInit:

            return {
                ...state,
                showChangePassword: action.data,
                user: action.user
            }
        

        default:
            return state;
    }
}