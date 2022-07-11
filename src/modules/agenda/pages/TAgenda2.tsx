import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, Button, ButtonGroup, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ConfigService } from '../../../core/services/ConfigService';
import { Col, Row } from 'react-bootstrap'; import { SSpinner } from '../../../shared/components/SSpinner';
import { NoInfo } from '../../../utils/NoInfo';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { Office } from '../../configuration/model/Office';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import { BsClockHistory, BsXSquare } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { MRescheduleAgenda } from '../components/MRescheduleAgenda';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { formatDate } from '../../../utils/formatDate';
import { getSession } from '../../../utils/UseProps';

export const TAgenda = () => {


    const [seccional, setSeccional] = useState("");
    const [show, setShow] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [listOffice, setListOffice] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [page, setPage] = useState(0);
    const [fecha, setFecha] = useState("");
    const [officeSelected, setofficeSelected] = useState(-1);
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [listAgenda, setListAgenda] = useState<any[]>([]);
    const [idAgenda, setIdAgenda] = useState(0);
    const [idDelete, setIdDelete] = useState(10);

    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const _configService = new ConfigService();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getListOffice();
    }, [items]);

    useEffect(() => {
        /* getListAgenda(fecha); */
    }, [officeSelected]);

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setRowsPerPage(parseInt(items));
    };

    const getListOffice = () => {
        setShowSpinner(true);
        let aux: any = [];
        let auxSorted: any = [];
        _configService.getSeccionalUsuario(getSession().IDAccount).subscribe((resp) => {
            setShowSpinner(false);
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

    const getListAgenda = (fecha: string) => {
        setShowSpinner(true);
        console.log(officeSelected, fecha);
        _configService.bandejaCitas(officeSelected, fecha).subscribe((resp: any) => {
            setShowSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                if (resp.DataBeanProperties.ObjectValue.length > 0) {
                    console.log(resp.DataBeanProperties.ObjectValue);
                    setListAgenda(resp.DataBeanProperties.ObjectValue);
                } else {
                    setListAgenda([]);
                }
            }
            else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const recortarFecha = (fecha: Date) => {
        const fecha2 = fecha && fecha.toString();
        return fecha2.slice(0, 10);
    };

    const cancelMeetings = () => {
        _configService.cancelarCita(idDelete).subscribe((resp: any) => {
            if (resp.cancelado === true) {
                getListAgenda(fecha);
                Toast.fire({
                    icon: "success",
                    title: "Se ha eliminado con éxito!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        });
    };

    const cancelMeet = (data: boolean) => {
        if (data) {
            cancelMeetings();
        }
    };

    const classes = useStyles();

    return (
        <>
            <div className="nWhite w-80 p-3 m-3">
                <main>
                    <header className="page-header page-header-light bg-light mb-0">
                        <div className="container-fluid">
                            <div className="page-header-content pt-4 pb-10">
                                <div className="row">
                                    <div className="col-auto mt-4">
                                        <h1>Agenda para Seccional - {seccional}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="px-5  mt-2">
                        <div className="card p-2 mb-3 box-s">
                            <Row className="mb-1 d-flex">
                                <Col sm={6} className="ml-2 d-flex justify-content-center mt-3 mb-3">
                                    <Autocomplete
                                        onChange={(e, value) => { setofficeSelected(value ? value.id : 0); setSeccional(value ? value.label : ""); }}
                                        fullWidth
                                        size="small"
                                        disablePortal
                                        id="seccionales"
                                        options={listOffice}
                                        renderInput={(params) => (
                                            <TextField
                                                key={params.id}
                                                {...params}
                                                label="Seleccione una secccional"
                                                fullWidth
                                                color="secondary"
                                            />
                                        )}
                                    />
                                </Col>
                                {officeSelected !== -1 &&
                                    <Col sm={5} className="mt-3 mb-3">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                /* disablePast */
                                                label="Seleccione una fecha "
                                                value={dateInit}
                                                onChange={(e) => {
                                                    setDateInit(e);
                                                    setFecha(formatDate(e));
                                                    getListAgenda(formatDate(e));
                                                }}
                                                renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </Col>
                                }
                            </Row>
                        </div>

                        {listAgenda.length > 0 &&
                            <div>
                                <Paper sx={{ width: "100%", overflow: "auto" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table
                                            stickyHeader
                                            aria-label="sticky table"
                                            className={classes.root}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Alphacode</TableCell>
                                                    <TableCell>Trámite</TableCell>
                                                    <TableCell>Solicitante</TableCell>
                                                    <TableCell>Fecha (AAAA/MM/DD)</TableCell>
                                                    <TableCell>Hora</TableCell>
                                                    <TableCell>Estado</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {listAgenda
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((item: any) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>
                                                                {item.DataBeanProperties.IDAGENDA}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.DataBeanProperties.ALPHACODE}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.DataBeanProperties.NOMBRETRAMITE}
                                                            </TableCell>
                                                            <TableCell>
                                                                <b>{item.DataBeanProperties.Nit}</b>
                                                                <br />
                                                                {item.DataBeanProperties.NAME1} {item.DataBeanProperties.NAME2} {item.DataBeanProperties.SURNAME1} {item.DataBeanProperties.SURNAME2}
                                                            </TableCell>
                                                            <TableCell>
                                                                {recortarFecha(item.DataBeanProperties.FECHADIA)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.DataBeanProperties.HORA}:00 hrs
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.DataBeanProperties.EstadoNombre}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup>
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Re-programar Cita">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="secondary"
                                                                                    onClick={() => {
                                                                                        setShow(true);
                                                                                        setIdAgenda(item.DataBeanProperties.IDAGENDA);
                                                                                    }}>
                                                                                    <BsClockHistory />
                                                                                </Button>
                                                                            </Tooltip>
                                                                        </ThemeProvider>
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Cancelar Cita">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setShowCancel(true);
                                                                                        setIdDelete(item.IDAgenda);
                                                                                    }}>
                                                                                    <BsXSquare className='pointer' />
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
                                                                            key={item.IDAgendaSeccional}
                                                                            icon={<BsClockHistory />}
                                                                            tooltipTitle="Re-programar Cita"
                                                                            onClick={() => {
                                                                                setShow(true);
                                                                                setIdAgenda(item.DataBeanProperties.IDAGENDA);
                                                                            }}
                                                                        />
                                                                        <SpeedDialAction
                                                                            key={item.IDAgendaSeccional + 1}
                                                                            icon={<BsXSquare />}
                                                                            tooltipTitle="Cancelar Cita"
                                                                            onClick={() => {
                                                                                setShowCancel(true);
                                                                                setIdDelete(item.IDAgenda);
                                                                            }}
                                                                        />
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
                                        component="div"
                                        count={listAgenda.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                        }
                        {(officeSelected !== null && dateInit !== null && listAgenda.length === 0) &&
                            <NoInfo />
                        }
                    </div>
                </main>
            </div>
            {show &&
                <MRescheduleAgenda show={show} setShow={setShow} idAgenda={idAgenda} fecha={fecha} refresh={getListAgenda} />
            }
            {showCancel &&
                <GenericConfirmAction title="¿Está seguro de cancelar la cita?" show={showCancel} setShow={setShowCancel} confirmAction={cancelMeet} />
            }
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
        </>
    )
}
