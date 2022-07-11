import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, MenuItem, TextField, Button } from "@mui/material";
import { CharacterizationK } from "../model/Characterization";
import { useState, useEffect } from "react";
import { ICustomerType } from "../model/CustomerType";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";

const _configService = new ConfigService();

interface INENotification {
    getShow: Function;
    dataShow: boolean;
    dataObj: any;
    dataTitle: string;
}

export const NENotification: React.FC<INENotification> = (
    props: INENotification
) => {
    const {
        register,
        formState: { errors },
        clearErrors,
        setValue,
        handleSubmit,
    } = useForm();
    const [listCustomerType, setListCustomerType] = useState<ICustomerType[]>([]);
    const [selector, setSelector] = useState(
        props.dataObj && props.dataTitle === "Editar"
            ? props.dataObj.IDCustomerType
            : null
    );

    useEffect(() => {
        clearErrors("entity");
       
        getValue(props.dataTitle);
    }, []);

  

    const updateNotificacion = (bean: any) => {
        _configService.updateNotificacion(bean).subscribe((res) => {
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
        });
    };

    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                DESCRIPCION: "",
                TEXTONOTIFICA: "",
                IDNOTIFICA: null
            });
        } else if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
        }
    };

    const setShow = () => {
        clearErrors("entity");
        props.getShow(false);
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
       
        console.log(data)
        updateNotificacion(data.entity);
    };

    const classes = useStyles();

    return (
        <>
            <Modal show={props.dataShow}   centered  onHide={setShow}>
                <Modal.Header>
                    {props.dataTitle} Notificación
                    <BsXSquare className='pointer' onClick={setShow} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <b>Campo obligatorio *</b>
                        <Row>
                            <Col sm={12} className={"mt-3"}>
                                <ThemeProvider theme={inputsTheme}>
                                    <TextField
                                        size="small"
                                        color="secondary"
                                        id="outlined-required"
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
                                        {...register("entity.DESCRIPCION", { required: true })}
                                    />
                                </ThemeProvider>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Name?.type === "required" &&
                                        "El campo Nombre es obligatorio."
                                        : ""}
                                </span>
                            </Col>

                            <Col sm={12} className="mt-3">
                                <TextField
                                    color="secondary"
                                    id="outlined-required"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    {...register("entity.TEXTONOTIFICA")}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="modal-element">
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="error"
                                onClick={setShow}
                            >
                                CANCELAR
                            </Button>
                        </div>
                        <div className="modal-element">
                            <Button
                                className={classes.button}
                                type="submit"
                                variant="contained"
                                color="success"
                            >
                                GUARDAR
                            </Button>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};
