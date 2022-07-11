import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, MenuItem, TextField, Button } from "@mui/material";
import { CharacterizationK } from "../model/Characterization";
import { useState, useEffect } from "react";
import { ICustomerType } from "../model/CustomerType";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { SSpinner } from "../../../shared/components/SSpinner";

const _configService = new ConfigService();

interface INECharacterization {
  getShow: Function;
  dataShow: boolean;
  dataObj: any;
  dataTitle: string;
}

export const NECharacterization: React.FC<INECharacterization> = (
  props: INECharacterization
) => {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    handleSubmit,
  } = useForm();
  const [listCustomerType, setListCustomerType] = useState<ICustomerType[]>([]);
  const [selector, setSelector] = useState(
    props.dataObj && props.dataTitle === "Editar"
      ? props.dataObj.IDCustomerType
      : null
  );
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    clearErrors("entity");
    getCustomerTypeCatalog();
    getValue(props.dataTitle);
  }, []);

  const getCustomerTypeCatalog = () => {
    setSpinner(true);
    _configService.getCustomerTypeCatalog().subscribe((res) => {
      setSpinner(false);
      if (res) {
        setListCustomerType(res);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const updateCharacterization = (bean: CharacterizationK) => {
    setSpinner(true);
    _configService.updateCharacterization(bean).subscribe((res) => {
      setSpinner(false);
      if (res) {
        props.getShow(false);
        clearErrors("entity");
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
        Description: "",
        IDCharacterization: null,
        IDCustomerType: null,
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  const setShow = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    data.entity.State = 0;
    updateCharacterization(data.entity);
  };

  const classes = useStyles();

  return (
    <>
      <Modal show={props.dataShow}  centered onHide={setShow} >
        <Modal.Header>
          {props.dataTitle} Caracterización
          <BsXSquare className='pointer' onClick={setShow} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <b>Campo obligatorio *</b>
            <Row>
              <Col sm={12} className={"mt-3"}>
                <ThemeProvider theme={inputsTheme}>
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
                          <BsTextRight />
                        </InputAdornment>
                      ),
                    }}
                    {...register("entity.Name", { required: true })}
                  />
                </ThemeProvider>
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.Name?.type === "required" &&
                    "El campo Nombre es obligatorio."
                    : ""}
                </span>
              </Col>
              <Col sm={12} className="mt-3">
                <ThemeProvider theme={inputsTheme}>
                  <TextField
                    size="small"
                    color="secondary"
                    select
                    value={selector}
                    fullWidth
                    label="Seleccione Tipo de Cliente: *"
                    id="type"
                    {...register("entity.IDCustomerType", { required: true })}
                    onChange={(e) => {
                      setSelector(e.target.value);
                    }}
                  >
                    {listCustomerType.map((item: ICustomerType) => (
                      <MenuItem
                        key={item.IDCustomerType}
                        value={item.IDCustomerType}
                      >
                        {item.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                </ThemeProvider>
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.IDCustomerType?.type === "required" &&
                    "El campo Tipo de Cliente es obligatorio."
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
                  {...register("entity.Description")}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal-element">
              <Button
                className={classes.button}
                variant="contained"
                color="error"
                onClick={setShow}
              >
                CANCELAR
              </Button>
            </div>
            <div className="modal-element">
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="success"
              >
                GUARDAR
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
      {spinner && <SSpinner show={spinner} />}
    </>
  );
};
