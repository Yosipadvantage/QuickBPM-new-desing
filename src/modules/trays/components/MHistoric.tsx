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
} from "@mui/material";

import { BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { SSpinner } from "../../../shared/components/SSpinner";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMProtocolo {
    getShowMProtocolo: Function;
    dataShowMProtocolo: boolean;
    dataObjProtocolo: any;
}

const MProtocolo: React.FC<IMProtocolo> = (props: IMProtocolo) => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [list, setList] = useState<any[]>([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        console.log(props.dataObjProtocolo);
        getProtocoloCatalogPorPropiedadRender(props.dataObjProtocolo.ID_ACCOUNT);
        setRowsPerPage(parseInt(items));
    }, [items]);

    const getProtocoloCatalogPorPropiedadRender = (id: number) => {
        setShowSpinner(true);
        _configService.getProtocoloCatalogPorPropiedadRender(id).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setList(resp.DataBeanProperties.ObjectValue);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const closeModal = () => {
        props.getShowMProtocolo(false);
    };

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMProtocolo}
            onHide={closeModal}
            size="lg"
            centered
             
        >
            <Modal.Header>
                Protocolo
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ height: "70vh" }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            className={classes.root}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha de verificación</TableCell>
                                    <TableCell>Observaciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: any, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.DataBeanProperties.FechaVeri}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Observacion}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.root}
                        rowsPerPageOptions={[items, 10, 25, 100]}
                        component="div"
                        count={list.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Columnas por Página"
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Modal.Body>
            {showSpinner && (
                <SSpinner show={showSpinner} />
            )}
        </Modal>
    );
}

export default MProtocolo;