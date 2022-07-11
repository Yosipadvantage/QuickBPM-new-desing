import { MenuItem, TextField, ThemeProvider, Button, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsFileEarmarkPersonFill, BsTrashFill, BsXSquare } from 'react-icons/bs';
import { FaCertificate, FaTimes } from 'react-icons/fa';
import { ConfigService } from '../../../core/services/ConfigService';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { AdminService } from '../../../core/services/AdminService';
import { IWorkGroupRole } from '../model/WorkGroupRole';
import { IBusinessRole } from '../model/BusinessRole';
import { getOriginalNode } from 'typescript';
import { getRoles } from '@testing-library/react';


const _adminService = new AdminService();

interface ITEWorkGroupRole {
    idWorkGroupMember: number,
    show: boolean;
    setShow: Function;
    idLn: number;
    nombre: string
}

export const TEWorkGroupRole: React.FC<ITEWorkGroupRole> = (props: ITEWorkGroupRole) => {
    const [listRole, setListRole] = useState<IBusinessRole[]>([]);
    const [listCheck, setListCheck] = useState<IWorkGroupRole[]>([]);
    const [listSelect, setListSelect] = useState<number[]>([]);
    const [idDelete, setIdDelete] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [beanWorkGropuRole, setBeanWorkGropuRole] = useState<IWorkGroupRole>();
    const [showRolPrincipal, setShowRolPrincipal] = useState(false);

    const [btn, setBtn] = useState(false);

    useEffect(() => {
        getRoles();
        getListCheck();
    }, [])
    const getRoles = () => {
        _adminService.getBusinessRoleCatalog(props.idLn).subscribe((resp) => {
            if (resp) {
                setListRole(resp)
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }

    const getListCheck = () => {
        _adminService.getWorkGroupRoleCatalog(props.idWorkGroupMember).subscribe((resp) => {
            if (resp) {
                setListCheck(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }

    const addUserRol = (idBusiness: number) => {
        _adminService.addWorkGroupRole(props.idWorkGroupMember, idBusiness).subscribe((resp: any) => {
            console.log(resp);
            if (resp.DataBeanProperties.ObjectValue) {
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado con éxito!",
                });
            }
            else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
            getListCheck();
        })
    }


    const closeModal = () => {
        props.setShow(false);
    }
    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setListSelect(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const handleAdd = () => {
        listSelect.map((item) => {
            addUserRol(item);
        })
        setBtn(false);
    }
    const principalRol = () => {
        if (beanWorkGropuRole) {
            beanWorkGropuRole!.RoleChief = true;
            _adminService.updateWorkGroupRole(beanWorkGropuRole).subscribe(resp => {
                if (resp) {
                    Toast.fire({
                        icon: "success",
                        title: "Se ha completado la acción con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            }
            );
        }
    }
    return (
        <>
            <Modal
                show={props.show}
                onHide={closeModal}
                centered
               >
                <Modal.Header>
                    Asignar rol a {props.nombre}
                    <BsXSquare className="pointer" onClick={closeModal} />
                </Modal.Header>
                <Modal.Body className="h-50">
                    <Row>
                        <Col sm={12} className="mt-2 mb-3 ">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { setBtn(true) }}
                                >
                                    AGREGAR ROL
                                </Button>
                            </ThemeProvider>
                        </Col>
                        {btn &&
                            <Col sm={12} className="mt-3 mb-3">
                                <label>Puede selecionar varias opciones</label>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label=".:Caracterizaciones a agregar:."
                                    id="state"
                                    SelectProps={{
                                        multiple: true,
                                        value: listSelect,
                                    }}
                                    onChange={handleChange}
                                >
                                    {listRole.map((item: IBusinessRole) => (
                                        <MenuItem key={item.IDBusinessRole} value={item.IDBusinessRole}>
                                            {item.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>
                        }
                        <Col sm={12} className="d-flex justify-content-center mt-3 mb-3">
                            {listCheck.length > 0
                                ? <div className="overflow-auto d-flex justify-content-center flex-column">
                                    {listCheck.map((item: IWorkGroupRole) => (
                                        <div className={item.RoleChief ? ' cgt-sucess card m-2 d-flex flex-row' : "cgt-char card m-2 d-flex flex-row"}>
                                            <div className="mt-2 mr-5">
                                                <b className="ml-2 p-2 d-flex justify-content">{item.BusinessRoleName}</b>
                                            </div>
                                            <div className="col sm-3 d-flex justify-content-end">
                                                <Tooltip title="Poner como principal" placement="right">
                                                    <IconButton
                                                        onClick={() => {
                                                            setBeanWorkGropuRole(item);
                                                            setShowRolPrincipal(true);
                                                        }}
                                                    >
                                                        <FaCertificate />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                : <h2 className="mt-5 mb-5">No hay caracterizaciones asignadas</h2>
                            }
                        </Col>

                        <Col sm={9} className="d-flex justify-content-end mt-3">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    color="secondary"
                                    variant="contained"
                                    endIcon={<BsFileEarmarkPersonFill />}
                                    onClick={() => {
                                        handleAdd();
                                    }}
                                >
                                    AGREGAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={3} className="mt-3 ml-n2">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    color="success"
                                    variant="contained"
                                    onClick={() => {
                                        handleAdd();
                                        props.setShow(false);
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                    </Row>
                </Modal.Body >
            </Modal>
            {showRolPrincipal &&
                <GenericConfirmAction
                    show={showRolPrincipal}
                    setShow={setShowRolPrincipal}
                    confirmAction={principalRol}
                    title="¿Desea usar este rol como principal?"
                />}
        </>
    )

}