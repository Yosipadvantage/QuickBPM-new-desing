import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from 'react-bootstrap';
import { BsXCircle, BsXSquare } from 'react-icons/bs';
import { useStyles } from '../../../utils/Themes';
import { Toast } from "../../../utils/Toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { Paper, TableCell, TableContainer, TableHead, Table, TablePagination, ThemeProvider, Tooltip, Button, TextField, TableRow, ButtonGroup } from "@mui/material";
import { TableBody } from "@material-ui/core";
import { inputsTheme } from "../../../utils/Themes";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { getSession } from "../../../utils/UseProps";
import { NoInfo } from '../../../utils/NoInfo'
import { MHistoryAudit } from "../components/MHistoryAudit";

interface ITAuditorias {
    type: number
}

const _WeaponsService = new WeaponsService();

export const TAuditorias: React.FC<ITAuditorias> = (props: ITAuditorias) => {

    const [records, setRecords] = useState<any>([]);
    const classes = useStyles();
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [showSpiner, setShowSpiner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState<any[]>([]);
    const [auditor, setAuditor] = useState<any>([])
    const [idAuditoria, setIdAuditoria] = useState(-1);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (props.type === 2) {
            getAuditoriaFuncionarioRender(getSession().IDAccount);
        } else if (props.type === 1) {
            getAuditoriaAuditorRender(getSession().IDAccount);
        }
    }, [props.type]);

    const getAuditoriaAuditorRender = (idAuditor: number) => {
        setShowSpiner(true);
        _WeaponsService.getAuditoriaAuditorRender(idAuditor).subscribe((res) => {
            setShowSpiner(false)
            if (res.length > 0) {
                setList(res);
            } else {
                setList([]);
                props.type === 1 ?
                    Toast.fire({
                        icon: "warning",
                        title: "Aún no ha registrado Auditorias"
                    })
                    :
                    Toast.fire({
                        icon: "warning",
                        title: "No tiene Auditorias pendientes por responder"
                    })
            }
        })
    }

    const getAuditoriaFuncionarioRender = (idFuncionario: object) => {
        setShowSpiner(true);
        _WeaponsService.getAuditoriaFuncionarioRender(idFuncionario).subscribe((res) => {
            setShowSpiner(false)
            if (res.length > 0) {
                setList(res);
            } else {
                setList([]);
                props.type === 1 ?
                    Toast.fire({
                        icon: "warning",
                        title: "Aún no ha registrado Auditorias"
                    })
                    :
                    Toast.fire({
                        icon: "warning",
                        title: "No tiene Auditorias pendientes por responder"
                    })
            }
        })
    }

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="row w-100">
                    <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                        <div className="pull-title-top">
                            <h1>{(props.type == 1 && "Mis auditorias") || (props.type == 2 && "Auditorias")}</h1>
                        </div>
                        {list.length > 0 ?
                            < Paper sx={{ width: "100%", overflow: "hidden", marginTop: 2 }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                        <TableHead>
                                            <TableCell># Auditoría</TableCell>
                                            <TableCell>Auditor</TableCell>
                                            <TableCell>Funcionario Asignado</TableCell>
                                            <TableCell>Fecha Actualización</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => (
                                                <TableRow>
                                                    <TableCell>{item.DataBeanProperties.IDAuditoria}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.NombreAuditor}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.NombreFuncionario}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.FechaActualizacion}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.NombreEstado}</TableCell>
                                                    <TableCell>
                                                        <ButtonGroup>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Tooltip title="Auditar" placement="left">
                                                                    <Button
                                                                        variant="contained"
                                                                        className="box-s mt-2 mb-2"
                                                                        color="secondary"
                                                                        onClick={() => {
                                                                            setIdAuditoria(item.DataBeanProperties.IDAuditoria)
                                                                            setShowModal(true);
                                                                        }}>
                                                                        <BsReverseLayoutTextSidebarReverse />
                                                                    </Button>
                                                                </Tooltip>
                                                            </ThemeProvider>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Tooltip title="Cerrar auditoría">
                                                                    <Button
                                                                        variant="contained"
                                                                        className="box-s mt-2 mb-2 ml-2"
                                                                        color="error"
                                                                        onClick={() => {

                                                                        }}>
                                                                        <BsXCircle />
                                                                    </Button>
                                                                </Tooltip>
                                                            </ThemeProvider>
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    className={classes.root}
                                    rowsPerPageOptions={[items, 10, 25, 100]}
                                    labelRowsPerPage="Columnas por Página"
                                    component="div"
                                    count={records.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            :
                            <NoInfo />
                        }
                    </div>
                </div>
            </div>
            {showSpiner && <SSpinner show={showSpiner} />}
            {showModal &&
                <MHistoryAudit show={showModal} setShow={setShowModal} idAuditoria={idAuditoria} />
            }
        </>

    );

}