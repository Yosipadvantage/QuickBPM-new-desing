import React, { useEffect, useState } from "react";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { Col, Modal, Row } from 'react-bootstrap';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, ButtonGroup, IconButton, InputAdornment, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import { BsArrowLeftShort, BsBookmark, BsCaretUpFill, BsFileEarmarkPdfFill, BsFileEarmarkSpreadsheetFill, BsFileEarmarkTextFill, BsFileEarmarkXFill, BsFillCreditCard2FrontFill, BsFillFileEarmarkFill, BsSearch, BsX, BsXCircleFill, BsXSquare } from 'react-icons/bs';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { Toast } from "../../../utils/Toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { NoInfo } from "../../../utils/NoInfo";
import { SSpinner } from "../../../shared/components/SSpinner";
import { IProduct } from "../model/product";
import { DataItemCiudadano } from "../model/item-ciudadano.interface";
import { PDFTrumatic } from "../components/PDFTrumatic";
import MUploadRecord from "../components/MUploadRecord";
import PDFRegisterTraumatic from "../components/PDFRegisterTraumatic";
import { formatDate } from "../../../utils/formatDate";

interface ITWeapon { }

const PORTE: number = 1;
const TENENCIA: number = 2;
const ESPECIAL: number = 3;

const _weaponService = new WeaponsService();

