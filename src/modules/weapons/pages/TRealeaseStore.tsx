import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { formatDate } from '../../../utils/formatDate';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';

interface IRealeaseStore { }

const _weaponService = new WeaponsService();

export const TRealeaseStore: React.FC<IRealeaseStore> = (props: IRealeaseStore) => {

    const [render, setRender] = useState(0);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateUpto, setDateUpto] = useState<Date | null>(null);
    const [states, setStates] = useState<any[]>([]);
    const [state, setState] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [records, setRecords] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getStates();
    }, [items])

    const getStates = () => {
        setSpinner(true);
        _weaponService.listarEstadosPorSalidaAlmacen().subscribe(resp => {
            console.log(resp);
            if (resp) {
                console.log(resp);
                setStates(resp.DataBeanProperties.ObjectValue);
                setSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getRecords = () => {
        setSpinner(true);
        _weaponService.getSalidaAlmacenByState(formatDate(dateFrom), formatDate(dateUpto), parseInt(state)).subscribe(resp => {
            console.log(resp);
            if (resp) {
                console.log(resp);
                setRecords(resp.DataBeanProperties.ObjectValue);
                setSpinner(false);
                setRender(1);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const onNext = (e: any) => {
        e.preventDefault();
        if (dateFrom === null || dateUpto === null) {
            Toast.fire({
                icon: "warning",
                title: "Debe llenar todos los campos",
            });
        } else if (state === '') {
            Toast.fire({
                icon: "warning",
                title: "Debe llenar todos los campos",
            });
        }
        else {
            getRecords();
        }
    };

    const onBack = () => {
        setDateFrom(null);
        setDateUpto(null);
        setRender(0);
    };

    const classes = useStyles();

    const renderSwitch = () => {
        switch (render) {
            case 0: return (
                <div className="d-flex justify-content-center">
                    <form>
                        <Row className="card box-s m-3 d-block">
                            <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                <h1>..::CONSULTAR REGISTROS DE SALIDA A ALMACÉN::..</h1>
                            </Col>
                            <Col sm={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Desde: "
                                        value={dateFrom}
                                        onChange={(e) => {
                                            setDateFrom(e);
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Hasta: "
                                        value={dateUpto}
                                        onChange={(e) => {
                                            setDateUpto(e);
                                        }}
                                        renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    margin="normal"
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Estado"
                                    id="state"
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    {states.map((item: any) => (
                                        <MenuItem value={item.DataBeanProperties.Value}>
                                            {item.DataBeanProperties.Property}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>
                            <Col sm={8} className="mb-3 ml-12 d-flex justify-content-center">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button type="submit" className="mt-3 w-100" variant="contained" color="secondary" onClick={(e) => { onNext(e) }}>
                                        CONSULTAR
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </form>
                </div>
            )
            case 1: return (
                <div>
                    {records.length > 0 ?
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ height: "70vh" }}>
                                <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>No. Ref</TableCell>
                                            <TableCell>Fecha documento</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Fecha anulación</TableCell>
                                            <TableCell>Obs. anulación</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {records
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item: any) => (
                                                <TableRow hover role="checkbox" tabIndex={-1}>
                                                    <TableCell>{item.DataBeanProperties.IDSalidaAlmacen}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.NoSalidaRef}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.FechaDocumento}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.NombreEstado}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.FechaAnulacion}</TableCell>
                                                    <TableCell>{item.DataBeanProperties.ObsAnulado}</TableCell>
                                                    {/* <TableCell>
                                                        <div className="d-lg-flex d-none">
                                                            <ButtonGroup>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Editar elemento">
                                                                        <Button
                                                                            variant="contained"
                                                                            className="box-s mr-1 mt-2 mb-2"
                                                                            color="secondary"
                                                                            onClick={() => {
                                                                                formComponent("Editar", item);
                                                                            }}>
                                                                            <BsPencilSquare />
                                                                        </Button>
                                                                    </Tooltip>
                                                                </ThemeProvider>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Eliminar elemento">
                                                                        <Button
                                                                            variant="contained"
                                                                            className="box-s mr-1 mt-2 mb-2"
                                                                            color="error"
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(item.IDOffice)
                                                                            }}>
                                                                            <BsTrash />
                                                                        </Button>
                                                                    </Tooltip>
                                                                </ThemeProvider>
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
                                                                <SpeedDialAction
                                                                    key={item.IDOffice + 6}
                                                                    sx={{ color: "secondary" }}
                                                                    icon={<BsPencilSquare />}
                                                                    tooltipTitle="Editar"
                                                                    onClick={() => {
                                                                        formComponent("Editar", item);
                                                                    }}
                                                                />
                                                                <SpeedDialAction
                                                                    key={item.IDOffice + 7}
                                                                    icon={<BsTrash />}
                                                                    tooltipTitle="Eliminar seccional"
                                                                    onClick={() => {
                                                                        setShowDelete(true);
                                                                        setIdDelete(item.IDOffice)
                                                                    }}
                                                                />
                                                                <SpeedDialAction
                                                                    key={item.IDOffice + 8}
                                                                    icon={<HiOutlineOfficeBuilding />}
                                                                    tooltipTitle="Ver Trámites"
                                                                    onClick={() => {
                                                                        setShowModalTramits(true);
                                                                        setIdOffice(item.IDOffice);
                                                                        setNameOffice(item.Name);
                                                                    }}
                                                                />
                                                                )
                                                            </SpeedDial>
                                                        </div>
                                                    </TableCell> */}
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
                        : <div><NoInfo /></div>
                    }
                </div>
            )
            default:
                <div>

                </div>
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="mt-10 container">
                    <Row>
                        {render === 1 &&
                            <Col sm={12} className="mt-1 mb-1 d-flex justify-content-start">
                                <div>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className="mt-3" variant="contained" color="secondary" onClick={() => { onBack() }}>
                                            ATRAS
                                        </Button>
                                    </ThemeProvider>
                                </div>
                            </Col>}
                        <Col sm={12}>
                            {renderSwitch()}
                        </Col>
                    </Row>
                </div>
            </div>
            {spinner &&
                <SSpinner show={spinner} />
            }
        </>
    )
}
