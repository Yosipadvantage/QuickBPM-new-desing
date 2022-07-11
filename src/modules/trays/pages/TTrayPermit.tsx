import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

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
import { NoInfo } from "../../../utils/NoInfo";
import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    Tooltip,
    TextField,
} from "@mui/material";
import { BsArrowLeftRight, BsCloudDownloadFill, BsFillArrowUpSquareFill, BsFillCloudUploadFill, BsFillFileEarmarkMedicalFill, BsLayersFill, BsSearch, BsXSquare } from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import MProtocolo from "../components/MHistoric";
import MStateAntecedent from "../components/MStateAntecedent";
import MUploadPermit from "../components/MUploadPermit";
import MFilterPermit from "../components/MFilterPermit";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { Col, Modal, Row } from "react-bootstrap";
import { getSession } from "../../../utils/UseProps";
import { pipeSort } from "../../../utils/pipeSort";
import { Office } from "../../configuration/model/Office";
import { PDFPermissionReport } from "../components/PDFPermissionReport";

/**
 * Servicios
 */
const _configService = new ConfigService();
const _weaponService = new WeaponsService();

interface ITTrayPermit { }

const TTrayPermit: React.FC<ITTrayPermit> = () => {

    const [list, setList] = useState<any[]>([]); // Cambiar interface
    const [showFilterPermit, setShowFilterPermit] = useState(false);
    const [showUploadPermit, setShowUploadPermit] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [listOffice, setListOffice] = useState<any[]>([]);
    const [office, setOffice] = useState<number>(-1);
    const [officeName, setOfficeName] = useState<string>('');
    const [estado, setEstado] = useState<number>(4);
    const [numLote, setNumLote] = useState<string>('');
    const [reportObj, setReportObj] = useState<any>({});
    const [showReport, setShowReport] = useState(false);
    const [generateReport, setGenerateReport] = useState(false);
    const [listEstado, setListEstado] = useState([
        { id: 4, nombre: "DISPONIBLE" },
        { id: 5, nombre: "ASIGNADO" },
        { id: 6, nombre: "ANULADO" },
    ]);
    const [codeP, setCodeP] = useState('');
    // Tabla
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        getListOffice();
        setRowsPerPage(parseInt(items));
    }, [items]);


    /**
     * Metodo que pemite cerrar el Modal de Cargar Archivo
     * @param data
     */
    const closeUploadPermit = (data: any) => {
        setShowUploadPermit(data.view);
        if (data.idOffice) {
            const obj = {
                "IDOffice": data.idOffice,
                "Estado": data.state
            }
            getHojaPermisoCatalogPorPropiedades(obj);
        }
    };

    /**
     * Metodo que pemite cerrar el Modal de Buscar Permiso
     * @param data
     */
    const closeFilterPermit = (data: any) => {
        setShowFilterPermit(data.view);
        if (data.idOffice) {
            const obj = {
                "IDOffice": data.idOffice,
                "Estado": data.state
            }
            getHojaPermisoCatalogPorPropiedades(obj);
        }
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

    const getHojaPermisoCatalogPorPropiedades = (obj: any) => {
        setShowSpinner(true);
        _weaponService.getHojaPermisoCatalogPorPropiedades(obj).subscribe((resp) => {
            setShowSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setList(resp.DataBeanProperties.ObjectValue);
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

    const getEstadoNombre = (num: number) => {
        let name = '';
        listOffice.map((estado: any) => {
            if (estado.id === num) {
                name = estado.nombre;
            }
        })
        return name
    }

    const onSearch = (e: any) => {
        e.preventDefault();
        getHojaPermisoCatalogPorPropiedades({ 'CodigoPermiso': codeP });
    }

    const classes = useStyles();

    return (
        <div className="nWhite w-80 p-3 m-3">
            <header className="page-header page-header-light bg-light mb-0">
                <div className="container-fluid">
                    <div className="page-header-content pt-4 pb-10">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-12 d-flex justify-content-between mt-4">
                                <h1>Gestión Permisos</h1>
                                <div>
                                    <h1>{officeName}</h1>
                                </div>
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
                    <div className="card-filter-items">
                        <div className="card-filter-button">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<BsFillArrowUpSquareFill />}
                                    className="my-3"
                                    fullWidth
                                    onClick={() => {
                                        setShowUploadPermit(true)
                                    }}
                                >
                                    Subir formato
                                </Button>
                            </ThemeProvider>
                        </div>
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
                                        setShowReport(true)
                                    }}
                                >
                                    DESCARGAR PLANILLA
                                </Button>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
                <div className="card-filter">
                    <div className="card-filter-title">
                        <h2>Filtro de información</h2>
                    </div>
                    <Row className="d-flex justify-content-around">
                        <Col sm={6}>
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
                                            setShowFilterPermit(true);
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                </ThemeProvider>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <form >
                                <TextField
                                    value={codeP}
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    margin="normal"
                                    label="Buscar por Código Permiso"
                                    id="write"
                                    onChange={(e) => { setCodeP(e.target.value) }}
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
                </div>
            </div>
            {list.length > 0 ?
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
                                    <TableCell>Num. Lote</TableCell>
                                    <TableCell>Fecha Lote</TableCell>
                                    <TableCell>Código Permiso</TableCell>
                                    <TableCell>Código Seguridad</TableCell>
                                    <TableCell>Tipo Permiso</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Observaciones</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: any, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.DataBeanProperties.Lote}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Since}</TableCell>
                                            <TableCell>{item.DataBeanProperties.CodigoPermiso}</TableCell>
                                            <TableCell>{item.DataBeanProperties.CodigoSeguridad}</TableCell>
                                            <TableCell>{item.DataBeanProperties.NombreTipoPermiso}</TableCell>
                                            <TableCell>{item.DataBeanProperties.NombreEstado}</TableCell>
                                            <TableCell>{item.DataBeanProperties.Observaciones}</TableCell>
                                            <TableCell>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Tooltip title="Generar Planilla" placement="left">
                                                        <Button className="mt-2" variant="contained" color="secondary"
                                                            onClick={() => {
                                                                setReportObj({
                                                                    "IDOffice": office,
                                                                    "Estado": estado,
                                                                    "Lote": item.DataBeanProperties.Lote,
                                                                });
                                                                setNumLote(item.DataBeanProperties.Lote);
                                                                setGenerateReport(true);
                                                            }}
                                                        >
                                                            <BsFillFileEarmarkMedicalFill />
                                                        </Button>
                                                    </Tooltip>
                                                </ThemeProvider>
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
                : <NoInfo />
            }
            {showSpinner && <SSpinner show={showSpinner} />}
            {showUploadPermit && (
                <MUploadPermit
                    getShowMUploadPermit={closeUploadPermit}
                    dataShowMUploadPermit={showUploadPermit}
                />
            )}
            {showFilterPermit && (
                <MFilterPermit
                    getShowMFilterPermit={closeFilterPermit}
                    dataShowMFilterPermit={showFilterPermit}
                    estado={estado}
                    setEstado={setEstado}
                    officeName={officeName}
                    setOfficeName={setOfficeName}
                    office={office}
                    setOffice={setOffice}
                />
            )}
            {showReport &&
                <Modal
                    show={showReport}
                    onHide={() => setShowReport(false)}
                    size="lg"
                    centered
                     
                >
                    <Modal.Header>
                        GENERAR REPORTE
                        <BsXSquare className='pointer' onClick={() => setShowReport(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="container">
                            <Col sm={12} className="mt-2">
                                <Autocomplete
                                    onChange={(e: any, value: any) => { setOffice(value ? value.id : 0); setOfficeName(value ? value.label : '') }}
                                    fullWidth
                                    size="small"
                                    disablePortal
                                    defaultValue={officeName}
                                    id="seccionales"
                                    options={listOffice}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            key={params.id}
                                            label="Seleccione una secccional"
                                            fullWidth
                                            color="secondary"
                                        />
                                    )}
                                />
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={estado}
                                    margin="normal"
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Seleccione un estado"
                                    id="state"
                                    onChange={(e) => setEstado(parseInt(e.target.value))}
                                >
                                    {listEstado.map((item: any) => (
                                        <MenuItem value={item.id}>{item.nombre}</MenuItem>
                                    ))}
                                </TextField>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={numLote}
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    label="Número de lote *"
                                    id="state"
                                    onChange={(e) => setNumLote(e.target.value)}
                                >
                                </TextField>
                            </Col>
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        endIcon={<BsSearch />}
                                        className="my-3"
                                        fullWidth
                                        onClick={() => {
                                            setReportObj({
                                                "IDOffice": office,
                                                "Estado": estado,
                                                "Lote": numLote,
                                            });
                                            setGenerateReport(true);
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
            {generateReport &&
                <Modal show={generateReport}   centered   size="xl">
                    <Modal.Header>
                        REPORTE DE PERMISOS
                        <BsXSquare className='pointer' onClick={() => setGenerateReport(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="ml-2w-100 acta" >
                            <Col sm={12} className="w-100">
                                <PDFPermissionReport
                                    obj={reportObj}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
}

export default TTrayPermit;
