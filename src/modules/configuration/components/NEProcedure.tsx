import { FormControlLabel, FormGroup, InputAdornment, MenuItem, Switch, TextField, Button, ThemeProvider, Dialog, DialogTitle, List, ListItem, ListItemText, IconButton, Checkbox, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsJustifyRight, BsSearch, BsXSquare } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { procedureCreateOk, procedureUpdateOk } from "../../../actions/AConfig";
import { AdminService } from "../../../core/services/AdminService";
import { ConfigService } from "../../../core/services/ConfigService";
import { SSearchTree } from "../../../shared/components/SSearchTree";
import { pipeSort } from "../../../utils/pipeSort";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { IBusinessRole } from "../../admin/model/BusinessRole";
import { IActivityType } from "../model/ActivityType";
import { IBusinessCharacterization } from "../model/BusinessCharacterization";
import { Office } from "../model/Office";
import { IProcedure } from "../model/Procedure";

const _configService = new ConfigService();
const _adminService = new AdminService();
interface INEProcedure {
  getShow: Function,
  dataShow: boolean,
  beanProcedure: IProcedure | any
  dataTitle: string,
  dataId: number,
  listState: any[],
  listBP: any[],
  refresh: Function,
  wgName: string,
  validName: string
  setWgName: Function,
  setValidName: Function
}

