import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeMenu } from "../model/Applicationtype";
import { TextField } from "@material-ui/core";
import { InputAdornment } from "@mui/material";
import { BsTextRight, BsXSquare } from "react-icons/bs";

interface INEMenus {
  closeModal: Function;
  dataShow: boolean;
  dataObj: IApplicationTypeMenu | undefined;
  dataTitle: string;
  idSelected: any;
  getApplicationDACatalog: Function;
}

const _adminService = new AdminService();

export const NEMenus: React.FC<INEMenus> = (props: INEMenus) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const updateApplicationID = (bean: IApplicationTypeMenu) => {
    _adminService.createApplicationID(bean).subscribe((res) => {
      if (res) {
        Toast.fire({
          icon: "success",
          title: "Se ha guardado con éxito!",
        });
        props.getApplicationDACatalog(props.idSelected);
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
        Code: "",
        Name: "",
        URL: "",
        IDLn: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  getValue(props.dataTitle);

  const setShow = () => {
    clearErrors("entity");
    props.closeModal(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.IDApplicationType = parseInt(props.idSelected);
    updateApplicationID(aux);
    props.closeModal(false);
  };

  return (
    <>
      <Modal
        size="sm"
        show={props.dataShow}
        onHide={setShow}
        centered
       
      >
        <Modal.Header>
          {props.dataTitle + " Menú"}
          <BsXSquare  className='pointer' onClick={setShow} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="Código *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Code", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.Code?.type === "required" &&
                      "El campo Código es obligatorio."
                    : ""}
                </span>
              </Col>
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
                  label="URL *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.URL", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.URL?.type === "required" &&
                      "El campo Url es obligatorio."
                    : ""}
                </span>
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
