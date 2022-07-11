import {
  Button,
  ButtonGroup,
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
  TextField,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BsHandIndexThumb, BsSearch, BsBoxArrowInLeft } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import Toast from "sweetalert2";
import { GlobalService } from "../../../core/services/GlobalService";
import { getSession } from "../../../utils/UseProps";
import { MdOutlineDownloadDone, MdSaveAlt } from "react-icons/md";
import { ToastCenter } from "../../../utils/Toastify";

export const SDataSyncro = () => {
  const _globalService = new GlobalService();

  const [step, setStep] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);
  const [showSpinnerScan, setShowSpinnerScan] = useState(false);
  const [idAccountSought, setIdAccountSought] = useState(0);
  const [identification, setIdentification] = useState<number>(0);
  const [idFuncionario, setIdFuncionario] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const classes = useStyles();
  const [seleccionado, setSeleccionado] = useState<number[]>([]);
  const [spinner, setSpinner] = useState(false);
  const [gunList, setGunList] = useState([]);
  const [gunInfo, setGunInfo] = useState<any>([]);
  const [user, setUser] = useState<any>(null)
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
    setIdFuncionario(getSession().IDAccount);
    console.log("id account del funcionario", idFuncionario);
  }, []);
  console.log();
  /**
   * *FUNCIONES HALLAR USUARIO
   */

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (identification === 0) {
      Toast.fire({
        icon: "warning",
        title: "Introduzca una Identificación",
      });
    } else {
      getAccountByNit(identification);
    }
  };
  const getAccountByNit = (nit: number) => {
    setSpinner(true);
    _globalService.getAccountByNit(nit).subscribe((findNit) => {
      console.log("respuesta hallar nit", findNit);
      if (findNit.length > 0) {
        setSpinner(false);
        setIdAccountSought(findNit[0].IDAccount);
        setUser(findNit[0])
        sincronizarPersonasNaturalJuridica(nit);
      } else {
        setSpinner(false);
        Toast.fire({
          icon: "error",
          title: "No se han encontrado coincidencias",
        });
      }
    });
  };
  const sincronizarPersonasNaturalJuridica = (nit: number) => {
    setSpinner(true);
    _globalService
      .sincronizarPersonasNaturalJuridica(nit)
      .subscribe((resp: any) => {
        if (resp.DataBeanProperties.ObjectValue.length > 0) {
          setSpinner(false);
          console.log("sincronizacion", resp);
          setStep(1);
          setList(resp.DataBeanProperties.ObjectValue);
        } else {
          setSpinner(false);
          Toast.fire({
            timer: 1000,
            title: 'No se hallaron resultados',
            icon: 'error',
            showConfirmButton: false
          })
          setSpinner(false);
          setStep(1)
        }
      });
  };

  /**
   * *Funciones de la tabla
   */
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
      const resto = list.map((rest) => {
        console.log(rest);
        return rest.ID_PERSONA;
      });

      setSeleccionado([...resto]);
    }
  };
  const handleSearch = () => {
    setSpinner(true);
    _globalService
      .updateSincronizacionRender(idAccountSought, seleccionado, idFuncionario)
      .subscribe((resp) => {
        setSpinner(false);
        if (resp) {
          console.log(resp);
          sincronizarCargueArma();
          setStep(2)
        } else {
          ToastCenter.fire({
            title: "error",
            icon: "error",
            timer: 1000,
          });
        }
      });
  };
  const sincronizarCargueArma = () => {
    setSpinner(true);
    _globalService.sincronizarCargueArma(idAccountSought).subscribe((resp) => {
      setSpinner(false);
      if (resp.length > 0) {
        setGunList(resp);
        setStep(2);
      } else {
        console.log("error respuesta del server");
      }
    });
  };

  /**
   * *Funcion steper para manejo de la vista en pantalla
   * @param step  paso en el que se encuentra del proceso
   * @returns JSXElement
   */

  const renderSwitch = (step: number) => {
    switch (step) {
      /**
       * *Inicio del proceso
       */
      case 0:
        return (
          <div className="container d-flex justify-content-center">
            <form>
              <Row className="card box-s m-3 d-block">
                <Col sm={12} className="mt-5 mb-3 mr-5 ml-5">
                  <h1>..::Sincronizacion de datos::..</h1>
                </Col>
                <Col sm={11} className="mt-5 mb-3">
                  <TextField
                    className="m-3"
                    type="number"
                    size="small"
                    fullWidth
                    color="secondary"
                    margin="normal"
                    label="No. Identificación"
                    id="write"
                    onChange={(e) =>
                      setIdentification(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            onClick={(e) => onSubmit(e)}
                          >
                            <BsSearch />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col
                  sm={6}
                  className="mb-3 ml-12 d-flex justify-content-center"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      type="button"
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => onSubmit(e)}
                    >
                      BUSCAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
          </div>
        );
      /**
       * *Tabla Usuarios
       * */
      case 1:
        return (
          <>
            <h2>Usuario:</h2>
            <h3>{user.EntityName}</h3>
            <div className="sync__header__grid">
              {/* boton atras */}
              <ThemeProvider theme={inputsTheme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<BsBoxArrowInLeft />}
                  className="my-3"
                  style={{
                    width: "10%",
                  }}
                  fullWidth
                  onClick={() => {
                    setStep(0);
                    setList([]);
                    setSeleccionado([])
                    setIdentification(0);
                  }}
                >
                  Atrás
                </Button>
              </ThemeProvider>

              <div className="sync__botones__grid">
                {seleccionado.length > 0 && (
                  <div style={{ margin: 0 }}>
                    <p className="m-0">
                      {seleccionado.length} Usuarios Seleccionados
                    </p>
                  </div>
                )}
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    endIcon={<BsHandIndexThumb />}
                    className="my-3"
                    style={{
                      width: "50%",
                    }}
                    fullWidth
                    onClick={handleMultiSeleccion}
                  >
                    {seleccionado.length > 0
                      ? "Limpiar Seleccionados"
                      : "Selecccionar Todos"}
                  </Button>
                </ThemeProvider>
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    endIcon={<MdOutlineDownloadDone />}
                    className="my-3"
                    disabled={seleccionado.length > 0 ? false : true}
                    style={{
                      width: "50%",
                    }}
                    fullWidth
                    onClick={handleSearch}
                  >
                    AGREGAR
                  </Button>
                </ThemeProvider>
              </div>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ height: "70vh" }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  className={classes.root}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Documento</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Incio del cuerpo de la tabla  */}

                    {list
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item: any, index: number) => (
                        <TableRow
                          hover
                          role="checkbox"
                          className={
                            seleccionado.includes(item.ID_PERSONA)
                              ? "seleccionado"
                              : ""
                          }
                          tabIndex={-1}
                        >
                          <TableCell>{item.NUMERO_IDENTIFICACION}</TableCell>
                          <TableCell>
                            {item.hasOwnProperty("NOMBRE1")
                              ? `${item.NOMBRE1} ${item.NOMBRE2} ${item.APELLIDO1}
                            ${item.APELLIDO2}   `
                              : `${item.RAZON_SOCIAL}`}
                            {/* {item.NOMBRE1} {item.NOMBRE2} {item.APELLIDO1}{" "}
                            {item.APELLIDO2} */}
                          </TableCell>
                          <TableCell>
                            <div className="d-lg-flex d-none">
                              <ButtonGroup>
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Cambiar estado">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="secondary"
                                      onClick={() => {
                                        handleSeleccionado(item.ID_PERSONA);
                                      }}
                                    >
                                      {<BsHandIndexThumb />}
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                              </ButtonGroup>
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
          </>
        );
      /**
       * *Tabla armas
       */
      case 2:
        return (
          <>
            <h2>Lista de armas</h2>
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<BsBoxArrowInLeft />}
                className="my-3"
                style={{
                  width: "10%",
                }}
                fullWidth
                onClick={() => {
                  setStep(0);
                  setList([]);
                  setSeleccionado([])
                  setIdentification(0);
                }}
              >
                Atrás
              </Button>
            </ThemeProvider>
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
                      <TableCell>Tipo Arma</TableCell>
                      <TableCell>Serial</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Calibre</TableCell>
                      <TableCell>Capacidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Incio del cuerpo de la tabla  */}

                    {gunList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item: any, index: number) => (
                        <TableRow tabIndex={-1}>
                          <TableCell>
                            {
                              JSON.parse(item.Propiedades).DataArma
                                .CodigoTipoArma
                            }
                          </TableCell>
                          <TableCell>{item.Serial}</TableCell>
                          <TableCell>
                            {JSON.parse(item.Propiedades).DataArma.Descripcion}
                          </TableCell>
                          <TableCell>
                            {JSON.parse(item.Propiedades).DataArma.Calibre}
                          </TableCell>
                          <TableCell>
                            {JSON.parse(item.Propiedades).DataArma.Capacidad}
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
          </>
        );
    }
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <div className={step === 0 ? "mt-15" : ""}>{renderSwitch(step)}</div>
        <SSpinner
          show={showSpinnerScan}
          message="ESCANEANDO DATOS BIOMÉTRICOS"
        />
        <SSpinner show={spinner} message="DCCAE" />
      </div>
    </>
  );
};
