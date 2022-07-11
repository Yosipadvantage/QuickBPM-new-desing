import React, { Dispatch, useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    Tooltip,
    TextField,
} from "@mui/material";

import { BsArrowLeftRight, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { ConfigService } from "../../../core/services/ConfigService";
import { getSession } from "../../../utils/UseProps";
import { SSpinner } from "../../../shared/components/SSpinner";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMStateAntecedent {
    getShowMStateAntecedent: Function;
    dataShowMStateAntecedent: boolean;
    IDAntecedente: any;
    listIDProcedureList: number[];
    clearListProcedure: Dispatch<number[]>
}

const MStateAntecedent: React.FC<IMStateAntecedent> = (props: IMStateAntecedent) => {

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState(0);
    const [spinner, setSpinner] = useState(false);
    const [listEstado, setListEstado] = useState([
        { id: 2, nombre: "CON ANTECEDENTES" },
        { id: 3, nombre: "SIN ANTECEDENTES" },
        { id: 7, nombre: "ESTUDIO DIJIN" },
    ]);

    useEffect(() => {
        setRowsPerPage(parseInt(items));;
    }, [items]);


    const actualizarAntecedentesMultiple = (estado: any, observacion: any, idFuncionario: any, list: any[]) => {
        setSpinner(true);


        _configService.actualizarAntecedentesMultiple(estado, observacion, idFuncionario, list).subscribe((resp) => {
            console.log(resp);
            setSpinner(false);
            if (resp) {
                closeModal();
                Toast.fire({
                    icon: "success",
                    title: "Se ha cambiado el estado",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const closeModal = () => {
        props.getShowMStateAntecedent(false);
        /* props.refresh(); */
    };

    const handleState = () => {
        console.log(estado, descripcion, parseInt(getSession().IDAccount), props.listIDProcedureList);
        actualizarAntecedentesMultiple(estado, descripcion, parseInt(getSession().IDAccount), props.listIDProcedureList);
        props.clearListProcedure([])
    };




    return (
        <Modal
            show={props.dataShowMStateAntecedent}
             onHide={closeModal}
            size="sm"
            centered
             
        >
            <Modal.Header>
                Cambiar Estado
                <BsXSquare className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12} className="mt-3">
                        <TextField
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un estado"
                            id="state"
                            onChange={(e) => setEstado(parseInt(e.target.value))}
                        >
                            {listEstado.map((item: any) => (
                                <MenuItem value={item.id}>{item.nombre}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col sm={12} className="mt-3">
                        <TextField
                            color="secondary"
                            id="outlined-required"
                            label="Descripción"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={5}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </Col>
                    <Col sm={12}>
                        <ThemeProvider theme={inputsTheme}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                endIcon={<BsArrowLeftRight />}
                                className="my-3"
                                fullWidth
                                onClick={() => {
                                    handleState();
                                }}
                            >
                                Cambiar Estado
                            </Button>
                        </ThemeProvider>
                    </Col>
                </Row>
            </Modal.Body>
            {spinner && <SSpinner show={spinner} />}
        </Modal>
    );
}

export default MStateAntecedent;