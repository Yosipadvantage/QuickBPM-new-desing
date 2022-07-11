import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    Tooltip,
    TextField,
} from "@mui/material";
import { NoInfo } from "../../../utils/NoInfo";
// Redux
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
// Toast
import { Toast } from "../../../utils/Toastify";
// Servicio
import { ConfigService } from "../../../core/services/ConfigService";
import {
    BsArrowLeftShort,
    BsFillCreditCard2FrontFill,
    BsFillPatchCheckFill,
    BsFillXCircleFill,
    BsSearch,
    BsXSquare,
} from "react-icons/bs";
import { formatDate } from "../../../utils/formatDate";
import { Impresion } from "../model/impresion.interface";
import { Col, Modal, Row } from "react-bootstrap";
import { SSpecialPermission } from "../../weapons/pages/SSpecialPermission";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { IBandejaImpresion } from "../model/bandejaImpresion-interface";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { getSession } from "../../../utils/UseProps";
import { pipeSort, pipeSortIDAce, pipeSortIDDec } from "../../../utils/pipeSort";

/**
 * Servicios
 */
const _configService = new ConfigService();
const _weaponService = new WeaponsService();

const PORTE: any = { cod: 1, render: 'PORTE' };
const TENENCIA: any = { cod: 2, render: 'TENENCIA' };
const POR_IMPRIMIR = 1;
const IMPRESO = 2;
const ENTREGADO = 3;
const APROBADO_SI: number = 5;
const APROBADO_NO: number = 6;
const APROBADO_PENDIENTE: number = 7;
const listEstadoImpresion = [
    { id: 1, nombre: "POR_IMPRIMIR" },
    { id: 2, nombre: "IMPRESOS" },
    { id: 3, nombre: "ENTREGADOS" },
    { id: 4, nombre: "ANULADOS" },
];
const listAprobCiu = [
    { id: 5, nombre: "APROBADO_SI" },
    { id: 6, nombre: "APROBADO_NO" },
    { id: 7, nombre: "APROBADO_PENDIENTE" },
];

interface ITrayPrint { }

