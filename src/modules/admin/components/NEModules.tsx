import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeModule } from "../model/Applicationtype";
import { TextField } from "@material-ui/core";
import { IconButton, InputAdornment, ThemeProvider, Button, ButtonGroup } from "@mui/material";
import { BsTextRight, BsXSquare } from "react-icons/bs";
import { inputsTheme } from "../../../utils/Themes";
import { ICONS } from '../components/Icon'
import { MSelectIcon } from '../components/MSelectIcon'
interface INEModules {
  getShow: Function;
  dataShow: boolean;
  dataObj: IApplicationTypeModule | undefined;
  dataTitle: string;
}

const _adminService = new AdminService();

export const NEModules: React.FC<INEModules> = (props: INEModules) => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
    getValue(props.dataTitle);
  }, [])

  const [icon, setIcon] = useState(0);
  const [showIcon, setShowIcon] = useState(false);
  const [name, setName] = useState(props.dataObj ? props.dataObj.Name : '');

  const updateApplicationType = (bean: IApplicationTypeModule) => {
    _adminService.updateApplicationType(bean).subscribe(res => {
      console.log(res);
      if (res) {
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
        Purpose: "",
        IDApplicationType: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
      setIcon(props.dataObj !== undefined ? props.dataObj.Type : 0)
    }
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    data.entity.Type = icon
    updateApplicationType(data.entity);
    closeModal();
  };

  return (
    <>
      <Modal
        size="sm"
        show={props.dataShow}
        onHide={closeModal}
        centered
       
      >
        <Modal.Header>
          {props.dataTitle + " Módulo"}
          <BsXSquare className='pointer' onClick={closeModal} />
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
              </Col>
              <Col sm={12} className="mt-3 d-flex flex-row justify-content-between">
                <IconButton className='mr-3' >
                  {ICONS[icon]}
                </IconButton>
                <ThemeProvider theme={inputsTheme}>
                  <Button className="w-100" variant="contained" color="secondary"
                    onClick={() => { setShowIcon(true) }}
                  >
                    CAMBIAR ICONO
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-3">
                <TextField
                  id="outlined-required"
                  label="Propósito *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsTextRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Purpose", { required: true })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="contained" color="error" onClick={closeModal}>
              CANCELAR
            </Button>
            <Button className="ml-3" variant="contained" type='submit' color="success">
              GUARDAR
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {showIcon &&
        <MSelectIcon show={showIcon} setShow={setShowIcon} icon={icon} setIcon={setIcon} nombreModulo={name} />
      }
    </>
  );
};
