import React, { useEffect, useState } from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button, MenuItem } from "@mui/material";
import { IResponseValue } from "../model/ResponseValue";
import { IResponseValueJson } from "../model/ResponseValueJson";

const _adminService = new AdminService();

interface INEResponseValue {
  getShowNE: Function;
  dataShowNE: boolean;
  dataObjNe: IResponseValue | IResponseValueJson | undefined;
  dataTitleNE: string;  
  refresh: Function;
  IDForm: number | null;
  IDJsonService: number | null;
  dataTitleResponse: string | undefined;
}

const NEResponseValue: React.FC<INEResponseValue> = (
  props: INEResponseValue
) => {
  console.log(props.dataObjNe);
  console.log(props.dataTitleNE);
  console.log(props.dataShowNE);

  const [listTypes, setListTypes] = useState([]);
  const [name, setName] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.Name : ""
  );
  const [showInput, setShowInput] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.LimitedWithValues : false
  );
  const [txtJson, setTxtJson] = useState<any>();
  const [responseClass, setResponseClass] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.ResponseClass : ""
  );
  const [limitedWithValues, setLimitedWithValues] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.LimitedWithValues : ""
  );
  const [limitValues, setLimitValues] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe?.LimitedValues : ""
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
    getJsonDataTypes();
    console.log(props.dataTitleNE);

    getValue(props.dataTitleNE);
  }, [txtJson]);

  const getJsonDataTypes = () => {
    _adminService.getJsonDataTypes().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListTypes(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const addResponseValue = (bean: any) => {
    _adminService.addResponseValue(bean).subscribe((resp) => {
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

  const getValue = (dataTitle: string) => {
    /* if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        LimitedValues: "",
        LimitedWithValues: false,
        ResponseClass: 0,
        IDForm: 0,
        IDResponseValue: null,
      });
    } */
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObjNe);
    }
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.Name = name?.toUpperCase().replaceAll(' ', '_');
    console.log(aux);
    if (aux.LimitedWithValues === "true") {
      aux.LimitedWithValues = true;
    }
    if (aux.LimitedWithValues === "false") {
      aux.LimitedWithValues = false;
    }

    if(props.dataTitleResponse === "Formulario"){
      props.IDForm ? aux.IDForm = props.IDForm : aux.IDForm = null;
    }
    if(props.dataTitleResponse === "Servicio"){
      props.IDJsonService ? aux.IDJsonService = props.IDJsonService : aux.IDJsonService = null;
    }

    if (limitValues) {
      aux.LimitedValues = JSON.parse(limitValues);
    } else {
      aux.LimitedValues = "";
    }
    aux.ResponseClass = responseClass;
    console.log(aux);
    addResponseValue(aux);
  };

  const closeModal = () => {
    clearErrors("entity");    
    props.getShowNE(false);
    props.refresh();
  };

  const classes = useStyles();

  const onChangeComponent = (data: any) => {
    console.log(data);
    if (data === "true") {
      setShowInput(true);
    }
    if (data === "false") {
      setShowInput(false);
      setValue("entity", {
        LimitedValues: "",
      });
    }
  };

  const onChangeFormatter = () => {    
    try {
      let aux = JSON.parse(limitValues ? limitValues : "");
      setTxtJson(JSON.stringify(aux, undefined, 2));
      console.log("Bien casteado");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Formato Incorrecto",
      });
    }
  };

  return (
    <Modal show={props.dataShowNE}   centered onHide={closeModal} >
      <Modal.Header>
        {props.dataTitleNE} Variables de Respuesta
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  size="small"
                  value={name}
                  color="secondary"
                  label="Nombre *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                />
              </ThemeProvider>
              {/* { (getValues("entity.Name") === "") &&
              <span className="text-danger">              
                    "El campo Nombre es obligatorio."                  
              </span>} */}
              {/* <span className="text-danger">
                {errors.entity
                  ? errors.entity.Name?.type === "required" &&
                  "El campo Nombre es obligatorio."
                  : ""}
              </span> */}
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                value={responseClass}
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un tipo"
                {...register("entity.ResponseClass")}
                onChange={(e) => setResponseClass(e.target.value)}
              >
                {listTypes.map((item: any) => (
                  <MenuItem value={item.DataBeanProperties.Value}>
                    {item.DataBeanProperties.Property}
                  </MenuItem>
                ))}
              </TextField>
              {/* <span className="text-danger">
                {errors.entity
                  ? errors.entity.ResponseClass?.type === "required" &&
                  "El campo Tipo es requerido."
                  : ""}
              </span> */}
            </Col>
            {(responseClass === "Number" || responseClass === "String") &&
              <Col sm={12} className="mt-3">
              <TextField
                value={limitedWithValues}
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Limitar valores"
                id="state"
                {...register("entity.LimitedWithValues")}
                onChange={(e) => {
                  onChangeComponent(e.target.value);
                  setLimitedWithValues(e.target.value);
                }}
              >
                <MenuItem value="true">Si</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
              {/* <span className="text-danger">
                {errors.entity
                  ? errors.entity.LimitedWithValues?.type === "required" &&
                  "El campo Lista de Valores es requerido."
                  : ""}
              </span> */}
            </Col>}
            {showInput && (
              <Col sm={12} className="mt-3">
                <TextField
                  value={limitValues}
                  color="secondary"
                  id="outlined-required"
                  label="Valores Cerrados"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={(e) => setLimitValues(e.target.value)}
                /* {...register("entity.LimitedValues")} */
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.LimitedValues?.type === "required" &&
                    "El campo Valores Cerrados es requerido."
                    : ""}
                </span>
                <div className="mt-3">
                  <Button
                    className={classes.button}
                    type="button"
                    variant="contained"
                    color="success"
                    onClick={() => onChangeFormatter()}
                  >
                    FORMATO
                  </Button>
                </div>
              </Col>
            )}
            {showInput && (
              <Col sm={12} className="mt-3">
                <TextField
                  color="secondary"
                  id="outlined-required"
                  label="Formato"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  value={txtJson}
                ></TextField>
              </Col>
            )}
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

export default NEResponseValue;
