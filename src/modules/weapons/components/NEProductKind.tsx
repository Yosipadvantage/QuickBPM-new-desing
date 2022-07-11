import { Button, TextField, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { BsXSquare } from 'react-icons/bs'
import { WeaponsService } from '../../../core/services/WeaponsService'
import { inputsTheme } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { IProductKind } from '../model/ProductKind'

interface INEProductKind {
    show: boolean,
    setShow: Function,
    data: IProductKind | null
    title: string,
    refresh: Function
}

const _weaponService = new WeaponsService();

export const NEProductKind: React.FC<INEProductKind> = (props: INEProductKind) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    useEffect(() => {
        if (props.title === 'Editar') {
            setValue('entity', props.data)
        }
    }, [])


    const updateClaseProducto = (bean: IProductKind) => {
        _weaponService.updateClaseProducto(bean).subscribe((res) => {
            console.log(res);
            if (res) {
                props.setShow(false);
                props.refresh();
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

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        updateClaseProducto(data.entity);
        /* data.entity.State = 0; */
        /* updateOffice(data.entity); */
    };

    return (
        <>
            <Modal show={props.show}   centered onHide={() => props.setShow(false)} >
                <Modal.Header>
                    {props.title} Clase de Producto
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>                        
                        <Row>
                            <b className="ml-3">Campo obligatorio *</b>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    id="Name"
                                    label="Nombre *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.Nombre", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Nombre?.type === "required" &&
                                        "El campo Nombre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    size="small"
                                    color="secondary"
                                    id="Descripcion"
                                    label="Descripción *"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    {...register("entity.Descripcion",  { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Descripcion?.type === "required" &&
                                        "El campo Descripcion es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <ThemeProvider theme={inputsTheme}>
                            <Button variant="contained" color="error" onClick={() => props.setShow(false)}>
                                CANCELAR
                            </Button>
                            <Button type="submit" variant="contained" color="success" className="ml-3">
                                GUARDAR
                            </Button>
                        </ThemeProvider>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}
