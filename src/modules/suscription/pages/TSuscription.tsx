import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { Col, Form, Spinner } from "react-bootstrap";
import { BsSearch, BsSkipForwardFill } from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { SuscriptionService } from "../../../core/services/SuscriptionService";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Button,
  ThemeProvider,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SpeedDial,
  SpeedDialAction,
  Autocomplete,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { ICustomerType } from "../../configuration/model/CustomerType";
import { FiMoreVertical } from "react-icons/fi";
import { FaFileUpload, FaWpforms } from "react-icons/fa";
import SLoadForm from "../../../shared/components/SLoadForm";
import { pipeSort } from "../../../utils/pipeSort";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { useHistory } from "react-router-dom";
import { SSpinner } from "../../../shared/components/SSpinner";
import { getEntityName } from "../../../utils/getEntityName";

const _configService = new ConfigService();
const _suscripcionService = new SuscriptionService();
const steps = ["Crear trámite", "Cargar Documentacion"];

interface ISuscription { }

export const TSuscription: React.FC<ISuscription> = () => {
  const [show, setShow] = useState(false);
  const [showM, setShowM] = useState(false);
  const [listaTramites, setListTramites] = useState([]);
  const [listaDocumentos, setListDocs] = useState([]);
  const [titleDoc, setTitleDoc] = useState("");
  const [user, setUser] = useState("");
  const [tramite, setTramite] = useState("");
  const [beanAction, setBeanAct] = useState<any>();
  const [beanProcedureImp, setBeanProcedure] = useState<any>();
  const [listOffice, setListOffice] = useState([]);
  const [listTypeCustumer, setListTypeCustumer] = useState<ICustomerType[]>([]);
  const [listCharacterization, setListCharacterization] = useState([]);
  const [chaName, setChaName] = useState("");
  const [listTypeDocument, setListTypeDocument] = useState<String[]>([]);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [showSkip, setShowSkip] = useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    getTypeCustomer();
    setRowsPerPage(parseInt(items));

    listTypeDocument[2] = "Documento / Anexo";
    listTypeDocument[3] = "Formulario";
    listTypeDocument[4] = "Servicio";
  }, [items]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //Servicios
  const getTypeCustomer = () => {
    setSpinner(true);
    _configService.getCustomerTypeCatalog().subscribe((resp) => {
      setSpinner(false);
      if (resp) {
        setListTypeCustumer(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getListCharacterization = (idCustomer: number) => {
    setSpinner(true);
    clearErrors("customerType");
    let aux: any = [];
    let auxSorted: any = [];
    _configService
      .getCharacterizationByCustomerType(idCustomer)
      .subscribe((resp: any) => {
        setSpinner(false);
        if (resp) {
          resp.DataBeanProperties.ObjectValue.map((item: any) =>
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDCharacterization,
            })
          );
          auxSorted = pipeSort([...aux], "label");
          setListCharacterization(auxSorted);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la información",
          });
        }
      });
  };

  const getProcess = async (idCharacterization: number) => {
    setSpinner(true);
    let aux: any = [];
    let auxSorted: any = [];
    clearErrors("businessClass");
    await _configService
      .getBusinessProcessCatalog(null, null, idCharacterization)
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          resp.data.DataBeanProperties.ObjectValue.map((item: any) =>
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDBusinessProcess,
            })
          );
          auxSorted = pipeSort([...aux], "label");
          setListTramites(auxSorted);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getOfficeCatalogForBusinessProcess = (idBusinessProcess: number) => {
    setSpinner(true);
    let aux: any = [];
    let auxSorted: any = [];
    _configService
      .getOfficeCatalogForBusinessProcess(idBusinessProcess)
      .subscribe((res: any) => {
        setSpinner(false);
        if (res) {
          console.log(res.DataBeanProperties.ObjectValue);
          res.DataBeanProperties.ObjectValue.map((item: any) =>
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDOffice,
            })
          );
          auxSorted = pipeSort([...aux], "label");
          setListOffice(auxSorted);
          console.log(auxSorted);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido listar información de sucursales",
          });
        }
      });
  };

  const createProcess = async (data: any) => {
    setSpinner(true);
    await _suscripcionService
      .createBusinessProcessAndNextStage(
        data.Tramite,
        data.Sucursal,
        data.Account,
        data.Descripcion,
        "0",
        true,
        data.Caracterizacion
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          setBeanProcedure(resp.data.DataBeanProperties.ObjectValue);
          const respuesta = resp.data.DataBeanProperties.ObjectValue;
          listAllDocuments(
            respuesta.DataBeanProperties.IDProcedureImp,
            respuesta.DataBeanProperties.IDAccount
          );
          handleComplete();
        } else {
          Toast.fire({
            icon: "error",
            title: resp.data.DataBeanProperties.ErrorMessage,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const listAllDocuments = async (idProcedure: number, idAccount: number) => {
    setSpinner(true);
    await _suscripcionService
      .getProcedureActionByAccount(idAccount, idProcedure)
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          if (resp.data.DataBeanProperties.ObjectValue.length > 0) {
            setListDocs(resp.data.DataBeanProperties.ObjectValue);
          } else {
            Toast.fire({
              icon: "info",
              title: `No existen documentos para la caracterización -${chaName}-`,
            });
            setListDocs([]);
            handleComplete();
            setActiveStep(0);
            ToastCenter.fire({
              icon: "success",
              title: "Proceso iniciado exitosamente",
              position: "center",
            });
            reset();
            setUser("");
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo cargar los documentos.",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  //inicio Steper
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };
  //finaliza stepper

  //Abrir modal
  const openUser = () => {
    setShow(true);
  };
  const closeSearch = (data: any) => {
    setShow(data);
  };
  const openMedia = (titulo: string) => {
    setShowM(true);
    setTitleDoc(titulo);
  };

  const openForm = (statusForm: boolean) => {
    setShowModalForm(statusForm);
  };

  const closeForm = (status: boolean) => {
    setShowModalForm(status);

    listAllDocuments(
      beanProcedureImp.DataBeanProperties.IDProcedureImp,
      beanProcedureImp.DataBeanProperties.IDAccount
    );
  };

  const setBeanAction = (bean: any) => {
    setBeanAct(bean);
  };
  const getItemM = async (data: any) => {
    setSpinner(true);
    await _suscripcionService
      .responseProcedureAction2(
        beanAction.IDAction,
        null,
        null,
        {
          Media: data.Media,
          MediaContext: data.MediaContext,
        },
        false
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          listAllDocuments(
            beanProcedureImp.DataBeanProperties.IDProcedureImp,
            beanProcedureImp.DataBeanProperties.IDAccount
          );
          validar();
        }
      });
  };

  const skipStep = async () => {
    setSpinner(true);
    await _suscripcionService
      .responseProcedureAction2(beanAction.IDAction, null, null, null, false)
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          listAllDocuments(
            beanProcedureImp.DataBeanProperties.IDProcedureImp,
            beanProcedureImp.DataBeanProperties.IDAccount
          );
          validar();
        }
      });
  };
  const validar = async () => {
    setSpinner(true);
    await _suscripcionService
      .isValidStage(
        beanProcedureImp.DataBeanProperties.IDAccount,
        beanAction.IDStage
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          console.log(listaDocumentos.length);
          if (listaDocumentos.length === 1) {
            handleComplete();
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const closeSearchM = (data: any) => {
    setShowM(data);
  };

  const getItem = (data: any) => {
    clearErrors("NombreAccount");
    setValue("Account", data.IDAccount);
    setValue("NombreAccount", getEntityName(data));
    setUser(data.EntityName);
  };
  //Finalizacion modal

  //Envio de primer paso
  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    createProcess(data);
  };
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setValue("NombreAccount", "");
    setValue("Account", "");
    setValue("Descripcion", "");
    setValue("Tramite", "");
  };
  const onChangeSelect_Process = (e: any) => {
    return e == null
      ? null
      : (setValue("Tramite", e.id),
        clearErrors("Tramite"),
        getOfficeCatalogForBusinessProcess(parseInt(e.id)));
  };

  const classes = useStyles();

  const renderSwitch = (param: number) => {
    switch (param) {
      case 0:
        return (
          <div className="card d-flex justify-content-center flex-row p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row mt-5">
                <Col sm={12} className="mb-5 d-flex justify-content-center">
                  <h1>.:: INICIAR UN TRÁMITE ::.</h1>
                </Col>
                <Col sm={6} className="mt-3">
                  <TextField
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label=".:Seleccione un tipo de cliente:."
                    id="state"
                    {...register("CustomerType", { required: true })}
                    onChange={(e) => {
                      setValue("CustomerType", e.target.value);
                      getListCharacterization(parseInt(e.target.value));
                    }}
                  >
                    {listTypeCustumer.map((item: ICustomerType) => (
                      <MenuItem value={item.IDCustomerType}>
                        {item.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span className="text-danger">
                    {errors
                      ? errors.CustomerType?.type === "required" &&
                      "El campo Tipo de Cliente es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={6} className="mt-3">
                  <Autocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={listCharacterization}
                    {...register("Caracterizacion")}
                    onChange={(e, value: any) => {
                      setValue("Caracterizacion", value ? value.id : 0);
                      clearErrors("Caracterizacion");
                      getProcess(value !== null ? value.id : 0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=".:Selecione una caracterización:."
                        fullWidth
                        color="secondary"
                      />
                    )}
                  />
                  <span className="text-danger">
                    {errors
                      ? errors.Caracterizacion?.type === "required" &&
                      "El campo Caracterizacion es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={6} className="mt-3">
                  <Autocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box"
                    options={listaTramites}
                    {...register("Tramite", { required: true })}
                    onChange={(e, value) => onChangeSelect_Process(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=".:Trámite:."
                        fullWidth
                        color="secondary"
                      />
                    )}
                  />
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.IDBusinessProcess?.type === "required" &&
                      "El campo Trámite es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={6} className="mt-3">
                  {listOffice.length > 0 ? (
                    <Autocomplete
                      fullWidth
                      size="small"
                      disablePortal
                      id="forms"
                      options={listOffice}
                      {...register("Sucursal", { required: true })}
                      onChange={(e, value: any) => {
                        setValue("Sucursal", value ? value.id : 0);
                        clearErrors("Sucursal");
                        setTramite(value ? value.label : "No selected");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          color="secondary"
                          label=".:Seleccione una Seccional:."
                          id="state"
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      size="small"
                      fullWidth
                      value={
                        tramite === ""
                          ? ""
                          : "No hay seccionales asignadas a este trámite"
                      }
                      color="secondary"
                      label=".:Seleccione una Seccional:."
                      id="state"
                    ></TextField>
                  )}
                  <span className="text-danger">
                    {errors
                      ? errors.Sucursal?.type === "required" &&
                      "El campo Sucursal es obligatorio."
                      : ""}
                  </span>
                </Col>
                {/* <Col sm={6} className="mt-3">
                  <TextField
                    size="small"
                    color="secondary"
                    id="txtAlpha"
                    label="Código alpha *"
                    fullWidth
                    variant="outlined"
                    {...register("AlphaCode", { required: true })}
                  />
                  <span className="text-danger">
                    {errors
                      ? errors.AlphaCode?.type === "required" &&
                      "El campo Código alpha es obligatorio."
                      : ""}
                  </span>
                </Col> */}
                <Col sm={12} className="mt-3">
                  <TextField
                    value={user}
                    size="small"
                    label="Usuario *"
                    fullWidth
                    color="secondary"
                    id="user"
                    {...register("NombreAccount", { required: true })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => openUser()}>
                            <BsSearch />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onClick={() => openUser()}
                  />
                  <span className="text-danger">
                    {errors
                      ? errors.NombreAccount?.type === "required" &&
                      "El campo Nombre usuario es obligatorio."
                      : ""}
                  </span>
                </Col>
                <Col sm={12} className="mt-3">
                  <Form.Group>
                    <TextField
                      size="small"
                      color="secondary"
                      id="description"
                      label="Descripción"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={5}
                      {...register("Descripcion")}
                    />
                  </Form.Group>
                </Col>
                <Col
                  sm={12}
                  className="d-flex justify-content-center mt-3 mb-5"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-5"
                      type="submit"
                      color="secondary"
                      variant="contained"
                    >
                      CONTINUAR
                    </Button>
                  </ThemeProvider>
                </Col>
                {/*  <input type="submit" value="Guardar" className="btn btn-outline-secondary" /> */}
              </div>
            </form>
            <SSearchPerson
              getShow={closeSearch}
              getPerson={getItem}
              dataShow={show}
            />
          </div>
        );

      case 1:
        return (
          <div className="d-flex mt-2 flex-column w-100 ">
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
                      <TableCell>Descripción del requisito</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Tipo de documento</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listaDocumentos.map((item: any) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{item.DataBeanProperties.Name}</TableCell>
                        <TableCell>
                          {item.DataBeanProperties.Description}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.UptoDate}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.DocumentTypeName}
                        </TableCell>
                        <TableCell>
                          <div className="d-lg-block d-none">
                            {item.DataBeanProperties.DocumentType === 2 && (
                              <Tooltip
                                title={item.DataBeanProperties.DocumentTypeName}
                              >
                                <IconButton
                                  onClick={() => {
                                    openMedia(item.DataBeanProperties.Name);
                                    setBeanAction(item.DataBeanProperties);
                                  }}
                                >
                                  <FaFileUpload />
                                </IconButton>
                              </Tooltip>
                            )}
                            {item.DataBeanProperties.DocumentType === 6 && (
                              <Tooltip
                                title={item.DataBeanProperties.DocumentTypeName}
                              >
                                <IconButton
                                  onClick={() => {
                                    openForm(true);
                                    setTitleDoc(item.DataBeanProperties.Name);
                                    setBeanAction(item.DataBeanProperties);
                                  }}
                                >
                                  <FaWpforms />
                                </IconButton>
                              </Tooltip>
                            )}
                            {item.DataBeanProperties.IsOptional && (
                              <Tooltip title="Omitir documento">
                                <IconButton
                                  onClick={() => {
                                    setShowSkip(true);
                                    setBeanAction(item.DataBeanProperties);
                                  }}
                                >
                                  <BsSkipForwardFill />
                                </IconButton>
                              </Tooltip>
                            )}
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
                              {item.DataBeanProperties.DocumentType === 2 && (
                                <SpeedDialAction
                                  icon={<FaFileUpload />}
                                  tooltipTitle={
                                    item.DataBeanProperties.DocumentTypeName
                                  }
                                  onClick={() => {
                                    openMedia(item.DataBeanProperties.Name);
                                    setBeanAction(item.DataBeanProperties);
                                  }}
                                />
                              )}
                              {item.DataBeanProperties.DocumentType === 6 && (
                                <SpeedDialAction
                                  icon={<FaWpforms />}
                                  tooltipTitle={
                                    item.DataBeanProperties.DocumentTypeName
                                  }
                                  onClick={() => {
                                    openForm(true);
                                    setTitleDoc(item.DataBeanProperties.Name);
                                    setBeanAction(item.DataBeanProperties);
                                  }}
                                />
                              )}
                              {item.DataBeanProperties.IsOptional && (
                                <Tooltip title="Omitir documento">
                                  <IconButton
                                    onClick={() => {
                                      setShowSkip(true);
                                      setBeanAction(item.DataBeanProperties);
                                    }}
                                  >
                                    <BsSkipForwardFill />
                                  </IconButton>
                                </Tooltip>
                              )}
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
                labelRowsPerPage="Columnas por Página"
                component="div"
                count={listaDocumentos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            {/* {listaDocumentos.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => {
                  openMedia(item.DataBeanProperties.Name);
                  setBeanAction(item.DataBeanProperties);
                }}
              >
                <div className="card m-2">
                  <div className="card-header header-card">
                    <h5 className="text-white">{item.DataBeanProperties.Name}</h5>
                  </div>
                  <div className="card-body">
                    <div>
                      <div>
                        <b>Descripción del requisito:</b>
                        <br />
                        {item.DataBeanProperties.Description}
                      </div>
                      <div>
                        <b>Fecha</b>
                        <br />
                        {item.DataBeanProperties.UptoDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
            {showSkip && (
              <GenericConfirmAction
                show={showSkip}
                setShow={setShowSkip}
                confirmAction={skipStep}
                title={"¿Está seguro de omitir el elemento?"}
              />
            )}
            {showM ? (
              <SLoadDocument
                setShow={closeSearchM}
                type={1}
                title={titleDoc}
                getMedia={getItemM}
                show={showM}
              />
            ) : (
              ""
            )}
            {showModalForm && (
              <SLoadForm
                type={1}
                beanAction={beanAction}
                getShowForm={closeForm}
                status={showModalForm}
                title={titleDoc}
                IDProcedureIMP={
                  beanProcedureImp.DataBeanProperties.IDProcedureImp
                }
              />
            )}
          </div>
        );
      default:
        return (
          <div>
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
            <h5 className="w-100 text-center">
              Muchas Gracias!, Su solicitud se encuentra en revisión. Para crear
              un nuevo proceso click{" "}
              <b onClick={() => handleReset()}>
                {" "}
                <u className="pointer"> AQUI</u>
              </b>
            </h5>
          </div>
        );
    }
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <Box sx={{ width: "100%" }}>
          <h2>Iniciar Trámite</h2>
          <Stepper activeStep={activeStep} className={classes.root}>
            {steps.map((label, index) => (
              <Step
                key={label}
                completed={completed[index]}
                disabled={completed[index]}
              >
                <StepButton
                  className="line-out"
                  color="inherit"
                  onClick={handleStep(index)}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <React.Fragment></React.Fragment>
            ) : (
              <React.Fragment>
                <div>Paso {activeStep + 1}</div>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
        <Box sx={{ width: "100%" }}>
          <div>{renderSwitch(activeStep)}</div>
        </Box>
      </div>
      {spinner && <SSpinner show={spinner} />}
    </>
  );
};
