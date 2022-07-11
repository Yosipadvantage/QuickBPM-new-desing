import {
  Paper,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Tooltip,
  ButtonGroup,
} from "@mui/material";

import Accordion from "react-bootstrap/Accordion";
import { title } from "process";
import React, { useEffect, useState } from "react";
import { Card, Modal, OverlayTrigger } from "react-bootstrap";
import {
  BsBarChartSteps,
  BsCaretLeftFill,
  BsChevronDoubleLeft,
  BsCurrencyBitcoin,
  BsFillBookmarkFill,
  BsFillCheckCircleFill,
  BsFillXCircleFill,
  BsXSquare,
} from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import SLoadForm from "../../../shared/components/SLoadForm";
import { SSpinner } from "../../../shared/components/SSpinner";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import {
  IconButton,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  ThemeProvider,
  Checkbox,
  CircularProgress,
} from "@mui/material";

import { ConfigService } from "../../../core/services/ConfigService";
import { FileService } from "../../../core/services/FileService";
import { inputsTheme } from "../../../utils/Themes";
import MViewService from "./MViewService";

interface ITProcessManagement {
  dataShow: boolean;
  setShow: Function;
  id: number;
  type: number | null;
}

const _configService = new ConfigService();
const _files = new FileService();

const SERVICIO_JSON = "Servicio Json";

