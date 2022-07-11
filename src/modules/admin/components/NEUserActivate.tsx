import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { BsJustifyRight, BsKeyFill, BsXSquare } from 'react-icons/bs';
import { AdminService } from '../../../core/services/AdminService';
import { Toast } from '../../../utils/Toastify';
import { IApplicationTypeRole } from '../model/Applicationtype';
import { InputAdornment, MenuItem, TextField } from '@mui/material';
import { User } from '../../../shared/model/User';
import { SSpinner } from '../../../shared/components/SSpinner';


interface INEUserActivate {
    getShow: Function,
    dataShow: boolean,
    user: User
    refreshList: Function,
}

const _adminService = new AdminService();

export const NEUserActivate: React.FC<INEUserActivate> = (props: INEUserActivate) => {

    const [listRole, setListRole] = useState<IApplicationTypeRole[]>([]);
    const [spinner, setSpinner] = useState<boolean>(false);

    const getRoleCatalog = () => {
        setSpinner(true);
        _adminService
            .getRoleCatalog()
            .subscribe(resp => {
                setSpinner(false);
                setListRole(resp);
            });
    };

    useEffect(() => {
        getRoleCatalog();
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const closeModal = () => {
        props.getShow(false);
        clearErrors();
    };

    const updateAbstractAccount = (idAccount: number, idRole: number) => {
        setSpinner(true);
        _adminService
            .updateAbstractAccount(idAccount, idRole)
            .subscribe(res => {
                setSpinner(false);
                if (res) {
                    Toast.fire({
                        icon: "success",
                        title: "Usuario activado con éxito!"
                    });
                    props.refreshList(props.user.Nit);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido activar el usuario"
                    });
                    props.refreshList(props.user.Nit);
                }
            });
    }

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

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        updateAbstractAccount(props.user.IDAccount, parseInt(data.entity.IDRole));
        restablecerContrasena(props.user.eMail);
        props.getShow(false);
    }

    return (
        <>
            <Modal show={props.dataShow} centered onHide={closeModal}>
                <Modal.Header>
                    Activar Usuario
                    <BsXSquare  className='pointer' onClick={closeModal} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} className="mt-3 d-flex justify-content-center text-center flex-column">
                                Se activará el usuario <b>{props.user.EntityName}</b><b>{props.user.Nit}</b>
                                <div>
                                    <p>El usuario será notificado al correo:  <b>{props.user.eMail}</b> </p>
                                </div>
                            </Col>
                        </Row>
                        <TextField
                            className="mt-3"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="¿Con qué Rol desea activar este usuario? *"
                            id="roles"
                            {...register("entity.IDRole", { required: true })}
                        >
                            {listRole.map((item: any) => (
                                <MenuItem value={item.IDRole}>
                                    {item.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <span className="text-danger">{errors.entity ? errors.entity.IDRole?.type === 'required' && "El campo Rol es obligatorio." : ''}</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeModal}>
                            CANCELAR
                        </Button>
                        <Button type="submit" variant="success">
                            ACTIVAR
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
