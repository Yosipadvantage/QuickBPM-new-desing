import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { BsXSquare } from 'react-icons/bs';
import { SSpinner } from '../../../shared/components/SSpinner';
import { NEMeet } from './NEMeet';

interface IMRescheduleAgenda {
    show: boolean,
    setShow: Function,
    idAgenda: number,
    fecha: string,
    refresh: Function
}

export const MRescheduleAgenda: React.FC<IMRescheduleAgenda> = (props: IMRescheduleAgenda) => {

    const reScheduleAgenda = () => {
        props.setShow(false);
        props.refresh(props.fecha);
    }

    return (
        <>
            <Modal show={props.show}  centered onHide={() => props.setShow(false)}>
                <Modal.Header>
                    Re-programar cita
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <NEMeet IDProcedureIMP={undefined} IDAgenda={props.idAgenda} type={1} setShow={reScheduleAgenda} />
                </Modal.Body>
            </Modal>
        </>
    )
}
