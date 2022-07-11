import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeRole } from "../model/Applicationtype";
import { InputAdornment, TextField } from "@mui/material";

interface INERole {
  getShow: Function;
  dataShow: boolean;
  dataObj: IApplicationTypeRole | undefined;
  dataTitle: string;
  refreshList: Function;
}

const _adminService = new AdminService();

export const NERole: React.FC<INERole> = (props: INERole) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();


  const updateRole = (bean: IApplicationTypeRole) => {
    _adminService
      .updateRole(bean)
      .subscribe(res => {
        if (res) {
          props.refreshList();
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!",
          });
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción.",
          });

        }
      })
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Description: "",
        State: "",
        IDApplicationType: null,
      });
    } else if (dataTitle === "Editar") {
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
    updateRole(data.entity);
    /* props.refreshList(); */
    closeModal();
  };

  return (
    <>
      <Modal show={props.dataShow} centered onHide={closeModal}  >
        <Modal.Header>
          {props.dataTitle + " Rol"}
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={6}>
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
                    )
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
              <Col sm={6}>
                <TextField
                  color="secondary"
                  id="outlined-required"
                  label="Estado"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.State", { required: true })}
                />
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
            <Button variant="danger" onClick={closeModal}>
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
