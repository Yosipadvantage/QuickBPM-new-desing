import { useForm } from "react-hook-form";
import { Button, InputAdornment, MenuItem, TextField, FormGroup, FormControlLabel, ThemeProvider, Checkbox, CircularProgress, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";
import { SSpinner } from "../../../shared/components/SSpinner";

import { ConfigService } from "../../../core/services/ConfigService";
import { SSearchTree } from "../../../shared/components/SSearchTree";
import { Toast } from "../../../utils/Toastify";
import { AdminService } from "../../../core/services/AdminService";
import { TypeForm } from "../model/TypeForm";
import { DataForm } from "../model/Form";
import { JsonService } from "../model/JsonService";
import { JsonServiceClass } from "../model/JsonServiceClass";
import { inputsTheme } from "../../../utils/Themes";
import { IBusinessCharacterization } from "../model/BusinessCharacterization";
import { pipeSort } from "../../../utils/pipeSort";

const _configService = new ConfigService();
const _adminService = new AdminService();

interface INEGenericProcedure {
  getShowNE: Function;
  dataShowNE: boolean;
  dataObjNe: any;
  dataTitleNE: string;
  dataTitlenNEGeneric: string;
  // dataType: number;
  dataIDProcedure: number;
  businessId: number;
  idDocument: number;
  listTypesDocument: any[];
}

const NEGenericProcedure: React.FC<INEGenericProcedure> = (
  props: INEGenericProcedure
) => {
  console.log(props.dataObjNe);
  console.log(props.listTypesDocument);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [showSTree, setSTree] = useState(false);
  const [funtionalArea, setFuntionalArea] = useState("");
  const [documentType, setDocumentType] = useState<number | null>(
    props.dataTitleNE === "Editar" ? props.dataObjNe.DocumentType : null
  );
  const [applyForAllChar, setApplyForAllChar] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe.ApplyForAllChar : false
  );
  const [isOptional, setIsOptional] = useState(
    props.dataTitleNE === "Editar" ? props.dataObjNe.IsOptional : false
  );

  const [formType, setFormType] = useState<number | null>(
    props.dataTitleNE === "Editar" ? props.dataObjNe.IDFormClass : null
  );
  const [formValue, setFormValue] = useState<number | null>(
    props.dataTitleNE === "Editar" ? props.dataObjNe.IDForm : null
  );
  const [serviceType, setServiceType] = useState<number | null>(
    props.dataTitleNE === "Editar" ? props.dataObjNe.IDJsonServiceClass : null
  );
  const [serviceValue, setServiceValue] = useState<number | null>(
    props.dataTitleNE === "Editar" ? props.dataObjNe.IDJsonService : null
  );
  const [listTypeForm, setListTypeForm] = useState<TypeForm[]>([]);
  const [list, setList] = useState<DataForm[]>([]);
  const [listServiceClass, setListServiceClass] = useState<JsonServiceClass[]>(
    []
  );
  const [listService, setListService] = useState<JsonService[]>([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [formName, setFormName] = useState("");

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        Name: "",
        Description: "",
        ValidityType: "",
        DefeatTime: "",
        DocumentType: 0,
        FormURLComponent: "",
        FormEngine: "",
        ApplyForAllChar: "",
      });
    }
    if (dataTitle === "Editar") {
      console.log(props.dataObjNe);
      setValue("entity", props.dataObjNe);
      getFormClassCatalog();
      getJsonServiceClassCatalog();
      getFormCatalog(formType);
      getJsonServiceCatalog(serviceType);
      setFuntionalArea(props.dataObjNe.FunctionalIDName);
    }
  };

  useEffect(() => {
    getValue(props.dataTitleNE);
    console.log(props.listTypesDocument);
  }, []);

  const closeModalNE = () => {
    props.getShowNE(false);
    clearErrors();
  };

  const getFormClassCatalog = () => {
    setShowSpinner(true);
    _adminService.getFormClassCatalog().subscribe((resp) => {
      if (resp) {
        setListTypeForm(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getFormCatalog = (id: number | null) => {
    let aux: any = [];
    let auxSorted: any = [];
    setShowSpinner(true);
    _adminService.getFormCatalog(id).subscribe((resp) => {
      console.log(resp);
      /* if (resp) {
        setList(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      } */
      if (resp) {
        console.log(resp)
        setList(resp);
        setShowSpinner(false);
        resp.map((item: any) =>
          aux.push({
            label: item.Name,
            id: item.IDForm
          }))
        auxSorted = pipeSort([...aux], 'label');
        setList(auxSorted);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const updateProcedureDocument = async (bean: any) => {
    await _configService
      .updateProcedureDocument(bean)
      .then((resp: any) => {
        console.log(resp);
        if (resp.data.DataBeanProperties.ObjectValue) {
          closeModalNE();
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
      .catch((e) => {
        console.log(e);
      });
  };

  const getJsonServiceClassCatalog = () => {
    setShowSpinner(true);
    _adminService.getJsonServiceClassCatalog().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListServiceClass(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getJsonServiceCatalog = (id: number | null) => {
    setShowSpinner(true);
    _adminService.getJsonServiceCatalog(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListService(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    console.log(data.entity);
    const aux = data.entity;
    // aux.Type = props.dataType;
    aux.IDForm = formValue;
    aux.IDProcedure = props.dataIDProcedure;
    aux.ValidityType = parseInt(aux.ValidityType);
    aux.DefeatTime = parseInt(aux.DefeatTime);
    aux.DocumentType = parseInt(aux.DocumentType);
    aux.ApplyForAllChar = applyForAllChar;
    aux.IsOptional = isOptional;
    console.log(aux);
    updateProcedureDocument(aux);
  };

  const onChangeComponent = (type: number, data: any) => {
    if (type === 2) {
      getFormCatalog(parseInt(data));
    } else if (type === 3) {
      getJsonServiceCatalog(parseInt(data));
    }
  };

  // Modal Search
  const getData = (data: any) => {
    setValue("entity.IDLnFunctionalID", data.IDLn);
    setFuntionalArea(data.name);
    setValue("entity.AreaName", data.name);
  };

  const closeSearchTree = (data: any) => {
    setSTree(data);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplyForAllChar(e.target.checked);
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOptional(e.target.checked);
  };

  return (
    <>
      <Modal show={props.dataShowNE} onHide={closeModalNE} size="xl" centered>
        <Modal.Header>
          {props.dataTitleNE + " documento " + props.dataTitlenNEGeneric}
          <BsXSquare className="pointer" onClick={closeModalNE} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col sm={12} className="mt-3">
                <TextField
                  size="small"
                  color="secondary"
                  id="name"
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
                      "El campo 'Nombre' es obligatorio."
                    : ""}
                </span>
              </Col>
              {/* {(props.dataType === 0 || props.dataType === 1) && */}
              <>
                <Col sm={6} className="mt-3">
                  <TextField
                    size="small"
                    type="number"
                    margin="normal"
                    color="secondary"
                    id="valid-time"
                    label="Tiempo de validez *"
                    fullWidth
                    variant="outlined"
                    {...register("entity.ValidityType", { required: true })}
                  />
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.ValidityType?.type === "required" &&
                        "El campo Tiempo de validez es requerido."
                      : ""}
                  </span>
                </Col>
                <Col sm={6} className="mt-3">
                  <TextField
                    size="small"
                    type="number"
                    margin="normal"
                    color="secondary"
                    id="default-time"
                    label="Tiempo por defecto *"
                    fullWidth
                    variant="outlined"
                    {...register("entity.DefeatTime", { required: true })}
                  />
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.DefeatTime?.type === "required" &&
                        "El campo Tiempo por defecto es requerido."
                      : ""}
                  </span>
                </Col>
                <Col sm={4} className="mt-3">
                  <TextField
                    value={documentType}
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    margin="normal"
                    label="Tipo de documento *"
                    id="state"
                    {...register("entity.DocumentType", { required: true })}
                    onChange={(e: any) => {
                      setDocumentType(e.target.value);
                      if (e.target.value === 6) {
                        getFormClassCatalog();
                      } else if (e.target.value === 4) {
                        getJsonServiceClassCatalog();
                      }
                    }}
                  >
                    {props.listTypesDocument.map((item) => (
                      <MenuItem value={item.DataBeanProperties.Value}>
                        {item.DataBeanProperties.Property}
                      </MenuItem>
                    ))}
                  </TextField>
                  <span className="text-danger">
                    {errors.entity
                      ? errors.entity.DocumentType?.type === "required" &&
                        "El campo 'Tipo de documento' es requerido."
                      : ""}
                  </span>
                </Col>
                {documentType === 6 && (
                  <>
                    <Col sm={4} className="mt-3">
                      <TextField
                        value={formType}
                        size="small"
                        select
                        fullWidth
                        color="secondary"
                        margin="normal"
                        label="Tipo de formulario: *"
                        id="state"
                        {...register("entity.IDFormClass", { required: true })}
                        onChange={(e: any) => {
                          onChangeComponent(2, e.target.value);
                          setFormType(e.target.value);
                        }}
                      >
                        {listTypeForm.map((item: any) => (
                          <MenuItem value={item.IDFormClass}>
                            {item.Name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.IDFormClass?.type === "required" &&
                            "El campo Tipo de Formulario es requerido."
                          : ""}
                      </span>
                    </Col>
                    <Col sm={4} className="mt-3">
                      {showSpinner ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "#503464",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                          }}
                        />
                      ) : (
                        formType !== null &&
                        list.length > 0 && (
                          < Autocomplete
                          fullWidth
                          size="small"
                          disablePortal
                          id="forms"
                          options={list}
                          onChange={(e, value: any) => { setFormValue(value ? value.id : 0); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              color="secondary"
                              label="Formulario *"
                              id="state"
                              margin="normal"
                            />)}
                        />
                        )
                      )}
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.IDForm?.type === "required" &&
                            "El campo Formulario es requerido."
                          : ""}
                      </span>
                    </Col>
                  </>
                )}
                {documentType === 4 && (
                  <>
                    <Col sm={4} className="mt-3">
                      <TextField
                        value={serviceType}
                        size="small"
                        select
                        fullWidth
                        color="secondary"
                        margin="normal"
                        label="Tipo de servicio: *"
                        id="state"
                        {...register("entity.IDJsonServiceClass", {
                          required: true,
                        })}
                        onChange={(e: any) => {
                          onChangeComponent(3, e.target.value);
                          setServiceType(e.target.value);
                        }}
                      >
                        {listServiceClass.map((item: any) => (
                          <MenuItem value={item.IDJsonServiceClass}>
                            {item.Name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.IDJsonServiceClass?.type ===
                              "required" &&
                            "El campo Tipo de Servicio es requerido."
                          : ""}
                      </span>
                    </Col>
                    <Col sm={4} className="mt-3">
                      {serviceType !== null && listService.length > 0 && (
                        <TextField
                          value={serviceValue}
                          size="small"
                          select
                          fullWidth
                          color="secondary"
                          margin="normal"
                          label="Servicio: *"
                          id="state"
                          {...register("entity.IDJsonService", {
                            required: true,
                          })}
                          onChange={(e: any) => setServiceValue(e.target.value)}
                        >
                          {listService.map((item: any) => (
                            <MenuItem value={item.IDJsonService}>
                              {item.Name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.IDJsonService?.type === "required" &&
                            "El campo Formulario es requerido."
                          : ""}
                      </span>
                    </Col>
                  </>
                )}
                {documentType === 3 && (
                  <>
                    <Col sm={4} className="mt-3">
                      <TextField
                        size="small"
                        type="text"
                        margin="normal"
                        color="secondary"
                        id="Form-url"
                        label="Url del formulario *"
                        fullWidth
                        variant="outlined"
                        {...register("entity.FormURLComponent", {
                          required: true,
                        })}
                      />
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.FormURLComponent?.type ===
                              "required" &&
                            "El campo Url del formulario es requerido."
                          : ""}
                      </span>
                    </Col>
                    <Col sm={4} className="mt-3">
                      <TextField
                        size="small"
                        type="text"
                        margin="normal"
                        color="secondary"
                        id="Form"
                        label="Clase java de la forma *"
                        fullWidth
                        variant="outlined"
                        {...register("entity.FormEngine", { required: true })}
                      />
                      <span className="text-danger">
                        {errors.entity
                          ? errors.entity.FormEngine?.type === "required" &&
                            "El campo Clase java de la forma es requerido."
                          : ""}
                      </span>
                    </Col>
                  </>
                )}
                <Col sm={12} className="mt-3">
                  <TextField
                    size="small"
                    margin="normal"
                    color="secondary"
                    id="description"
                    label=".:Descripción:."
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={5}
                    {...register("entity.Description")}
                  />
                </Col>
                <Col
                  sm={6}
                  className=" sm-12  d-flex justify-content-center mt-3"
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <ThemeProvider theme={inputsTheme}>
                          <Checkbox
                            color="secondary"
                            defaultChecked={applyForAllChar}
                            onChange={(e) => handleChange(e)}
                          />
                        </ThemeProvider>
                      }
                      label="¿Aplicar a todas las caracterizaciones?"
                    />
                  </FormGroup>
                </Col>
                <Col
                  sm={6}
                  className=" sm-12  d-flex justify-content-center mt-3"
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <ThemeProvider theme={inputsTheme}>
                          <Checkbox
                            color="secondary"
                            defaultChecked={isOptional}
                            onChange={(e) => handleChange2(e)}
                          />
                        </ThemeProvider>
                      }
                      label="¿Es Opcional?"
                    />
                  </FormGroup>
                </Col>
              </>
              {/* } */}
              {/* {(props.dataType === 4) && */}
              {/* <>
                <Col sm={12} className="mt-3">
                  <TextField
                    size="small"
                    color="secondary"
                    id="name"
                    label="Form URL"
                    fullWidth
                    variant="outlined"
                    {...register("entity.FormURLComponent")}
                  />
                </Col>
              </> */}
              {/* } */}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-element">
              <Button variant="contained" color="error" onClick={closeModalNE}>
                CANCELAR
              </Button>
            </div>
            <div className="modal-element">
              <Button type="submit" variant="contained" color="success">
                GUARDAR
              </Button>
            </div>
          </Modal.Footer>
        </form>
        <SSearchTree
          getShowSTree={closeSearchTree}
          getDataTree={getData}
          dataShowTree={showSTree}
        />
      </Modal>
      {showSpinner && (
        <div className="spinner d-flex justify-content-center">
          <SSpinner show={showSpinner} />
        </div>
      )}
    </>
  );
};

export default NEGenericProcedure;
