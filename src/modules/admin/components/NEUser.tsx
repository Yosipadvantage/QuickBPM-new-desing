import { useForm } from "react-hook-form";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { BsXSquare, BsJustifyRight, BsSearch } from "react-icons/bs";


import { AdminService } from "../../../core/services/AdminService";
import { GlobalService } from "../../../core/services/GlobalService";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { Autocomplete, IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { User } from "../../../shared/model/User";
import { IApplicationTypeRole } from "../model/Applicationtype";
import { useEffect, useState } from "react";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import SSearchTreeSite from "../../../shared/components/SSearchTreeSite";

const _adminService = new AdminService();

interface INEUser {
  getShow: Function;
  dataShow: boolean;
  dataObj?: User | undefined;
  dataTitle: string;
  getAccount: Function;
}

const _weaponService = new WeaponsService();
const _globalService = new GlobalService();

export const NEUser: React.FC<INEUser> = (props: INEUser) => {

  const { register, setValue, formState: { errors }, handleSubmit } = useForm();

  const [listGrade, setListGrade] = useState<any[]>([]);
  const [spinner, setSpinner] = useState(false);
  const [grade, setGrade] = useState(-1);
  const [gradeName, setGradeName] = useState('');
  const [sTree, setSTree] = useState(false);
  const [cityExpedition, setCityExpedition] = useState('');
  const [cityID, setCityID] = useState(-1);

  useEffect(() => {
    getList([14]);
    getValue(props.dataTitle);
  }, [])

  const getList = (lista: number[]) => {
    setSpinner(true);
    let aux = [];
    let grades: any[] = [];
    _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
      setSpinner(false);
      if (resp.DataBeanProperties.ObjectValue) {
        aux = resp.DataBeanProperties.ObjectValue[0]?.Lista;
        aux.map((item: any) =>
          grades.push({
            label: item.Valor,
            id: item.Codigo,
          }));
        setListGrade(grades);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    })
  };

  const closeModal = () => {
    props.getShow(false);
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Nit: "",
        RoleID: "",
        Name1: "",
        Name2: "",
        Surname1: "",
        Surname2: "",
        Tel: "",
        eMail: "",
        IDAccount: ""
      });
    } else if (dataTitle === "Editar") {
      console.log(props.dataObj);
      setValue("entity", props.dataObj);
      setGrade(props.dataObj?.IDGrade !== undefined ? props.dataObj.IDGrade : -1)
      setGradeName(props.dataObj?.Grade !== undefined ? props.dataObj.Grade : '')
      setCityExpedition(props.dataObj?.BornSiteIDName !== undefined ? props.dataObj.BornSiteIDName : 'SIN ASIGNAR');
    }
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    let aux = data.entity;
    if (gradeName !== '') {
      aux.IDGrade = grade;
      aux.Grade = gradeName;
      aux.IDBornSiteLn = cityID;
      aux.DocType = 1;
      console.log(aux);
      getAccountByNit(aux.Nit, aux);
    } else {
      Toast.fire({
        icon: 'warning',
        title: 'Debe seleccionar un grado'
      })
    }
  };

  const getAccountByNit = (nit: number | null, bean: any) => {
    setSpinner(true);
    if (nit !== null) {
      _globalService
        .getAccountByNit(nit)
        .subscribe(resp => {
          setSpinner(false);
          if (resp.length > 0) {
            if (props.dataTitle === 'Editar') {
              putAbstractAccount(bean);
            } else {
              ToastCenter.fire({
                icon: 'error',
                title: 'El usuario que intenta crear ya exíste.'
              })
            }
            props.getAccount(bean.Nit);
            closeModal();
          } else {
            if (props.dataTitle === 'Crear') {
              createAbstractAccount(bean);
            }
            if (props.dataTitle === 'Editar') {
              putAbstractAccount(bean);
            }
            closeModal();
          }
        })
    } else {
      setSpinner(false);
    }
  };

  const createAbstractAccount = (bean: any) => {
    setSpinner(true);
    _adminService.createAbstractAccount(bean)
      .subscribe(resp => {
        setSpinner(false);
        if (resp) {
          console.log(resp);
          props.getAccount(bean.Nit);
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
        }
      });
  }

  const putAbstractAccount = (bean: any) => {
    _adminService.putAbstractAccount(bean)
      .subscribe(resp => {
        if (resp) {
          props.getAccount(bean.Nit);
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!"
          })
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción"
          })
        }
      });
  };

  const getData = (data: any) => {
    setCityExpedition(data.name);
    setCityID(data.IDLn);
  };

  const closeSearchTree = (data: any) => {
    setSTree(data);
  };

  return (
    <>
      <Modal size="lg" show={props.dataShow}  centered onHide={closeModal}>
        <Modal.Header>
          <div className="title-modal">
            {props.dataTitle + " Funcionario"}
          </div>
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <Autocomplete
                  fullWidth
                  size="small"
                  disablePortal
                  id="seccionales"
                  options={listGrade}
                  renderInput={(params) => (
                    <TextField
                      key={params.id}
                      value={gradeName}
                      {...params}
                      label="Grado"
                      fullWidth
                      color="secondary"
                      {...register("entity.Grade")}
                      onChange={(e) => { setGradeName(e.target.value) }}
                    />
                  )}
                  {...register("entity.IDGrade")}
                  onChange={(e, value) => { setGrade(value ? value.id : 0); setGradeName(value ? value.label : '') }}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6} className="mt-3">
                <TextField
                  type="number"
                  size="small"
                  color="secondary"
                  id="nit"
                  label="No. Identificación *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Nit", { required: true })}
                />
                <span className="text-danger">{errors.entity ? errors.entity.Nit?.type === 'required' && "El campo Identificación es obligatorio." : ''}</span>
              </Col>
              <Col sm={6}>
                <TextField
                  value={cityExpedition}
                  size="small"
                  label="Lugar de expedición de documento"
                  fullWidth
                  color="secondary"
                  margin="normal"
                  {...register("entity.IDBornSiteLn")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSTree(true)}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onClick={() => setSTree(true)}
                />
                <span className="text-danger">
                  {errors.entity
                    ? (errors.entity.IDBornSiteLn?.type === "required") &&
                    "El campo Lugar de expedición de documento es requerido."
                    : ""}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="name1"
                  label="Primer nombre *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Name1", { required: true })}
                />
                <span className="text-danger">{errors.entity ? errors.entity.Name1?.type === 'required' && "El campo Primer Nombre es obligatorio." : ''}</span>
              </Col>
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="name1"
                  label="Segundo nombre"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Name2")}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="Surname1"
                  label="Primer apellido *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Surname1", { required: true })}
                />
                <span className="text-danger">{errors.entity ? errors.entity.Surname1?.type === 'required' && "El campo Primer Apellido es obligatorio." : ''}</span>
              </Col>
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="Surname2"
                  label="Segundo apellido"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Surname2")}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="Phone"
                  label="Celular *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.Tel", { required: true })}
                />
                <span className="text-danger">{errors.entity ? errors.entity.Tel?.type === 'required' && "El campo Celular es obligatorio." : ''}</span>
              </Col>
              <Col sm={6}>
                <TextField
                  size="small"
                  color="secondary"
                  id="email"
                  label="Correo *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    )
                  }}
                  {...register("entity.eMail", { required: true })}
                />
                <span className="text-danger">{errors.entity ? errors.entity.eMail?.type === 'required' && "El campo Correo es obligatorio." : ''}</span>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Guardar
            </Button>
          </Modal.Footer>
        </form>
      </Modal >
      {spinner && <SSpinner show={spinner} />}
      {sTree && <SSearchTreeSite getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={sTree} />}
    </>
  );
};