import { BsJustifyRight, BsXSquare } from "react-icons/bs";
import { Modal, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import { businessCreateOk, businessEditOk } from "../../../actions/AConfig";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, TextField, Button, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { RootState } from "../../../store/Store";
import { CharacterizationK } from "../model/Characterization";
import { ICustomerType } from "../model/CustomerType";

const _configService = new ConfigService();

interface INEBussinesProcess {
  getShow: Function,
  dataShow: boolean,
  dataObj: any,
  dataTitle: string,
  businessClassID: number | null,
  businessClassName: string,
  listCharacterization: CharacterizationK[]
  filtter: Function
}

const NEBusinessProcess: React.FC<INEBussinesProcess> = (props: INEBussinesProcess) => {

  const dispatch = useDispatch();
  const [bcSelected, setBcSelected] = useState<number | null>((props.dataTitle === 'Editar') ? props.businessClassID : null);

  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    handleSubmit
  } = useForm();

  useEffect(() => {
    getValue(props.dataTitle);
  }, []);

  const businessClasses = useSelector(
    (state: RootState) => state.characterization.characterizations
  );

  const updateBusinessProcess = async (bean: any) => {
    console.log("VOY A CREAR", bean)
    await _configService
      .updateBusinessProcess(bean)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          Toast.fire({
            icon: "success",
            title: "Se ha guardado con éxito!",
          });
          if (props.dataTitle === 'Crear') {
            dispatch(businessCreateOk(resp.data.DataBeanProperties.ObjectValue))
          }
          else {
            dispatch(businessEditOk(resp.data.DataBeanProperties.ObjectValue));
          }
          props.filtter();
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha guardado con éxito!",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getValue = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      if (props.dataObj.IDBusinessProcess) {
        setValue("entity", {
          PrivateBusiness: false,
          Description: "",
          PublicBusiness: false,
          Name: "",
          IDCharacterization: null,
          IDBusinessProcess: null,
          Code: null,
          BusinessValue: null
        });
      }
    }
    if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
      console.log(props.dataObj);

    }
  };

  const closeModal = () => {
    props.getShow(false);
    clearErrors();
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    if (props.dataTitle === "Crear") {
      aux.IDBusinessClass = props.businessClassID;
    }
    updateBusinessProcess(aux);
    closeModal();
  };

  return (

    <Modal show={props.dataShow} centered onHide={closeModal}>
      <Modal.Header>
        {props.dataTitle} Trámite
        <BsXSquare className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
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
                size="small"
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
            <Col sm={12} className="mt-3">
              <TextField
                value={bcSelected}
                size="small"
                select
                fullWidth
                color="secondary"
                label=".:Clase de trámite *:."
                id="state"
                {...register("entity.IDBusinessClass", { required: true })}
                onChange={(e) => setBcSelected(parseInt(e.target.value))}
              >
                {businessClasses.map((item: any) => (
                  <MenuItem key={item.IDBusinessClass} value={item.IDBusinessClass}>
                    {item.Name}
                  </MenuItem>
                ))}
              </TextField>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.IDBusinessClass?.type === "required" &&
                  "El campo Clase trámite es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
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
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="outlined-required"
                label="Precio *"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsJustifyRight />
                    </InputAdornment>
                  )
                }}
                {...register("entity.BusinessValue", { required: true })}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.BusinessValue?.type === "required" &&
                  "El campo Precio es obligatorio."
                  : ""}
              </span>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-element">
            <Button variant="contained" color="error" onClick={closeModal}>CANCELAR</Button>
          </div>
          <div className="modal-element">
            <Button type="submit" variant="contained" color="success">GUARDAR</Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default NEBusinessProcess;