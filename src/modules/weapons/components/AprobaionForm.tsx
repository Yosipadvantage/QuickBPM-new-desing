import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useStyles, inputsTheme } from "../../../utils/Themes";
import { RootState } from "../../../store/Store";
import {
  Button,
  ThemeProvider,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import {
  BsBoxArrowInLeft,
  BsCheckCircleFill,
  BsHandIndexThumb,
  BsRecycle,
} from "react-icons/bs";
import {
  Paper,
  TableContainer,
  Table,
  ButtonGroup,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { NoInfo } from "../../../utils/NoInfo";
import { DataItemCiudadano } from "../model/item-ciudadano.interface";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { Toast } from "../../../utils/Toastify";
import { Col, Row } from "react-bootstrap";
import { SSpinner } from "../../../shared/components/SSpinner";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { AiOutlineClear } from "react-icons/ai";
import { getSession } from "../../../utils/UseProps";
import { SuscriptionService } from "../../../core/services/SuscriptionService";
import { formatDate } from "../../../utils/formatDate";
import Swal from 'sweetalert2'
interface IRevalitationForm {
  beanAction: any;
  setShow: Function;
}

const _weaponService = new WeaponsService();
const _suscripcionService = new SuscriptionService();

const APROBADO = 2;

export const AprobationForm: React.FC<IRevalitationForm> = (
  props: IRevalitationForm
) => {
  const [seleccionado, setSeleccionado] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [spinner, setSpinner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [render, setRender] = useState(0);
  const [listCantidades, setListCantidades] = useState<any[]>([]);
  const [counter, setCounter] = useState(0);
  const [totalCant, setTotalCant] = useState(0);
  const [cant, setCant] = useState<number>(1);
  /**
   * *seccion funciones tabla
   */
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    console.log(props.beanAction);
    /* getSolProductoCatalogLike(); */
    solProductoRender(props.beanAction.IDProcedureImp);
    setRowsPerPage(parseInt(items));
  }, [items]);

  /* const getItemsPorCiudadano = () => {
        setSpinner(true);
        _weaponService.getItemsPorCiudadano(16163, null, null).subscribe(resp => {
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
                setList(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    }; */
  /* 
        const getSolProductoCatalogLike = () => {
            setSpinner(true);
            _weaponService.getSolProductoCatalogLike().subscribe(resp => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                    setList(resp);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            });
        }; */

  const solProductoRender = (idProcedureImp: number) => {
    setSpinner(true);
    _weaponService.solProductoRender(idProcedureImp).subscribe((resp) => {
      setSpinner(false);
      if (resp) {
        console.log(resp);
        setList(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const classes = useStyles();

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSeleccionado = (id: any) => {
    if (seleccionado.includes(id)) {
      const resto = seleccionado.filter((item: any) => item !== id);
      setSeleccionado([...resto]);
    } else {
      setSeleccionado([...seleccionado, id]);
    }
  };

  const handleMultiSeleccion = () => {
    if (seleccionado.length > 0) {
      setSeleccionado([]);
    } else {
      const resto = list.map((rest: any) => {
        console.log(rest);
        return rest.IDSolProducto;
      });
      setSeleccionado([...resto]);
    }
  };

  const getMapAprobacion = (seleccionados: number[]) => {
    let aux: any[] = [];
    seleccionados.forEach((id: number) => {
      list.forEach((item: any) => {
        if (item.IDSolProducto === id) {
          aux.push({
            IDSolProducto: item.IDSolProducto,
          });
        }
      });
    });
    return aux;
  };

  const onChangeCantidad = (idSolProduct: number, cant: number) => {
    console.log(idSolProduct, cant);
    let aux = [...listCantidades];
    let yaExiste = false;
    console.log(aux);
    if (listCantidades.length > 0) {
      listCantidades.forEach((element: any, index: number) => {
        if (element.IDSolProducto === idSolProduct) {
          element = {
            IDSolProducto: element.IDSolProducto,
            Cantidad: cant,
          };
          aux[index] = element;
          yaExiste = true;
        }
      });
      if (!yaExiste) {
        aux.push({
          IDSolProducto: idSolProduct,
          Cantidad: cant,
        });
      }
    } else {
      aux.push({
        IDSolProducto: idSolProduct,
        Cantidad: cant,
      });
    }
    console.log("RESULTADO", aux);
    setListCantidades(aux);
  };

  const aprobarSeleccionados = () => {
    let definitive: any[] = [];
    seleccionado.forEach((idSelect: number) => {
      listCantidades.forEach((element: any) => {
        if (idSelect === element.IDSolProducto) {
          definitive.push({
            IDSolProducto: idSelect,
            Cantidad: element.Cantidad,
          });
        }
      });
    });

    console.log(definitive);

    let bean: any = {};
    definitive.forEach((element: any) => {
      bean = element;
      bean.Estado = APROBADO;
      bean.IDFunAprueba = getSession().IDAccount;
      bean.FechaAprueba = formatDate(new Date());
      updateSolProductosAprobados(bean);
      console.log(bean);
    });
  };

  const updateSolProductosAprobados = (bean: any) => {
    setSpinner(true);
    _weaponService.updateSolProducto(bean).subscribe((resp) => {
      setSpinner(false);
      if (resp) {
        setTotalCant(totalCant + bean.Cantidad);
        setCounter(counter + 1);
        console.log(counter);
        setRender(1);
        if (counter === seleccionado.length) {
          setRender(1);
        }
        Toast.fire({
          icon: "success",
          title: "Se ha guardad con éxito!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "INTERNAL SERVER ERROR",
        });
      }
    });
  };

  /* const revalidarArmas = () => {
        setSpinner(true);
        let map = getMapRevalidation(seleccionado);
        _weaponService.agregaraArmaImpresionRevalidacion(getSession().IDAccount, props.beanAction ? props.beanAction.IDProcedureImp : -1, map)
            .subscribe((resp) => {
                if (resp.DataBeanProperties.ObjectValue) {
                    setRender(1);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: resp.DataBeanProperties.ErrorMessage
                    })
                }
            })
        setSpinner(false);
    } */

  const aprobarArmasConfirm = (data: boolean) => {
    if (data) {
      /* revalidarArmas(); */
      aprobarSeleccionados();
    }
  };

  const responseProcedure = async () => {
    setSpinner(true);
    await _suscripcionService
      .responseProcedureAction2(
        props.beanAction.IDAction,
        null,
        null,
        {
          APROBAR: true,
        },
        false
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          Toast.fire({
            icon: "success",
            title: "Resultado de la validacion enviada correctamente",
          });
          props.setShow(false);
        }
      });
  };
  console.log("tipo de cantidad ", cant.toString() === 'NaN');
  const renderSwitch = (render: number) => {
    switch (render) {
      case 0:
        return (
          <>
            <div className="sync__header__grid">
              {list.length > 0 && (
                <div className="card p-3 w-100 mb-3">
                  <Row>
                    <Col sm={12} className="d-flex justify-content-end">
                      <ThemeProvider theme={inputsTheme}>
                        <Button
                          disabled={
                            !(seleccionado.length > 0) ||
                            listCantidades.some(
                              (item: any) => item.Cantidad.toString() === 'NaN'
                            )
                          }
                          type="submit"
                          variant="contained"
                          color="secondary"
                          endIcon={<BsCheckCircleFill />}
                          className="my-3 w-50"
                          fullWidth
                          onClick={() => {
                            setShowConfirm(true);
                            console.log(props.beanAction);
                          }}
                        >
                          APROBAR
                        </Button>
                      </ThemeProvider>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            {list.length > 0 ? (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className={classes.root}
                  >
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>CódPermiso/CódSeguridad</TableCell>
                                            <TableCell>Marca</TableCell>
                                            <TableCell>Serial</TableCell>
                                            <TableCell>Estado Arma de fuego</TableCell>
                                            <TableCell>Estado Traumatica</TableCell>
                                            <TableCell>Fecha de descargo</TableCell> */}
                        <TableCell>Producto Solicitado</TableCell>
                        <TableCell>Tipo de Uso</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>
                          <ThemeProvider theme={inputsTheme}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                seleccionado.length > 0 ? (
                                  <AiOutlineClear />
                                ) : (
                                  <BsHandIndexThumb />
                                )
                              }
                              className="my-3"
                              style={{
                                width: "100%",
                              }}
                              fullWidth
                              onClick={handleMultiSeleccion}
                            >
                              {seleccionado.length > 0 ? "Limpiar" : "Todos"}
                            </Button>
                          </ThemeProvider>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
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
                              seleccionado.includes(item.IDSolProducto)
                                ? "seleccionado"
                                : ""
                            }
                            tabIndex={-1}
                          >
                            <TableCell>{item.DescripcionProducto}</TableCell>
                            <TableCell>{item.NombreTipoUso}</TableCell>
                            <TableCell>{item.NombreEstado}</TableCell>
                            <TableCell>{item.Cantidad}</TableCell>
                            <TableCell className="d-flex flex-row justify-content-center">
                              <div className="d-lg-flex d-none">
                                <ButtonGroup>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Seleccionar">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-1 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() => {
                                          handleSeleccionado(
                                            item.IDSolProducto
                                          );
                                        }}
                                      >
                                        {<BsHandIndexThumb />}
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                </ButtonGroup>
                              </div>
                              {seleccionado.includes(item.IDSolProducto) && (
                                <div>
                                  <TextField
                                    /* value={capacity} */
                                    type="number"
                                    size="small"
                                    fullWidth
                                  
                                    color="secondary"
                                    label="Cantidad"
                                    id={"cantidad" + item.IDSolProducto}
                                    /* onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))} */
                                    onChange={(e) => {
                                      if (
                                        parseInt(e.target.value) > item.Cantidad
                                      ) {
                                        setCant(parseInt(item.Cantidad));
                                      } else if (parseInt(e.target.value) < 1) {
                                        setCant(1);
                                      } 
                                      else {
                                        setCant(parseInt(e.target.value));
                                      }
                                      
                                      if(e.target.value===''){
                                        Toast.fire({
                                            icon: "error",
                                            title: "No puedes dejar ningún arma seleccionada sin algún valor",
                                          });
                                      }
                                      onChangeCantidad(
                                        item.IDSolProducto,
                                        parseInt(e.target.value)
                                      );
                                    }}
                                    InputProps={{
                                      inputProps: {
                                        min: 1,
                                        max: item.Cantidad,
                                      },
                                    }}
                                  ></TextField>
                                </div>
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
            ) : (
              <NoInfo />
            )}
          </>
        );
      case 1:
        return (
          <div>
            <div>
              <div className="d-flex justify-content-center mt-3">
                <h1>APROBACIÓN DE {totalCant} ARMA(S) REALIZADO CON ÉXITO!</h1>
              </div>
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark__check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
              <h4 className="w-100 text-center">
                <b>FECHA DE REGISTRO:</b> {formatDate(new Date()).split(" ")[0]}
              </h4>
              <h5 className="mt-5 w-100 text-center">
                Aprobación terminada con éxito, siguiente paso: ASIGNAR SERIAL
                AL ARMA.
              </h5>
              <div className="d-flex justify-content-center mt-5">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      responseProcedure();
                    }}
                  >
                    CONTINUAR
                  </Button>
                </ThemeProvider>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <>
      <header className="page-header page-header-light bg-light mb-0"></header>
      <main>{renderSwitch(render)}</main>
      {spinner && <SSpinner show={spinner} />}
      {showConfirm && (
        <GenericConfirmAction
          show={showConfirm}
          setShow={setShowConfirm}
          title="¿Desea continuar con la Aprobación de Adquisición?"
          confirmAction={aprobarArmasConfirm}
        />
      )}
    </>
  );
};
