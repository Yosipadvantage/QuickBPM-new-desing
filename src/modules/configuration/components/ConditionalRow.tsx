import React, { useState } from 'react'
import { Button, TextField } from '@mui/material';
import { Col, Modal, Row } from 'react-bootstrap';
import { BsXSquare } from 'react-icons/bs';
import { AdminService } from '../../../core/services/AdminService';
import { Toast } from '../../../utils/Toastify';

interface IConditionalRow {
    show: boolean;
    setShow: Function;
    id: number;
    idObj: number
    refresh: Function;
}

const _adminService = new AdminService();

export const ConditionalRow: React.FC<IConditionalRow> = (props: IConditionalRow) => {

    const [index, setIndex] = useState<any>(null);
    const [err, setErr] = useState(false);

    const changeOrder = (index: number) => {
        if (index !== NaN && index !== null) {
            _adminService.moveConditionStatementToPosition(props.id, index)
                .subscribe((res) => {
                    console.log(res);
                    props.refresh(props.idObj);
                    if (res) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Se ha guardado exitosamente!'
                        })
                    }
                })
            props.setShow(false);
        } else {
            setErr(true);
        }
    }

    return (
        <Modal show={props.show}  size="sm" centered onHide={() => props.setShow(false)} >
            <Modal.Header>
                Cambiar orden del flujo
                <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
            </Modal.Header>
            <Modal.Body>
                <Row className="p-4">
                    <Col sm={12}>
                        <TextField
                            value={index}
                            type="number"
                            className="mt-3"
                            size="small"
                            fullWidth
                            color="secondary"
                            label="Orden en el flujo"
                            onChange={(e) => { setIndex(parseInt(e.target.value)); setErr(e.target.value ? false : true) }}
                        >
                        </TextField>
                        {err &&
                            <span className=" mt-2 text-danger">
                                El campo es obligatorio
                            </span>}
                    </Col>
                    <Col sm={12} className="mt-3">
                        <Button className="w-100" variant="contained" color="success"
                            onClick={() => { changeOrder(index) }}>
                            GUARDAR
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}
