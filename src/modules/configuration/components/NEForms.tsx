import React, { useEffect, useState } from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
  InputAdornment,
  TextField,
  Button,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import { DataForm } from "../model/Form";
import { PreviewFormDialog } from "./PreviewFormDialog";
import { getSession } from "../../../utils/UseProps";

const _adminService = new AdminService();

interface INEForms {
  getShow: Function;
  dataShow: boolean;
  dataObj: DataForm | undefined;
  dataTitle: string;
  dataType: number;
  openResponseValue: Function
}

const NEForms: React.FC<INEForms> = (props: INEForms) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [showInput, setShowInput] = useState(
    props.dataTitle === "Editar" ? props.dataObj?.HtmlStored : false
  );

  const [HtmlStored, setHtmlStored] = useState(
    props.dataTitle === "Editar" ? props.dataObj?.HtmlStored : ""
  );

  const [open, setOpen] = useState(false);

  const updateForm = (bean: DataForm) => {
    _adminService.updateForm(bean).subscribe((resp) => {
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
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.State = 0;
    aux.IDFormClass = props.dataType;
    console.log(aux.HtmlBodyText);
    aux.IDEmployee = parseInt(getSession().IDAccount);
    console.log(aux);
    updateForm(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  const onChangeComponent = (data: any) => {
    console.log(data);
    if (data === "true") {
      setShowInput(true);
    }
    if (data === "false") {
      setShowInput(false);
    }
  };

  return (
    <Modal
      show={props.dataShow}
      size="xl"
      centered
      onHide={closeModal}
    >
      <Modal.Header>
        {props.dataTitle} Formulario
        <BsXSquare className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={6} className="mt-3">
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
                  ),
                }}
                {...register("entity.Name", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Name?.type === "required" &&
                  "El campo Nombre es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={6} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="formengine"
                label="Código *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  ),
                }}
                {...register("entity.Code", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Code?.type === "required" &&
                  "El campo Url de Código es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="formengine"
                label="Url de Formulario *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  ),
                }}
                {...register("entity.FormURLComponent", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.FormEngine?.type === "required" &&
                  "El campo Url de Formulario es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="outlined-required"
                label="Descripción"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                {...register("entity.Description")}
              />
            </Col>
            {(props.dataTitle === "Editar") &&
              <Col sm={12} className="mt-3 d-flex justify-content-center">
                <ThemeProvider theme={inputsTheme}>
                  <Button className="w-100" color="secondary" variant="contained" onClick={() => setOpen(true)}>
                    VER CAMPOS DE RESPUESTA
                  </Button>
                </ThemeProvider>
              </Col>}
            <Col sm={12} className="mt-3">
              <TextField
                value={HtmlStored}
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Html Almacenado"
                id="state"
                {...register("entity.HtmlStored", { required: true })}
                onChange={(e) => {
                  onChangeComponent(e.target.value);
                  setHtmlStored(e.target.value);
                }}
              >
                <MenuItem value="true">Si</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.HtmlStored?.type === "required" &&
                  "El campo Html Almacenado es requerido."
                  : ""}
              </span>
            </Col>
            {showInput && (
              <Col sm={12} className="mt-3">
                <TextField
                  size="small"
                  color="secondary"
                  id="outlined-required"
                  label="HtmlBodyText"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={10}
                  {...register("entity.HtmlBodyText")}
                />
              </Col>
            )}
            {showInput && (
              <Col sm={12} className="mt-3">
                <TextField
                  size="small"
                  color="secondary"
                  id="outlined-required"
                  label="HtmlExtraText"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  {...register("entity.HtmlExtraText")}
                />
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
      <PreviewFormDialog
        open={open}
        setOpen={setOpen}
        dataObjID={props.dataObj?.IDForm}
        openResponseValue={props.openResponseValue}
      />
    </Modal>
  );
};

export default NEForms;
