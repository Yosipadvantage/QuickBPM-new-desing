import { Button, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsJustifyRight, BsXSquare } from 'react-icons/bs';
import { AdminService } from '../../../core/services/AdminService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { Toast } from '../../../utils/Toastify';
import { ListParameter } from '../model/ListParameter';
interface INETypeParameter {
  getShow: Function;
  dataShow: boolean;
  dataObj: ListParameter | undefined;
  dataTitle: string;
  refreshList: Function;
  codeList: number[];
}

const _adminService = new AdminService();

export const NETypeParameter: React.FC<INETypeParameter> = (props: INETypeParameter) => {

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [spinner, setSpinner] = useState(false);
  const [beforeCode, setBeforeCode] = useState(-1);

  useEffect(() => {
    getValue(props.dataTitle);
  }, [])

  const getValue = (dataTitle: string) => {
    console.log(props.dataObj);
    if (dataTitle === "Crear") {
      if (props.dataObj) {
        setValue("entity", {
          Codigo: "",
          Descripcion: "",
          Nombre: "",
          IDTipoLista: null,
        });
      }
    }
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
      if (props.dataObj) {
        setBeforeCode(props.dataObj.Codigo);
      }
    }
  };

  const update = (bean: any) => {
    setSpinner(true);
    _adminService
      .updateTipoLista(bean)
      .subscribe(rps => {
        setSpinner(false);
        if (rps) {
          props.refreshList();
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

  const updateTipoLista = (bean: any) => {
    if (props.dataTitle === 'Editar') {
      if (beforeCode === bean.Codigo) {
        update(bean);
      } else {
        if (props.codeList.includes(bean.Codigo)) {
          Toast.fire({
            icon: "warning",
            title: "El Código " + bean.Codigo + " ya está en uso",
          })
        }
        else {
          update(bean);
        };
      }
    } else {
      if (props.codeList.includes(bean.Codigo)) {
        Toast.fire({
          icon: "warning",
          title: "El Código " + bean.Codigo + " ya está en uso",
        })
      }
      else {
        update(bean);
      };
    };
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.Codigo = parseInt(aux.Codigo);
    updateTipoLista(aux);
  };


  return (
    <>
      <Modal show={props.dataShow} centered onHide={closeModal}>
        <Modal.Header>
          {props.dataTitle}
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={6} className="mt-3">
                <TextField
                  type="number"
                  color="secondary"
                  id="outlined-required"
                  label="Código *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Codigo", { required: true })}
                />
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.Codigo?.type === "required" &&
                    "El campo Código es obligatorio."
                    : ""}
                </span>
              </Col>
              <Col sm={6} className="mt-3">
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
            <Button variant="contained" color="error" onClick={closeModal}>
              CANCELAR
            </Button>
            <Button type="submit" variant="contained" color="success">
              GUARDAR
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {spinner && <SSpinner show={spinner} />}
    </>
  )
}
