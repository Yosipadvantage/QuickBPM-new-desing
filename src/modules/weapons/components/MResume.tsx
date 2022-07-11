import { Button, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsXSquare } from 'react-icons/bs'
import { inputsTheme } from '../../../utils/Themes'
import { IProduct } from '../model/product'

interface IMResume {
    show: boolean,
    setShow: Function,
    listProducts: IProduct[],
    citizen: any,
    setCases: Function,
    crearSalidaAlmacen: Function
}

export const MResume: React.FC<IMResume> = (props: IMResume) => {


    const calcularTotal = () => {
        let x = 0;
        props.listProducts.map((item: any) => {
            x += item.Cantidad;
        })
        return x;
    }

    return (
        <Modal show={props.show}   size="xl" centered onHide={() => { props.setCases(1); props.setShow(false) }} >
            <Modal.Header>
                Descargo de almacén
                <BsXSquare  className='pointer' onClick={() => { props.setCases(1); props.setShow(false) }} />
            </Modal.Header>
            <Modal.Body>
                <Row className="p-4 ">
                    <Col sm={6}>
                        <ThemeProvider theme={inputsTheme}>
                            <Button className=" mt-3 w-25" variant="contained" color="secondary" onClick={(e) => { props.setCases(1); props.setShow(false) }}>
                                ATRAS
                            </Button>
                        </ThemeProvider>
                    </Col>
                    <Col sm={6} className="d-flex justify-content-end">
                        <ThemeProvider theme={inputsTheme}>
                            <Button className=" mt-3 w-50" variant="contained" color="secondary" onClick={(e) => { props.crearSalidaAlmacen(); props.setShow(false); }}>
                                CONFIRMAR DESCARGO
                            </Button>
                        </ThemeProvider>
                    </Col>
                    <Col sm={12} className="mt-3">
                        <h1>Resumen del descargo</h1>
                    </Col>
                    <Col sm={12} className="mt-3">
                        <div className="d-flex flex-row">
                            <p><b>SOLICITANTE: </b> <h4>{props.citizen.EntityName + " - " + props.citizen.Nit}</h4></p>
                        </div>
                        <div>
                            <p><b>TOTAL DE PRODUCTOS SOLICITADOS: </b>  {calcularTotal()}</p>
                        </div>
                    </Col>
                    <Col sm={12} className="mt-2 mh-70 overflow-auto">
                        {
                            props.listProducts.map((item: any) => (
                                <div className="m-2 d-flex flex-column border-top border-bottom">
                                    <div className="d-flex flex-row">
                                        <small><b>Cod. SAP:</b></small><small className="ml-3">{item.CodSAP}</small>
                                    </div>
                                    <div>
                                        <small><b>Cod. DCCAE</b></small><small className="ml-3">{item.CodDCCAE}</small>
                                    </div>
                                    <div>
                                        <small>{item.Descripcion}</small>
                                    </div>
                                    {item.RequiereSerial &&
                                        <div>
                                            <small><b>Serial:</b></small><small className="ml-3">{item.Serial}</small>
                                        </div>
                                    }
                                    <div>
                                        <small><b>Cantidad:</b></small><small className="ml-3">{item.Cantidad}</small>
                                    </div>
                                </div>
                            ))
                        }
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}
