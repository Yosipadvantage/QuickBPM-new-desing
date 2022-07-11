import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { BsCheckCircleFill, BsHandIndexThumb } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useSelector } from "react-redux";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { getSession } from "../../../utils/UseProps";
import { Col, Row } from "react-bootstrap";
import { AiOutlineClear } from "react-icons/ai";
import { NoInfo } from "../../../utils/NoInfo";
import { formatDate } from "../../../utils/formatDate";
import { SuscriptionService } from "../../../core/services/SuscriptionService";

interface IRevalitationForm {
  beanAction: any;
  setShow: Function;
}

const _weaponService = new WeaponsService();
const _suscripcionService = new SuscriptionService();

export const RevalidationForm: React.FC<IRevalitationForm> = (
  props: IRevalitationForm
) => {
  const [render, setRender] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [seleccionado, setSeleccionado] = useState<number[]>([]);
  const [list, setList] = useState<any[]>([]);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mapReval, setMapReval] = useState<any>([]);
  const classes = useStyles();
  let auxUpdate: any = [];
  useEffect(() => {
    console.log(props.beanAction.IDProcedureImp);
    console.log("informacion de la sesion", getSession());
    solRevalidacionRender();
  }, []);

  const solRevalidacionRender = () => {
    _weaponService
      .solRevalidacionRender(props.beanAction.IDProcedureImp)
      .subscribe((resp: any) => {
        console.log("respuesta de servicio de revalidacion", resp);
        if (resp) {
          if (resp.length > 0) {
            setList(resp);
          }
        } else {
          console.log("no hubo repsuesta del servidor");
        }
      });
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSeleccionado = (id: number): void => {
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
        return rest.IDSolRevalidacion;
      });
      setSeleccionado([...resto]);
    }
  };

  const getMapRevalidation = () => {
    let aux: any[] = [];

    seleccionado.forEach((id: number) => {
      list.forEach((item: any) => {
        if (item.IDSolRevalidacion === id) {
          aux.push({
            FechDocumento: item.FechaDocumento,
            IDItem: item.IDItem,
            TipoPermiso: item.IDTipoPermiso
          });
          auxUpdate.push({
            IDFuncionario: getSession().IDAccount,
            IDSolRevalidacion: item.IDSolRevalidacion,
            Estado: 2,
            FechaAprueba: formatDate(new Date()),
          });
          console.log("info de revalidation", item);
        }
      });
    });
    return { aux, auxUpdate };
  };
  console.log("listado de seleccionados", seleccionado);
  console.log("resultado formateo de informacion", mapReval);
  const revalidarArmas = (data: any) => {
    console.log("datos para validacion", {
      account: getSession().IDAccount,
      idIMP: props.beanAction.IDProcedureImp,
      data,
    });
    setSpinner(true);
    _weaponService
      .agregaraArmaImpresionRevalidacion(
        getSession().IDAccount,
        props.beanAction.IDProcedureImp,
        data
      )
      .subscribe((resp) => {
        setSpinner(false);
        console.log(resp);
        if (resp.DataBeanProperties.ObjectValue) {
          setRender(1);
        } else {
          Toast.fire({
            icon: "error",
            title: resp.DataBeanProperties.ErrorMessage,
          });
        }
      });
  };

  const revalidarArmasConfirm = (data: boolean) => {
    console.log(data);
    if (data) {
      console.log("inf update", auxUpdate);
      revalidarArmas(getMapRevalidation().aux);
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
          REVALIDAR: true,
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

  const handleUpdate = (data: any) => {
    console.log('auxUpdate', data)
    data.forEach((element: any) => {
      _weaponService.updateSolRevalidacion(element).subscribe((resp: any) => {
        console.log('actualziacion de revalidacion', resp)
      })
    });

  };
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
                          disabled={!(seleccionado.length > 0)}
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
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ height: "70vh" }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  className={classes.root}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Estado</TableCell>
                      <TableCell>Arma/Serial</TableCell>
                      <TableCell>IdItem</TableCell>
                      <TableCell>Tipo permiso</TableCell>
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
                            seleccionado.includes(item.IDSolRevalidacion)
                              ? "seleccionado"
                              : ""
                          }
                          tabIndex={-1}
                        >
                          <TableCell>{item.NombreEstado}</TableCell>
                          <TableCell>
                            {item.DescripcionItem}/{item.Serial}
                          </TableCell>
                          <TableCell>{item.IDItem}</TableCell>
                          <TableCell>
                            {item.IDTipoPermiso === 1 ? "PORTE" : "TENENCIA"}
                          </TableCell>
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
                                        console.log(seleccionado);
                                        handleSeleccionado(
                                          item.IDSolRevalidacion
                                        );
                                      }}
                                    >
                                      {<BsHandIndexThumb />}
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>
                              </ButtonGroup>
                            </div>
                            {/* {seleccionado.includes(item.IDSolProducto) &&
                                                            <div>
                                                                <TextField
                                                                    /* value={capacity} 
                                                                    type="number"
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    label="Cantidad"
                                                                    id={'cantidad' + item.IDSolProducto}
                                                                    /* onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))} 
                                                                    onChange={(e) => onChangeCantidad(item.IDSolProducto, parseInt(e.target.value))}
                                                                    InputProps={{ inputProps: { min: 1, max: item.Cantidad } }}
                                                                >
                                                                </TextField>
                                                            </div>
                                                        } */}
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

      case 1:
        return (
          <div>
            <div>
              <div className="d-flex justify-content-center mt-3">
                <h1>
                  APROBACIÓN DE {seleccionado.length} ARMA(S) PARA REVALDIACION
                  REALIZADO CON ÉXITO!
                </h1>
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
                Aprobación terminada con éxito, siguiente paso: REVISAR BANDEJA
                DE IMPRESION.
              </h5>
              <div className="d-flex justify-content-center mt-5">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      handleUpdate(getMapRevalidation().auxUpdate);
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
          confirmAction={revalidarArmasConfirm}
        />
      )}
    </>
  );
};
