import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsSearch, BsTextRight, BsXSquare } from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { Office } from "../model/Office";
import { ConfigService } from "../../../core/services/ConfigService";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import SSearchTreeSite from "../../../shared/components/SSearchTreeSite";
import { getSession } from "../../../utils/UseProps";

interface INEOficce {
    getShow: Function;
    dataShow: boolean;
    dataObj: Office | undefined;
    dataTitle: string;
    /* validName: string; */
    /* setWgName: Function;
    setValidName: Function; */
}

const _configService = new ConfigService();

export const NEOffice: React.FC<INEOficce> = (props: INEOficce) => {

    const [showSTree, setSTree] = useState(false);
    const [cityExpedition, setCityExpedition] = useState('');
    const [cityID, setCityID] = useState(-1);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    useEffect(() => {
        console.log(props.dataObj);
        getValue(props.dataTitle);
    }, [])


    const updateOffice = (bean: Office) => {
        _configService.updateOffice(bean).subscribe((res) => {
            if (res) {
                props.getShow(false);
                clearErrors("entity");
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado con éxito!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                Name: "",
                Description: "",
                State: 0,
                IDEmployee: parseInt(getSession().IDAccount),
                IDOffice: null,
            });
        } else if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
            setCityID(props.dataObj ? props.dataObj.IDSiteLn : -1);
            setCityExpedition(props.dataObj ? props.dataObj.SiteIDName : 'SIN ASIGNAR')
        }
    };

    const setShow = () => {
        clearErrors("entity");
        props.getShow(false);
    };
    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        let aux = data.entity;
        aux.State = 0;
        aux.IDSiteLn = cityID;
        console.log(aux);
        updateOffice(aux);
    };

    const closeSearchTree = (data: any) => {
        setSTree(data);
    }

    const openTree = (view: number) => {
        setSTree(true);
        /* setViewData(view); */
    };

    const getData = (data: any) => {
        console.log(data);
        setCityExpedition(data.name);
        setCityID(data.IDLn);
        /* props.setValidName(data.name); */
        /* if (viewData === 1) {
            console.log(data.name);
            setValue("entity.IDLnFunctionalIDOwner", data.IDLn);
            props.setWgName(data.name)
            setValue(
                "entity.WorkGroupName", data.name
            );
        }
        else if (viewData === 2) {
            console.log(data.name, "IDLnFunctionalID");
            setValue("entity.IDLnFunctionalID", data.IDLn);
            props.setValidName(data.name)
            setValue(
                "entity.ValidatorName", data.name
            );
        } */
    };

    return (
        <>
            <Modal show={props.dataShow}   centered  onHide={setShow}>
                <Modal.Header>
                    {props.dataTitle} Seccional
                    <BsXSquare className='pointer' onClick={setShow} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <b className="ml-3">Campo obligatorio *</b>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Code"
                                    label="Código *"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Code", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Code?.type === "required" &&
                                        "El campo Código es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Name"
                                    label="Nombre *"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Name", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Name?.type === "required" &&
                                        "El campo Nombre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12}>
                                <TextField
                                    value={cityExpedition}
                                    size="small"
                                    label="Ciudad *"
                                    fullWidth
                                    color="secondary"
                                    margin="normal"
                                    {...register("entity.IDSiteLn", { required: true })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => openTree(2)}>
                                                    <BsSearch />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    onClick={() => openTree(2)}
                                />
                                {/* <span className="text-danger">
                                    {errors.entity
                                        ? (errors.entity.FunctionalIDValidateName?.type === "required" && props.validName === "") &&
                                        "El campo Ciudad es requerido."
                                        : ""}
                                </span> */}
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    id="Description"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    {...register("entity.Description")}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={setShow}>
                            CANCELAR
                        </Button>
                        <Button type="submit" variant="success">
                            GUARDAR
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            {showSTree && <SSearchTreeSite getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={showSTree} />}
        </>
    )
}
