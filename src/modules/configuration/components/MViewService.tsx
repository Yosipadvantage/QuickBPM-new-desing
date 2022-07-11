import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    ThemeProvider,
    IconButton
} from "@mui/material";

import { BsFillCheckCircleFill, BsFillXCircleFill, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme, useStyles } from "../../../utils/Themes";

interface IMViewService {
    getShowMViewService: Function;
    dataShowMViewService: boolean;
    dataObj: any;
}

const MViewService: React.FC<IMViewService> = (props: IMViewService) => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        console.log(props.dataObj);
    }, []);

    const closeModal = () => {
        props.getShowMViewService(false);
    };

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMViewService}
            onHide={closeModal}
            size="lg"
            centered
            
        >
            <Modal.Header>
                Histórico de invocación de servicio
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    {/* <TableContainer sx={{ height: "50vh" }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            className={classes.root}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Servicio Invocado</TableCell>
                                    <TableCell>Mensaje de envío validado</TableCell>
                                    <TableCell>Fecha de Envío</TableCell>
                                    <TableCell>Mensaje Enviado Al Servicio</TableCell>
                                    <TableCell>Mensaje recibido del Servicio</TableCell>
                                    <TableCell>Mensaje de Error</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                    <TableCell>{props.dataObj.InvokedResponseValue}</TableCell>
                                    <TableCell>{props.dataObj.InvokedValidated}</TableCell>
                                    <TableCell>{props.dataObj.InvokedDate}</TableCell>
                                    <TableCell
                                        style={{
                                            width: "60%",
                                        }}
                                    >{JSON.stringify(JSON.parse(props.dataObj.InvokedMsgJsonValue), undefined, 2)}</TableCell>
                                    <TableCell>{props.dataObj.InvokedRVJsonValue}</TableCell>
                                    <TableCell>{props.dataObj.InvokedErrorMsg}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                    <TableContainer sx={{ height: "60vh" }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            className={classes.root}
                        >
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "60%" }}>Servicio Invocado</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "70%" }}>
                                    {props.dataObj.InvokedResponseValue ===
                                        true ? (
                                        <ThemeProvider theme={inputsTheme}>
                                            <IconButton color="success">
                                                <BsFillCheckCircleFill />
                                            </IconButton>
                                        </ThemeProvider>
                                    ) : (
                                        <ThemeProvider theme={inputsTheme}>
                                            <IconButton color="error">
                                                <BsFillXCircleFill />
                                            </IconButton>
                                        </ThemeProvider>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "60%" }}>Servicio Enviado Construido sin Errores</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "70%" }}>
                                    {props.dataObj.InvokedValidated ===
                                        true ? (
                                        <ThemeProvider theme={inputsTheme}>
                                            <IconButton color="success">
                                                <BsFillCheckCircleFill />
                                            </IconButton>
                                        </ThemeProvider>
                                    ) : (
                                        <ThemeProvider theme={inputsTheme}>
                                            <IconButton color="error">
                                                <BsFillXCircleFill />
                                            </IconButton>
                                        </ThemeProvider>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "50%" }}>Fecha de Envío</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "70%" }}>{props.dataObj.InvokedDate}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "60%" }}>Mensaje Enviado Al Servicio</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "70%" }}>{JSON.stringify(JSON.parse(props.dataObj.InvokedMsgJsonValue), undefined, 2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "60%" }}>Mensaje recibido del Servicio</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "85%" }}> {JSON.stringify(JSON.parse(props.dataObj.InvokedRVJsonValue), undefined, 2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>
                                    <TableCell style={{ width: "60%" }}>Mensaje de Error</TableCell>
                                </TableHead>
                                <TableCell style={{ width: "70%" }}>{props.dataObj.InvokedErrorMsg}</TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Paper>
            </Modal.Body>
            {showSpinner && (
                <SSpinner show={showSpinner} />
            )}
        </Modal>
    );
}

export default MViewService;
