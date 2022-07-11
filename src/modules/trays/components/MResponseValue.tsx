import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { TextField } from "@mui/material";

interface IMResponseValue {
    getShowMResponseValue: Function;
    dataShowMResponseValue: boolean;
    dataJson: any;
}

const MResponseValue: React.FC<IMResponseValue> = (props: IMResponseValue) => {

    const [Json, setJson] = useState<any>();

    useEffect(() => {
        const aux = props.dataJson;
        setJson(JSON.stringify(aux, undefined, 3));
    }, [])


    const closeModal = () => {
        props.getShowMResponseValue(false);
    };

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMResponseValue}
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

export default MResponseValue;