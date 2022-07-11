import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, Button, ButtonGroup, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { ConfigService } from '../../../core/services/ConfigService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { NoInfo } from '../../../utils/NoInfo';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { Office } from '../../configuration/model/Office';
import { IAgendaSeccional } from '../model/AgendaSeccional';
import { FiMoreVertical } from 'react-icons/fi';
import { NEAgenda } from '../components/NEAgenda';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';
import { formatDate } from '../../../utils/formatDate';
import { getSession } from '../../../utils/UseProps';
;

interface IAgenda { }

const _configService = new ConfigService();

export const TOpenAgenda: React.FC<IAgenda> = (props: IAgenda) => {

    const [seccional, setSeccional] = useState("");
    const [btn, setBtn] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [listOffice, setListOffice] = useState<any[]>([]);
    const [listAgenda, setListAgenda] = useState<any[]>([]);
    const [busy, setBusy] = useState<any[]>([]);
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [officeSelected, setofficeSelected] = useState(-1);
    const [agenda, setAgenda] = useState<IAgendaSeccional | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [idDelete, setIdDelete] = useState(0);
    const [titleNE, setTitleNE] = useState("");
    const [showNE, setShowNE] = useState(false);
    const [fecha, setFecha] = useState("");
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
        getListOffice();
        setRowsPerPage(parseInt(items));


    }, []);

    useEffect(() => {
        getListAgenda(fecha);
    }, [officeSelected]);

    const getListAgenda = (fecha: string) => {
        setShowSpinner(true);
        let aux: number[] = [];
        console.log(officeSelected, fecha);
        _configService.getAgendaSeccional(officeSelected, fecha).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                resp.map((item: IAgendaSeccional) => {
                    aux.push(item.Hora)
                })
                setBusy(aux);
                setListAgenda(resp);
            }
            else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }

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

    const deleteAgenda = () => {
        _configService.deleteAgenda(idDelete).subscribe((resp) => {
            if (resp) {
                getListAgenda(fecha);
                Toast.fire({
                    icon: "success",
                    title: "Se ha eliminado con existe",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteAgenda();
        }
    };

    ;

    const recortarFecha = (fecha: Date) => {
        const fecha2 = fecha.toString();
        return fecha2.slice(0, 10);
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
                                        <h1>Abrir agenda para la seccional <b>{seccional}</b> </h1>
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
                                                disablePast
                                                label="Seleccione una fecha "
                                                value={dateInit}
                                                onChange={(e) => {
                                                    setDateInit(e);
                                                    setFecha(formatDate(e));
                                                    getListAgenda(formatDate(e));
                                                    setBtn(true);
                                                }}
                                                renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </Col>}
                                {btn && (
                                    <button
                                        className="btn btn-sm btn-outline-secondary btn-custom"
                                        type="button"
                                        onClick={() => {
                                            setTitleNE('Crear');
                                            setShowNE(true);
                                        }}
                                    >
                                        <BsPlus />
                                    </button>
                                )}
                            </Row>
                        </div>
                        {showSpinner
                            ? <div>
                                <SSpinner
                                    show={showSpinner}
                                />
                            </div>
                            : listAgenda.length > 0 ? (
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
                                                    <TableCell>Fecha (AAAA/MM/DD)</TableCell>
                                                    <TableCell>Hora</TableCell>
                                                    <TableCell>Cantidad de citas / hora</TableCell>
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
                                                    .map((item: IAgendaSeccional) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>
                                                                {item.IDAgendaSeccional}
                                                            </TableCell>
                                                            <TableCell>
                                                                {recortarFecha(item.FechaDia)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.Hora}:00
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.Cantidad}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.EstadoNombre}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup>
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Editar elemento">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="secondary"
                                                                                    onClick={() => {
                                                                                        setAgenda(item);
                                                                                        setTitleNE('Editar');
                                                                                        setShowNE(true);
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
                                                                                        setIdDelete(
                                                                                            item.IDAgendaSeccional
                                                                                        );
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
                                                                            key={item.IDAgendaSeccional}
                                                                            icon={<BsPencilSquare />}
                                                                            tooltipTitle="Editar elemento"
                                                                            onClick={() => {
                                                                                setAgenda(item);
                                                                                setTitleNE('Editar');
                                                                                setShowNE(true);
                                                                            }}
                                                                        />
                                                                        <SpeedDialAction
                                                                            key={item.IDAgendaSeccional + 1}
                                                                            icon={<BsTrash />}
                                                                            tooltipTitle="Eliminar elemento"
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(
                                                                                    item.IDAgendaSeccional
                                                                                );
                                                                            }}
                                                                        />
                                                                        )
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
                            ) : listAgenda.length === 0 && officeSelected !== -1 && dateInit !== null ? (
                                <div className="mt-10">
                                    <NoInfo />
                                </div>
                            ) : (
                                ""
                            )}
                    </div>
                </main>
            </div>
            {showNE && <NEAgenda
                show={showNE}
                setShow={setShowNE}
                dataTitle={titleNE}
                fecha={fecha}
                busy={busy}
                IDOffice={officeSelected}
                Agenda={agenda}
                refresh={getListAgenda}
            />}
            {showDelete && (
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"¿Está seguro de eliminar el elemento?"}
                />
            )}
        </>
    );
};
