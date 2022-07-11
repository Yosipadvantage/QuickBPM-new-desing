import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { MenuItem, ThemeProvider, Paper, SpeedDial, TableCell, TableContainer, Table, TableHead, TextField, TableRow, TableBody, TablePagination, IconButton, Button, Menu, ListItemIcon, ListItemText, ButtonGroup } from "@mui/material";
import { Tooltip } from "@material-ui/core";
import { FiMoreVertical } from "react-icons/fi";
import { BsReceiptCutoff, BsFillFileEarmarkBreakFill } from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { RootState } from "../../../store/Store";
import { Fine } from "../../trays/model/fine.interface";
import { NEManageFines } from "../components/NEManageFines";
import { formatDate } from "../../../utils/formatDate";
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Col, Row } from "react-bootstrap";
import { SSpinner } from "../../../shared/components/SSpinner";
import { NoInfo } from "../../../utils/NoInfo";

const _configService = new WeaponsService();

/* interface ICustomerType { } */

export const TManageFines: any = () => {

    const [list, setList] = useState<Fine[]>([])

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [page, setPage] = useState(0);
    const [show, setShow] = useState(false);
    const [showSpiner, setShowSpiner] = useState(false)
    const [dataFiltro, setDataFiltro] = useState<any>({
        state: 0,
        fechaInicial: '',
        fechaFinal: ''
    });
    const [showEximir, setShowEximir] = useState(false);
    const [multa, setMulta] = useState();
    const [eximir, setEximir] = useState<any>();
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [dateFinal, setDateFinal] = useState<Date | null>(null);
    const [fecha, setFecha] = useState<any>("");
    const [fecha2, setFecha2] = useState<any>("");
    const [showInfo, setShowInfo] = useState(false);
    const states = [{ state: 1, name: "PENDIENTE POR PAGAR" }, { state: 2, name: "PAGADA" }, { state: 3, name: "EXENTA" }]

    useEffect(() => {
        setRowsPerPage(parseInt(items));
    }, [items, dataFiltro]);

    const listaMultasRender = (state: number, dateFrom: string, dateUpto: string) => {
        setShowSpiner(true);
        _configService.listaMultasRender(state, dateFrom, dateUpto).subscribe((res) => {
            setShowSpiner(false);
            if (res) {
                setShowInfo(true);
                setList(res);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    }
    const closeModal = (data: boolean) => {
        setShow(data);
        //getCustomerTypeCatalog();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const dataElement = (data: boolean) => {
        if (data) {
            eximirMulta(eximir.IDMULTA, eximir.IDFUNCIONARIO, eximir.Soporte, eximir.OBSERVACION)
        }
    }

    const eximirMulta = (idMulta: number, idfuncionario: number, soporte: string, observacion: string) => {
        setShowSpiner(true)
        _configService.eximirMulta(idMulta, idfuncionario, soporte, observacion).subscribe((res) => {
            if (res.length > 0) {
                setShowSpiner(false);
                listaMultasRender(dataFiltro.state, dataFiltro.fechaInicial, dataFiltro.fechaFinal)
                Toast.fire({
                    icon: "success",
                    title: "operacion realizada con exito"
                })
            } else {
                setShowSpiner(false);
                Toast.fire({
                    icon: "error",
                    title: "Hubo un error en la operacion"
                })
            }
        })
    }
    const classes = useStyles();


    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <h1 className="mt-3 mb-3">Gestionar Multas</h1>
                    <div className="card p-3 w-100 pull-title-top">
                        <Row>
                            <Col sm={3} className="mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Fecha Inicial "
                                        value={dateInit}
                                        onChange={(e) => {
                                            setDateInit(e);
                                            setFecha(formatDate(e));
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={3} className="mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Fecha Final"
                                        value={dateFinal}
                                        onChange={(e) => {
                                            setDateFinal(e);
                                            setFecha2(formatDate(e));
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={4}>
                                <TextField
                                    margin="normal"
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Estado Multa"
                                    id="state"
                                    onChange={(e) => {
                                        setDataFiltro({
                                            state: parseInt(e.target.value),
                                            fechaInicial: fecha,
                                            fechaFinal: fecha2
                                        })
                                    }}
                                >
                                    {states.map((item: any, index) => (
                                        <MenuItem value={item.state} key={index}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>
                            <Col sm={2} className="mt-3">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary"
                                        onClick={() => { listaMultasRender(dataFiltro.state, fecha, fecha2) }}
                                    >
                                        FILTRAR
                                    </Button>
                                </ThemeProvider>
                            </Col>

                        </Row>
                    </div>
                    {
                        (showInfo && list.length > 0) ?
                            <div className="mt-3">
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Identificacion
                                                    </TableCell>
                                                    <TableCell>
                                                        Nombres y Apelllidos
                                                    </TableCell>
                                                    <TableCell>
                                                        Arma
                                                    </TableCell>
                                                    <TableCell>
                                                        Estado Multa
                                                    </TableCell>
                                                    <TableCell>
                                                        Serial
                                                    </TableCell>
                                                    <TableCell>
                                                        Cod Permiso/Seguridad
                                                    </TableCell>
                                                    <TableCell>
                                                        Fecha de Vencimiento
                                                    </TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {list
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: any, index: number) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell>{item.NIT}</TableCell>
                                                            <TableCell>{item.SURNAME1} - {item.SURNAME2}</TableCell>
                                                            <TableCell>{item.ARMA}</TableCell>
                                                            <TableCell>{item.ESTADOMULTA}</TableCell>
                                                            <TableCell>{item.SERIAL}</TableCell>
                                                            <TableCell>{item.CODIGOPERMISO} - {item.CODIGOSEGURIDAD}</TableCell>
                                                            <TableCell>{item.FECHAVENCIMIENTO}</TableCell>
                                                            <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup>
                                                                        {dataFiltro.state === 1 &&
                                                                            <ThemeProvider theme={inputsTheme}>
                                                                                <Tooltip title="Liquidar">
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        className="box-s mr-1 mt-2 mb-2"
                                                                                        color="secondary"
                                                                                        onClick={() => {
                                                                                            setMulta(item)
                                                                                            setShow(true);
                                                                                        }}>
                                                                                        <BsReceiptCutoff />
                                                                                    </Button>
                                                                                </Tooltip>
                                                                            </ThemeProvider>
                                                                        }
                                                                        {dataFiltro.state === 2 &&
                                                                            <ThemeProvider theme={inputsTheme}>
                                                                                <Tooltip title="Eximir">
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        className="box-s mt-2 mb-2"
                                                                                        color="secondary"
                                                                                        onClick={() => {
                                                                                            setEximir(item)
                                                                                            setShowEximir(true);

                                                                                        }}>
                                                                                        <BsFillFileEarmarkBreakFill />
                                                                                    </Button>
                                                                                </Tooltip>
                                                                            </ThemeProvider>}
                                                                    </ButtonGroup>
                                                                </div>
                                                                <div className="d-block d-lg-none">
                                                                    <SpeedDial
                                                                        ariaLabel="SpeedDial basic example"
                                                                        direction="left"
                                                                        FabProps={{
                                                                            size: "small",
                                                                            style: { backgroundColor: "#503464" },
                                                                        }}
                                                                        icon={<FiMoreVertical />}
                                                                    >

                                                                    </SpeedDial>
                                                                </div>

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
                                        count={list.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                            : (showInfo) && <div className="mt-5"><NoInfo /></div>
                    }
                </div>
            </div>
            {show &&
                <NEManageFines
                    setShow={closeModal}
                    show={show}
                    multa={multa}
                    dataFiltro={dataFiltro}
                    refresh={listaMultasRender}
                />
            }

            {showEximir &&
                <GenericConfirmAction
                    show={showEximir}
                    setShow={setShowEximir}
                    confirmAction={dataElement}
                    title="¿Seguro quiere eximir este pago?"
                />
            }

            {showSpiner &&

                <SSpinner show={showSpiner} />
            }
        </div>
    )
}

