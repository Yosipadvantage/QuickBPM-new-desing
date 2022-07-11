import { AuthService } from "../core/services/AuthService";
import { AnyAction, Dispatch } from "redux";
import { TypesLogin } from "../types/Types";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootState } from "../store/Store";
import { Toast, ToastCenter } from "../utils/Toastify";
import { GlobalService } from "../core/services/GlobalService";
import { User } from "../shared/model/User";

interface UserLogin {
  email: string;
  password: string;
}

const _authService = new AuthService();
const _globalService = new GlobalService();

export const startLoginFinger = (user: UserLogin, history: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading(false));
    await _authService
      .login(user.email, user.password)
      .then((resp: any) => {
        dispatch(pauseLoading(false));
        if (resp.data.DataBeanProperties.ObjectValue) {
          const tempUser = resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.Account;
          if (resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State === 6) {
            Toast.fire({
              icon: "error",
              title: "Usuario y contraseña inválido.",
            });
          }
          else if (tempUser.DataBeanProperties.IDAccount) {
            if (tempUser.DataBeanProperties.cambiar === true) {
              ToastCenter.fire({
                icon: "success",
                title: "Activación Exitosa! Debe actualizar la contraseña"
              });
              dispatch(changePassWord(true, tempUser.DataBeanProperties));
            } else {
              localStorage.setItem(
                "usuario",
                JSON.stringify(tempUser.DataBeanProperties)
              );
              dispatch(pauseLoading(true));
              _globalService.validateFingerPrint((tempUser.DataBeanProperties.IDAccount + ""), 6, 1)
                .subscribe((resp) => {
                  dispatch(pauseLoading(false));
                  let jsonResp = JSON.parse((decodeURIComponent(resp)));
                  if (jsonResp.Result !== null) {
                    if (jsonResp.Result.DataBeanProperties.Result === true) {
                      ToastCenter.fire({
                        icon: "success",
                        title: "Validación Biométrica Correcta. ¡Bienvenido!",
                      });
                      localStorage.setItem("c", "t");
                      dispatch(
                        login(
                          tempUser.DataBeanProperties.IDAccount,
                          tempUser.DataBeanProperties.Name1,
                          tempUser.DataBeanProperties.Surname1
                        )
                      );
                      history.push('/dashboard')
                    }
                    else {
                      ToastCenter.fire({
                        icon: "error",
                        title: "Validación Biométrica Fallida, Por favor intente de nuevo",
                      });
                      dispatch(finishLoading());
                    }
                  }
                  else {
                    dispatch(finishLoading());
                    dispatch(pauseLoading(false));
                    Toast.fire({
                      icon: 'error',
                      title: 'No se pudo completar la accción'
                    });
                  }
                })
            }
          } else {
            Toast.fire({
              icon: "error",
              title: "No se ha podido completar el login " +
                "Error - " + resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State,
            });
            dispatch(finishLoading());
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción.",
          });
          dispatch(finishLoading());
        }
      })
      .catch((e) => {
        dispatch(finishLoading());
      });
  };
};

export const startLogin = (user: UserLogin, history: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading(false));
    await _authService
      .login(user.email, user.password)
      .then((resp: any) => {
        dispatch(pauseLoading(false));
        if (resp.data.DataBeanProperties.ObjectValue) {
          const tempUser =
            resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.Account;
          if (resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State === 6) {
            Toast.fire({
              icon: "error",
              title: "Usuario y contraseña inválido.",
            });
          }
          if (tempUser.DataBeanProperties.IDAccount) {
            localStorage.setItem(
              "usuario",
              JSON.stringify(tempUser.DataBeanProperties)
            );
            localStorage.setItem("c", "t");
            dispatch(
              login(
                tempUser.DataBeanProperties.IDAccount,
                tempUser.DataBeanProperties.Name1,
                tempUser.DataBeanProperties.Surname1
              )
            );
            history.push('/dashboard')
          } else {
            Toast.fire({
              icon: "error",
              title: "No se ha podido completar el login " +
                "Error - " + resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.State,
            });
            dispatch(finishLoading());
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "Usuario y contraseña inválido, ",
          });
          dispatch(finishLoading());
        }
      })
      .catch((e) => {
        dispatch(finishLoading());
      });
  };
};


export const login = (IDAccount: number, Name1: string, Surname1: string) => ({
  type: TypesLogin.authLogin,
  data: {
    IDAccount,
    Name1,
    Surname1,
  },
});

export const startLoading = (data: boolean) => ({
  type: TypesLogin.authStartLoading,
  data: data
});

export const getBioReader = (readerType: string) => ({
  type: TypesLogin.authGetBioReader,
  data: readerType
});

export const pauseLoading = (data: boolean) => ({
  type: TypesLogin.authPauseLoading,
  data: data
});

export const finishLoading = () => ({
  type: TypesLogin.authFinishLogin,
});

export const changePassWord = (data: boolean, user: User) => ({
  type: TypesLogin.authChangePasswordInit,
  data: data,
  user: user
});

export const startLogout = () => {
  return async (dispatch: Dispatch) => {
    dispatch(logout());
  };
};

export const logout = () => ({
  type: TypesLogin.authLogout,
});

/* export const authLogin =
  (
    email: string,
    password: string
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
    async (
      dispatch: ThunkDispatch<RootState, unknown, AnyAction>
    ): Promise<void> => {
      try {
        dispatch({
          type: TypesAuth.authLoginSucces,
        });
        await _authService
          .login(email, password)
          .then((resp: any) => {
            if (resp.data.DataBeanProperties.ObjectValue) {
              const tempUser =
                resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.Account;
              console.log(tempUser);
              if (tempUser.DataBeanProperties.IDAccount) {
                console.log("Entro");
                const userData = { IDAccount: tempUser.DataBeanProperties.IDAccount, Name1: tempUser.DataBeanProperties.Name1 }
                dispatch({
                  type: TypesAuth.authLoginSucces,
                  data: userData
                });
                localStorage.setItem(
                  "usuario",
                  JSON.stringify(tempUser.DataBeanProperties)
                );
              } else {
                console.log("Colocar alerta");
              }
            } else {
              /* dispatch({
                  type: TypesAuth.authLoginError,
                  data: userData
              }); 
            }
          })
          .catch((e) => {
            dispatch(finishLoading());
          });

      } catch (error) { }
    };

export const authLogout = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, AnyAction>
  ): Promise<void> => {
    dispatch({
      type: TypesAuth.authClose,
    });
  }
 */





