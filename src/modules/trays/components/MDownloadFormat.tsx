import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    Tooltip,
    TextField,
} from "@mui/material";

import { BsArrowRepeat, BsCloudDownloadFill, BsSearch, BsXSquare } from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";

import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { formatDate } from "../../../utils/formatDate";
import { FileService } from "../../../core/services/FileService";
import { SSpinner } from "../../../shared/components/SSpinner";

/**
 * Servicios
 */
const _configService = new ConfigService();
const _fileService = new FileService();

interface IMDownloadFormat {
    getShowMDownloadFormat: Function;
    dataShowMDownloadFormat: boolean;
    dataType: number;
    /* dataList: any[]; */
}

const MDownloadFormat: React.FC<IMDownloadFormat> = (
    props: IMDownloadFormat
) => {

    const [url, setUrl] = useState("");
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [dateInitError, setDateInitError] = useState<boolean>(false);
    const [dateFinal, setDateFinal] = useState<Date | null>(null);
    const [dateFinalError, setDateFinalError] = useState<boolean>(false);
    const [showDateFinal, setShowDateFinal] = useState<boolean>(false);
    const [showEstadoAntecedente, setEstadoAntecedente] = useState<boolean>(false);
    const [showEstadoMarcaje, setEstadoMarcaje] = useState<boolean>(false);
    const [cuantos, setCuantos] = useState<number | null>(null);

    const [estado, setEstado] = useState(1);
    const [listEstado, setListEstado] = useState([
        { id: 1, nombre: "PENDIENTE VALIDACION" },
        { id: 2, nombre: "CON ANTECEDENTES" },
        { id: 3, nombre: "SIN ANTECEDENTES" },
        { id: 10, nombre: "EN VERIFICACION" },
        //{ id: 4, nombre: "CON EXCEPCION" },
    ]);
    const [listEstadoMarcaje, setListEstadoMarcaje] = useState([
        { id: 1, nombre: "SOLICITADO" },
        { id: 2, nombre: "RECIBIDA" },
        { id: 3, nombre: "MARCADA" },
        { id: 4, nombre: "ENTREGADA" },
        /* { id: 5, nombre: "PERMISO" },
        { id: 6, nombre: "ACEPTADO" },
        { id: 7, nombre: "IMPRESO" },
        { id: 8, nombre: "ENTREGADO" }, */
    ]);
    const [spinner, setSpinner] = useState(false);


    useEffect(() => {
        if (props.dataType === 1) {
            setShowDateFinal(false);
            setEstadoAntecedente(true);
            setEstadoMarcaje(false);
        }
        if (props.dataType === 2) {
            setShowDateFinal(true);
            setEstadoAntecedente(false);
            setEstadoMarcaje(true);
        }
    }, []);

    const descargarArchivoAntecedentes = (state: any, dateUpto: any) => {
        setSpinner(true);
        _configService.descargarArchivoAntecedentes(state, dateUpto).subscribe((resp) => {
            console.log(resp);
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setUrl(_fileService.getUrlFile(
                    resp.DataBeanProperties.ObjectValue.DataBeanProperties.MediaContext,
                    resp.DataBeanProperties.ObjectValue.DataBeanProperties.Media
                ));
                Toast.fire({
                    icon: "success",
                    title: "Se ha generado el Formato",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha generado la información",
                });
            }
        });
    };

    const bajarArchivoIndumilMarca = (state: any, dateUpto: any, dateFinal: any) => {
        setSpinner(true);
        _configService.bajarArchivoIndumilMarca(state, dateUpto, dateFinal).subscribe((resp) => {
            console.log(resp);
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setUrl(_fileService.getUrlFile(
                    resp.DataBeanProperties.ObjectValue.DataBeanProperties.MediaContext,
                    resp.DataBeanProperties.ObjectValue.DataBeanProperties.Media
                ));
                Toast.fire({
                    icon: "success",
                    title: "Se ha generado el Formato",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha generado la información",
                });
            }
        });
    };

    const closeModal = () => {
        props.getShowMDownloadFormat(false);
        /* props.refresh(); */
    };

    const handleSearch = () => {
        if (dateInit) {
            if (estado) {
                const aux = formatDate(dateInit);
                if (props.dataType === 1) {
                    console.log(estado, aux);
                    descargarArchivoAntecedentes(estado, aux);
                }
                if (props.dataType === 2) {
                    const aux2 = formatDate(dateFinal);
                    console.log(estado, aux, aux2);
                    bajarArchivoIndumilMarca(estado, aux, aux2);
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Debe seleccionar un estado.",
                });
            }
        } else {
            Toast.fire({
                icon: "error",
                title: "Debe seleccionar una fecha de corte.",
            });
        }
    };

    return (
        <Modal
            show={props.dataShowMDownloadFormat}
             onHide={closeModal}
            size="lg"
            centered
             
        >
            <Modal.Header>
                Descargar Formato
                <BsXSquare className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row className="container">
                    <Col sm={12} className="mt-2">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                disableFuture
                                label="Fecha de corte: "
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
                        {/* <TextField
                            value={cuantos}
                            size="small"
                            type="number"
                            id="cuantos_formato"
                            label="No. de registros a descargar *"
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onChange={(e) => { setCuantos(parseInt(e.target.value)) }}
                        /> */}
                    </Col>
                    {showDateFinal && (
                        <Col sm={12} className="mt-3">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    disableFuture
                                    label="Fecha Final: "
                                    value={dateFinal}
                                    onChange={(e) => {
                                        setDateFinal(e);
                                        e !== null ? setDateFinalError(false) : setDateFinalError(true);
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
                                {dateFinalError ? "El campo Fecha Final es obligatorio" : ""}
                            </span>
                        </Col>
                    )}
                    {showEstadoAntecedente && (
                        <Col sm={12} className="mt-2">
                            <TextField
                                value={estado}
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
                    )}
                    {showEstadoMarcaje && (
                        <Col sm={12} className="mt-2">
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
                                {listEstadoMarcaje.map((item: any) => (
                                    <MenuItem value={item.id}>{item.nombre}</MenuItem>
                                ))}
                            </TextField>
                        </Col>
                    )}
                    <Col sm={12} className="mt-2">
                        <ThemeProvider theme={inputsTheme}>
                            <Button
                                type="button"
                                disabled={!(url === "")}
                                variant="contained"
                                color="secondary"
                                endIcon={<BsCloudDownloadFill />}
                                className="my-3"
                                fullWidth
                                onClick={() => {
                                    handleSearch();
                                }}
                            >
                                Generar Formato
                            </Button>
                        </ThemeProvider>
                    </Col>
                    {!(url === "") &&
                        <Col sm={12}>
                            <ThemeProvider theme={inputsTheme}>
                                <a href={url}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        endIcon={<BsCloudDownloadFill />}
                                        className="my-3"
                                        fullWidth
                                        onClick={() => {
                                            props.getShowMDownloadFormat(false);
                                        }}
                                    >
                                        Descargar formato
                                    </Button>
                                </a>
                            </ThemeProvider>
                        </Col>}
                </Row>
            </Modal.Body>
            <SSpinner show={spinner} />
        </Modal>
    );
};

export default MDownloadFormat;