export const TWeaponCitizen: React.FC<ITWeapon> = (props: ITWeapon) => {

    const [cases, setCases] = useState(0);
    const [spinner, setSpinner] = useState(false);
    const [showPermission, setShowPermission] = useState(false);
    const [devolucion, setDevolucion] = useState(false);
    const [idCitizen, setIdCitizen] = useState(0);
    const [type, setType] = useState(0);
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [dateFinal, setDateFinal] = useState<Date | null>(null);
    const [itemData, setItemData] = useState<any>();
    const [nameCitizen, setNameCitizen] = useState('');
    const [showUser, setShowUser] = useState(false);
    const [showMUploadRecord, setShowMUploadRecord] = useState(false);
    const [records, setRecords] = useState<DataItemCiudadano[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [user, setUser] = useState<any>({});
    const [producto, setProducto] = useState<IProduct>();
    const [dataActa, setDataActa] = useState<any>({});
    const [dataAttach, setDataAttach] = useState<any>({});
    const [typeAttach, setTypeAttach] = useState(0);

    const [marking, setMarking] = useState(false);

    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setRowsPerPage(parseInt(items));
    }, [items])

    const closeSearch = (data: any) => {
        setShowUser(data);
    };

    const getItem = (data: any) => {
        setIdCitizen(data.IDAccount);
        setNameCitizen(data.EntityName);
        setUser(data);
    };

    const closeMUploadRecord = (data: any) => {
        setShowMUploadRecord(data);
    }

    const getItemsPorCiudadano = () => {
        let aux: any[] = [];
        setSpinner(true);
        _weaponService.getItemsPorCiudadano(idCitizen, dateInit !== null ? formatDate(dateInit) : null, dateFinal !== null ? formatDate(dateFinal) : null).subscribe(resp => {
            setSpinner(false);
            if (resp) {
                console.log(resp);
                resp.forEach((item: DataItemCiudadano) => {
                    console.log(item.Propiedades);
                    if (item.Propiedades) {
                        let obj;
                        obj = JSON.parse(item.Propiedades);
                        console.log(obj, item);
                        if (item.NombreProducto == "TRAUMATICA") {
                            item.ItemEstado = obj.EstadoTraumatica.nombreEstado;
                        } else {
                            item.ItemEstado = "NO APLICA";
                        }
                    } else {
                        item.ItemEstado = "NO APLICA";
                    }
                });
                setRecords(resp);
                setCases(1);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getProducto = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorIDProducto(idProducto).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                setProducto(resp[0]);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const onNext = () => {
        if (nameCitizen === '') {
            Toast.fire({
                icon: 'warning',
                title: 'No hay persona seleccionada'
            });
        } else {
            getItemsPorCiudadano();
        }
    };

    const getDataAttach = (data: any) => {
        let propiedades = JSON.parse(data.Propiedades);
        const obj = {
            "fileCuerpo": propiedades.Documentos[0],
            "fileSerie": propiedades.Documentos[1],
            "acc": (propiedades.DataArma.Accesorios.length > 0),
            "obs": (propiedades.DataArma.Observaciones.length > 0),
            "acessorios": propiedades.DataArma.Accesorios,
            "observacion": propiedades.DataArma.Observaciones,
        };
        setDataAttach(obj);
        setDevolucion(true);
    };

    const onBack = () => {
        setDateInit(null);
        setDateFinal(null);
        setNameCitizen('');
        setCases(0);
    };

    const classes = useStyles();

    const renderSwitch = () => {
        switch (cases) {
            case 0:
                return (
                    <div className="container d-flex justify-content-center">
                        <form>
                            <Row className="card box-s m-3 d-block">
                                <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                    <h1>CONSULTAR ARMAS</h1>
                                </Col>
                                <Col sm={12} className="mt-3 mb-3">
                                    <TextField
                                        size="small"
                                        value={nameCitizen}
                                        label=".:Usuario:. *"
                                        fullWidth
                                        color="secondary"
                                        id="distributionChanel"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowUser(true)}>
                                                        <BsSearch />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        onClick={() => setShowUser(true)}
                                    />
                                </Col>
                                <Col sm={12} className="mb-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-100" variant="contained" color="secondary" onClick={(e) => { onNext() }}>
                                            SIGUIENTE
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        </form>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <Row>
                            <Col sm={12}>
                                <div className="text-center mb-4">
                                    <div>
                                        <h2>Documento: {user.Nit}</h2>
                                        <h2>Nombre: {user.EntityName}</h2>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {records.length > 0 ?
                            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Marca</TableCell>
                                                {/* <TableCell>Marca</TableCell> */}
                                                <TableCell>Serial</TableCell>
                                                <TableCell>Estado Arma de fuego</TableCell>
                                                <TableCell>Estado Traumatica</TableCell>
                                                {/* <TableCell>Almacén de descargo</TableCell> */}
                                                <TableCell>Fecha de descargo</TableCell>
                                                <TableCell>Documentos</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {records
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((item: any) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.NombreProducto}</TableCell>
                                                        {/* <TableCell>{JSON.parse(item.DataBeanProperties.Propiedades).EstadoTraumatica}</TableCell> */}
                                                        <TableCell>{item.Serial}</TableCell>
                                                        <TableCell>{item.NombreProducto == 'TRAUMATICA' ? 'NO APLICA' : item.NombreEstado}</TableCell>
                                                        <TableCell>{item.ItemEstado}</TableCell>
                                                        {/* <TableCell>{item.NombreAlmacen}</TableCell> */}
                                                        <TableCell>{item.FechaDocumentoSalida}</TableCell>
                                                        <TableCell>{
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <ButtonGroup>
                                                                    {item.ItemEstado === 'NO APLICA' &&
                                                                        <Tooltip title="Descargar permiso" placement="right">
                                                                            <IconButton color="secondary" onClick={() => { /* setShowPermission(true); getProducto(item.IDProducto); */ }}>
                                                                                <BsFillCreditCard2FrontFill />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    }
                                                                    {/* {item.ItemEstado === 'MARCADO' &&
                                                                        <Tooltip title="Generar Acta de Marcaje" placement="right">
                                                                            <IconButton
                                                                                color="secondary"
                                                                            >
                                                                                <BsFileEarmarkTextFill />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    } */}
                                                                    {item.ItemEstado === 'PENDIENTE POR MARCAR' &&
                                                                        <Tooltip title="Acta de Marcaje" placement="right">
                                                                            <IconButton color="secondary" onClick={() => { setMarking(true); setDataActa(item) }}>
                                                                                <BsFillFileEarmarkFill />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    }
                                                                    {item.ItemEstado === 'EN DEVOLUCION' &&
                                                                        <ButtonGroup>
                                                                            <Tooltip title="Generar Acta de Devolución" placement="left">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setDataActa(item); getDataAttach(item); setTypeAttach(0) }}
                                                                                >
                                                                                    <BsFileEarmarkTextFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Generar Acta de Devolución POR LOTE" placement="top">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setDataActa(item); getDataAttach(item); setTypeAttach(1) }}
                                                                                >
                                                                                    <BsFileEarmarkSpreadsheetFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Subir documentos devolución" placement="right">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setShowMUploadRecord(true); setItemData(item); }}
                                                                                >
                                                                                    <BsCaretUpFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </ButtonGroup>
                                                                    }
                                                                    {item.ItemEstado === 'EN DEVOLUCIÓN' &&
                                                                        <ButtonGroup>
                                                                            <Tooltip title="Generar Acta de Devolución" placement="left">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setDataActa(item); getDataAttach(item); setTypeAttach(0) }}
                                                                                >
                                                                                    <BsFileEarmarkTextFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Generar Acta de Devolución POR LOTE" placement="top">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setDataActa(item); getDataAttach(item); setTypeAttach(1) }}
                                                                                >
                                                                                    <BsFileEarmarkSpreadsheetFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Subir documentos devolución" placement="right">
                                                                                <IconButton
                                                                                    color="secondary"
                                                                                    onClick={() => { setShowMUploadRecord(true); setItemData(item); }}
                                                                                >
                                                                                    <BsCaretUpFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </ButtonGroup>
                                                                    }
                                                                </ButtonGroup>
                                                            </ThemeProvider>
                                                        }</TableCell>
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
                        {showMUploadRecord && (
                            <MUploadRecord
                                getShowMUploadRecord={closeMUploadRecord}
                                dataShowMUploadRecord={showMUploadRecord}
                                dataItemData={itemData}
                                docType={user.DocType}
                            />
                        )}
                    </div>
                )
            case 2: return (
                <>
                    <div>
                        <Row>
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary" onClick={() => setCases(1)}>
                                        <BsArrowLeftShort className="mr-2" />
                                        ATRAS
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </div>
                </>
            )
        }
    };

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="mt-10">
                    <div className="text-center">
                        {cases === 1 && <h1><b></b></h1>}
                    </div>
                    <Row>
                        {cases === 1 &&
                            <Col sm={12} className="mt-1 mb-1 d-flex justify-content-start">
                                <div>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className="mt-3" variant="contained" color="secondary" onClick={() => { onBack() }}>
                                            <BsArrowLeftShort className="mr-2" />
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
            {
                /* para el commit */
                showUser &&
                <SSearchPerson
                    getShow={closeSearch}
                    getPerson={getItem}
                    dataShow={showUser}
                    create={false}
                />
            }
            {spinner && <SSpinner show={spinner} />}
            {
                showPermission &&
                <Modal show={showPermission}   centered   size="sm" onHide={() => setShowPermission(false)}>
                    <Modal.Header>
                        Tipo de Permisos
                        <BsXSquare className='pointer' onClick={() => setShowPermission(false)} />
                    </Modal.Header>
                    <form onSubmit={(e) => { }}>
                        <Modal.Body>
                            <Row className="mt-3" >
                                <Col sm={12}>
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        select
                                        fullWidth
                                        color="secondary"
                                        label="Tipo de permiso"
                                        id="state"
                                        onChange={(e) => setType(parseInt(e.target.value))}
                                    >
                                        <MenuItem value={PORTE}>
                                            PORTE
                                        </MenuItem>
                                        <MenuItem value={TENENCIA}>
                                            TENENCIA
                                        </MenuItem>
                                    </TextField>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="w-100" variant="contained" color="secondary" onClick={() => { setCases(2); setShowPermission(false); }}>
                                    CONFIRMAR
                                </Button>
                            </ThemeProvider>
                        </Modal.Footer>
                    </form>
                </Modal>
            }
            {
                devolucion &&
                <Modal show={devolucion}   centered   size="xl">
                    <Modal.Header>
                        ACTA DE DEVOLUCIÓN
                        <BsXSquare className='pointer' onClick={() => setDevolucion(false)} />
                    </Modal.Header>
                    <form onSubmit={(e) => { }}>
                        <Modal.Body>
                            <Row className="ml-2w-100 acta" >
                                <Col sm={12} className="w-100">
                                    <PDFTrumatic dataActa={dataActa} dataSolicitante={user} dataAttach={dataAttach} type={typeAttach} />
                                </Col>
                            </Row>
                        </Modal.Body>
                    </form>
                </Modal>
            }
            {
                marking &&
                <Modal show={marking}   centered   size="xl">
                    <Modal.Header>
                        ACTA DE MARCAJE
                        <BsXSquare className='pointer' onClick={() => setMarking(false)} />
                    </Modal.Header>
                    <form onSubmit={(e) => { }}>
                        <Modal.Body>
                            <Row className="ml-2w-100 acta" >
                                <Col sm={12} className="w-100">
                                    <PDFRegisterTraumatic dataObj={dataActa} />
                                </Col>
                            </Row>
                        </Modal.Body>
                    </form>
                </Modal>
            }
        </>
    );
};
