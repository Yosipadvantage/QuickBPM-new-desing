import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { TextField } from "@mui/material";
import { InputAdornment, ThemeProvider, Button } from '@mui/material';
import { Site } from "../model/site.interface";
import { TreeService } from "../../../core/services/TreeService";
import { Toast } from "../../../utils/Toastify";

/**
 * Servicio
 */
 const _treeService = new TreeService();

interface INESite {
    getShowNESite: Function;
    dataShowNESite: boolean;
    dataTitle: string;
    dataObj: Site | undefined;
    dataIDLn: any;
}

const NESite: React.FC<INESite> = (props: INESite) => {

    const [code, setCode] = useState(props.dataTitle === "Editar" ? props.dataObj?.Code : null);
    const [name, setName] = useState(props.dataTitle === "Editar" ? props.dataObj?.Name : null);

    useEffect(() => {
        console.log(props.dataObj);
        console.log(props.dataIDLn);
        /* const aux = JSON.parse(props.dataJson); */
        /* setJson(JSON.stringify(aux, undefined, 2)); */
    }, [])

    const createSiteID = (idParent: any, id: any, code: any, nameSite: any) => {
        _treeService.createSiteID(idParent, id, code, nameSite).subscribe((res) => {
            if (res) {
                closeModal();
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
        });
    };

    const closeModal = () => {
        props.getShowNESite(false);
    };

    const handleSubmit = () => {
        console.log(code);
        console.log(name);
        console.log(props.dataIDLn);
        if(props.dataTitle === 'Crear'){
            createSiteID(props.dataIDLn, null, code, name);
        }
        if(props.dataTitle === 'Editar'){
            createSiteID(props.dataIDLn, props.dataObj?.IDLn, code, name);
        }
    }

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowNESite}
            onHide={closeModal}
            size="sm"
            centered
      
        >
            <Modal.Header>
                {props.dataTitle + " Item"}
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12} className="mt-3">
                        <TextField
                            color="secondary"
                            value={isNaN(code)? '' : code}
                            id="outlined-required"
                            label="Código *"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <BsJustifyRight />
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => {
                                setCode(parseInt(e.target.value));
                            }}
                        />
                    </Col>
                    <Col sm={12} className="mt-3">
                        <TextField
                            color="secondary"
                            value={name}
                            id="outlined-required"
                            label="Nombre *"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <BsJustifyRight />
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <div className="modal-element">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="error"
                        onClick={closeModal}
                    >
                        CANCELAR
                    </Button>
                </div>
                <div className="modal-element">
                    <Button
                        className={classes.button}
                        type="button"
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                    >
                        GUARDAR
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default NESite;