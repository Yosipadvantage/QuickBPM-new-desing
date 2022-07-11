import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsJustifyRight, BsSearch, BsXSquare } from 'react-icons/bs';
import { AdminService } from '../../../core/services/AdminService';
import { GlobalService } from '../../../core/services/GlobalService';
import SSearchPerson from '../../../shared/components/SSearchPerson';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { Toast, ToastCenter } from '../../../utils/Toastify';

interface IMCreateCompany {
    setShow: Function;
    show: boolean;
    dataObj?: User | undefined;
    dataTitle: string;
    getAccount: Function;
}

const _globalService = new GlobalService();
const _adminService = new AdminService();

export const MCreateCompany: React.FC<IMCreateCompany> = (props: IMCreateCompany) => {

    const { register, setValue, formState: { errors }, handleSubmit } = useForm();

    const [spinner, setSpinner] = useState(false);
    const [sPerson, setSSPerson] = useState(false);
    const [represent, setRepresent] = useState<any>('');
    const [representID, setRepresentID] = useState(-1);
    const [objUser, setObjUser] = useState<any>({});
    const [viewUser, setViewUser] = useState(false);

    useEffect(() => {
        console.log(props.dataObj);
        getValue(props.dataTitle);
    }, [])

    const closeModal = () => {
        props.setShow(false);
    };

    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                Nit: "",
                RoleID: "",
                Name1: "",
                Name2: "",
                Surname1: "",
                Surname2: "",
                Tel: "",
                eMail: "",
                IDAccount: ""
            });
        } else if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
            setRepresent(props.dataObj !== undefined ? props.dataObj.BornSiteIDName : 'SIN ASIGNAR');
        }
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        let aux = data.entity;
        aux.IDAppointmentManual = representID;
        aux.DocType = 2;
        getAccountByNit(aux.Nit);
    };

    const getAccountByNit = (nit: number) => {
        setSpinner(true);
        if (nit !== null) {
            _globalService
            .sincronizarUsuario(nit)
            .subscribe(resp => {
                console.log(resp);
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue.validacion) {
                    ToastCenter.fire({
                        icon: 'success',
                        title: `${resp.DataBeanProperties.ObjectValue.msg}`
                    });
                    setObjUser(resp.DataBeanProperties.ObjectValue.usuario);
                    setViewUser(true);
                } else {
                    ToastCenter.fire({
                        icon: 'error',
                        title: `${resp.DataBeanProperties.ObjectValue.msg}`
                    });
                    setObjUser({});
                    setViewUser(false);
                }
            })
        } else {
            setSpinner(false);
        }
    };

    const openTree = (view: number) => {
        setSSPerson(true);
    };

    const closeSearch = (data: any) => {
        setSSPerson(data);
    };

    const getItem = (data: any) => {
        setRepresentID(data.IDAccount);
        setRepresent(data.EntityName);
    };

    const handleChange = (data: any) => {
        console.log(data);
        if (data > 0) {
            getAccountByNit(parseInt(data));
        }
    };

    return (
        <>
            <Modal size="lg" show={props.show}  centered onHide={closeModal}>
                <Modal.Header>
                    <div className="title-modal">
                        Sincronizar Empresa
                    </div>
                    <BsXSquare className='pointer' onClick={closeModal} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row className="mt-3">
                            <Col sm={6} className="mt-3">
                                <TextField
                                    type="number"
                                    size="small"
                                    color="secondary"
                                    id="nit"
                                    label="Nit *"
                                    fullWidth
                                    variant="outlined"
                                    onBlur={(e) => { handleChange(e.target.value) }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsJustifyRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Col>
                        </Row>
                        { (viewUser) && (
                            <Row className="mt-3 mr-2 ml-2">
                            <Col sm={6}>
                                <b><label>Razón Social: </label></b> {objUser.EntityName}
                            </Col>
                            <Col sm={6}>
                                <b><label>Celular: </label></b> {objUser.Tel}
                            </Col>
                            <Col sm={6}>
                                <b><label>Correo: </label></b> {objUser.eMail}
                            </Col>
                        </Row>
                        ) }
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button variant="danger" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="success">
                            Guardar
                        </Button> */}
                    </Modal.Footer>
                </form>
            </Modal >
            {spinner && <SSpinner show={spinner} />}
            {/* {sTree && <SSearchTreeSite getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={sTree} />} */}
            {sPerson && <SSearchPerson getShow={closeSearch} getPerson={getItem} dataShow={sPerson} />}
        </>
    )
}
