import { Button, MenuItem, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsXSquare } from 'react-icons/bs';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';

interface INETipoNovedad {
    show: boolean,
    setShow: Function,
    title: string,
    formData: any,
    refresh: Function
}

const _weaponService = new WeaponsService();

export const NETipoNovedad: React.FC<INETipoNovedad> = (props: INETipoNovedad) => {

    const {
        register,
        formState: { errors },
        clearErrors,
        setValue,
        handleSubmit,
    } = useForm();

    const [type, setType] = useState<number | null>(props.title === "Editar" ? props.formData.Tipo : null);
    const [categorie, setCategorie] = useState<number | null>(props.title === "Editar" ? props.formData.Categoria : null);
    const [spinner, setSpinner] = useState(false);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getList([50, 51]);
        if (props.title === "Editar") {
            setValue("entity", props.formData);
        }
        return () => {
            clearErrors("entity");
        }
    }, []);

    const getList = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setTypes(resp.DataBeanProperties.ObjectValue[0].Lista);
                setCategories(resp.DataBeanProperties.ObjectValue[1].Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const updateTipoNovedad = (bean: any) => {
        setSpinner(true);
        _weaponService.updateTipoNovedad(bean).subscribe((res) => {
            setSpinner(false);
            if (res) {
                props.setShow(false);
                props.refresh();
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
        updateTipoNovedad(data.entity);
    };

    const classes = useStyles();

    return (
        <>
            <Modal show={props.show}   centered onHide={() => props.setShow(false)} >
                <Modal.Header>
                    {props.title} Tipo de Novedad
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <b>Campo obligatorio *</b>
                        <Row>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={type}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Tipo *"
                                    id="tipoNovedad"
                                    {...register("entity.Tipo", { required: true })}
                                    onChange={(e) => setType(parseInt(e.target.value))}
                                >
                                    {types.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Tipo?.type === "required" &&
                                        "El campo Tipo de uso es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={categorie}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Categoria *"
                                    id="catecogoriaNovedad"
                                    {...register("entity.Categoria", { required: true })}
                                    onChange={(e) => setCategorie(parseInt(e.target.value))}
                                >
                                    {categories.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Categoria?.type === "required" &&
                                        "El campo Tipo de uso es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className={"mt-3"}>
                                <TextField
                                    size="small"
                                    color="secondary"
                                    id="nombreTipoNovedad"
                                    label="Nombre *"
                                    fullWidth
                                    variant="outlined"
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
                                    color="secondary"
                                    id="descripcionNovedad"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    {...register("entity.Descripcion")}
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
            {spinner && <SSpinner show={spinner} />}
        </>
    )
}
