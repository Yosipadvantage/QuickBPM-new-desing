import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsTextRight, BsXSquare } from "react-icons/bs";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { SystemProperty } from "../model/SystemPropertie";
import { InputAdornment } from "@mui/material";
import { TextField } from "@material-ui/core";

interface INESystemProperties {
  getShow: Function;
  dataShow: boolean;
  dataObj: SystemProperty | undefined;
  dataTitle: string;
}

const _adminService = new AdminService();

export const NESystemProperties: React.FC<INESystemProperties> = (
  props: INESystemProperties
) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateupdateSystemProperty = (bean: SystemProperty) => {
     _adminService
      .updateSystemProperty(bean)
      .subscribe(res => {
        if (res) {
          setShow();
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
      })
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Description: "",
        AppName: "",
        SystemValue: "",
        IDSystemProperty: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const setShow = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    updateupdateSystemProperty(data.entity);
  };

  return (
    <>
      <Modal show={props.dataShow}  centered  onHide={setShow}>
        <Modal.Header>
          {props.dataTitle} Propiedad
          <BsXSquare  className='pointer' onClick={setShow} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="Nombre *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
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
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="App Name *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.AppName", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.AppName?.type === "required" &&
                      "El campo AppName es obligatorio."
                    : ""}
                </span>
              </Col>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="System Value *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.SystemValue", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.SystemValue?.type === "required" &&
                      "El campo System Value es obligatorio."
                    : ""}
                </span>
              </Col>
              <Col sm={12} className="mt-3">
                <TextField
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
            <Button variant="danger" onClick={setShow}>
              CANCELAR
            </Button>
            <Button type="submit" variant="success">
              GUARDAR
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
