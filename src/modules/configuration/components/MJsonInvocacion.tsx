import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { TextField } from "@mui/material";

interface IMJsonInvocacion {
    getShowMJsonInvocacion: Function;
    dataShowMJsonInvocacion: boolean;
    dataJson: any;
}

const MJsonInvocacion: React.FC<IMJsonInvocacion> = (props: IMJsonInvocacion) => {

    const [Json, setJson] = useState<any>();

    useEffect(() => {
        const aux = JSON.parse(props.dataJson);
        setJson(JSON.stringify(aux, undefined, 2));
    }, [])


    const closeModal = () => {
        props.getShowMJsonInvocacion(false);
    };

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMJsonInvocacion}
            onHide={closeModal}
            size="lg"
            centered
            
        >
            <Modal.Header>
                JSON
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <TextField
                    value={Json}
                    color="secondary"
                    id="outlined-required"
                    label="Descripción"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={20}
                />
            </Modal.Body>
        </Modal>
    );
}

export default MJsonInvocacion;