import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { BsXSquare, BsJustifyRight, BsSearch } from "react-icons/bs";


import { AdminService } from "../../../core/services/AdminService";
import { GlobalService } from "../../../core/services/GlobalService";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { Autocomplete, IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { User } from "../../../shared/model/User";
import SSearchTreeSite from "../../../shared/components/SSearchTreeSite";
import { MCargaFoto } from "./MCargaFoto";


interface IMCreateCitizen {
    setShow: Function;
    show: boolean;
    dataObj?: User | undefined;
    dataTitle: string;
    getAccount: Function;
}

const _globalService = new GlobalService();
const _adminService = new AdminService();

export const MCreateCitizen: React.FC<IMCreateCitizen> = (props: IMCreateCitizen) => {

    const { register, setValue, formState: { errors }, handleSubmit } = useForm();

    const [spinner, setSpinner] = useState(false);
    const [sTree, setSTree] = useState(false);
    const [cityExpedition, setCityExpedition] = useState<any>('');
    const [cityID, setCityID] = useState(-1);
    const [objUser, setObjUser] = useState<any>({});
    const [viewUser, setViewUser] = useState(false);


    useEffect(() => {
        console.log(props.dataObj);
        /* getValue(props.dataTitle); */
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
            setCityExpedition(props.dataObj !== undefined ? props.dataObj.BornSiteIDName : 'SIN ASIGNAR');
        }
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        let aux = data.entity;
        aux.IDBornSiteLn = cityID;
        aux.DocType = 1;
        getAccountByNit(aux.Nit);
    };

    const getAccountByNit = (nit: number) => {
        setSpinner(true);
        console.log(nit);
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
        setSTree(true);
    };

    const getData = (data: any) => {
        setCityExpedition(data.name);
        setCityID(data.IDLn);
    };

    const closeSearchTree = (data: any) => {
        setSTree(data);
    };

    const handleChange = (data: any) => {
        console.log(data);
        if (data > 0) {
            getAccountByNit(parseInt(data));
        }
    };

    return (
        <>
            <Modal size="lg" show={props.show}  centered onHide={closeModal} >
                <Modal.Header>
                    <div className="title-modal">
                        Sincronizar Ciudadano
                    </div>
                    <BsXSquare className='pointer' onClick={closeModal} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row className="mt-3 mr-2 ml-2">
                            <Col sm={12} className="mt-3">
                                <label>Ingrese el siguiente dato</label>
                                <TextField
                                    type="number"
                                    size="small"
                                    color="secondary"
                                    id="nit"
                                    label="No. Identificación *"
                                    fullWidth
                                    variant="outlined"
                                    onBlur={(e) => { handleChange(e.target.value) }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsJustifyRight />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Col>
                        </Row>
                        { (viewUser) && (
                            <Row className="mt-3 mr-2 ml-2">
                            <Col sm={6}>
                                <b><label>Primer Nombre: </label></b> {objUser.Name1}
                            </Col>
                            <Col sm={6}>
                                <b><label>Segundo Nombre: </label></b> {objUser.Name2}
                            </Col>
                            <Col sm={6}>
                                <b><label>Primer Apellido: </label></b> {objUser.Name1}
                            </Col>
                            <Col sm={6}>
                                <b><label>Segundo Apellido: </label></b> {objUser.Name2}
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
            {sTree && <SSearchTreeSite getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={sTree} />}

        </>
    );
};