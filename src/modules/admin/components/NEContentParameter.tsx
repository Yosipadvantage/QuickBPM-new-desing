import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";

import React, { useEffect, useState } from "react";
import { ListParameter } from "../model/ListParameter";
import { InputAdornment, TextField } from "@mui/material";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { SSpinner } from "../../../shared/components/SSpinner";

interface INEContentParameter {
  getShow: Function,
  dataShow: boolean,
  dataObj: ListParameter | undefined,
  dataTitle: string,
  IDTipoLista: string,
  refreshList: Function,
  codeList: number[],
  id: number
}

const _adminService = new AdminService();

const NEContentParameter: React.FC<INEContentParameter> = (props: INEContentParameter) => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [spinner, setSpinner] = useState(false);
  const [beforeCode, setBeforeCode] = useState('-1');

  useEffect(() => {
    getValue(props.dataTitle);
  }, [])

  const update = (bean: any) => {
    setSpinner(true);
    _adminService
      .updateListaParametros(bean)
      .subscribe(rps => {
        setSpinner(false);
        if (rps) {
          props.refreshList(props.id);
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se podido completar la acción"
          })
        }
      })
    closeModal();
  };

  const updateListaParametros = (bean: any) => {
    if (props.dataTitle === 'Editar') {
      if (beforeCode === bean.CodigoP) {
        update(bean);
      } else {
        if (props.codeList.includes(bean.CodigoP)) {
          Toast.fire({
            icon: "warning",
            title: "El Código " + bean.CodigoP + " ya está en uso",
          })
        }
        else {
          update(bean);
        };
      }
    } else {
      if (props.codeList.includes(bean.CodigoP)) {
        Toast.fire({
          icon: "warning",
          title: "El Código " + bean.CodigoP + " ya está en uso",
        })
      }
      else {
        update(bean);
      };
    };
  };

  const getValue = (dataTitle: string) => {
    console.log(props.dataObj);
    if (dataTitle === "Crear") {
      if (props.dataObj) {
        setValue("entity", {
          CodigoP: "",
          Valor: "",
          IDTipoLista: "",
          IDListaParametros: null,
        });
      }
    }
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
      if (props.dataObj) {
        setBeforeCode(props.dataObj.CodigoP);
      }
    }
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.IDTipoLista = parseInt(props.IDTipoLista);
    updateListaParametros(aux);
  };

  return (
    <>
      <Modal show={props.dataShow}  centered  onHide={closeModal}>
        <Modal.Header>
          {props.dataTitle}
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={4} className="mt-3">
                <TextField
                  color="secondary"
                  id="outlined-required"
                  label="Código"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.CodigoP")}
                />
              </Col>
              <Col sm={8} className="mt-3">
                <TextField
                  color="secondary"
                  id="outlined-required"
                  label="Valor *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Valor", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.Valor?.type === "required" &&
                    "El campo Valor es obligatorio."
                    : ""}
                </span>
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
      {spinner && <SSpinner show={spinner} />}
    </>
  );
}

export default NEContentParameter;