export const NEProcedure: React.FC<INEProcedure> = (props: INEProcedure) => {


  const dispatch = useDispatch();
  const { register,
    setValue,
    formState: { errors },
    handleSubmit,
    clearErrors
  } = useForm();

  const [isConditional, setisConditional] = useState((props.dataTitle === "Editar") ? props.beanProcedure.IsConditional : false);
  const [procedureLimited, setProcedureLimited] = useState((props.dataTitle === "Editar") ? props.beanProcedure.LimitByOffice : false);

  const [useDChannel, setuseDChannel] = useState((props.dataTitle === "Editar") ? props.beanProcedure.UseDistributionChannel : false);
  const [validateDocs, setValidateDocs] = useState((props.dataTitle === "Editar") ? props.beanProcedure.ValidateDocuments : false);
  const [state, setState] = useState("0");
  const [businessState, setBusinessState] = useState("0");
  const [openDiag, setOpenDiag] = useState(false);
  const [list, setList] = useState<IBusinessCharacterization[]>([]);
  const [activityTypes, setActivityTypes] = useState<IActivityType[]>([]);
  const [showSTree, setSTree] = useState(false);
  /* const [submit, setSubmit] = useState(false); */
  const [btn, setBtn] = useState((props.dataTitle === "Editar" && props.beanProcedure.ActivityType === 8) ? true : false);
  const [viewData, setViewData] = useState(0);
  const [activityType, setActivityType] = useState((props.dataTitle === "Editar") ? props.beanProcedure.ActivityType : null);
  const [IDOffice, setIDOffice] = useState((props.dataTitle === "Editar") ? props.beanProcedure.IDOffice : null);
  const [IDBusinessRole, setIDBusinessRole] = useState((props.dataTitle === "Editar") ? props.beanProcedure.IDBusinessRole : null);

  const [listRoles, setListRole] = useState<IBusinessRole[]>([]);
  const [listOffice, setListOffice] = useState<Office[]>([]);

  useEffect(() => {
    getBusinessCharacterizationCatalog(props.dataId);
    getProcedureTypeList();
    getOffice();
    if (props.dataTitle === "Editar") {
      getBusinessRoleCatalog(props.beanProcedure.IDLnFunctionalID);
    }
  }, [])
  console.log(IDOffice);

  console.log(IDBusinessRole);


  const getValue = (dataTitle: string) => {
    if (dataTitle === "Editar") {
      setValue("entity", props.beanProcedure);
    }
  };

  getValue(props.dataTitle);

  const closeModal = () => {
    props.getShow(false);
    setisConditional(false);
    setState("0");
    setBusinessState("0");
    clearErrors();
  };

  const onSubmit = (data: any, e: any) => {
    console.log(data);
    e.preventDefault();
    const aux = data.entity;
    aux.IDProcedure === undefined
      ? (aux.IDProcedure = null)
      : parseInt(props.beanProcedure.IDProcedure);
    aux.ProcedureRow = parseInt(aux.ProcedureRow);
    aux.State = parseInt(state);
    aux.IDBusinessState = parseInt(businessState);
    aux.UseDistributionChannel = useDChannel;
    aux.ValidateDocuments = validateDocs;
    aux.LimitByOffice = procedureLimited;
    aux.IsConditional = isConditional;
    aux.ActivityType = activityType;
    aux.IDOffice = IDOffice;
    aux.IDBusinessRole = IDBusinessRole;
    aux.IDBusinessProcess = props.dataId;

    if (isConditional === false) {
      aux.TrueIDLnPath = "";
      aux.FalseIDLnPath = "";
    }
    console.log(aux);
    updateProcedure(aux);
    closeModal();
  };

  const getBusinessCharacterizationCatalog = (id: number) => {
    _configService
      .getBusinessCharacterizationCatalog(id)
      .subscribe(res => {
        if (res) {
          console.log(res);
          setList(res);
        } else {

        }
      })
  }

  const getProcedureTypeList = () => {
    _configService
      .getProcedureTypeList()
      .subscribe(res => {
        if (res) {
          console.log(res);
          setActivityTypes(res);
        } else {

        }
      })
  }
  const getOffice = () => {
    let aux: any = [];
    let auxSorted: any = [];
    _configService.getOfficeCatalog().subscribe(resp => {
      if (resp) {
        resp.map((item: any) =>
          aux.push({
            label: item.Name,
            id: item.IDForm
          }));
        auxSorted = pipeSort([...aux], "label");
        setListOffice(auxSorted);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información de sucursales",
        });
      }
    })
  }
  const updateProcedure = async (bean: any) => {
    await _configService
      .updateProcedure(bean)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          if (props.dataTitle === "Crear") {
            dispatch(procedureCreateOk(resp.data.DataBeanProperties.ObjectValue));
          } else {
            dispatch(procedureUpdateOk(resp.data.DataBeanProperties.ObjectValue));
          }
          props.refresh(props.dataId);
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha guardado con éxito!",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    setOpenDiag(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
    if (type === 1) {
      setuseDChannel(e.target.checked);
    }
    else if (type === 2) {
      setValidateDocs(e.target.checked);
    }
    else if (type === 3) {
      setProcedureLimited(e.target.checked);
    }

  };

  const openTree = (view: number) => {
    setSTree(true);
    setViewData(view);
  };

  const getData = (data: any) => {
    if (viewData === 1) {
      console.log(data.name);
      setValue("entity.IDLnFunctionalIDOwner", data.IDLn);
      props.setWgName(data.name)
      setValue(
        "entity.WorkGroupName", data.name
      );
    }
    else if (viewData === 2) {
      console.log(data.name, "IDLnFunctionalID");
      setValue("entity.IDLnFunctionalID", data.IDLn);
      props.setValidName(data.name)
      setValue(
        "entity.ValidatorName", data.name
      );
      getBusinessRoleCatalog(data.IDLn);
    }
  }
  const getBusinessRoleCatalog = (id: number) => {
    console.log(id);

    _adminService.getBusinessRoleCatalog(id).subscribe(resp => {
      if (resp) {
        setListRole(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido listar los roles con éxito",
        });
      }
    })
  }

  const closeSearchTree = (data: any) => {
    setSTree(data);
  }

  const handleChangeSelect = (e: number) => {
    if (e === 8) {
      setBtn(true);
      setisConditional(true);
    }
    else {
      setBtn(false);
    }
    setActivityType(e);
  }

  const classes = useStyles();

  return (
    <>
      <Modal size="xl" show={props.dataShow} modal  centered onHide={closeModal} >
        <Modal.Header>
          {props.dataTitle} Procedimiento
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <b>Campo obligatorio *</b>
            <Row className="modal-element">
              <Col sm={12} className="mt-3">
                <TextField
                  size="small"
                  color="secondary"
                  label="Nombre del procedimiento *"
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
              <Col sm={12}>
                <TextField
                  size="small"
                  margin="normal"
                  color="secondary"
                  label="Descripción"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  {...register("entity.Description")}
                />
              </Col>
              <Col sm={6} >
                <TextField
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  margin="normal"
                  label=".:Estado de proceso de negocio:."
                  onChange={(e) => setBusinessState(e.target.value)}
                >
                  {props.listBP.map((item: any) => (
                    <MenuItem value={item.DataBeanProperties.IDBusinessState}>
                      {item.DataBeanProperties.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </Col>
              <Col sm={6}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  margin="normal"
                  label=".:Estado:."
                  onChange={(e) => setState(e.target.value)}
                >
                  {props.listState.map((item: any) => (
                    <MenuItem value={item.DataBeanProperties.IDProcedureState}>
                      {item.DataBeanProperties.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </Col>
              <Col sm={6}>
                <TextField
                  value={activityType}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Tipo de actividad *"
                  id="BProcess"
                  {...register("entity.ActivityType", { required: true })}
                  onChange={(e) => handleChangeSelect(parseInt(e.target.value))}
                >
                  {activityTypes.map((item: IActivityType) => (
                    <MenuItem value={item.Value}>
                      {item.Property}
                    </MenuItem>
                  ))}
                </TextField>
                <span className="text-danger">
                  {errors.entity
                    ? (errors.entity.ActivityType?.type === "required" && activityType === null) &&
                    "El campo Tipo de actividad es requerido."
                    : ""}
                </span>
              </Col>
              <Col sm={6}>
                <TextField
                  value={props.validName}
                  size="small"
                  label="Grupo de trabajo *"
                  fullWidth
                  color="secondary"
                  margin="normal"
                  {...register("entity.FunctionalIDValidateName", { required: true })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => openTree(2)}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onClick={() => openTree(2)}
                />
                <span className="text-danger">
                  {errors.entity
                    ? (errors.entity.FunctionalIDValidateName?.type === "required" && props.validName === "") &&
                    "El campo Grupo de trabajo es requerido."
                    : ""}
                </span>
              </Col>
              <Col sm={6}>
                <Autocomplete
                  className="mt-3"
                  fullWidth
                  size="small"
                  disablePortal
                  id="forms"
                  options={listOffice}
                  onChange={(e, value: any) => { setIDOffice(value ? value.id : 0); clearErrors('entity.IDOffice') }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      color="secondary"
                      label=".:Seleccione una Seccional:."
                      id="state"
                      {...register("entity.IDOffice", { required: false })}
                    />)}
                />
                <span className="text-danger">
                  {errors.entity
                    ? (errors.entity.IDOffice?.type === "required" && IDOffice === null) &&
                    "El campo Sucursal es requerido."
                    : ""}
                </span>
              </Col>
              <Col sm={6}>
                <TextField
                  value={IDBusinessRole}
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  margin="normal"
                  label=".:Rol:."
                  {...register("entity.IDBusinessRole", { required: true })}
                  onChange={(e) => setIDBusinessRole(e.target.value)}
                >
                  {listRoles.map((item: IBusinessRole) => (
                    <MenuItem value={item.IDBusinessRole}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </TextField>
                <span className="text-danger">
                  {errors.entity
                    ? (errors.entity.IDBusinessRole?.type === "required" && IDBusinessRole === null) &&
                    "El campo Rol es requerido."
                    : ""}
                </span>
              </Col>
              <Col sm={4} className="d-flex justify-content-center mt-3">
                <FormGroup>
                  <FormControlLabel control={
                    <ThemeProvider theme={inputsTheme}>
                      <Checkbox color="secondary" defaultChecked={useDChannel} onChange={(e) => handleChange(e, 1)} />
                    </ThemeProvider>
                  } label="¿Usa canal de distribuición?" />
                </FormGroup>
              </Col>
              <Col sm={4} className="d-flex justify-content-center mt-3">
                <FormGroup>
                  <FormControlLabel control={
                    <ThemeProvider theme={inputsTheme}>
                      <Checkbox color="secondary" defaultChecked={validateDocs} onChange={(e) => handleChange(e, 2)} />
                    </ThemeProvider>
                  } label="¿Validar documentos?" />
                </FormGroup>
              </Col>
              <Col sm={4} className=" sm-12  d-flex justify-content-center mt-3">
                <FormGroup>
                  <FormControlLabel control={
                    <ThemeProvider theme={inputsTheme}>
                      <Checkbox color="secondary" defaultChecked={procedureLimited} onChange={(e) => handleChange(e, 3)} />
                    </ThemeProvider>
                  } label="¿Limitar procedimiento a oficina de radicación?" />
                </FormGroup>
              </Col>
              <Col sm={4} className="mt-3">
                <ThemeProvider theme={inputsTheme}>
                  <Button className="w-100" variant="contained" color="secondary"
                    onClick={() => {
                      setOpenDiag(true); console.log(list);
                    }}
                  >
                    VER CARACTERIZACIONES A LAS QUE APLICA
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={4}>
                <TextField
                  size="small"
                  type="number"
                  margin="normal"
                  color="secondary"
                  label="Orden en el flujo"
                  fullWidth
                  variant="outlined"
                  {...register("entity.ProcedureRow")}
                />
              </Col>
              {btn &&
                <Col
                  sm={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <FormGroup>
                    <FormControlLabel control={
                      <ThemeProvider theme={inputsTheme}>
                        <Switch color="secondary" className={classes.root} defaultChecked disabled />
                      </ThemeProvider>
                    } label="¿Es condicional?" />
                  </FormGroup>
                </Col>}
              {btn && (
                <Col sm={6}>
                  <TextField
                    size="small"
                    type="number"
                    margin="normal"
                    color="secondary"
                    label="Línea opción positiva"
                    fullWidth
                    variant="outlined"
                    {...register("entity.TrueIDLnPath")}
                  />
                </Col>
              )}
              {btn && (
                <Col sm={6}>
                  <TextField
                    size="small"
                    type="number"
                    margin="normal"
                    color="secondary"
                    label="Línea opción negativa"
                    fullWidth
                    variant="outlined"
                    {...register("entity.FalseIDLnPath")}
                  />
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-element">
              <Button className={classes.button} variant="contained" color="error" onClick={closeModal}>CANCELAR</Button>
            </div>
            <div className="modal-element">
              <Button className={classes.button} type="submit" variant="contained" color="success">GUARDAR</Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
      <Dialog onClose={handleClose} open={openDiag}>
        <DialogTitle>Aplica para las caracterizaciones:</DialogTitle>
        <List sx={{ pt: 0 }}>
          {(list.length > 0)
            ? list.map((item: IBusinessCharacterization) => (
              <ListItem key={item.IDBusinessCharacterization}>
                <ListItemText primary={item.CharacterizationName} />
              </ListItem>
            ))
            : <h4 className="m-3">No hay caracterizaciones asignadas</h4>
          }
        </List>
      </Dialog>
      <SSearchTree getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={showSTree} />
    </>
  );
}



