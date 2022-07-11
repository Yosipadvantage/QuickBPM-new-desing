import { Button, InputAdornment, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { BsJustifyRight, BsXSquare } from 'react-icons/bs'
import { WeaponsService } from '../../../core/services/WeaponsService';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IndumilOffice } from '../model/AlmacenIndumil';

interface INEIndumilOffice {
    show: boolean
    setShow: Function
    dataTitle: string
    data: IndumilOffice
    refresh: Function
}

const _weaponsService = new WeaponsService();

export const NEIndumilOffice: React.FC<INEIndumilOffice> = (props: INEIndumilOffice) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [nombre, setNombre] = useState(props.dataTitle === 'Editar' ? props.data.Nombre : "")
    const [direccion, setDireccion] = useState(props.dataTitle === 'Editar' ? props.data.Direccion : "")
    const [telefono, seTelefono] = useState(props.dataTitle === 'Editar' ? props.data.Telefono : "")

    useEffect(() => {
        if (props.dataTitle === 'Editar') {
            setValue('entity', props.data);
        }
    }, [])


    const updateIndumilOffice = (bean: IndumilOffice) => {
        _weaponsService
            .updateAlmacenIndumil(bean)
            .subscribe(resp => {
                props.refresh();
                if (resp) {
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

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        const aux = data.entity;
        console.log(aux);
        updateIndumilOffice(aux);
        props.setShow(false);
    };

    const classes = useStyles();

    return (
        <Modal show={props.show}   centered onHide={() => props.setShow(false)}  >
            <Modal.Header>
                {props.dataTitle} Almacen Indumil
                <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <b>Campo obligatorio *</b>
                    <Row>
                        <Col sm={12} className="mt-3">
                            <TextField
                                value={nombre}
                                size="small"
                                color="secondary"
                                id="outlined-required"
                                label="Nombre *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register("entity.Nombre", { required: true })}
                                onChange={(e) => setNombre(e.target.value)}
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
                                value={direccion}
                                size="small"
                                color="secondary"
                                id="outlined-required"
                                label="Dirección *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register("entity.Direccion", { required: true })}
                                onChange={(e) => setDireccion(e.target.value)}
                            />
                            <span className="text-danger">
                                {errors.entity
                                    ? errors.entity.Name?.type === "required" &&
                                    "El campo Direccion es obligatorio."
                                    : ""}
                            </span>
                        </Col>
                        <Col sm={12} className="mt-3">
                            <TextField
                                value={telefono}
                                size="small"
                                type="number"
                                color="secondary"
                                id="outlined-required"
                                label="Telefono *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register("entity.Telefono", { required: true })}
                                onChange={(e) => seTelefono(e.target.value)}
                            />
                            <span className="text-danger">
                                {errors.entity
                                    ? errors.entity.Name?.type === "required" &&
                                    "El campo Telefono es obligatorio."
                                    : ""}
                            </span>
                        </Col>

                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <div className="modal-element">
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="error"
                            onClick={() => props.setShow(false)}
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
    )
}
