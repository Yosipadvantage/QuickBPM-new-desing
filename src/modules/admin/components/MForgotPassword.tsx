import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsFillEnvelopeFill, BsXSquare } from 'react-icons/bs';
import { Button, IconButton, TextField, ThemeProvider, Tooltip } from '@mui/material';

import { SSpinner } from '../../../shared/components/SSpinner';
import { inputsTheme } from '../../../utils/Themes';
import { GlobalService } from '../../../core/services/GlobalService';
import { Toast, ToastCenter } from '../../../utils/Toastify';
import { User } from '../../../shared/model/User';
import { AdminService } from '../../../core/services/AdminService';

interface IMForgotPassword {
    show: boolean,
    setShow: Function,
}

const _globalService = new GlobalService();
const _adminService = new AdminService();

export const MForgotPassword: React.FC<IMForgotPassword> = (props: IMForgotPassword) => {

    const [spinner, setSpinner] = useState(false);
    const [state, setState] = useState(0);
    const [identification, setIdentification] = useState<number | null>(null);
    const [user, setUser] = useState<User>();

    const getAccountByNit = (nit: number | null) => {
        setSpinner(true);
        if (nit !== null) {
            _globalService
                .getAccountByNit(nit)
                .subscribe(resp => {
                    setSpinner(false);
                    if (resp.length > 0) {
                        console.log(resp);
                        setUser(resp[0]);
                        setState(1);
                        Toast.fire({
                            icon: "success",
                            title: "Se han encontrado coincidencias"
                        })
                    }
                    else {
                        Toast.fire({
                            icon: "error",
                            title: "No se han encontrado coincidencias"
                        })
                    }
                })
        }
    };

    const restablecerContrasena = async (userName: string) => {
        setSpinner(true);
        await _adminService
            .restablecerContrasena(userName)
            .then((rps: any) => {
                setSpinner(false);
                if (rps.data.DataBeanProperties.ObjectValue.enviado === false) {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se ha podido completar la acción'
                    })
                }
                else {
                    ToastCenter.fire({
                        icon: 'success',
                        title: 'Contraseña restablecida, Revise su correo'
                    })
                }
            })
            .catch(e => {
                console.error(e)
                Toast.fire({
                    icon: 'error',
                    title: 'No se ha podido completar la acción'
                })
                setSpinner(false);
            });
    }

    const onClose = () => { setIdentification(null); props.setShow(false); setState(0); }

    return (
        <>
            <Modal show={props.show} centered onHide={onClose} >
                <Modal.Header>
                    Restablecer contraseña
                    <BsXSquare  className='pointer' onClick={() => { onClose(); }} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <form>
                            {state === 0 &&
                                <Col sm={12} className="mt-3">
                                    <div>
                                        <b>Por favor ingrese su Identifción</b>
                                        <TextField
                                            value={identification}
                                            className="mt-3"
                                            type="number"
                                            size="small"
                                            color="secondary"
                                            id="passWord"
                                            key={0}
                                            label='Identificación *'
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => (e.target.value.length <= 4) ? setIdentification(null) : setIdentification(parseInt(e.target.value))}
                                        />
                                    </div>
                                </Col>
                            }
                            {state === 1 &&
                                <Col sm={12}>
                                    <div className="m-3">
                                        <small>Haga click en el botón para generar un TOKEN como constraseña temporal, será enviado al correo: </small>
                                        <b>{user?.eMail}</b>
                                    </div>
                                    <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                        <Col sm={10} className='p-0'>
                                            <div className='d-flex flex-wrap flex-row'>
                                                <div className='m-2'>
                                                    <small>{user?.Nit}</small>
                                                </div>
                                                <div className='m-2'>
                                                    <small>Nombre: </small>
                                                    {user?.EntityName}
                                                </div>
                                                <div className='m-2'>
                                                    <small>Estado: </small>
                                                    {user?.Active === true ? <b className="text-success">Activo</b> : <b className="text-danger">Activo</b>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                            <ThemeProvider theme={inputsTheme}>
                                                <Tooltip title="Enviar TOKEN">
                                                    <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => restablecerContrasena((user) ? user.eMail : '')}>
                                                        <BsFillEnvelopeFill />
                                                    </IconButton>
                                                </Tooltip>
                                            </ThemeProvider>
                                        </Col>
                                    </Row>
                                </Col>
                            }
                            {state === 0 &&
                                <Col sm={12}>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className="mt-3 w-100" variant="contained" color="secondary" type="submit" disabled={identification !== null ? false : true}
                                            onClick={() => getAccountByNit(identification)}
                                        >
                                            CONTINUAR
                                        </Button>
                                    </ThemeProvider>
                                </Col>}
                        </form>
                    </Row>
                </Modal.Body>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
