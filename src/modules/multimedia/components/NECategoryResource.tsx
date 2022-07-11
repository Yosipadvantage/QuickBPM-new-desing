import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button } from "@mui/material";
import { CategoryResource } from "../model/CategoryResource";

const _adminService = new AdminService();

interface INECategoryResource {
  getShow: Function;
  dataShow: boolean;
  dataObj: CategoryResource | undefined;
  dataTitle: string;
}

const NECategoryResource: React.FC<INECategoryResource> = (props: INECategoryResource) => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateCategoriaRecurso = (bean: CategoryResource) => {
    _adminService
      .updateCategoriaRecurso(bean)
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
        Nombre: "",
        Descripcion: ""
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    console.log(data.entity);
    updateCategoriaRecurso(data.entity);
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
        {props.dataTitle} Recurso Categoría
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
                  {...register("entity.Nombre", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Nombre?.type === "required" &&
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
                {...register("entity.Descripcion")}
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

export default NECategoryResource;
