import { changePassWord, getBioReader, startLogin, startLoginFinger } from '../actions/Auth';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { RootState } from '../store/Store';
import { SSpinner } from '../shared/components/SSpinner';
import { Button, IconButton, ThemeProvider, Tooltip } from '@mui/material';
import { BsGearFill } from 'react-icons/bs';
import { inputsTheme } from '../utils/Themes';
import { ReaderTypeDialog } from '../modules/citizenData/components/ReaderTypeDialog';
import { useEffect, useState } from 'react';
import { MChangePassword } from '../modules/admin/components/MChangePassword';
import { MForgotPassword } from '../modules/admin/components/MForgotPassword';
interface UserLogin {
    email: string;
    password: string;
};

export const P_Login = () => {

    let history = useHistory();
    const dispatch = useDispatch();

    const { loading, bioLoading, user, showChangePassword } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>();

    const [show, setShow] = useState(false);
    const [showChangeP, setShowChangeP] = useState(showChangePassword);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        localStorage.setItem('readerType', 'zkteco')
        dispatch(getBioReader('zkteco'));
    }, [])

    const onSubmit = (data: UserLogin, e: any) => {
        console.log(data);
        e.preventDefault();
        dispatch(startLoginFinger(data, history));
    }

    const onSubmit2 = (data: UserLogin, e: any) => {
        console.log(data);
        e.preventDefault();
        dispatch(startLogin(data, history));
    }

    return (
        <>
            <div id="layoutAuthentication" className="bg-white">
                <div id="layoutAuthentication_content" className="d-flex align-items-center" >
                    <main className="w-100">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-5">
                                    <div className="border-0 rounded-lg mt-5 mb-3">
                                        <div className="">
                                            <div className="w-100  d-flex flex-wrap justify-content-center">
                                                <img className="img-fluid" src={process.env.PUBLIC_URL + "/assets/logodccae.png"} alt="Logo dccae" />
                                                <h4 className="w-100 my-5">Iniciar Sesión</h4>
                                            </div>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-group">
                                                    <label className="small mb-1" htmlFor="inputEmailAddress">Usuario:</label>
                                                    <Form.Control
                                                        className="form-control"
                                                        {...register("email", { required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
                                                    />
                                                    <span className="text-danger"> {errors.email?.type === 'required' && "Usuario es requerido"} </span>
                                                    <span className="text-danger"> {errors.email?.type === 'pattern' && "Usuario debe de ser valido"}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label className="small mb-1" htmlFor="inputPassword">Contraseña:</label>
                                                    <Form.Control
                                                        type="password"
                                                        className="form-control"
                                                        {...register("password", { required: true })}
                                                    />
                                                    <span className="text-danger"> {errors.password?.type === 'required' && "Contraseña es requerida"} </span>
                                                </div>
                                                <div className="form-group  d-flex align-items-center justify-content-between mt-4 mb-0">
                                                    <button className="btn w-100 btn-secondary rounded-pill" type="submit" onClick={handleSubmit(onSubmit2)}>Iniciar Sesión</button>
                                                </div>
                                                <div className="form-group  d-flex align-items-center justify-content-between mt-4 mb-0">
                                                    <button className="btn w-100 btn-secondary rounded-pill" onClick={handleSubmit(onSubmit)}>Iniciar Sesión (Con huella)</button>
                                                </div>
                                                <div className="form-group mt-5 d-flex flex-column justify-content-center">
                                                    <a className="m-auto btn" onClick={() => setShowForgotPassword(true)}>¿Olvido su Contraseña?</a>
                                                    {/* <ThemeProvider theme={inputsTheme}>
                                                        <Button className="w-50" variant="outlined" color="secondary">
                                                            ¿Olvido su Contraseña?
                                                        </Button>
                                                    </ThemeProvider> */}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div id="layoutAuthentication_footer">
                    <footer className="footer mt-auto footer-custom">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 small d-flex justify-content-start">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Configurar lector biométrico" placement="right">
                                            <IconButton color="warning" onClick={() => setShow(true)}>
                                                <BsGearFill />
                                            </IconButton>
                                        </Tooltip>
                                    </ThemeProvider>
                                </div>
                                <div className="col-md-6 text-md-right small">
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            {loading &&
                <SSpinner show={loading} />
            }
            <SSpinner show={bioLoading} message="VALIDACIÓN BIOMETRICA EN PROCESO" />
            <ReaderTypeDialog show={show} setShow={setShow} />
            <MChangePassword show={showChangePassword} setShow={setShowChangeP} user={user} type={0} />
            <MForgotPassword show={showForgotPassword} setShow={setShowForgotPassword} />
        </>
    );
}