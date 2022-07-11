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
    InputAdornment
} from "@mui/material";

import { BsArrowRepeat, BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Office } from "../../configuration/model/Office";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { formatDate } from "../../../utils/formatDate";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { SSpinner } from "../../../shared/components/SSpinner";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMInvokePeriod {
    getShowMInvokePeriod: Function;
    dataShowMInvokePeriod: boolean;
    idJsonService: number;
    /* dataList: any[]; */
}

const MInvokePeriod: React.FC<IMInvokePeriod> = (
    props: IMInvokePeriod
) => {
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [dateInitError, setDateInitError] = useState<boolean>(false);
    const [dateFinal, setDateFinal] = useState<Date | null>(null);
    const [dateFinalError, setDateFinalError] = useState<boolean>(false);
    const [maxRows, setMaxRows] = useState(0);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {

    }, []);

    const closeModal = () => {
        props.getShowMInvokePeriod(false);
        /* props.refresh(); */
    };

    const invokeJsonServiceInPeriod = (
        IDJsonService: any,
        dateInit: any,
        dateFinal: any,
        maxRows: number
    ) => {
        setSpinner(true);
        _configService
            .invokeJsonServiceInPeriod(IDJsonService, dateInit, dateFinal, maxRows)
            .subscribe((res) => {
                setSpinner(false);
                if (res) {
                    closeModal();
                    Toast.fire({
                        icon: "success",
                        title: "Se ha actualizado",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            });
    };

    const handleUpdate = () => {
        if (dateInit) {
            if (dateFinal) {
                if (maxRows) {
                    invokeJsonServiceInPeriod(
                        props.idJsonService,
                        formatDate(dateInit),
                        formatDate(dateFinal),
                        maxRows
                    );
                } else {
                    invokeJsonServiceInPeriod(
                        props.idJsonService,
                        formatDate(dateInit),
                        formatDate(dateFinal),
                        50
                    );
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Debe seleccionar una Fecha Final.",
                });
            }
        } else {
            Toast.fire({
                icon: "error",
                title: "Debe seleccionar una Fecha Inicial.",
            });
        }
    };


    return (
        <>
            <Modal
                show={props.dataShowMInvokePeriod}
                backdrop="static"
                size="lg"
                centered
                keyboard={false}
            >
                <Modal.Header>
                    Valirdar invocación
                    <BsXSquare className='pointer' onClick={closeModal} />
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    disableFuture
                                    label="Fecha Final: "
                                    value={dateFinal}
                                    onChange={(e) => {
                                        setDateFinal(e);
                                        e !== null
                                            ? setDateFinalError(false)
                                            : setDateFinalError(true);
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
                                {dateFinalError ? "El campo Fecha Inicial es obligatorio" : ""}
                            </span>
                        </Col>
                        <Col sm={12} className="mt-3">
                            <TextField
                                color="secondary"
                                id="outlined-required"
                                label="Número de elementos"
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
                                    setMaxRows(parseInt(e.target.value));
                                }}
                            />
                        </Col>
                        <Col sm={12}>
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsArrowRepeat />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => {
                                        handleUpdate();
                                    }}
                                >
                                    Actualizar
                                </Button>
                            </ThemeProvider>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            {spinner && <SSpinner show={spinner} />}
        </>
    );
};

export default MInvokePeriod;
