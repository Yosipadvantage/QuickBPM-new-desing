import React, { useState } from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button } from "@mui/material";
import { getSession } from "../../../utils/UseProps";

const _adminService = new AdminService();

interface INETypeForms {
  getShow: Function;
  dataShow: boolean;
  dataObj: TypeForm | undefined;
  dataTitle: string;
}

const NETypeForms: React.FC<INETypeForms> = (props: INETypeForms) => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateFormClass = (bean: TypeForm) => {
    _adminService
      .updateFormClass(bean)
      .subscribe(resp => {
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

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Description: "",
        IDFormClass: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.State = 0;
    aux.IDEmployee = parseInt(getSession().IDAccount);
    console.log(aux);
    updateFormClass(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  return (
    <Modal show={props.dataShow}   centered onHide={closeModal} >
      <Modal.Header>
        {props.dataTitle} Tipo de Formulario
        <BsXSquare  className='pointer' onClick={closeModal} />
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

export default NETypeForms;
