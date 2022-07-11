import React, { useEffect, useState } from "react";
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
    BsArrowLeftRight,
    BsArrowRepeat,
    BsCaretRightFill,
    BsCloudDownloadFill,
    BsFillCloudUploadFill,
    BsLayersFill,
    BsSearch,
} from "react-icons/bs";
import { formatDate } from "../../../utils/formatDate";
import MProtocolo from "../components/MHistoric";
import MUpdateAntecedent from "../components/MUpdateAntecedent";
import { MFilterAntecedent } from "../components/MFilterAntecedent";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import MDownloadFormat from "../components/MDownloadFormat";
import { Marcaje } from "../model/marcaje.interface";
import { MweaponDetail as MWeapoDetail, MweaponDetail } from "../components/MWeaponDetail";
import { getSession } from "../../../utils/UseProps";
import MFilterTray from "../components/MFilterTray";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface ITTrayMarking { }

const TTrayMarking: React.FC<ITTrayMarking> = () => {

    const [idAntecedente, setIDAntecedente] = useState(0);
    const [formdata, setFormdata] = useState<any>();
    const [item, setItem] = useState<any>();
    const [list, setList] = useState<Marcaje[]>([]);
    const [showDownloadFormat, setShowDownloadFormat] = useState(false);
    const [showProtocolo, setShowProtocolo] = useState(false);
    const [showUpdateAntecedent, setShowUpdateAntecedent] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showWeaponDetail, setShowWeaponDetail] = useState(false)


    /**
     *Document upload states, please user media, context, and beanDoc as a you need.
     */
    const [media, setMedia] = useState("");
    const [context, setContex] = useState("");
    const [beanDoc, setBeanDoc] = useState<any>();
    const [showLoad, setShowLoad] = useState(false);

    // Tabla
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        bandejaIndumilRender(null, new Date(), new Date());
        setRowsPerPage(parseInt(items));
    }, [items]);

    const bandejaIndumilRender = (state:any, todayInit: Date, todayFinal: Date) => {
        setShowSpinner(true);
        _configService.bandejaIndumilRender(state, formatDate(todayInit), formatDate(todayFinal)).subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                setList(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const subirArchivoIndumilMarca = (context: string, media: string) => {
        setShowSpinner(true);
        _configService.subirArchivoIndumilMarca(context, media, parseInt(getSession().IDAccount)).subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                bandejaIndumilRender(null, new Date(), new Date());
                Toast.fire({
                    icon: "success",
                    title: "Se ha subido el archivo",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    /**
     * Metodo que permite enviar el media y context
     * @param doc 
     */
    const getMedia = (doc: any) => {
        if (doc) {
            /* setMedia(doc.Media);
            setContex(doc.MediaContext);
            setBeanDoc(doc); */
            console.log(doc);
            subirArchivoIndumilMarca(doc.MediaContext, doc.Media);
            Toast.fire({
                icon: "success",
                title: "Docuemento seleccionado",
            });
        }
    };

    /**
     * Metodo que pemite cerrar el Modal Protocolo
     * @param data
     */
    const closeProtocolo = (data: any) => {
        setShowProtocolo(data);
    };

    /**
     * Metodo que permite cerrar Modal UpdateAntecedent
     * @param data booleano que viede de respuesta al cerrar el modal
     */
    const closeUpdateAntecedent = (data: any) => {
        /* getAntecedentesRender(); */
        setShowUpdateAntecedent(data);
    };

    /**
     * Metodo que permite cerrar Modal Filter
     * @param data booleano que viede de respuesta al cerrar el modal
     */
    const closeFilterTray = (show: any, item: any, type: number) => {
        console.log(show, item, type);
        setShowSearch(show);
        if( type === 1 ){
            bandejaIndumilRender(item.Estado, item.FechaInicial, item.FechaFinal);
        }        
    };

    /**
     * Metodo que permite abrir el modal de actualizar antecedente
     */
    const handleUpdate = () => {
        setShowUpdateAntecedent(true);
    };

    /**
     * Metodo que permite abrir el modal de actualizar antecedente
     */
    const handleSearch = () => {
        setShowSearch(true);
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

    const closeDownloadFormat = (data: any) => {
        console.log(data);
        setShowDownloadFormat(data);
    };

    const classes = useStyles();

    return (
        <div className="nWhite w-80 p-3 m-3">
            <header className="page-header page-header-light bg-light mb-0">
                <div className="container-fluid">
                    <div className="page-header-content pt-4 pb-10">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-auto mt-4">
                                <h1>Bandeja de Marcaje</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="card-item-filter">
                <div className="card-filter">
                    <div className="card-filter-title">
                        <h2>Formatos</h2>
                    </div>
                    <div className="card-filter-items3">
                        <div className="card-filter-button">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsCloudDownloadFill />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => {
                                        setShowDownloadFormat(true)
                                    }}
                                >
                                    Descargar formato
                                </Button>
                            </ThemeProvider>
                        </div>
                        <div className="card-filter-button">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsFillCloudUploadFill />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => { setShowLoad(true) }}
                                >
                                    Subir formato
                                </Button>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
                <div className="card-filter">
                    <div className="card-filter-title">
                        <h2>Filtro de información</h2>
                    </div>
                    <div className="card-filter-items2">
                        <div className="card-filter-button">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsSearch />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => {
                                        handleSearch();
                                    }}
                                >
                                    Buscar
                                </Button>
                            </ThemeProvider>
                        </div>
                        {/* <div className="card-filter-button">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsArrowRepeat />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => {
                                        handleUpdate();
                                    }}
                                >
                                    Actualizar
                                </Button>
                            </ThemeProvider>
                        </div> */}
                    </div>
                </div>
            </div>
            {showSpinner ? (
                <SSpinner show={showSpinner} />
            ) : list.length > 0 ? (
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ height: "70vh" }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            className={classes.root}
                        >
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>ID</TableCell> */}
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>ALPHACODE</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: any, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.NIT}</TableCell>
                                            <TableCell>
                                                {item.NAME1} {item.NAME2} {item.SURNAME1}{" "}
                                                {item.SURNAME2}
                                            </TableCell>
                                            <TableCell>{item.ALPHACODE}</TableCell>
                                            <TableCell>{item.ESTADONOMBRE}</TableCell>
                                            {/* <TableCell>{item.FECH}</TableCell> */}
                                            <TableCell>
                                                <ButtonGroup>
                                                    <ThemeProvider theme={inputsTheme}>
                                                        <Tooltip title="Cambiar estado">
                                                            <Button
                                                                variant="contained"
                                                                className="box-s mr-1 mt-2 mb-2"
                                                                color="secondary"
                                                                onClick={() => { setItem(item); setShowWeaponDetail(true) }}
                                                            >
                                                                {<BsCaretRightFill />}
                                                            </Button>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                </ButtonGroup>
                                                {/* <div className="d-lg-flex d-none">
                                                    <ButtonGroup>
                                                        <ThemeProvider theme={inputsTheme}>
                                                            <Tooltip title="Variables de respuesta">
                                                                <Button
                                                                    variant="contained"
                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                    color="secondary"
                                                                    onClick={() => {
                                                                        setShowProtocolo(true);
                                                                        setFormdata(item)
                                                                    }}
                                                                >
                                                                    {<BsLayersFill />}
                                                                </Button>
                                                            </Tooltip>
                                                        </ThemeProvider>
                                                    </ButtonGroup>
                                                    {(item.ESTADO === 1) && (
                                                        <ButtonGroup>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Tooltip title="Cambiar estado">
                                                                    <Button
                                                                        variant="contained"
                                                                        className="box-s mr-1 mt-2 mb-2"
                                                                        color="secondary"
                                                                        onClick={() => {
                                                                            setShowStateAntecedent(true);
                                                                            setIDAntecedente(item.IDANTECEDENTES)
                                                                        }}
                                                                    >
                                                                        {<BsArrowLeftRight />}
                                                                    </Button>
                                                                </Tooltip>
                                                            </ThemeProvider>
                                                        </ButtonGroup>
                                                    )}
                                                </div> */}
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
            ) : list.length === 0 ? (
                <NoInfo />
            ) : (
                ""
            )}
            {showProtocolo && (
                <MProtocolo
                    getShowMProtocolo={closeProtocolo}
                    dataShowMProtocolo={showProtocolo}
                    dataObjProtocolo={formdata}
                />
            )}
            {showUpdateAntecedent && (
                <MUpdateAntecedent
                    getShowMUpdateAntecedent={closeUpdateAntecedent}
                    dataShowMUpdateAntecedent={showUpdateAntecedent}
                />
            )}
            {showSearch && (
                <MFilterTray
                    getShowMFilterTray={closeFilterTray}
                    dataShowMFilterTray={showSearch}
                    dataType={2} // 1 Bandeja de Antecedentes, 2 Bandeja de Marcaje, 3 Bandeja de Impresión
                />
            )}
            <SLoadDocument
                setShow={setShowLoad}
                type={1}
                title={"Marcaje"}
                getMedia={getMedia}
                show={showLoad}
                beanAction={null}
                accept={[".xlsx"]}
            />
            {showDownloadFormat && (
                <MDownloadFormat
                    getShowMDownloadFormat={closeDownloadFormat}
                    dataShowMDownloadFormat={showDownloadFormat}
                    dataType={2} // 1 si es la Bandeja de Antecedentes, 2 si es Bandeja Marcaje
                />
            )}
            {showWeaponDetail &&
                <MweaponDetail show={showWeaponDetail} setShow={setShowWeaponDetail} data={item} refresh={bandejaIndumilRender} />
            }
        </div>
    );
};

export default TTrayMarking;