const TProcessManagement: React.FC<ITProcessManagement> = (
  props: ITProcessManagement
) => {
  const [listRequested, setListRequested] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [showModalForm, setShowModalForm] = useState(false);
  const [beanAction, setBeanAction] = useState<any>();
  const [titleDoc, setTitleDoc] = useState("");

  const [showVariables, setShowVariables] = useState(false);
  const [formData, setFormData] = useState({});

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
    getProcedureActionByProcedureImp();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getProcedureActionByProcedureImp = async () => {
    setShowSpinner(true);
    await _configService
      .getProcedureActionByProcedureImp(props.id)
      .then((rps: any) => {
        console.log("informacion para historial", rps);
        setShowSpinner(false);
        if (rps.data.DataBeanProperties.ObjectValue) {
          setListRequested(rps.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setShowSpinner(false);
      });
  };

  const closeModal = () => {
    props.setShow(false);
  };

  const setInPendingForInputState = async () => {
    await _configService
      .setInPendingForInputState(id)
      .then((rps: any) => {
        if (rps.data.DataBeanProperties.ObjectValue) {
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!",
          });
          getProcedureActionByProcedureImp();
        } else {
          Toast.fire({
            icon: "success",
            title: "No se ha podido completar la acción",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const statusModalForm = (status: boolean) => {
    setShowModalForm(status);
  };
  const setPending = (data: boolean) => {
    if (data) {
      setInPendingForInputState();
    }
  };

  const closeModalViewSerivice = (data: boolean) => {
    setShowVariables(data);
  };

  const classes = useStyles();

  return (
    <>
      <Modal size="xl" show={props.dataShow} modal centered onHide={closeModal}>
        <Modal.Header>
          Historial de gestión del proceso
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "60vh" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.root}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Etapa/Area encargada</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Tipo de Actividad</TableCell>
                    <TableCell>Nombre Documento</TableCell>
                    <TableCell>Datos Documento</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Código Formulario</TableCell>
                    <TableCell>Código Servicio</TableCell>
                    <TableCell>Opcional</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listRequested
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>
                          {item.DataBeanProperties.IDAction}
                        </TableCell>
                        <TableCell>{`${item.DataBeanProperties.ProcedureName} / ${item.DataBeanProperties.FunctionalIDName}`}</TableCell>
                        <TableCell>
                          {item.DataBeanProperties.AccountName}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.ActivityTypeName}
                        </TableCell>
                        <TableCell
                          style={{
                            width: "20%",
                          }}
                        >
                          <b>Nombre Documento:</b>{" "}
                          {item.DataBeanProperties.ProcedureActionName}
                          <div className="mt-1">
                            <b>Tipo de Documento:</b>{" "}
                            {item.DataBeanProperties.DocumentTypeName}
                          </div>
                        </TableCell>
                        {item.DataBeanProperties.Url && (
                          <TableCell>
                            <a
                              href={_files.getUrlFile(
                                item.DataBeanProperties.MediaContext,
                                item.DataBeanProperties.Media
                              )}
                            >
                              {" "}
                              {item.DataBeanProperties.Media}
                            </a>
                          </TableCell>
                        )}
                        {/* {(item.DataBeanProperties.ResponseJsonValue !== null) &&
                          <TableCell className="textDecoration" onClick={() => (statusModalForm(true), setBeanAction(item.DataBeanProperties), setTitleDoc(item.DataBeanProperties.Name))}>
                            Formulario {JSON.parse(item.DataBeanProperties.ResponseJsonValue)}
                          </TableCell>} */}
                        {!item.DataBeanProperties.Url && (
                          <>
                            {item.DataBeanProperties.ResponseJsonValue !==
                            null ? (
                              <TableCell
                                onClick={() => (
                                  statusModalForm(true),
                                  setBeanAction(item.DataBeanProperties),
                                  setTitleDoc(item.DataBeanProperties.Name)
                                )}
                              >
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).NOMBRE_CIUDADANO && (
                                  <div>
                                    
                                    <strong>NOMBRE_CIUDADANO:</strong>
                                    <br />
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).NOMBRE_CIUDADANO
                                    }
                                  </div>
                                )}
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).IDENTIFICACION && (
                                  <div>
                    
                                    <strong>IDENTIFICACION:</strong>
                                    <br />
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).IDENTIFICACION
                                    }
                                  </div>
                                )}
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).formulario && (
                                  <div>
                                    <strong>formulario:</strong> <br />{" "}
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).formulario
                                    }
                                  </div>
                                )}
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).IDAction && (
                                  <div>
                                    <strong>IDAction</strong> :<br />
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).IDAction
                                    }
                                  </div>
                                )}

                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).ID_CIUDADANO && (
                                  <div>
                                  
                                    <strong>ID_CIUDADANO:</strong>
                                    <br />
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).ID_CIUDADANO
                                    }
                                  </div>
                                )}
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).miarma && (
                                  <div>
                                 
                                    <strong>miarma:</strong>
                                    <br />
                                    {
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).miarma
                                    }
                                  </div>
                                )}
                                {JSON.parse(
                                  item.DataBeanProperties.ResponseJsonValue
                                ).ARMAS && (
                                  <div>
                                    <br />
                                    <h5><strong>ARMAS:</strong></h5>
                                    {JSON.parse(
                                      JSON.parse(
                                        item.DataBeanProperties
                                          .ResponseJsonValue
                                      ).ARMAS
                                    ).map((item:any,idx:number)=>{
                                      return (
                                        <>
                                        <h6><strong>Arma {idx+1}</strong></h6>
                                        <div>
                                        <strong>ID Item</strong>
                                        <div>{item.IDItem}</div>
                                        </div>
                                        <div>
                                        <strong>Fecha Documento</strong>
                                        <div>{item.FechaDocumento}</div>
                                        </div>
                                        <div>
                                        <strong>Tipo Porte</strong>
                                        <div>{item.FechaDocumento === 1? 'PORTE' : 'TENENCIA'}</div>
                                        <hr />
                                        </div>
                                        </>
                                      )
                                    })}
                                  </div>
                                )}
                                
                                

                                
                              </TableCell>
                            ) : (
                              <TableCell>NO APLICA</TableCell>
                            )}
                          </>
                        )}
                        <TableCell>
                          {item.DataBeanProperties.StateName
                            ? item.DataBeanProperties.StateName
                            : "NA"}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.FormCode
                            ? item.DataBeanProperties.FormCode
                            : "NA"}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.JsonServiceCode
                            ? item.DataBeanProperties.JsonServiceCode
                            : "NA"}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.IsOptional === true ? (
                            <ThemeProvider theme={inputsTheme}>
                              <IconButton color="success">
                                <BsFillCheckCircleFill />
                              </IconButton>
                            </ThemeProvider>
                          ) : (
                            <ThemeProvider theme={inputsTheme}>
                              <IconButton color="error">
                                <BsFillXCircleFill />
                              </IconButton>
                            </ThemeProvider>
                          )}
                        </TableCell>
                        <TableCell>
                          {/* <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip id={item.DataBeanProperties.IDAction}>
                                Asignar como 'Pendiente por respuesta'
                              </Tooltip>
                            }
                          >
                            <Button className="btn btn-secondary">
                              <BsCaretLeftFill
                                onClick={() => {
                                  setId(item.DataBeanProperties.IDAction)
                                  setShow(true);
                                }}
                              />
                            </Button>
                          </OverlayTrigger> */}
                          <ButtonGroup>
                            <ThemeProvider theme={inputsTheme}>
                              <Tooltip title="Asignar como 'Pendiente por respuesta'">
                                <Button
                                  variant="contained"
                                  className="box-s mr-1 mt-2 mb-2"
                                  color="secondary"
                                  onClick={() => {
                                    setId(item.DataBeanProperties.IDAction);
                                    setShow(true);
                                  }}
                                >
                                  <BsCaretLeftFill />
                                </Button>
                              </Tooltip>
                            </ThemeProvider>
                            {item.DataBeanProperties.DocumentTypeName ===
                              SERVICIO_JSON && (
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Histórico de invocación de servicio">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      setFormData(item.DataBeanProperties);
                                      setShowVariables(true);
                                    }}
                                  >
                                    <BsBarChartSteps />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              className={classes.root}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={listRequested.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Modal.Body>
      </Modal>
      {showSpinner && <SSpinner show={showSpinner} />}
      {show && (
        <GenericConfirmAction
          show={show}
          setShow={setShow}
          confirmAction={setPending}
          title="Está seguro de completar la acción"
        />
      )}
      {showVariables && (
        <MViewService
          getShowMViewService={closeModalViewSerivice}
          dataShowMViewService={showVariables}
          dataObj={formData}
        />
      )}
    </>
  );
};

export default TProcessManagement;
