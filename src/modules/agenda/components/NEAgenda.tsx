import { Button, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsXSquare } from 'react-icons/bs';
import { ConfigService } from '../../../core/services/ConfigService';
import { formatDate } from '../../../utils/formatDate';
import { Toast } from '../../../utils/Toastify';
import { IAgendaSeccional } from '../model/AgendaSeccional';

interface INEAgenda {
    show: boolean
    setShow: Function
    dataTitle: string
    fecha: string
    busy: number[]
    IDOffice: number
    Agenda: IAgendaSeccional | null
    refresh: Function
}

const _configService = new ConfigService();

export const NEAgenda: React.FC<INEAgenda> = (props: INEAgenda) => {

    const numCitas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const calcPosibleMettings = (today: Date, fechaSelected: string) => {
        if (fechaSelected === formatDate(today)) {
            let aux: number[] = [];
            horarios.map((hrs: number) => {
                if (hrs > today.getHours()) {
                    aux.push(hrs);
                }
            })
            setHorarios(aux);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm();

    const [horarios, setHorarios] = useState([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20]);
    const [horario, setHorario] = useState(props.dataTitle === 'Editar' ? horarios[props.Agenda !== null ? props.Agenda.Hora : 0] : null);
    const [cantidad, setCantidad] = useState(props.dataTitle === 'Editar' ? props.Agenda?.Cantidad : null)
    const [estado, setEstado] = useState(props.dataTitle === 'Editar' ? props.Agenda?.Estado : null);

    useEffect(() => {
        calcPosibleMettings(new Date(), props.fecha);
    }, [])

    const updateAgenda = (bean: IAgendaSeccional) => {
        _configService.updateAgendaSeccional(bean).subscribe((res) => {
            if (res) {
                props.setShow(false);
                clearErrors("entity");
                props.refresh(props.fecha);
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
    }

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        const aux = data.entity;
        if (props.dataTitle === "Editar") {
            if (props.Agenda?.Hora !== horario) {
                if (props.busy.includes(horario === null ? 0 : horario)) {
                    Toast.fire({
                        icon: "error",
                        title: "Agenda ocupada",
                    });
                }
                else {
                    aux.FechaDia = props.fecha;
                    aux.IDOffice = props.IDOffice;
                    aux.IDAgendaSeccional = props.Agenda?.IDAgendaSeccional;
                    updateAgenda(aux);
                }
            }
            else {
                aux.FechaDia = props.fecha;
                aux.IDOffice = props.IDOffice;
                aux.IDAgendaSeccional = props.Agenda?.IDAgendaSeccional;
                updateAgenda(aux);
            }
        }
        else {
            if (props.busy.includes(horario === null ? 0 : horario)) {
                Toast.fire({
                    icon: "error",
                    title: "Agenda ocupada",
                });
            }
            else {
                aux.FechaDia = props.fecha;
                aux.IDOffice = props.IDOffice;
                aux.IDAgendaSeccional = null;
                updateAgenda(aux);
            }
        }
        console.log(aux);
    }

    return (
        <>
            <Modal show={props.show}  centered onHide={() => props.setShow(false)}>
                <Modal.Header>
                    {props.dataTitle} Agenda para Seccional
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <h2>Agenda para: <b>{props.fecha.split(' ')[0]}</b></h2>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={horario}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Seleccione una franja de horario"
                                    id="characterization"
                                    {...register("entity.Hora", {
                                        required: true
                                    })}
                                    onChange={(e) => { setHorario(parseInt(e.target.value)) }}
                                >
                                    {horarios.map((item: number) => (
                                        <MenuItem value={item}>
                                            {props.busy.includes(item)
                                                ? <p className="text-danger m-0">{item}:00 - {item === 23 ? "0:00" : item + 1 + ":00 "}(Agendado)</p>
                                                : <p className="text-success m-0">{item}:00 - {item === 23 ? "0:00" : item + 1 + ":00 "}</p>}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Hora?.type === "required" &&
                                        "El campo Hora es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={cantidad}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Cantidad de citas / hora"
                                    id="Cantidad"
                                    {...register("entity.Cantidad", {
                                        required: true
                                    })}
                                    onChange={(e) => { setCantidad(parseInt(e.target.value)) }}
                                >
                                    {numCitas.map((item: number) => (
                                        <MenuItem value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Cantidad?.type === "required" &&
                                        "El campo Cantidad / Hora es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={estado}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Estado"
                                    id="State"
                                    {...register("entity.Estado", {
                                        required: true
                                    })}
                                    onChange={(e) => { setEstado(parseInt(e.target.value)) }}
                                >
                                    <MenuItem value={1}>
                                        ACTIVO
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        INACTIVO
                                    </MenuItem>
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Estado?.type === "required" &&
                                        "El campo Estado es obligatorio."
                                        : ""}
                                </span>
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" color="error" onClick={() => props.setShow(false)}>
                            CANCELAR
                        </Button>
                        <Button className="ml-3" type="submit" variant="contained" color="success">
                            GUARDAR
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};
