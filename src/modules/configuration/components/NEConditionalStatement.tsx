import React, { useEffect, useState } from "react";

import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { InputAdornment, TextField, Button, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";

import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { IConditionStatement } from "../model/ConditionStatement";

const _adminService = new AdminService();

/* refresh: Function; */
interface INEConditionStatement {
  getShowNE: Function;
  dataShowNE: boolean;
  dataObjNe: IConditionStatement | undefined;
  dataTitleNE: string;
  dataIDProcedure: any;
  dataIDBusinessProcess: number
}

const NEConditionStatement: React.FC<INEConditionStatement> = (
  props: INEConditionStatement
) => {
  console.log(props.dataObjNe);
  console.log(props.dataTitleNE);
  console.log(props.dataShowNE);

  const [listListFlowControl, setListFlowControl] = useState([]);
  const [listExcluding, setListExcluding] = useState([]);
  const [listProcedureCatalog, setProcedureCatalog] = useState([]);
  const [listResponseValue, setListResponseValue] = useState([]);
  const [listConditionalOpe, setListConditionalOpe] = useState([]);
  const [listProcedureBusiness, setListProcedureBusiness] = useState([]);
  const [flowControl, setFowControl] = useState("");
  const [showType, setShowType] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [idProcedureDestination, setIdProcedureDestination] = useState(
    props.dataTitleNE === "Editar"
      ? props.dataObjNe?.IDProcedureDestination
      : null
  );
  const [flowControlOperator, setFlowControlOperator] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.FlowControlOperator : null
  );
  const [idProcedureSource, setIdProcedureSource] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.IDProcedureSource : props.dataIDProcedure
  );
  const [idDocument, setIdDocument] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.IDDocument : null
  );
  const [idResponseValue, setIdResponseValue] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.IDResponseValue : null
  );

  const [conditionalOperator, setConditionalOperator] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.ConditionalOperator : null
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
  } = useForm();

  useEffect(() => {
    console.log(props.dataIDProcedure);
    console.log(props.dataIDBusinessProcess);
    getProcedureCatalog(props.dataIDBusinessProcess);
    getProcedureDocumentCatalog(props.dataIDProcedure);
    getProcedureListExcluding(props.dataIDProcedure);
    getValue(props.dataTitleNE);
    getFlowControlOperators();
  }, []);

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Editar") {
      if (flowControlOperator) {
        getConditionalOperators(flowControlOperator);
      }
      if (idProcedureSource) {
        getProcedureDocumentCatalog(idProcedureSource);
      }
      if (idDocument) {
        getResponseValueForDocument(idDocument);
      }
      if (flowControlOperator !== "GOTO") {
        setShowType(true);
        setShowDocument(true);
        /* setShowProcedureDocument(true); */
        setShowIndex(true);
      }
      setValue("entity", {
        IDConditionStatement: props.dataObjNe?.IDConditionStatement,
        IDProcedureDestination: props.dataObjNe?.IDProcedureDestination,
        FlowControlOperator: props.dataObjNe?.FlowControlOperator,
        IDResponseValue: props.dataObjNe?.IDResponseValue,
        IDDocument: props.dataObjNe?.IDDocument,
        ConditionalValue: props.dataObjNe?.ConditionalValue,
        ConditionalRow: props.dataObjNe?.ConditionalRow
      });
    }
  };

  const getProcedureListExcluding = (idProcedure: number) => {
    _adminService.getProcedureListExcluding(idProcedure).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListExcluding(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getFlowControlOperators = () => {
    _adminService.getFlowControlOperators().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListFlowControl(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const requiresVariable = (flowControl: any) => {
    _adminService.requiresVariable(flowControl).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setShowType(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getProcedureDocumentCatalog = (idProcedure: number) => {
    console.log(idProcedure);
    _adminService.getProcedureDocumentWithJsonFormAndJsonService(idProcedure).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setProcedureCatalog(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getResponseValueForDocument = (idDocument: any) => {
    console.log(idDocument);
    _adminService.getResponseValueForDocument(idDocument).subscribe((resp) => {
      console.log(resp);
      if (resp.DataBeanProperties.ObjectValue) {
        setListResponseValue(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getConditionalOperators = (flowControl: any) => {
    _adminService.getConditionalOperators(flowControl).subscribe((resp) => {      
      if (resp) {
        setListConditionalOpe(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getProcedureCatalog = (idBusinessProcess: number) => {
    _adminService.getProcedureCatalog(idBusinessProcess).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListProcedureBusiness(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const addFlowControlStatement = (
    idConditionStatement: any,
    idProcedure: number,
    idProcedureDestinity: number,
    idProcedureSource: number,
    flowControl: string,
    conditionalOperator: any,
    idDocument: any,
    idResponseValue: number,
    value: string
  ) => {
    _adminService
      .addFlowControlStatement(
        idConditionStatement,
        idProcedure,
        idProcedureDestinity,
        idProcedureSource,
        flowControl,
        conditionalOperator,
        idDocument,
        idResponseValue,
        value
      )
      .subscribe((resp) => {
        console.log(resp);
        if (resp) {
          if (resp.DataBeanProperties.ObjectValue) {
            closeModal();
            Toast.fire({
              icon: "success",
              title: "Se ha guardado con éxito!",
            });
          } else if (resp.DataBeanProperties.ErrorMessage) {
            closeModal();
            Toast.fire({
              icon: "warning",
              title: `${resp.DataBeanProperties.ErrorMessage}`,
            });
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción",
          });
        }
      });
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    console.log(props.dataIDProcedure,
      aux.IDProcedureDestination,
      aux.FlowControlOperator,
      aux.ConditionalOperator,
      aux.IDDocument,
      aux.IDResponseValue,
      aux.ConditionalValue);

    if (props.dataTitleNE === "Crear") {
      addFlowControlStatement(
        null,
        props.dataIDProcedure,
        aux.IDProcedureDestination,
        aux.IDProcedureSource,
        aux.FlowControlOperator,
        aux.ConditionalOperator,
        aux.IDDocument,
        aux.IDResponseValue,
        aux.ConditionalValue
      );
    }
    if (props.dataTitleNE === "Editar") {
      addFlowControlStatement(
        aux.IDConditionStatement,
        props.dataIDProcedure,
        aux.IDProcedureDestination,
        aux.IDProcedureSource,
        aux.FlowControlOperator,
        aux.ConditionalOperator,
        aux.IDDocument,
        aux.IDResponseValue,
        aux.ConditionalValue
      );
    }
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShowNE(false);
  };

  const classes = useStyles();

  const onChangeDocument = (data: any) => {
    console.log(data);
    getResponseValueForDocument(data);
    setShowDocument(true);
  };

  const changeFlowControl = (data: any) => {
    console.log(data);
    setFowControl(data);
    setShowDocument(false);
    requiresVariable(data);
    getConditionalOperators(data);
  };

  const onChangeBusiness = (idProcedure: any) => {
    getProcedureDocumentCatalog(idProcedure);
  };

  return (
    <Modal
      show={props.dataShowNE}
      
      size="xl"
      centered
     onHide={closeModal}
    >
      <Modal.Header>
        {props.dataTitleNE} Control de Flujo
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col sm={3} className="text-center mt-3">
              <b>
                <label>Seleccione condición</label>
              </b>
            </Col>
            <Col sm={9} className="mt-3">
              <TextField
                value={flowControlOperator}
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione condición"
                {...register("entity.FlowControlOperator")}
                onChange={(e) => {
                  changeFlowControl(e.target.value);
                  setFlowControlOperator(e.target.value);
                }}
              >
                {listListFlowControl.map((item: any) => (
                  <MenuItem value={item.DataBeanProperties.Property}>
                    {item.DataBeanProperties.Value}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
          </Row>
          <Row>
            {showType && (
              <Col sm={3} className="text-center mt-3">
                <b>
                  <label>Seleccione variable</label>
                </b>
              </Col>
            )}
            {showType &&
              <Col sm={3}>
                <TextField
                  value={idProcedureSource}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione un procedimiento"
                  id="state"
                  {...register("entity.IDProcedureSource")}
                  onChange={(e) => {
                    onChangeBusiness(e.target.value);
                    setIdProcedureSource(parseInt(e.target.value));
                  }}
                >
                  {listProcedureBusiness.map((item: any) => (
                    <MenuItem value={item.DataBeanProperties.IDProcedure}>
                      {item.DataBeanProperties.IDProcedure} - {item.DataBeanProperties.Name}
                    </MenuItem>
                  ))}
                </TextField>  
              </Col>}
            {showType &&
              <Col sm={3}>
                <TextField
                  value={idDocument}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione un documento"
                  id="state"
                  {...register("entity.IDDocument")}
                  onChange={(e) => {
                    onChangeDocument(e.target.value);
                    setIdDocument(parseInt(e.target.value));
                  }}
                >
                  {listProcedureCatalog.map((item: any) => (
                    <MenuItem value={item.DataBeanProperties.IDDocument}>
                      {item.DataBeanProperties.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </Col>
            }
            {(idDocument !== null && flowControlOperator !== "GOTO") &&
                <Col sm={3}>
                  <TextField
                    value={idResponseValue}
                    margin="normal"
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label="Seleccione una variable"
                    id="state"
                    {...register("entity.IDResponseValue")}
                    onChange={(e) => {
                      setIdResponseValue(parseInt(e.target.value));                                            
                    }}
                  >
                    {listResponseValue.map((item: any) => (
                      <MenuItem value={item.DataBeanProperties.IDResponseValue}>
                        {item.DataBeanProperties.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Col>                        
            }
          </Row>
          <Row>
            {showType && (
              <Col sm={3} className="text-center mt-3">
                <b>
                  <label>Seleccione operador lógico</label>
                </b>
              </Col>
            )}
            {showType && (
              <Col sm={9}>
                <TextField
                  value={conditionalOperator}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione una condición"
                  id="state"
                  {...register("entity.ConditionalOperator")}
                  onChange={(e) => {
                    setConditionalOperator(e.target.value);
                  }}
                >
                  {listConditionalOpe.map((item: any) => (
                    <MenuItem value={item.DataBeanProperties.Property}>
                      {item.DataBeanProperties.Value}
                    </MenuItem>
                  ))}
                </TextField>
              </Col>
            )}
          </Row>
          <Row>
            {showType && (
              <Col sm={3} className="text-center mt-3">
                <b>
                  <label>Valor a comparar</label>
                </b>
              </Col>
            )}
            {showType && (
              <Col sm={9} className="mt-3">
                <ThemeProvider theme={inputsTheme}>
                  <TextField
                    size="small"
                    color="secondary"
                    label="Ingrese un valor"
                    fullWidth
                    variant="outlined"
                    {...register("entity.ConditionalValue")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <BsJustifyRight />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ThemeProvider>
              </Col>
            )}
          </Row>
          <Row>
            <Col sm={3} className="text-center mt-3">
              <b>
                <label>Seleccione destino</label>
              </b>
            </Col>
            <Col sm={9} className="mt-3">
              <TextField
                value={idProcedureDestination}
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un procedimiento"
                {...register("entity.IDProcedureDestination")}
                onChange={(e) =>
                  setIdProcedureDestination(parseInt(e.target.value))
                }
              >
                {listExcluding.map((item: any) => (
                  <MenuItem value={item.DataBeanProperties.IDProcedure}>
                    {item.DataBeanProperties.IDProcedure} - {item.DataBeanProperties.Name}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-element">
            <Button
              className={classes.button}
              variant="contained"
              color="error"
              onClick={closeModal}
            >
              CANCELAR
            </Button>
          </div>
          <div className="modal-element">
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="success"
            >
              GUARDAR
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default NEConditionStatement;
