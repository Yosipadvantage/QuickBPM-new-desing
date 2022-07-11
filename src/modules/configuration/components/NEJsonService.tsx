import React, { useEffect, useState } from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsAspectRatio, BsFillSquareFill, BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import {
  ThemeProvider
} from "@mui/material";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button } from "@mui/material";
import { DataForm } from "../model/Form";
import { JsonService } from "../model/JsonService";
import {
  MenuItem
} from "@mui/material";
import { ConfigService } from "../../../core/services/ConfigService";
import { getSession } from "../../../utils/UseProps";

/**
 * Servicios
 */
const _adminService = new AdminService();
const _configService = new ConfigService();

interface INEJsonService {
  getShow: Function;
  dataShow: boolean;
  dataObj: JsonService | undefined;
  dataTitle: string;
  dataType: number;
}

const NEJsonService: React.FC<INEJsonService> = (props: INEJsonService) => {

  const [InputJsonValue, setInputJsonValue] = useState<any>();

  const [URLRequestType, setURLRequestType] = useState<any>(props.dataTitle === 'Editar' ? props.dataObj?.URLRequestType : null);
  const [listURLRequest, setListURLRequest] = useState<any[]>([]);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
    console.log(props.dataObj);
    getValue(props.dataTitle);
    getURLRequestType();
  }, [])


  const updateJsonService = (bean: JsonService) => {
    _adminService.updateJsonService(bean).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        Toast.fire({
          icon: "success",
          title: "Se ha guardado con éxito!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const getURLRequestType = () => {
    /* setShowSpinner(true); */
    _configService.getURLRequestType().subscribe((resp) => {
      console.log(resp);
      /* setShowSpinner(false); */
      if (resp) {
        setListURLRequest(resp.DataBeanProperties.ObjectValue);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Description: "",
        URLService: "",
        IDJsonService: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  const handleFormaterJson = () => {
    console.log(InputJsonValue);
    const aux = JSON.parse(InputJsonValue);
    setInputJsonValue(JSON.stringify(aux, undefined, 2));
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.State = 0;
    aux.IDJsonServiceClass = props.dataType;
    aux.IDEmployee = parseInt(getSession().IDAccount);
    aux.URLRequestType = URLRequestType;
    console.log(aux);
    updateJsonService(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  return (
    <Modal show={props.dataShow} size="lg"   centered onHide={closeModal} >
      <Modal.Header>
        {props.dataTitle} Servicio
        <BsXSquare className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  color="secondary"
                  id="outlined-required"
                  label="Nombre *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Name", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Name?.type === "required" &&
                  "El campo Nombre es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                value={URLRequestType}
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione"
                id="state"
                onChange={(e) => setURLRequestType(parseInt(e.target.value))}
              >
                {listURLRequest.map((item: any) => (
                  <MenuItem value={item.DataBeanProperties.Value}>{item.DataBeanProperties.Property}</MenuItem>
                ))}
              </TextField>
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  color="secondary"
                  id="formurl"
                  label="Url del Servicio *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.URLService", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.URLService?.type === "required" &&
                  "El campo Url del Servicio es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                color="secondary"
                id="outlined-required"
                label="Descripción"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                {...register("entity.Description")}
              /* value={InputJsonValue} */
              /* onChange={(e) =>
                setInputJsonValue(e.target.value)
              } */
              />
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                color="secondary"
                id="outlined-required"
                label="Json"
                fullWidth
                variant="outlined"
                multiline
                rows={15}
                {...register("entity.InputJsonValue")}
              />
            </Col>
            {/* <Col sm={12}>
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    endIcon={<BsAspectRatio />}
                    className="my-3"
                    fullWidth
                    onClick={() => handleFormaterJson()}
                  >
                    Formatear Json
                  </Button>
                </ThemeProvider>
            </Col> */}
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

export default NEJsonService;

