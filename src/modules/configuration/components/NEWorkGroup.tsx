import { BsXSquare, BsSearch, BsJustifyRight, BsEnvelopeFill } from "react-icons/bs";
import { Modal, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { TreeService } from "../../../core/services/TreeService";
import { WorkGroup } from "../model/WorkGroup";
import { Toast } from "../../../utils/Toastify";
import { IconButton, InputAdornment, TextField, Button } from "@mui/material";
import { useStyles } from "../../../utils/Themes";

const _treeService = new TreeService();

interface INEWorkGroup {
    getShow: Function,
    getIDLn: Function,
    dataShow: boolean,
    dataObj: WorkGroup | undefined,
    dataTitle: string,
    dataId: any,
    dcName: string,
    setDCName: Function,
    bossName: string,
    setBossName: Function
}

const NEWorkGroup: React.FC<INEWorkGroup> = (props: INEWorkGroup) => {


    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const [show, setShow2] = useState(false);
    const [viewData, setViewData] = useState(0);
    const [dcId, setDcId] = useState(0);
    const [baId, setBaId] = useState(0);

    useEffect(() => {
        getValue(props.dataTitle);
    }, [])

    const getValue = (dataTitle: string) => {
        if (dataTitle === 'Crear') {
            if (props.dataObj) {
                setValue('entity', {
                    Code: "",
                    Description: "",
                    IDBoss: "",
                    DistributionChannel: "",
                    IDSite: "",
                    Name: "",
                    EmailForNotifications: "",
                    DistributionChannelName: "",
                    BossName: "",
                })
            }
        }
        if (dataTitle === "Editar") {
            setValue('entity', props.dataObj);
        }
    };


    const closeModal = () => {
        clearErrors("entity");
        props.getShow(false);
    };

    const createFunctionalID = (id: number, bean: any) => {
        _treeService
            .createFunctionalID(id, bean)
            .subscribe((resp: any) => {

                if (resp.DataBeanProperties.ObjectValue) {
                    props.getIDLn();
                    Toast.fire({
                        icon: "success",
                        title: "Se ha guardado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha guardado con éxito!",
                    });
                }
                props.getIDLn();
            });
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        const aux = data.entity;
        aux.Code = parseInt(aux.Code);
        aux.DistributionChannel = dcId;
        aux.IDBoss = baId;
        createFunctionalID(props.dataId, aux);
        closeModal();
    };

    const openUser = (view: number) => {
        setShow2(true);
        setViewData(view);
    }
    const getItem = (data: any) => {
        if (viewData === 1) {
            setDcId(data.IDAccount);
            props.setDCName(data.EntityName);
        }
        else if (viewData === 2) {
            setBaId(data.IDAccount);
            props.setBossName(data.EntityName);
        }
    }

    const closeSearch = (data: any) => {
        setShow2(data);
    };

    const classes = useStyles();

    return (
        <Modal show={props.dataShow}   size="xl" centered  onHide={closeModal}>
            <Modal.Header>
                {props.dataTitle + " Grupo de Trabajo"}
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col sm={6} className="mt-3">
                            <TextField
                                size="small"
                                color="secondary"
                                id="code"
                                label="Código *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    )
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
                        <Col sm={6} className="mt-3">
                            <TextField
                                size="small"
                                color="secondary"
                                id="name"
                                label="Nombre *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    )
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
                        <Col sm={12} className="mt-3">
                            <TextField
                                size="small"
                                color="secondary"
                                id="name"
                                label="Correo de notificación *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsEnvelopeFill />
                                        </InputAdornment>
                                    )
                                }}
                                {...register("entity.EmailForNotifications", { required: true })}
                            />
                            <span className="text-danger">
                                {errors.entity
                                    ? errors.entity.EmailForNotifications?.type === "required" &&
                                    "El campo Correo de Notificación es obligatorio."
                                    : ""}
                            </span>
                        </Col>
                        <Col sm={6} className="mt-3">
                            <TextField
                                value={props.dcName}
                                size="small"
                                label="Canal de distribuición *"
                                fullWidth
                                color="secondary"
                                margin="normal"
                                id="distributionChanel"
                                {...register("entity.DistributionChannelName", { required: true })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => openUser(1)}>
                                                <BsSearch />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                onClick={() => openUser(1)}
                            />
                            <span className="text-danger">
                                {errors.entity
                                    ? errors.entity.DistributionChannelName?.type === "required" &&
                                    "El Campo Canal de Distribución."
                                    : ""}
                            </span>
                        </Col>
                        <Col sm={6} className="mt-3">
                            {/* <Form.Label>Jefe de Área *</Form.Label> */}
                            <TextField
                                value={props.bossName}
                                size="small"
                                label="Jefe de Área *"
                                /* disabled */
                                fullWidth
                                color="secondary"
                                margin="normal"
                                id="distributionChanel"
                                {...register("entity.BossName", { required: true })}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => openUser(2)}>
                                                <BsSearch />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                onClick={() => openUser(2)}
                            />
                            <span className="text-danger">
                                {errors.entity
                                    ? errors.entity.BossName?.type === "required" &&
                                    "El Campo Jefe Área es obligatorio."
                                    : ""}
                            </span>
                        </Col>
                        <Col sm={12} className="mt-3">
                            <TextField
                                size="small"
                                margin="normal"
                                color="secondary"
                                id="outlined-required"
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
                    <div className="modal-element">
                        <Button className={classes.button} variant="contained" color="error" onClick={closeModal}>CANCELAR</Button>
                    </div>
                    <div className="modal-element">
                        <Button className={classes.button} type="submit" variant="contained" color="success">GUARDAR</Button>
                    </div>
                </Modal.Footer>
            </form>
            <SSearchPerson getShow={closeSearch} getPerson={getItem} dataShow={show} />
        </Modal>
    );
}

export default NEWorkGroup;