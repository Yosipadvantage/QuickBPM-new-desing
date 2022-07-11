import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { BsXSquare } from 'react-icons/bs'
import { Toast } from '../../../utils/Toastify'

interface IModalSettings {
    show: boolean,
    setShow: Function,
    frontY: string,
    setFrontY: Function,
    codeY: string,
    setCodeY: Function,
    frontX: string,
    setFrontX: Function,
    codeX: string,
    setCodeX: Function
    height: number,
    setHeight: Function
}

export const ModalSettings: React.FC<IModalSettings> = (props: IModalSettings) => {


    useEffect(() => {
        if (localStorage.getItem('CodeY')) {
            props.setCodeY(localStorage.getItem('CodeY'));
        }
        else {
            props.setCodeY('-18');
        }
        if (localStorage.getItem('FrontY')) {
            props.setFrontY(localStorage.getItem('FrontY'));
        } else {
            props.setFrontY('0');
        }
        if (localStorage.getItem('CodeX')) {
            props.setCodeX(localStorage.getItem('CodeX'));
        }
        else {
            props.setCodeX('12');
        }
        if (localStorage.getItem('FrontX')) {
            props.setFrontX(localStorage.getItem('FrontX'));
        } else {
            props.setFrontX('0');
        }
    }, [])


    const onSubmit = (e: any) => {
        e.preventDefault();

        try {

            localStorage.setItem('CodeY', props.codeY + '');
            localStorage.setItem('FrontY', props.frontY + '');
            localStorage.setItem('CodeX', props.codeX + '');
            localStorage.setItem('FrontX', props.frontX + '');
            Toast.fire({
                icon: 'success',
                title: 'Guardado Correctamente'
            });
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: 'err.message'
            });
        }
        props.setShow(false);
    }

    return (
        <Modal show={props.show}   centered   size="lg" onHide={() => props.setShow(false)}>
            <Modal.Header>
                Configuración
                <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
            </Modal.Header>
            <form onSubmit={(e) => onSubmit(e)}>
                <Modal.Body>
                    <Row className="mt-3 border-bottom" >
                        <Col sm={12}>
                            <h4 className="mt-2">FRONTAL</h4>
                        </Col>
                        <Col sm={6} className="mt-3">
                            <div>
                                <TextField
                                    type='number'
                                    InputProps={{ inputProps: { min: -200, max: 200 } }}
                                    value={props.frontY}
                                    size="small"
                                    color="secondary"
                                    id="front"
                                    label="Subir/Bajar Frontal"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => props.setFrontY(parseInt(e.target.value))}
                                />
                                {
                                    parseInt(props.frontY) === 0 || isNaN(parseInt(props.frontY)) ? '' :
                                        parseInt(props.frontY) > 0 ?
                                            <div className="mt-2 mb-3">
                                                {'SUBIR FRONTAL ' + (parseInt(props.frontY) / 2) + ' milimetros'}
                                            </div>
                                            :
                                            <div className="mt-2 mb-3">
                                                {'BAJAR FRONTAL ' + (parseInt(props.frontY) / 2 * -1) + ' milimetros'}
                                            </div>
                                }
                            </div>
                        </Col>
                        <Col sm={6} className="mt-3">
                            <div>
                                <TextField
                                    type='number'
                                    InputProps={{ inputProps: { min: -200, max: 200 } }}
                                    value={props.frontX}
                                    size="small"
                                    color="secondary"
                                    id="front"
                                    label="Mover Izq/Der Frontal"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => props.setFrontX(parseInt(e.target.value))}
                                />
                                {
                                    parseInt(props.frontX) === 0 || isNaN(parseInt(props.frontX)) ? '' :
                                        parseInt(props.frontX) > 0 ?
                                            <div className="mt-2">
                                                {'MOVER A LA DERECHA ' + (parseInt(props.frontX) / 2) + ' milimetros'}
                                            </div>
                                            :
                                            <div className="mt-2">
                                                {'MOVER A LA IZQUIERDA ' + (parseInt(props.frontX) / 2 * -1) + ' milimetros'}
                                            </div>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-3" >
                        <Col sm={12}>
                            <h4 className="mt-2">CRYPTOCODE</h4>
                        </Col>
                        <Col sm={6} className="mt-3">
                            <div>
                                <TextField
                                    type='number'
                                    InputProps={{ inputProps: { min: -200, max: 200 } }}
                                    value={props.codeY}
                                    size="small"
                                    color="secondary"
                                    id="code"
                                    label="Subir/Bajar CryptoCode"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => props.setCodeY(parseInt(e.target.value))}
                                />
                                {
                                    parseInt(props.codeY) === 0 || isNaN(parseInt(props.codeY)) ? '' :
                                        parseInt(props.codeY) > 0 ?
                                            <div className="mt-2">
                                                {'SUBIR CRYTO-CODE ' + (parseInt(props.codeY) / 2) + ' milimetros'}
                                            </div>
                                            :
                                            <div className="mt-2">
                                                {'BAJAR CRYTO-CODE ' + (parseInt(props.codeY) / 2 * -1) + ' milimetros'}
                                            </div>
                                }
                            </div>
                        </Col>
                        <Col sm={6} className="mt-3">
                            <div>
                                <TextField
                                    type='number'
                                    InputProps={{ inputProps: { min: -200, max: 200 } }}
                                    value={props.codeX}
                                    size="small"
                                    color="secondary"
                                    id="front"
                                    label="Mover Izq/Der CryptoCode"
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => props.setCodeX(parseInt(e.target.value))}
                                />
                                {
                                    parseInt(props.codeX) === 0 || isNaN(parseInt(props.codeX)) ? '' :
                                        parseInt(props.codeX) > 0 ?
                                            <div className="mt-2">
                                                {'MOVER A LA DERECHA ' + (parseInt(props.codeX) / 2) + ' milimetros'}
                                            </div>
                                            :
                                            <div className="mt-2">
                                                {'MOVER A LA IZQUIERDA ' + (parseInt(props.codeX) / 2 * -1) + ' milimetros'}
                                            </div>
                                }
                            </div>
                        </Col>
                        {/* <Col sm={12} className="mt-3">
                            <TextField
                                type='number'
                                InputProps={{ inputProps: { min: -20, max: 20 } }}
                                value={props.height}
                                size="small"
                                color="secondary"
                                id="code"
                                label="Aumentar/Disminuir tamaño CryptoCode"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => { props.setHeight(parseInt(e.target.value)); setWidth(rule3(props.height)) }}
                            />
                            {
                                props.height === 0 || props.height === NaN ? '' :
                                    props.height > 0 ?
                                        <div>
                                            {'AUMENTAR TAMAÑO: ALTO: ' + (props.height / 2) + ' milimetros  X  ANCHO: ' + width + ' milimetros'}
                                        </div>
                                        :
                                        <div>
                                            {'DISMINUIR TAMAÑO: ALTO: ' + (props.height / 2 * -1) + ' milimetros  X  ANCHO: ' + width + ' milimetros'}
                                        </div>
                            }
                        </Col> */}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => props.setShow(false)}>
                        CANCELAR
                    </Button>
                    <Button type="submit" variant="success">
                        GUARDAR
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}
