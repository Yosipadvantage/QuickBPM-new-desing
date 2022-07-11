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

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMFilterPrint {
    getShowMFilterPrint: Function;
    dataShowMFilterPrint: boolean;
    /* dataList: any[]; */
}

export const MFilterPrint: React.FC<IMFilterPrint> = (
    props: IMFilterPrint
) => {
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [dateInitError, setDateInitError] = useState<boolean>(false);
    const [estado, setEstado] = useState(0);
    const [listEstado, setListEstado] = useState([
        { id: 1, nombre: "POR_IMPRIMIR" },
        { id: 2, nombre: "IMPRESO" },
        { id: 3, nombre: "ENTREGADO" },
        { id: 4, nombre: "ELIMINADO" },
    ]);


    useEffect(() => {

    }, []);

    const closeModal = () => {
        props.getShowMFilterPrint(false);
        /* props.refresh(); */
    };

    const handleSearch = () => {
    }

    return (
        <Modal
            show={props.dataShowMFilterPrint}
             onHide={closeModal}
            size="lg"
            centered
             
        >
            <Modal.Header>
                Buscar
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row className="container">
                    <Col sm={12} className="mt-2">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                disableFuture
                                label="Fecha Inicial: "
                                value={dateInit}
                                onChange={(e) => {
                                    setDateInit(e);
                                    e !== null ? setDateInitError(false) : setDateInitError(true);
                                }}
                                renderInput={(props) => (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        color="secondary"
                                        {...props}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <span className="mt-2 text-danger">
                            {dateInitError ? "El campo Fecha Inicial es obligatorio" : ""}
                        </span>
                    </Col>
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

