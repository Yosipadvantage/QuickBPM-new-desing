import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";

import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    Tooltip,
    Autocomplete,
    TextField,
} from "@mui/material";

import { BsArrowRepeat, BsSearch, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Office } from "../../configuration/model/Office";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { formatDate } from "../../../utils/formatDate";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { pipeSort } from '../../../utils/pipeSort';
import { getSession } from "../../../utils/UseProps";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMFilterPermit {
    getShowMFilterPermit: Function
    dataShowMFilterPermit: boolean
    estado: number
    setEstado: Function
    officeName: string,
    setOfficeName: Function,
    office: number,
    setOffice: Function
}

export const MFilterPermit: React.FC<IMFilterPermit> = (
    props: IMFilterPermit
) => {

    const [listOffice, setListOffice] = useState<any[]>([]);
    const [spinner, setSpinner] = useState(false);
    const [listEstado, setListEstado] = useState([
        { id: 4, nombre: "DISPONIBLE" },
        { id: 5, nombre: "ASIGNADO" },
        { id: 6, nombre: "ANULADO" },
    ]);


    useEffect(() => {
        getListOffice();
    }, []);

    const getListOffice = () => {
        setSpinner(true);
        let aux: any = [];
        let auxSorted: any = [];
        _configService.getSeccionalUsuario(getSession().IDAccount).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                resp.map((item: Office) =>
                    aux.push({
                        label: item.Name,
                        id: item.IDOffice,
                    }));
                auxSorted = pipeSort([...aux], "label");
                setListOffice(auxSorted);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }

    const closeModal = () => {
        props.getShowMFilterPermit(false);
    };

    const handleSearch = () => {
        if (props.office) {
            if (props.estado) {
                const obj = {
                    'idOffice': props.office,
                    'state': props.estado
                }
                props.getShowMFilterPermit(obj);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Debe seleccionar un estado.",
                });
            }
        } else {
            Toast.fire({
                icon: "error",
                title: "Debe seleccionar una oficina.",
            });
        }
    }

    return (
        <Modal
            show={props.dataShowMFilterPermit}
            size="lg"
            centered
            onHide={closeModal}
        >
            <Modal.Header>
                LISTAR PERMISOS
                <BsXSquare className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row className="container">
                    <Col sm={12} className="mt-2">
                        <Autocomplete
                            onChange={(e: any, value: any) => { props.setOffice(value ? value.id : 0); props.setOfficeName(value ? value.label : '') }}
                            fullWidth
                            size="small"
                            disablePortal
                            defaultValue={props.officeName}
                            id="seccionales"
                            options={listOffice}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params.id}
                                    label="Seleccione una secccional"
                                    fullWidth
                                    color="secondary"
                                />
                            )}
                        />
                    </Col>
                    <Col sm={12} className="mt-3">
                        <TextField
                            value={props.estado}
                            margin="normal"
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label="Seleccione un estado"
                            id="state"
                            onChange={(e) => props.setEstado(parseInt(e.target.value))}
                        >
                            {listEstado.map((item: any) => (
                                <MenuItem value={item.id}>{item.nombre}</MenuItem>
                            ))}
                        </TextField>
                    </Col>
                    <Col sm={12}>
                        <ThemeProvider theme={inputsTheme}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                endIcon={<BsSearch />}
                                className="my-3"
                                fullWidth
                                onClick={() => {
                                    handleSearch();
                                }}
                            >
                                Buscar
                            </Button>
                        </ThemeProvider>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default MFilterPermit;


