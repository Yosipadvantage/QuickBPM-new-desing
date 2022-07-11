import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
    Button,
    MenuItem
} from "@mui/material";

import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { useStyles } from "../../../utils/Themes";
import { SSpinner } from "../../../shared/components/SSpinner";
import { AdminService } from "../../../core/services/AdminService";
import { InputAdornment, TextField } from "@mui/material";
import { JsonProperty } from "../model/json-property.interface";
import { JsonServiceClass } from "../model/JsonServiceClass";
import { JsonService } from "../model/JsonService";
import { TypeForm } from "../model/TypeForm";
import { DataForm } from "../model/Form";

/**
 * Servicios
 */
const _adminService = new AdminService();
const _configService = new ConfigService();

interface IMConfigureDataSource {
    getShowMConfigureDataSource: Function;
    dataShowMConfigureDataSource: boolean;
    objPropertyService: JsonProperty | undefined;
}

const MConfigureDataSource: React.FC<IMConfigureDataSource> = (
    props: IMConfigureDataSource
) => {

    const BPM_PROPERTY = 2;
    const DOCUMENT_PROPERTY = 3;
    const USER_PROPERTY = 4;

    const [type, setType] = useState<any>(props.objPropertyService?.Type);

    const [BPMDataBeanClass, setBPMDataBeanClass] = useState<any>(props.objPropertyService?.BPMDataBeanClass);
    const [BPMDataBeanProperty, setBPMDataBeanProperty] = useState<any>(props.objPropertyService?.BPMDataBeanProperty);

    const [documentType, setDocumentType] = useState<any>(props.objPropertyService?.DocumentType);

    const [form, setForm] = useState<any>(props.objPropertyService?.IDFormSrc);
    const [jsonService, setJsonService] = useState<any>(props.objPropertyService?.IDJsonServiceSrc);

    const [formClass, setFormClass] = useState<any>(props.objPropertyService?.IDFormClass);
    const [jsonServiceClass, setJsonServiceClass] = useState<any>(props.objPropertyService?.IDJsonServiceClass);

    const [UserValue, setUserValue] = useState<any>(props.objPropertyService?.UserValue);

    const [listJsonProperty, setListJsonProperty] = useState<any[]>([]);

    const [listBPMStructs, setListBPMStructs] = useState<any[]>([]);
    const [listPropertiesForQuery, setListPropertiesForQuery] = useState<any[]>([]);

    const [listPropertyDocumentType, setListPropertyDocumentType] = useState<any[]>([]);
    const [listJsonServiceClass, setListJsonServiceClass] = useState<JsonServiceClass[]>([]);
    const [listJsonService, setListJsonService] = useState<JsonService[]>([]);
    const [listFormClass, setListFormClass] = useState<TypeForm[]>([]);
    const [listForm, setListForm] = useState<DataForm[]>([]);

    const [showSpinner, setShowSpinner] = useState(false);
    const [showPropertiesForQuery, setShowPropertiesForQuery] = useState(false);

    const [render, setRender] = useState(0);
    const [renderClass, setRenderClass] = useState(0);

    useEffect(() => {
        console.log(props.objPropertyService);
        console.log(props.objPropertyService?.DocumentType);
        if (props.objPropertyService?.Type === 2) {
            getBPMStructsForQuery();
            getPropertiesForQuery(BPMDataBeanClass);
            setShowPropertiesForQuery(true);
            setRender(1);
        } else if (props.objPropertyService?.Type === 3) {
            setRender(2);
            if (props.objPropertyService?.DocumentType === 4) {
                setRenderClass(2);
                console.log('segundo render', jsonServiceClass);
                getJsonServiceClassCatalog();
                getJsonServiceCatalog(jsonServiceClass);
            } else if (props.objPropertyService?.DocumentType === 6) {
                setRenderClass(1);
                getFormClassCatalog();
                getFormCatalog(formClass);
            }
        } else if (props.objPropertyService?.Type === 4) {
            setRender(3);
        }
        getJsonPropertyType();
        getJsonPropertyDocumentType();
    }, []);

    const closeModal = () => {
        props.getShowMConfigureDataSource(false);
    };


    const getJsonPropertyType = () => {
        setShowSpinner(true);
        _configService.getJsonPropertyType().subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                setListJsonProperty(resp.DataBeanProperties.ObjectValue);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 1
     * Primer Selector
     */
    const getBPMStructsForQuery = () => {
        setShowSpinner(true);
        _configService.getBPMStructsForQuery().subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                setListBPMStructs(resp.DataBeanProperties.ObjectValue);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 1
     * Segundo Selector
     */
    const getPropertiesForQuery = (BPMDataBeanClass: any) => {
        setShowSpinner(true);
        _configService.getPropertiesForQuery(BPMDataBeanClass).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setShowPropertiesForQuery(true);
                setListPropertiesForQuery(resp.DataBeanProperties.ObjectValue);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
                setShowSpinner(false);
            }
        });
    };

    /**
     * Metodo Caso 2
     * Primer Selector
     */
    const getJsonPropertyDocumentType = () => {
        setShowSpinner(true);
        _configService.getJsonPropertyDocumentType().subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                setListPropertyDocumentType(resp.DataBeanProperties.ObjectValue);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 2
     * Segundo Selector JsonServiceClass
     */
    const getJsonServiceClassCatalog = () => {
        setShowSpinner(true);
        _adminService.getJsonServiceClassCatalog().subscribe(resp => {
            setShowSpinner(false);
            console.log(resp);
            if (resp) {
                setListJsonServiceClass(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 2
     * Tercer Selector JsonService
     */
    const getJsonServiceCatalog = (id: number) => {
        setShowSpinner(true);
        _adminService.getJsonServiceCatalog(id).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setListJsonService(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 2
     * Segundo Selector FormClass
     */
    const getFormClassCatalog = () => {
        setShowSpinner(true);
        _adminService.getFormClassCatalog().subscribe(resp => {
            console.log(resp);
            if (resp) {
                setShowSpinner(false);
                setListFormClass(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo Caso 2
     * Tercer Selector Form
     */
    const getFormCatalog = (id: number) => {
        setShowSpinner(true);
        _adminService.getFormCatalog(id).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setListForm(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo que permite guardar JsonProperty
     */
    const updateJsonProperty = (bean: any) => {
        console.log(bean);
        _configService.updateJsonProperty(bean).subscribe((resp: any) => {
            console.log(resp);
            if (resp.DataBeanProperties.ObjectValue) {
                closeModal();
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado la información",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha guardado la información",
                });
            }
        });
    };

    const handleSubmit = () => {
        console.log("Enviar");
        console.log("ID", props.objPropertyService?.IDJsonProperty)
        if (render === 1) {
            if (BPMDataBeanClass) {
                if (BPMDataBeanProperty) {
                    console.log("Case 1");
                    console.log(BPMDataBeanClass);
                    console.log(BPMDataBeanProperty);
                    const obj = {
                        "IDJsonProperty": props.objPropertyService?.IDJsonProperty,
                        "UserValue": null,
                        "BPMDataBeanProperty": BPMDataBeanProperty,
                        "BPMDataBeanClass": BPMDataBeanClass,
                        "Type": type,
                        "DocumentType": null,
                        "IDJsonServiceSrc": null,
                        "IDFormSrc": null
                    }
                    console.log(obj);
                    updateJsonProperty(obj);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Debe diligenciar todos los campos",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Debe diligenciar todos los campos",
                });
            }
        } else if (render === 2) {

            if (renderClass === 1) {
                if (formClass) {
                    if (form) {
                        console.log("Case 1");
                        const obj = {
                            "IDJsonProperty": props.objPropertyService?.IDJsonProperty,
                            "UserValue": null,
                            "BPMDataBeanProperty": null,
                            "BPMDataBeanClass": null,
                            "Type": type,
                            "DocumentType": documentType,
                            "IDJsonServiceSrc": null,
                            "IDFormSrc": form
                        }
                        console.log(obj);
                        updateJsonProperty(obj);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "Debe seleccionar el formulario",
                        });
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Debe seleccionar el tipo de formulario",
                    });
                }
            }
            if (renderClass === 2) {
                if (jsonServiceClass) {
                    if (jsonService) {
                        console.log("Case 2");
                        const obj = {
                            "IDJsonProperty": props.objPropertyService?.IDJsonProperty,
                            "UserValue": null,
                            "BPMDataBeanProperty": null,
                            "BPMDataBeanClass": null,
                            "Type": type,
                            "DocumentType": documentType,
                            "IDJsonServiceSrc": jsonService,
                            "IDFormSrc": null
                        }
                        console.log(obj);
                        updateJsonProperty(obj);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "Debe seleccionar el servicio",
                        });
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Debe seleccionar el tipo de servicio",
                    });
                }
            }


        } else if (render === 3) {
            if (UserValue) {
                console.log("Case 3");
                console.log(UserValue);
                const obj = {
                    "IDJsonProperty": props.objPropertyService?.IDJsonProperty,
                    "UserValue": UserValue,
                    "BPMDataBeanProperty": null,
                    "BPMDataBeanClass": null,
                    "Type": type,
                    "DocumentType": null,
                    "IDJsonService": null,
                    "IDForm": null
                }
                console.log(obj);
                updateJsonProperty(obj);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Debe diligenciar todos los campos",
                });
            }
        }
    };

    const changeType = (data: any) => {
        setType(data);
        setBPMDataBeanClass(null);
        setBPMDataBeanClass(null);
        setUserValue(null);
        if (data === BPM_PROPERTY) {
            console.log("Case 1");
            getBPMStructsForQuery();
            setRender(1);
        } else if (data === DOCUMENT_PROPERTY) {
            console.log("Case 2");
            getJsonPropertyDocumentType();
            setRender(2);
        } else {
            console.log("Case 3");
            setRender(3);
        }
        setShowPropertiesForQuery(false);
    }

    const changeBPM = (data: any) => {
        getPropertiesForQuery(data);
    }


    const onChangeDocumentType = (data: any) => {
        setJsonService(null);
        setForm(null);
        setJsonServiceClass(null);
        setFormClass(null);
        console.log(data);
        setDocumentType(data);
        if (data === 4) {
            setRenderClass(2);
            getJsonServiceClassCatalog();
        }
        if (data === 6) {
            setRenderClass(1);
            getFormClassCatalog();
        }
    }
    const onChangeJsonServiceClass = (data: number) => {
        console.log(data);
        setJsonServiceClass(data);
        getJsonServiceCatalog(data);
    }

    const onChangeFormClass = (data: number) => {
        console.log(data);
        setFormClass(data);
        getFormCatalog(data);
    }

    const renderSwitch = () => {

        switch (render) {
            case 1: return (
                <>
                    <Row className="container">
                        <Col sm={6} className="mt-2">
                            <TextField
                                value={BPMDataBeanClass}
                                margin="normal"
                                size="small"
                                select
                                fullWidth
                                color="secondary"
                                label="Seleccione"
                                id="state"
                                onChange={(e) => { changeBPM(e.target.value); setBPMDataBeanClass(e.target.value); }}
                            >
                                {listBPMStructs.map((item: any) => (
                                    <MenuItem value={item.DataBeanProperties.Value}>{item.DataBeanProperties.Property}</MenuItem>
                                ))}
                            </TextField>
                        </Col>
                        {showPropertiesForQuery && (<Col sm={6} className="mt-2">
                            <TextField
                                value={BPMDataBeanProperty}
                                margin="normal"
                                size="small"
                                select
                                fullWidth
                                color="secondary"
                                label="Seleccione"
                                id="state"
                                onChange={(e) => setBPMDataBeanProperty(e.target.value)}
                            >
                                {listPropertiesForQuery.map((item: any) => (
                                    <MenuItem value={item.DataBeanProperties.Value}>{item.DataBeanProperties.Property}</MenuItem>
                                ))}
                            </TextField>
                        </Col>)}
                    </Row>
                </>
            )

            case 2: return (
                <>
                    <Row className="container">
                        <Col sm={4} className="mt-2">
                            <TextField
                                value={documentType}
                                margin="normal"
                                size="small"
                                select
                                fullWidth
                                color="secondary"
                                label="Seleccione un tipo"
                                id="state2"
                                onChange={(e) => {
                                    onChangeDocumentType(parseInt(e.target.value));
                                }}
                            >
                                {listPropertyDocumentType.map((item: any) => (
                                    <MenuItem value={item.DataBeanProperties.Value}>{item.DataBeanProperties.Property}</MenuItem>
                                ))}
                            </TextField>
                        </Col>
                        {renderSwitchClass()}
                    </Row>
                </>
            )

            case 3: return (
                <>
                    <Row className="container">
                        <Col sm={12} className="mt-2">
                            <TextField
                                value={UserValue}
                                color="secondary"
                                id="outlined-required"
                                label="Valor definido por el usuario"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(e) => setUserValue(e.target.value)}
                            />
                        </Col>
                    </Row>
                </>
            )


            default:
                break;
        }

    };

    const renderSwitchClass = () => {
        switch (renderClass) {
            case 1: return (
                <>
                    <Col sm={4} className="mt-2">
                        <TextField
                            value={formClass}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un tipo de formulario"
                            id="state"
                            onChange={(e) =>
                                onChangeFormClass(parseInt(e.target.value))
                            }
                        >
                            {listFormClass.map(item => (
                                <MenuItem value={item.IDFormClass}>{item.Name}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col sm={4} className="mt-2">
                        <TextField
                            value={form}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un formulario"
                            id="state"
                            onChange={(e) => setForm(e.target.value)}
                        >
                            {listForm.map(item => (
                                <MenuItem value={item.IDForm}>{item.Name}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                </>
            )
            case 2: return (
                <>
                    <Col sm={4} className="mt-2">
                        <TextField
                            value={jsonServiceClass}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un tipo de servicio"
                            id="state"
                            onChange={(e) =>
                                onChangeJsonServiceClass(parseInt(e.target.value))
                            }
                        >
                            {listJsonServiceClass.map(item => (
                                <MenuItem value={item.IDJsonServiceClass}>{item.Name}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col sm={4} className="mt-2">
                        <TextField
                            value={jsonService}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un servicio"
                            id="state"
                            onChange={(e) => setJsonService(e.target.value)}
                        >
                            {listJsonService.map(item => (
                                <MenuItem value={item.IDJsonService}>{item.Name}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                </>
            )
            default:
                break;
        }
    }

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMConfigureDataSource}
            onHide={closeModal}
            size="lg"
            centered
            
        >
            <Modal.Header>
                Configurar Fuente de Datos
                <BsXSquare className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row className="container">
                    <Col sm={12} className="mt-2">
                        <TextField
                            value={type}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un tipo"
                            id="state"
                            onChange={(e) => changeType(parseInt(e.target.value))}
                        >
                            {listJsonProperty.map((item: any) => (
                                <MenuItem value={item.DataBeanProperties.Value}>{item.DataBeanProperties.Property}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                </Row>
                {renderSwitch()}
                {/* <Row className="container">
                    <Col sm={12} className="mt-2">
                        <ThemeProvider theme={inputsTheme}>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                endIcon={<BsFillSave2Fill />}
                                className="my-3"
                                fullWidth
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Guardar
                            </Button>
                        </ThemeProvider>
                    </Col>
                </Row> */}
            </Modal.Body>
            <Modal.Footer>
                <div className="modal-element">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="error"
                        onClick={closeModal}
                    >
                        CANCELAR
                    </Button>
                </div>
                <div className="modal-element">
                    <Button
                        className={classes.button}
                        type="button"
                        variant="contained"
                        color="success"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        GUARDAR
                    </Button>
                </div>
            </Modal.Footer>
            {showSpinner && (<SSpinner show={showSpinner} />)}
        </Modal>
    );
};

export default MConfigureDataSource;
