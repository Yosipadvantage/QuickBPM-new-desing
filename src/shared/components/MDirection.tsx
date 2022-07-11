import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsXSquare } from 'react-icons/bs';

interface IMDirection {
    show: boolean,
    setShow: Function
}

export const MDirection: React.FC<IMDirection> = (props: IMDirection) => {


    return (
        <Modal show={props.show}   size="xl" centered onHide={() => { props.setShow(false) }} >
            <Modal.Header>
                Descargo de almacén
                <BsXSquare  className='pointer' onClick={() => { props.setShow(false) }} />
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal>
    )
}
