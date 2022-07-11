import { Button, TextField, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsXSquare } from 'react-icons/bs'
import { inputsTheme } from '../../../utils/Themes'
import { ICapCarga } from "../model/capCarga";
import { WeaponsService } from '../../../core/services/WeaponsService';
import { Toast } from '../../../utils/Toastify'


interface INECapCarga {
    title: string,
    show: boolean,
    setShow: Function,
    item: ICapCarga | undefined,
    idProducto: number,
    refresh: Function
}

const _weaponService = new WeaponsService();

export const NECapCarga: React.FC<INECapCarga> = (props: INECapCarga) => {

    const [capacity, setCapacity] = useState<number | null>(null);

    useEffect(() => {
        if(props.title === "Editar" && props.item){
            setCapacity(props.item.IDCapacidades)
        } else {
            setCapacity(null);
        }
    }, [props.item])

    const updateCapCarga = (bean: any) => {
        _weaponService.updateCapCarga(bean).subscribe((res) => {
            console.log(res);
            if (res) {
                props.refresh(props.idProducto);
                props.setShow(false);
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

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (capacity === null) {
            Toast.fire({
                icon: "warning",
                title: "Debe llenar el campo",
            });
        } else {
            let aux = {
                IDCapCarga: props.item ? props.item.IDCapCarga : null,
                IDProducto: props.idProducto,
                IDCapacidades: capacity
            }
            updateCapCarga(aux);
        }
    }

    return (
        <>
            <Modal show={props.show}   size="lg" centered  onHide={() => props.setShow(false)}>
                <Modal.Header>
                    {props.title === 'Crear' ? 'Asignar' : props.title} Capacidad
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <Row className="p-4">
                            <Col sm={6}>
                                <TextField
                                    value={capacity}
                                    type="number"
                                    size="small"
                                    id="capacity"
                                    label="Capacidad *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                                />
                            </Col>
                            <Col sm={6}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color={props.title === 'Crear' ? 'secondary' : 'success'}
                                        className='w-100'
                                        onClick={(e) => onSubmit(e)}
                                    >
                                        {props.title === 'Crear' ? 'ASIGNAR' : 'GUARDAR'}
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}
