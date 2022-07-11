import React, { useEffect, useState } from "react";
import {
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
  BsArrowLeftRight,
  BsArrowRepeat,
  BsCloudDownloadFill,
  BsFillCloudUploadFill,
  BsFillFunnelFill,
  BsLayersFill,
  BsSearch,
} from "react-icons/bs";
import { formatDate } from "../../../utils/formatDate";
import MProtocolo from "../components/MHistoric";
import { Antecedente } from "../model/antecedente.interface";
import MUpdateAntecedent from "../components/MUpdateAntecedent";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import MStateAntecedent from "../components/MStateAntecedent";
import MDownloadFormat from "../components/MDownloadFormat";
import { MFilterAntecedent } from "../components/MFilterAntecedent";
import MFilterTray from "../components/MFilterTray";
import { resetForms } from "../../../actions/FormActions";
import { BsHandIndexThumb } from "react-icons/bs";
import { AiOutlineReload } from "react-icons/ai";
import { MdOutlineCleaningServices } from "react-icons/md";
import { height } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface ITTTrayAntecedent { }

const TTrayAntecedent: React.FC<ITTTrayAntecedent> = () => {
  const [idAntecedente, setIDAntecedente] = useState<number | null>(0);
  const [formdata, setFormdata] = useState<any>();
  const [list, setList] = useState<Antecedente[]>([]);
  const [showDownloadFormat, setShowDownloadFormat] = useState(false);
  const [showProtocolo, setShowProtocolo] = useState(false);
  const [showUpdateAntecedent, setShowUpdateAntecedent] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showStateAntecedent, setShowStateAntecedent] = useState(false);

  const [showLoad, setShowLoad] = useState(false);

  // Tabla
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [seleccionado, setSeleccionado] = useState<number[]>([]);
  const [listEstado, setListEstado] = useState([
    { id: 1, nombre: "PENDIENTE VALIDACION" },
    { id: 2, nombre: "CON ANTECEDENTES" },
    { id: 3, nombre: "SIN ANTECEDENTES" },
    { id: 10, nombre: "EN VERIFICACIÓN" },
  ]);
  const [initialState, setInitialState] = useState<Antecedente[]>([]);

  const [estadoFiltro, setEstadoFiltro] = useState<number | null>(1);
  const [fechaInicial, setFechaInicial] = useState<Date | null>(null);
  const [fechaFinal, setFechaFinal] = useState<Date | null>(null);
  const [nit, setNit] = useState<number | null>(null);
  const [corte, setCorte] = useState<number | null>(null);



  useEffect(() => {
    getAntecedentesRender(estadoFiltro, null, null);
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getAntecedentesRender = (estado: number | null, fechaInit: Date | null, fechaFin: Date | null) => {
    setShowSpinner(true);
    _configService.getAntecedentesRender(estado, fechaInit ? formatDate(fechaInit) : null, fechaFin ? formatDate(fechaFin) : null).subscribe((resp) => {
      setShowSpinner(false);
      if (resp) {
        setList(resp);
        setInitialState(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const cargarArchivoAntecedentes = (
    state: number,
    context: string,
    media: string
  ) => {
    setShowSpinner(true);
    _configService
      .cargarArchivoAntecedentes(state, context, media)
      .subscribe((resp) => {
        console.log(resp);
        setShowSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          getAntecedentesRender(estadoFiltro, fechaInicial, fechaFinal);
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
      console.log(0, doc.MediaContext, doc.Media);
      cargarArchivoAntecedentes(0, doc.MediaContext, doc.Media);
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
    getAntecedentesRender(estadoFiltro, fechaInicial, fechaFinal);
    setShowUpdateAntecedent(data);
  };

  /**
   * Metodo que permite cerrar Modal FilterAntecedent
   * @param data booleano que viede de respuesta al cerrar el modal
   */
  const closeFilterAntecedent = (data: any) => {
    setShowSearch(data);
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

  /**
   * Metodo que pemite cerrar el Modal de Cambio de Estado
   * @param data
   */
  const closeStateAntecedent = (data: any) => {
    setShowStateAntecedent(data);
    setSeleccionado([])
    getAntecedentesRender(estadoFiltro, null, null);
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

  const handleSeleccionado = (id: number): void => {
    if (seleccionado.includes(id)) {
      const resto = seleccionado.filter((item) => item !== id);
      setSeleccionado([...resto]);
    } else {
      setSeleccionado([...seleccionado, id]);
    }
  };
  const handleMultiSeleccion = () => {
    if (seleccionado.length > 0) {
      setSeleccionado([]);
    } else {
      const resto = list
        .filter((item) => item.ESTADO === 10)
        .map((rest) => {
          return rest.IDANTECEDENTES;
        });
      setSeleccionado([...resto]);
    }
  };

  const handleFilter = () => {
    if (estadoFiltro != null && estadoFiltro > 0) {
      setList(initialState.filter((user) => user.ESTADO === estadoFiltro));
    } else if (estadoFiltro === 0) {
      setList(initialState);
    }
  };

  useEffect(() => {
    console.log("LISTA DE SELECCIONADOS", seleccionado);
  }, [seleccionado]);

  useEffect(() => {
    getAntecedentesRender(estadoFiltro, fechaInicial, fechaFinal);
  }, [estadoFiltro]);

  const getAntecedentesIdentificacionRender = () => {
    setShowSpinner(true);
    _configService.getAntecedentesIdentificacionRender(nit).subscribe((resp) => {
      setShowSpinner(false);
      if (resp) {
        setList(resp);
        setInitialState(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getAntecedentesCorteRender = () => {
    setShowSpinner(true);
    _configService.getAntecedentesCorteRender(corte).subscribe((resp) => {
      setShowSpinner(false);
      if (resp) {
        setList(resp);
        setInitialState(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  return (
    <div className="nWhite w-80 p-3 m-3">
      <header className="page-header page-header-light bg-light mb-0">
        <div className="container-fluid">
          <div className="page-header-content pt-4 pb-10">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1>Bandeja de Antecedentes</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="card-item-filter-top">
        {/* <div className="card-filter row">
          <div className="card-filter-title col-md-12">
            <h2>Formatos</h2>
          </div>
          <div className="col-12">
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
                    setShowDownloadFormat(true);
                  }}
                >
                  Descargar formato
                </Button>
              </ThemeProvider>
            </div>
          </div>
          <div className="col-6">
            <h4> <b>Usuarios Seleccionados</b> </h4>
            <h2>{seleccionado.length}</h2>
          </div>
          <div className="col-6">
            <div className="card-filter-button">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillCloudUploadFill />}
                  className="my-3"
                  fullWidth
                  disabled={seleccionado.length === 0 ? true : false}
                  onClick={() => {
                    setShowStateAntecedent(true);
                    setIDAntecedente(null);
                  }}
                >
                  Actualizar estados
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </div> */}
        <div className="card-filter">
          <div className="card-filter-title">
            <h2>Filtro de información</h2>
          </div>
          <div className="">
            <div className="antecedentes__filter__grid">
              <div className="antecedentes__filter__grid__selector">
                <TextField
                  value={estadoFiltro}
                  size="small"
                  margin="normal"
                  select
                  fullWidth
                  style={{ width: "40%" }}
                  color="secondary"
                  label="Seleccione un estado"
                  id="stateFiltter"
                  onChange={(e) => {
                    setEstadoFiltro(parseInt(e.target.value));
                  }}
                >
                  {listEstado.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    label="Fecha Inicial: "
                    value={fechaInicial}
                    onChange={(e) => {
                      setFechaInicial(e)
                    }}
                    renderInput={(props) => <TextField className="mt-2" style={{ width: "20%" }} size="small" fullWidth color="secondary" {...props} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    label="Fecha Final: "
                    value={fechaFinal}
                    onChange={(e) => {
                      setFechaFinal(e);
                    }}
                    renderInput={(props) => <TextField className="mt-2" style={{ width: "20%" }} size="small" fullWidth color="secondary" {...props} />}
                  />
                </LocalizationProvider>
                <ThemeProvider theme={inputsTheme}>
                  <Tooltip title="Limpiar Filtro">
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      style={{ width: "20%", marginTop: 7 }}
                      endIcon={<BsFillFunnelFill />}
                      onClick={() => {
                        getAntecedentesRender(estadoFiltro, fechaInicial, fechaFinal);
                      }}
                    >
                      APLICAR FILTRO
                    </Button>
                  </Tooltip>
                </ThemeProvider>
              </div>
              <div className="antecedentes__filter__grid__selector">
                <TextField
                  value={nit}
                  size="small"
                  margin="normal"
                  type="number"
                  fullWidth
                  style={{ width: "25%" }}
                  color="secondary"
                  label="Buscar por identificación"
                  id="id_antecedentes"
                  onChange={(e) => {
                    setNit(parseInt(e.target.value));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => {
                          if (nit !== null && !isNaN(nit)) {
                            getAntecedentesIdentificacionRender();
                          } else {
                            Toast.fire({
                              icon: 'warning',
                              title: 'Debe introducir una identificacion'
                            })
                          }
                        }}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                >
                </TextField>
                <TextField
                  value={corte}
                  size="small"
                  margin="normal"
                  type="number"
                  fullWidth
                  style={{ width: "25%" }}
                  color="secondary"
                  label="Buscar por # corte"
                  id="corte"
                  onChange={(e) => {
                    setCorte(parseInt(e.target.value));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => {
                          if (corte !== null && !isNaN(corte)) {
                            getAntecedentesCorteRender();
                          } else {
                            Toast.fire({
                              icon: 'warning',
                              title: 'Debe introducir un número de corte'
                            })
                          }
                        }}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                >
                </TextField>
                {/* <div style={{ width: "10%" }} >
                  <h4> <b>Usuarios Seleccionados</b> </h4>
                  <h2>{seleccionado.length}</h2>
                </div> */}
                <div className=" d-flex flex-row justify-content-end" style={{ width: "50%" }}>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="mr-3"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      endIcon={<BsCloudDownloadFill />}
                      style={{ width: "25%" }}
                      fullWidth
                      onClick={() => {
                        setShowDownloadFormat(true);
                      }}
                    >
                      Descargar formato
                    </Button>
                  </ThemeProvider>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="mr-3"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      endIcon={<BsFillCloudUploadFill />}
                      style={{ width: "25%" }}
                      fullWidth
                      disabled={seleccionado.length === 0 ? true : false}
                      onClick={() => {
                        setShowStateAntecedent(true);
                        setIDAntecedente(null);
                      }}
                    >
                      Actualizar estados
                    </Button>
                  </ThemeProvider>
                </div>
                {/* <ThemeProvider theme={inputsTheme}>
                  <Tooltip title="Limpiar Filtro">
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      endIcon={<MdOutlineCleaningServices />}
                      style={{ width: "20%", marginTop: 7 }}
                      onClick={() => {
                        setEstadoFiltro(null);
                        handleFilter();
                      }}
                    ></Button>
                  </Tooltip>
                </ThemeProvider> */}
              </div>
              {/* <ThemeProvider theme={inputsTheme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsSearch />}
                  className="my-3"
                  fullWidth
                  onClick={() => {
                    handleFilter();
                    console.log(list);
                  }}
                >
                  Buscar
                </Button>
              </ThemeProvider> */}
            </div>
          </div>
        </div>
      </div >
      {
        showSpinner ? (
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
                    <TableCell>Estado</TableCell>
                    <TableCell>Trámite</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>No. Corte</TableCell>
                    <TableCell>
                      <ThemeProvider theme={inputsTheme}>
                        <Button
                          /* disabled={estadoFiltro !== 10} */
                          type="submit"
                          variant="contained"
                          color="secondary"
                          endIcon={<BsHandIndexThumb />}
                          className=""
                          fullWidth
                          onClick={handleMultiSeleccion}
                        >
                          {seleccionado.length > 0
                            ? "Limpiar"
                            : "Todos"
                          }
                        </Button>
                      </ThemeProvider>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Incio del cuerpo de la tabla  */}
                  {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any, index: number) => (
                      <TableRow
                        hover
                        role="checkbox"
                        className={
                          seleccionado.includes(item.IDANTECEDENTES)
                            ? "seleccionado"
                            : ""
                        }
                        tabIndex={-1}
                      >
                        <TableCell>{item.NIT}</TableCell>
                        <TableCell>
                          {item.NAME1} {item.NAME2} {item.SURNAME1}{" "}
                          {item.SURNAME2}
                        </TableCell>
                        <TableCell>{item.NOMBREESTADO}</TableCell>
                        <TableCell>{item.TRAMITE}</TableCell>
                        <TableCell>{item.FECH}</TableCell>
                        <TableCell>{item.CORTE}</TableCell>
                        <TableCell>
                          <div className="d-lg-flex d-none">
                            <ButtonGroup>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Variables de respuesta">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      setShowProtocolo(true);
                                      setFormdata(item);
                                    }}
                                  >
                                    {<BsLayersFill />}
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                            </ButtonGroup>
                            {item.ESTADO === 10 && (
                              <>
                                <ButtonGroup>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Cambiar estado">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        disabled={seleccionado.length > 0}
                                        onClick={() => {
                                          setShowStateAntecedent(true);
                                          handleSeleccionado(item.IDANTECEDENTES);
                                        }}
                                      >
                                        {<BsArrowLeftRight />}
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                </ButtonGroup>
                                <ButtonGroup>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Seleccionar">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          handleSeleccionado(item.IDANTECEDENTES);
                                        }}
                                      >
                                        {<BsHandIndexThumb />}
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                </ButtonGroup>
                              </>
                            )}
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
        ) : list.length === 0 ? (
          <NoInfo />
        ) : (
          ""
        )}
      {
        showProtocolo && (
          <MProtocolo
            getShowMProtocolo={closeProtocolo}
            dataShowMProtocolo={showProtocolo}
            dataObjProtocolo={formdata}
          />
        )
      }
      {
        showUpdateAntecedent && (
          <MUpdateAntecedent
            getShowMUpdateAntecedent={closeUpdateAntecedent}
            dataShowMUpdateAntecedent={showUpdateAntecedent}
          />
        )
      }
      {
        showSearch && (
          <MFilterTray
            getShowMFilterTray={closeFilterAntecedent}
            dataShowMFilterTray={showSearch}
            dataType={1} // 1 Bandeja de Antecedentes, 2 Bandeja de Marcaje, 3 Bandeja de Impresión
          />
        )
      }
      <SLoadDocument
        setShow={setShowLoad}
        type={1}
        title={"Antecedente"}
        getMedia={getMedia}
        show={showLoad}
        beanAction={null}
        accept={[".xlsx"]}
      />
      {
        showDownloadFormat && (
          <MDownloadFormat
            getShowMDownloadFormat={closeDownloadFormat}
            dataShowMDownloadFormat={showDownloadFormat}
            dataType={1} // 1 si es la Bandeja de Antecedentes, 2 si es Bandeja Marcaje
          />
        )
      }
      {
        showStateAntecedent && (
          <MStateAntecedent
            getShowMStateAntecedent={closeStateAntecedent}
            dataShowMStateAntecedent={showStateAntecedent}
            IDAntecedente={idAntecedente}
            listIDProcedureList={seleccionado}
            clearListProcedure={setSeleccionado}
          />
        )
      }

      {/* {showStateAntecedent && (
        <MStateAntecedent
          getShowMStateAntecedent={closeStateAntecedent}
          dataShowMStateAntecedent={showStateAntecedent}
          IDAntecedente={idAntecedente}
        />
      )} */}
      {/* {
         showMultiAntecedentes && <MStateAntecedent getShowMStateAntecedent={setShowMultiAntecedentes} dataShowMStateAntecedent={}  />
      } */}
    </div >
  );
};

export default TTrayAntecedent;