const TTrayPrint: React.FC<ITrayPrint> = () => {

    const [list, setList] = useState<Impresion[]>([]);
    const [showSpinner, setShowSpinner] = useState(false);
    /* const [showPermission, setShowPermission] = useState(false); */
    const [render, setRender] = useState(0);
    const [typePermission, setTypePermission] = useState(0);
    const [person, setPerson] = useState<any>({});
    const [itemBandeja, setItemBandeja] = useState<IBandejaImpresion>();
    const [dataArma, setDataArma] = useState<any>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAnulacion, setShowAnulacion] = useState(false);
    const [obs, setObs] = useState('');
    const [identificacion, setIdentificacion] = useState<number | null>(null);
    const [codes, setCodes] = useState<any>({});
    const [dataFilter, setDataFilter] = useState<any>({});
    const [idOffice, setIdOffice] = useState(-1);
    const [listOffice, setListOffice] = useState<any[]>([]);
    const [estado, setEstado] = useState<number | null>(null);
    const [estadoCiu, setEstadoCiu] = useState<number | null>(null);

    // Tablas
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        /* bandejaImpresionRender(null, null, new Date(), new Date(), null); */
        getSeccionalesUsuario(getSession().IDAccount);
        setRowsPerPage(parseInt(items));
    }, [items]);

    useEffect(() => {
        setDataFilter({
            Office: idOffice,
            Estado: estado,
            AprobadoCiu: estadoCiu,
            FechaInicial: new Date(),
            FechaFinal: new Date()
        });
        bandejaImpresionRender(idOffice, estado, estadoCiu, new Date(), new Date(), null);
    }, [idOffice, estado, estadoCiu]);

    const getSeccionalesUsuario = (idAccount: number) => {
        setShowSpinner(true);
        _configService.getSeccionalesUsuario(idAccount).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                const aux = pipeSort(
                    [
                        ...resp.map((sec) => {
                            return { label: sec.Name, id: sec.IDOffice };
                        }),
                    ],
                    "id"
                );
                setListOffice(aux);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la accion",
                });
            }
        });
    };

    const bandejaImpresionRender = (
        idOffice: number,
        state: any,
        stateCiu: any,
        todayInit: Date,
        todayFinal: Date,
        cedula: number | null
    ) => {
        setShowSpinner(true);
        _configService
            .bandejaImpresionRender(
                idOffice,
                state,
                stateCiu,
                formatDate(todayInit),
                formatDate(todayFinal),
                cedula
            )
            .subscribe((resp) => {
                console.log(resp);
                setShowSpinner(false);
                if (resp) {
                    if (state === POR_IMPRIMIR) {
                        setList(pipeSortIDAce([...resp], 'IDBANDEJAIMPRESION'));
                    } else if (state === IMPRESO) {
                        setList(pipeSortIDDec([...resp], 'IDBANDEJAIMPRESION'));
                    } else {
                        setList(pipeSortIDAce([...resp], 'IDBANDEJAIMPRESION'));
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            });
    };

    /**
     * Metodo de paginador para la tabla
     * @param event
     * @param newPage
     */
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const classes = useStyles();

    const generateData = (item: IBandejaImpresion, type: number) => {
        console.log(item);
        setItemBandeja(item);
        setTypePermission(item.TIPOPERMISO);
        getDataArma(item.IDITEM, item.FECHDOCUMENTO);
        let dataPerson: any = {};
        dataPerson.idAccount = item.IDACCOUNT;
        dataPerson.Name1 = item.NAME1;
        dataPerson.Name2 = item.NAME2;
        dataPerson.Surname1 = item.SURNAME1;
        dataPerson.Surname2 = item.SURNAME2;
        dataPerson.Nit = item.NIT;
        /* item.ESTADO = 2; */
        setItemBandeja(item);
        setPerson(dataPerson);
        type === 1 ? setRender(1) : setShowAnulacion(true);
    };

    const getDataArma = (idItem: number, fechaDocumento: string) => {
        setShowSpinner(true);
        _weaponService.getItem(idItem, fechaDocumento).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                if (resp.DataBeanProperties.ObjectValue) {
                    console.log(resp.DataBeanProperties.ObjectValue);
                    let propiedades = JSON.parse(
                        resp.DataBeanProperties.ObjectValue.DataBeanProperties.Propiedades
                    );
                    console.log(propiedades);
                    propiedades.DataArma.IDItem = idItem;
                    propiedades.DataArma.fechaDocumento = fechaDocumento;
                    /* propiedades.DataArma.DocType = idItem; */
                    if (
                        resp.DataBeanProperties.ObjectValue.DataBeanProperties
                            .IDProducto === 9
                    ) {
                        //IDTRAUMATICA DESDE PROPIEDADES DEL SISTEMA
                        propiedades.DataArma.Serial =
                            resp.DataBeanProperties.ObjectValue.DataBeanProperties.SerialIndumil;
                    } else {
                        propiedades.DataArma.Serial =
                            resp.DataBeanProperties.ObjectValue.DataBeanProperties.Serial;
                        propiedades.DataArma.IDProducto =
                            resp.DataBeanProperties.ObjectValue.DataBeanProperties.IDProducto;
                        propiedades.DataArma.Fire = true;
                        setDataArma(propiedades.DataArma);
                        console.log(propiedades.DataArma);
                    }
                }
                /* setDataArma(resp); */
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const anularPermiso = () => {
        if ((itemBandeja ? itemBandeja.IDHOJAPERMISO : 0) === null) {
            setShowSpinner(true);
            let bean: any = itemBandeja ? itemBandeja : null;
            let aux: any = bean;
            aux.IDBandejaImpresion = bean.IDBANDEJAIMPRESION;
            aux.AprobadoCiu = APROBADO_SI;
            aux.APROBADOCIU = APROBADO_SI;
            aux.Estado = 1;
            aux.ESTADO = 1;
            _weaponService.updateBandejaImpresion(aux)
                .subscribe((resp) => {
                    setShowSpinner(false);
                    if (resp) {
                        bandejaImpresionRender(idOffice, null, null, new Date(), new Date(), null);
                        setShowAnulacion(false);
                        Toast.fire({
                            icon: 'success',
                            title: 'Se ha completado la acción'
                        });
                    } else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'No se ha podido completar la acción'
                        });
                    }
                })
        } else {
            setShowSpinner(true);
            _weaponService.anularPermiso((itemBandeja ? itemBandeja.IDHOJAPERMISO : 0), (itemBandeja ? itemBandeja.IDBANDEJAIMPRESION : 0), getSession().IDAccount, obs)
                .subscribe((resp) => {
                    setShowSpinner(false);
                    if (resp) {
                        bandejaImpresionRender(dataFilter.Office, dataFilter.Estado, dataFilter.AprobadoCiu, dataFilter.FechaInicial, dataFilter.FechaFinal, null)
                        setShowAnulacion(false);
                        Toast.fire({
                            icon: 'success',
                            title: 'Se ha completado la acción'
                        })
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: 'ERROR INTERNO DEL SERVIDOR'
                        })
                    }
                })
        }
    }

    const anularPermisoConfirm = (data: boolean) => {
        if (data) {
            anularPermiso();
        }
    }

    const getHojaPermiso = (item: any) => {
        //ByPass
        if (item.IDHOJAPERMISO === null) {
            setCodes({
                CodigoPermiso: '',
                CodigoSeguridad: ''
            });
        } else {
            setShowSpinner(true);
            _weaponService.getHojaPermiso((item.IDHOJAPERMISO))
                .subscribe((resp) => {
                    setShowSpinner(false);
                    if (resp.DataBeanProperties.ObjectValue) {
                        setCodes({
                            CodigoPermiso: resp.DataBeanProperties.ObjectValue.DataBeanProperties.CodigoPermiso,
                            CodigoSeguridad: resp.DataBeanProperties.ObjectValue.DataBeanProperties.CodigoSeguridad,
                        });
                    } else {
                        setCodes({
                            CodigoPermiso: '',
                            CodigoSeguridad: ''
                        });
                        Toast.fire({
                            icon: 'error',
                            title: 'ERROR INTERNO DEL SERVIDOR'
                        })
                    }
                })
        }
    }

    const updateBandeja = (bean: IBandejaImpresion) => {
        setShowSpinner(true);
        let aux: any = bean;
        aux.IDBandejaImpresion = bean.IDBANDEJAIMPRESION;
        aux.AprobadoCiu = APROBADO_SI;
        aux.APROBADOCIU = APROBADO_SI;
        _weaponService.updateBandejaImpresion(aux)
            .subscribe((resp) => {
                setShowSpinner(false);
                if (resp) {
                    bandejaImpresionRender(idOffice, null, null, new Date(), new Date(), null);
                    Toast.fire({
                        icon: 'success',
                        title: 'Simulación realiaza'
                    });
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'No se ha podido completar la acción'
                    });
                }
            })
    }

    const filtrarPorIdentificacion = () => {
        //funcion render para el filtro por identificacion
        bandejaImpresionRender(idOffice, null, null, new Date(), new Date(), identificacion);
    }

    const onSearch = (e: any) => {
        e.preventDefault();
        filtrarPorIdentificacion();
    }

    const renderSwitch = () => {
        switch (render) {
            case 0:
                return (
                    <div>
                        <div className="card w-100 p-3">
                            <Row className="d-flex justify-content-around">
                                <div className="col-4">
                                    <h6>Seleccione una seccional</h6>
                                </div>
                                <div className="col-8">
                                    <h6>Filtrar por:</h6>
                                </div>
                                <Col sm={4}>
                                    <Row>
                                        <Col sm={6}>
                                            <Autocomplete
                                                onChange={(e, value) => {
                                                    if (value) {
                                                        setIdOffice(parseInt(value.id));
                                                    }
                                                }}
                                                fullWidth
                                                size="small"
                                                disablePortal
                                                id="seccionales"
                                                options={listOffice}
                                                renderInput={(data) => (
                                                    <TextField
                                                        {...data}
                                                        key={data.id}
                                                        className="mt-3 mb-3"
                                                        label="Seccional"
                                                        fullWidth
                                                        color="secondary"
                                                    />
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={8}>
                                    <Row>
                                        <Col sm={4}>
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                select
                                                fullWidth
                                                color="secondary"
                                                label="Seleccione un estado de impresión"
                                                id="state"
                                                onChange={(e) => setEstado(parseInt(e.target.value))}
                                            >
                                                {listEstadoImpresion.map((item: any) => (
                                                    <MenuItem value={item.id}>{item.nombre}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Col>
                                        <Col sm={4}>
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                select
                                                fullWidth
                                                color="secondary"
                                                label="Seleccione un estado de aprobación"
                                                id="state"
                                                onChange={(e) => setEstadoCiu(parseInt(e.target.value))}
                                            >
                                                {listAprobCiu.map((item: any) => (
                                                    <MenuItem value={item.id}>{item.nombre}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Col>
                                        <Col sm={4}>
                                            <form >
                                                <TextField
                                                    type='number'
                                                    value={identificacion}
                                                    size="small"
                                                    fullWidth
                                                    color="secondary"
                                                    margin="normal"
                                                    label="Buscar por Identificación"
                                                    id="write"
                                                    onChange={(e) => { setIdentificacion(parseInt(e.target.value)) }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton type="submit" onClick={(e) => onSearch(e)}>
                                                                    <BsSearch />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </form>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        {(list.length > 0 && idOffice !== -1) ? (
                            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table
                                        stickyHeader
                                        aria-label="sticky table"
                                        className={classes.root}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell> {/*   QUITAR EN PRODUCCION */}
                                                <TableCell>Trámite</TableCell>
                                                <TableCell>Solicittante</TableCell>
                                                <TableCell>Arma</TableCell>
                                                <TableCell>Tipo Permiso</TableCell>
                                                <TableCell>Estado Aprob.</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Imprimir Permiso</TableCell>
                                                {/* <TableCell>Acciones</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {list
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                )
                                                .map((item: any) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.IDBANDEJAIMPRESION}</TableCell>
                                                        <TableCell>
                                                            {item.ALPHACODE}
                                                            <br />
                                                            {item.NOMBRETRAMITE}
                                                        </TableCell>
                                                        <TableCell>{item.NIT} <br /> {item.NAME1} {item.NAME2} {item.SURNAME1} {item.SURNAME2}</TableCell>
                                                        <TableCell>{item.Arma}</TableCell>
                                                        <TableCell>
                                                            {item.TIPOPERMISO === PORTE.cod && PORTE.render}
                                                            {item.TIPOPERMISO === TENENCIA.cod && TENENCIA.render}
                                                        </TableCell>
                                                        <TableCell>{item.APROBADONOMBRE}</TableCell>
                                                        <TableCell>{item.ESTADONOMBRE}</TableCell>
                                                        <TableCell>
                                                            {(item.ESTADO === 1 && item.APROBADOCIU === APROBADO_SI) && (
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="IMPRIMIR PERMISO">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="secondary"
                                                                                onClick={() => {
                                                                                    generateData(item, 1);
                                                                                }}
                                                                            >
                                                                                {<BsFillCreditCard2FrontFill />}
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
                                                                </ButtonGroup>
                                                            )}
                                                            {(item.ESTADO === 1 && item.APROBADOCIU === APROBADO_NO) && (
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="CAMBIAR DATOS">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="secondary"
                                                                                onClick={() => {

                                                                                }}
                                                                            >
                                                                                {<BsFillCreditCard2FrontFill />}
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
                                                                </ButtonGroup>
                                                            )}
                                                            {(item.ESTADO === 1 && item.APROBADOCIU === APROBADO_PENDIENTE) && (
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="SIMULAR APROBACIÓN">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="primary"
                                                                                onClick={() => { updateBandeja(item) }}
                                                                            >
                                                                                {<BsFillPatchCheckFill />}
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
                                                                </ButtonGroup>
                                                            )}
                                                            {(item.ESTADO === 2) && (
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="ANULAR PERMISO">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="error"
                                                                                onClick={() => { getHojaPermiso(item); generateData(item, 2); }}
                                                                            >
                                                                                {<BsFillXCircleFill />}
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
                                                                </ButtonGroup>
                                                            )}
                                                            {item.ESTADO === 4 && (
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="RE-IMPRIMIR">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="secondary"
                                                                                onClick={() => { generateData(item, 1); }}
                                                                            >
                                                                                {<BsFillCreditCard2FrontFill />}
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
                                                                </ButtonGroup>
                                                            )}
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
                        ) : (idOffice !== -1 && <NoInfo />)
                        }
                    </div>
                );
            case 1:
                return (
                    <div>
                        <Row>
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { setRender(0); bandejaImpresionRender(idOffice, null, null, new Date(), new Date(), null); }}
                                    >
                                        <BsArrowLeftShort className="mr-2" />
                                        ATRAS
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                            <SSpecialPermission
                                proCD={true}
                                person={person}
                                dataArma={dataArma}
                                type={typePermission}
                                itemBandeja={itemBandeja}
                            />
                        </div>
                    </div>
                );
            default:
                break;
        }
    };

    return (
        <>
            <div className="nWhite w-80 p-3 m-3">
                <header className="page-header page-header-light bg-light mb-0">
                    <div className="container-fluid">
                        <div className="page-header-content pt-4 pb-10">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1>Bandeja de Impresión</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main>{renderSwitch()}</main>
            </div>
            {showConfirm && (
                <GenericConfirmAction
                    show={showConfirm}
                    setShow={setShowConfirm}
                    confirmAction={anularPermisoConfirm}
                    title={"Está apunto de asignar el permiso ¿Desea continuar?"}
                />
            )}
            {showAnulacion &&
                <Modal show={showAnulacion}   centered onHide={() => setShowAnulacion(false)} >
                    <Modal.Header>
                        ANULAR PERMISO
                        <BsXSquare className='pointer' onClick={() => setShowAnulacion(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <b className="ml-3">Campo obligatorio *</b>
                            <Col sm={12} className="mt-3">
                                <fieldset className="d-flex flex-column">
                                    <legend>Datos del permiso</legend>
                                    <div>
                                        <small> <b>ASIGNADO A:</b> </small> : <small>{`${person.Surname1} ${person.Surname2} ${person.Name1} ${person.Name2} `}</small>
                                    </div>
                                    <div>
                                        <small> <b>IDENTIFICACIÓN:</b> </small> : <small>{`${person.Nit}`}</small>
                                    </div>
                                    <div>
                                        <small> <b>SERIAL DEL ARMA</b> </small> : <small>{`${dataArma.Serial}`}</small>
                                    </div>
                                    <div className="mt-3">
                                        <small> <b>COD PERMISO</b> </small> : <h5>{`${codes.CodigoPermiso}`}</h5>
                                    </div>
                                    <div>
                                        <small> <b>COD SEGURIDAD</b> </small> : <h5>{`${codes.CodigoSeguridad}`}</h5>
                                    </div>
                                </fieldset>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    id="Description"
                                    color="secondary"
                                    placeholder="¿Por qué razón(es) se anula el permiso?"
                                    label="Observaciones *"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    onChange={(e) => setObs(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mr-3" variant='contained' color="error" onClick={() => setShowAnulacion(false)}>
                            CANCELAR
                        </Button>
                        <Button variant='contained' color="success" onClick={() => {
                            if (obs.trim().length > 0) {
                                setShowConfirm(true)
                            } else {
                                Toast.fire({
                                    icon: "warning",
                                    title: "Debe ingresar observaciones"
                                })
                            }
                        }}>
                            CONFIRMAR
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            {showSpinner && <SSpinner show={showSpinner} />}
        </>
    );
};

export default TTrayPrint;
