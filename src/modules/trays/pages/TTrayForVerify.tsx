import React, { useEffect, useState } from "react";

import {
  IconButton,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  SpeedDial,
  SpeedDialAction,
  Stepper,
  Box,
  Step,
  StepButton,
  TablePagination,
  ButtonGroup,
  Tooltip,
  ThemeProvider,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { BsCheck2, BsCheckSquare, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import SLoadForm from "../../../shared/components/SLoadForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { SButtonHistory } from "../../../shared/components/SButtonHistory";
import { SSpinner } from "../../../shared/components/SSpinner";

import { SuscriptionService } from "../../../core/services/SuscriptionService";
import { FileService } from "../../../core/services/FileService";
import { getSession } from "../../../utils/UseProps";

const _suscripcionService = new SuscriptionService();
const _files = new FileService();

interface ITrayForVerify {}

export const TTrayForVerify: React.FC<ITrayForVerify> = () => {
  const [listProcedureImp, setListProcedureImp] = useState([]);
  const [IDProcedureAction, setProcedureAction] = useState(0);
  const [beanProcedureImp, setBeanProcedure] = useState<any>();
  const [listDocuments, setDocuments] = useState([]);
  const steps = ["Seleccione trámite", "Verificar Documentacion"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [titleDoc, setTitleDoc] = useState("");

  const [show, setShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [beanAction, setBeanAction] = useState<any>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [showDelete, setShowDelete] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  useEffect(() => {
    getProcedureImpForVerify();
    setRowsPerPage(parseInt(items));
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

  const openModal = (idProcedureAction: number) => {
    setShow(true);
    setProcedureAction(idProcedureAction);
    setValue("Description", "");
  };

  const closeModal = () => {
    setShow(false);
  };
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const getProcedureImpForVerify = async () => {
    setShowSpinner(true);
    await _suscripcionService
      .getProcedureImpForVerify(parseInt(getSession().IDAccount))
      .then((resp: any) => {
        console.log(resp);
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          setListProcedureImp(resp.data.DataBeanProperties.ObjectValue);
          
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
         
        }
      })
      .catch((e) => {
        console.error(e);
        
      });
  };
  const seleccionar = (bean: any) => {
    setBeanProcedure(bean);
    getProcedureActionForVerify(bean.IDProcedureImp);
    handleComplete();
  };

  const statusModalForm = (status: boolean) => {
    setShowModalForm(status);
  };

  const getProcedureActionForVerify = async (IDProcedureImp: number) => {
    await _suscripcionService
      .getProcedureActionForVerify(
        parseInt(getSession().IDAccount),
        IDProcedureImp
      )
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          if (resp.data.DataBeanProperties.ObjectValue.length === 0) {
            handleComplete();
          }
          setDocuments(resp.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const aprobarDoc = async () => {
    await _suscripcionService
      .verifyProcedureAction(IDProcedureAction, "aprobado!!")
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          getProcedureActionForVerify(beanProcedureImp.IDProcedureImp);
          if (listDocuments.length === 0) {
            handleComplete();
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    rechazar(data.Description);
  };
  const rechazar = async (descripcion: string) => {
    console.log(IDProcedureAction, descripcion);
    await _suscripcionService
      .declineProcedureAction(IDProcedureAction, descripcion)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          getProcedureActionForVerify(beanProcedureImp.IDProcedureImp);
          closeModal();
          if (listDocuments.length === 0) {
            handleComplete();
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const renderSwitch = (param: number) => {
    switch (param) {
      case 0:
        return (
          <div className="w-100 d-flex h-100 flex-wrap justify-content-xl-start justify-content-sm-center">
            {listProcedureImp.length > 0 ? (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className={classes.root}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Fecha de inicio</TableCell>
                        <TableCell>Solicitante</TableCell>
                        <TableCell>Código Trámite</TableCell>
                        <TableCell>Trámite</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listProcedureImp
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item: any) => (
                          <TableRow
                            hover
                            key={item.DataBeanProperties.IDProcedureImp}
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <TableCell>
                              {item.DataBeanProperties.IDProcedureImp}
                            </TableCell>
                            <TableCell
                              style={{
                                width: "20%",
                              }}
                            >
                              {item.DataBeanProperties.Since}
                            </TableCell>
                            <TableCell
                              style={{
                                width: "30%",
                              }}
                            >
                              <b>Documento:</b>{" "}
                              {item.DataBeanProperties.AccountID}
                              <div className="mt-1">
                                <b>Nombre:</b>{" "}
                                {item.DataBeanProperties.AccountName}
                              </div>
                              <div className="mt-1">
                                <b>Observación:</b>{" "}
                                {item.DataBeanProperties.Description}
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                width: "25%",
                              }}
                            >
                              {item.DataBeanProperties.AlphaCode}
                            </TableCell>
                            <TableCell
                              style={{
                                width: "30%",
                              }}
                            >
                              <b>Nombre:</b> {item.DataBeanProperties.Name}
                              <div className="mt-1">
                                <b>Etapa actual:</b>{" "}
                                {item.DataBeanProperties.ProcedureName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="d-lg-flex d-none">
                                <SButtonHistory
                                  idProcedure={
                                    item.DataBeanProperties.IDProcedureImp
                                  }
                                  type={2}
                                />
                                <ButtonGroup>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title="Seleccionar">
                                      <Button
                                        variant="contained"
                                        className="box-s mr-3 mt-2 mb-2"
                                        color="secondary"
                                        onClick={() =>
                                          seleccionar(item.DataBeanProperties)
                                        }
                                      >
                                        <BsCheckSquare />
                                      </Button>
                                    </Tooltip>
                                  </ThemeProvider>
                                </ButtonGroup>
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
                                  <SpeedDialAction
                                    icon={<BsCheckSquare />}
                                    tooltipTitle="Seleccionar"
                                    onClick={() =>
                                      seleccionar(item.DataBeanProperties)
                                    }
                                  />
                                </SpeedDial>
                                <SButtonHistory
                                  idProcedure={
                                    item.DataBeanProperties.IDProcedureImp
                                  }
                                  type={2}
                                />
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
                  count={listProcedureImp.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            ) : (
              <div className="w-100 d-flex justify-content-center">
                <h1 className="text-muted h-100">
                  No hay procesos por Verificar :(
                </h1>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <div className="w-100 d-flex flex-wrap justify-content-lg-start justify-content-sm-center">
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className={classes.root}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre del documento</TableCell>
                        <TableCell>Fecha de carga</TableCell>
                        <TableCell>Documento del solicitante</TableCell>
                        <TableCell>Nombre del solicitante</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listDocuments
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item: any) => (
                          <TableRow
                            key={item.DataBeanProperties.IDAction}
                            hover
                            role="checkbox"
                            tabIndex={-1}
                          >
                            <TableCell>
                              {item.DataBeanProperties.ProcedureActionName}
                            </TableCell>
                            <TableCell>
                              {item.DataBeanProperties.UptoDate}
                            </TableCell>
                            <TableCell>
                              {item.DataBeanProperties.AccountID}
                            </TableCell>
                            <TableCell>
                              {item.DataBeanProperties.AccountName}
                            </TableCell>
                            {item.DataBeanProperties.Url && (
                              <TableCell>
                                {" "}
                                <a
                                  href={_files.getUrlFile(
                                    item.DataBeanProperties.MediaContext,
                                    item.DataBeanProperties.Media
                                  )}
                                >
                                  {item.DataBeanProperties.Media}
                                </a>
                              </TableCell>
                            )}
                            {item.DataBeanProperties.IDForm &&
                              item.DataBeanProperties.ResponseJsonValue && (
                                <TableCell
                                  className="textDecoration"
                                  onClick={() => (
                                    statusModalForm(true),
                                    setBeanAction(item.DataBeanProperties),
                                    setTitleDoc(item.DataBeanProperties.Name)
                                  )}
                                >
                                  {item.DataBeanProperties.ProcedureName}
                                </TableCell>
                              )}
                            <TableCell>
                              <div className="d-lg-flex d-none">
                                <Tooltip title="Aprobar Documento">
                                  <Button
                                    className="mr-2 mt-2 mb-2"
                                    variant="contained"
                                    color="success"
                                    onClick={() => (
                                      setShowDelete(true),
                                      setProcedureAction(
                                        item.DataBeanProperties.IDAction
                                      )
                                    )}
                                  >
                                    <BsCheck2 />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Rechazar Documento">
                                  <Button
                                    className="ml-2 mt-2 mb-2"
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                      openModal(
                                        item.DataBeanProperties.IDAction
                                      )
                                    }
                                  >
                                    <BsXSquare  className='pointer' />
                                  </Button>
                                </Tooltip>
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
                                  <SpeedDialAction
                                    icon={<BsCheck2 />}
                                    tooltipTitle="Aprobar Documento"
                                    onClick={() => (
                                      setShowDelete(true),
                                      setProcedureAction(
                                        item.DataBeanProperties.IDAction
                                      )
                                    )}
                                    // aprobarDoc(item.DataBeanProperties.IDAction)
                                  />
                                  <SpeedDialAction
                                    onClick={() =>
                                      openModal(
                                        item.DataBeanProperties.IDAction
                                      )
                                    }
                                    icon={<BsXSquare/>}
                                    tooltipTitle="Rechazar Documento"
                                  />
                                  )
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
                  count={listDocuments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              {showModalForm && (
                <SLoadForm
                  beanAction={beanAction}
                  status={showModalForm}
                  title={titleDoc}
                  type={2}
                  getShowForm={statusModalForm}
                  IDProcedureIMP={beanProcedureImp.IDProcedureImp}
                />
              )}
              {show && (
                <Modal
                  size="sm"
                  show={show}
                  onHide={closeModal}
                  centered
                   
                >
                  <Modal.Header>
                    Rechazar
                    <BsXSquare  className='pointer' onClick={closeModal} />
                  </Modal.Header>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                      <Row className="mt-3">
                        <Col sm={12}>
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control "
                            as="textarea"
                            {...register("Description", { required: true })}
                          />
                          <span className="text-danger">
                            {errors
                              ? errors.Description?.type === "required" &&
                                "El campo Descripción es obligatorio."
                              : ""}
                          </span>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="btn btn-danger" onClick={closeModal}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-success">
                        Guardar
                      </button>
                    </Modal.Footer>
                  </form>
                </Modal>
              )}
              {showDelete && (
                <GenericConfirmAction
                  show={showDelete}
                  setShow={setShowDelete}
                  confirmAction={aprobarDoc}
                  title="¿Está seguro de aprobar?"
                />
              )}
            </div>
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
              Muchas Gracias!, Ya quedo gestionado el proceso. Para seguir con
              otro proceso click{" "}
              <b
                onClick={() => {
                  handleReset();
                  getProcedureImpForVerify();
                }}
              >
                {" "}
                <u className="pointer"> AQUI</u>
              </b>
            </h5>
          </div>
        );
    }
  };

  const classes = useStyles();

  return (
    <>
      <div className="nWhite p-3 m-3 w-100">
        <Box sx={{ width: "100%" }}>
          <h2>Trámites por Verificar</h2>
          <Stepper activeStep={activeStep} className={classes.root}>
            {steps.map((label, index) => (
              <Step
                key={index}
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
          <div className="mt-3 d-flex justify-content-end">
            {activeStep > 0 && (
              <Button
                startIcon={<MdKeyboardArrowLeft />}
                disabled={activeStep === 0}
                style={{ backgroundColor: "#553F73", color: "#FFFFFF" }}
                onClick={() => handleBack()}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
            )}
          </div>
        </Box>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                {" "}
                <b> Paso actual</b>: {steps[activeStep]}
              </div>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
              </Box>
            </React.Fragment>
          )}
        </div>
        <Box sx={{ width: "100%" }}>
          <div>{renderSwitch(activeStep)}</div>
        </Box>
      </div>
      {showSpinner && <SSpinner show={showSpinner} />}
    </>
  );
};
