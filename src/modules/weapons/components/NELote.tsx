import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Button, TextField, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { BsXSquare } from 'react-icons/bs'
import { WeaponsService } from '../../../core/services/WeaponsService'
import { inputsTheme } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { Ilote } from '../model/lote'
import { formatDate } from '../../../utils/formatDate'

interface INELote {
    show: boolean,
    setShow: Function,
    data: Ilote | null
    title: string,
    idRefresh: number | null,
    refresh: Function
}
const _weaponService = new WeaponsService();


export const NELote: React.FC<INELote> = (props: INELote) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm();

    const [submit, setSubmit] = useState(false);
    const [dateProduccion, setDateProduccion] = useState<Date | null>(null);
    const [dateVencimiento, setDateVencimiento] = useState<Date | null>(null);

    useEffect(() => {
        console.log(props.data);
        if (props.title === 'Editar' && props.data !== null) {
            setValue('entity', props.data)
            setDateProduccion(new Date(props.data?.FechaProduccion));
            setDateVencimiento(new Date(props.data?.FechaVencimiento));
        }
    }, [])

    const updateLote = (bean: Ilote) => {
        _weaponService.updateLote(bean).subscribe((res) => {
            console.log(res);
            if (res) {
                props.setShow(false);
                props.refresh(props.idRefresh);
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
        setSubmit(true);
        data.entity.FechaProduccion = formatDate(dateProduccion);
        data.entity.FechaVencimiento = formatDate(dateVencimiento);
        data.entity.IDProducto = props.idRefresh;
        if (dateProduccion !== null && dateVencimiento !== null) {
            updateLote(data.entity);
        }
    };

    return (
        <>
            <Modal show={props.show}   centered  onHide={() => props.setShow(false)}>
                <Modal.Header>
                    {props.title} Lote
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
                                    label="Número de lote *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.NumeroLote", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.NumeroLote?.type === "required" &&
                                        "El campo Número Lote es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disablePast
                                        label="Fecha de producción *"
                                        value={dateProduccion}
                                        onChange={(e) => {
                                            setDateProduccion(e);
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                                <span className="text-danger">
                                    {dateProduccion === null && submit
                                        ? "El campo Fecha de producción es obligatorio."
                                        : ""
                                    }
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disablePast
                                        label="Fecha de vencimiento *"
                                        value={dateVencimiento}
                                        onChange={(e) => {
                                            setDateVencimiento(e);
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                                <span className="text-danger">
                                    {dateVencimiento === null && submit
                                        ? "El campo Fecha de vencimiento es obligatorio."
                                        : ""
                                    }
                                </span>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <ThemeProvider theme={inputsTheme}>
                            <Button variant="contained" color="error" onClick={() => /* props.setShow(false) */ console.log(dateProduccion)}>
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
