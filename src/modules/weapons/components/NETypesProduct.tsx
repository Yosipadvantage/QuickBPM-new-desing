import { Button, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { BsJustifyRight, BsXSquare } from 'react-icons/bs'
import { WeaponsService } from '../../../core/services/WeaponsService';
import { useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { ITypeProduct } from '../model/typeProduct';

interface INETypesProduct {
    show: boolean
    setShow: Function
    dataTitle: string
    data: ITypeProduct | null
    refresh: Function
}
const _weaponsService = new WeaponsService();


export const NETypesProduct: React.FC<INETypesProduct> = (props: INETypesProduct) => {
    const [nombre, setNombre] = useState(props.dataTitle === 'Editar' ? props.data?.Nombre : "")
    const [descripcion, setDescripcion] = useState(props.dataTitle === 'Editar' ? props.data?.Descripcion : "")
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const updateTipoProducto = (bean: ITypeProduct) => {
        _weaponsService
            .updateTipoProducto(bean)
            .subscribe(resp => {
                console.log(resp);
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
        data.entity.IDTipoProducto = props.data?.IDTipoProducto;
        const aux = data.entity;
        console.log(aux);
        updateTipoProducto(aux);
        props.setShow(false);
    };
    const classes = useStyles();

    return (
        <Modal show={props.show}   centered onHide={() => props.setShow(false)} >
            <Modal.Header>
                {props.dataTitle} Tipo de Producto
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
                                color="secondary"
                                id="outlined-required"
                                label="Descripcion"
                                fullWidth
                                variant="outlined"
                                multiline
                                value={descripcion}
                                rows={5}

                                {...register("entity.Descripcion")}
                                onChange={(e) => setDescripcion(e.target.value)}
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
