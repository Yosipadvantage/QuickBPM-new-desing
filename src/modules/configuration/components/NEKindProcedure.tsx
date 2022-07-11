import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { InputAdornment, TextField, Button } from "@mui/material";
import { ThemeProvider } from "@material-ui/core";


import { ConfigService } from "../../../core/services/ConfigService";
import {
  characterizationUpdateOk,
  createCharacterizationOk,
} from "../../../actions/AConfig";
import { Characterization } from "../model/Characterization";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";


const _configService = new ConfigService();
interface INEKindProcedure {
  getShow: Function,
  dataShow: boolean,
  dataObj: Characterization | undefined,
  dataTitle: string
}

const NEKindProcedure: React.FC<INEKindProcedure> = (props: INEKindProcedure) => {

  const dispatch = useDispatch();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateBusinessClass = (bean: Characterization) => {
    console.log(bean);
    _configService
      .updateBusinessClass(bean)
      .subscribe(resp => {
        console.log(resp);
        if (resp) {
          if (props.dataTitle === "Crear") {
            dispatch(createCharacterizationOk(resp))
          } else {
            dispatch(characterizationUpdateOk(resp));
          }
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha guardado con éxito!",
          });
        }
      });
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      if (props.dataObj) {
        setValue("entity", {
          Description: "",
          Name: "",
          IDBusinessClass: null,
        });
      }
    }
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    updateBusinessClass(data.entity);
    closeModal();
  };

  const classes = useStyles();

  return (
    <Modal show={props.dataShow}   centered onHide={closeModal} >
      <Modal.Header>
        {props.dataTitle} Clase de Trámite
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
                    )
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
                color="secondary"
                id="outlined-required"
                label="Descripción"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                {...register("entity.Description")}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-element">
            <Button className={classes.button} variant="contained" color="error" onClick={closeModal}>CANCELAR</Button>
          </div>
          <div className="modal-element">
            <Button className={classes.button} type="submit" variant="contained" color="success">GUARDAR</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal >
  );
}

export default NEKindProcedure;
