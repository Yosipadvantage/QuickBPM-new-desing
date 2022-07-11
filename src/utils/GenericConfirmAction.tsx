import React from 'react'
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsXSquare } from 'react-icons/bs';
import { Button } from "@mui/material";

interface IGenericConfirmAction {
    show: boolean,
    setShow: Function,
    confirmAction: Function,
    title: string,
}

export const GenericConfirmAction: React.FC<IGenericConfirmAction> = (props: IGenericConfirmAction) => {

    const { handleSubmit } = useForm();

    const onSubmit = () => {
        props.confirmAction(true);
        props.setShow(false);
    };

    return (
        <Modal show={props.show}   centered  onHide={() => props.setShow(false)}>
            <Modal.Header>
                {props.title}
                <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Footer>
                    <Modal.Footer>
                        <div className="modal-footer-element">
                            <Button variant="contained" color="error" onClick={() => props.setShow(false)}>NO</Button>
                        </div>
                        <div className="modal-footer-element">
                            <Button type="submit" variant="contained" color="success">SI</Button>
                        </div>
                    </Modal.Footer>
                </Modal.Footer>
            </form>
        </Modal>
    )
}
