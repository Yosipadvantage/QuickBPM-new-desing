import React, { useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
  BsFillFileArrowUpFill,
  BsJustifyRight,
  BsXSquare,
} from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
  InputAdornment,
  TextField,
  Button,
  ThemeProvider,
} from "@mui/material";
import { CategoryResource } from "../model/CategoryResource";
import { New } from "../model/New";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { useState } from "react";
import { FileService } from "../../../core/services/FileService";

const _adminService = new AdminService();
const _files = new FileService();

interface INENew {
  getShow: Function;
  dataShow: boolean;
  dataObj: New | any;
  dataTitle: string;
  dataType: number;
}

const NENew: React.FC<INENew> = (props: INENew) => {
  const [showM, setShowM] = useState(false);
  const [showL, setShowL] = useState(false);
  const [prevDoc, setUrl] = useState<any>();
  const [file, setFile] = useState<any>();
  //const [FechaNoticia, setFechaNoticia] = useState("01/01/2000");
  const [FechaNoticia, setFechaNoticia] = useState((props.dataTitle === "Editar") ? props.dataObj.FechaNoticia : null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
    getValue(props.dataTitle);
  }, []);

  const updateNoticia = (bean: New) => {
    _adminService.updateNoticia(bean).subscribe((resp) => {
      console.log(resp);
      if (resp) {
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
        Autor: "",
        MediaContext: "",
        Context: "",
        Titulo: "",
        IDNoticia: null,
      });
    } else if (dataTitle === "Editar") {
      if (props.dataObj?.MediaContext) {
        console.log(props.dataObj);

        const temp = {
          "Media": props.dataObj.MediaContext,
          "MediaContext": props.dataObj.Context
        }
        
        console.log(temp);

        setShowL(true);
        setFile(temp);
        setUrl(
          _files.getUrlFile(props.dataObj.Context, props.dataObj.MediaContext)
        );
      }
      setValue("entity", props.dataObj);
    }
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    aux.IDVisualizacion = props.dataType;
    if(file.Media){
      console.log("Entro");
      aux.MediaContext = file.Media;
      aux.Context = file.MediaContext;
    }
    console.log(file);
    aux.FechaNoticia = aux.FechaNoticia + " 00:00:00";
    console.log(aux);
    updateNoticia(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  const closeSearchM = (data: any) => {
    setShowM(data);
  };

  const getItemM = async (data: any) => {
    console.log(data);
    setUrl(data.URL);
    setFile(data);
    setShowL(true);
  };

  return (
    <Modal show={props.dataShow}   centered onHide={closeModal}  >
      <Modal.Header>
         {props.dataTitle} Noticia
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <b>Campo obligatorio *</b>
          <Row>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  size="small"
                  color="secondary"
                  label="Título *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Titulo", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Titulo?.type === "required" &&
                    "El campo Título es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  size="small"
                  color="secondary"
                  label="Autor *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.Autor", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.Autor?.type === "required" &&
                    "El campo Autor es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <TextField
                  size="small"
                  color="secondary"
                  label="Noticia *"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <BsJustifyRight />
                      </InputAdornment>
                    ),
                  }}
                  {...register("entity.CuerpoNoticia", { required: true })}
                />
              </ThemeProvider>
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.CuerpoNoticia?.type === "required" &&
                    "El campo Noticia es obligatorio."
                  : ""}
              </span>
            </Col>
            <Col sm={12} className="mt-3">
              <TextField
                id="outlined-required"
                label="Fecha de Publicación *"
                fullWidth
                size="small"
                color="secondary"
                variant="outlined"
                type="Date"
                value={FechaNoticia}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("entity.FechaNoticia", { required: true })}
                onChange={(e) => {
                  setFechaNoticia(e.target.value);
                }}
              />
              <span className="text-danger">
                {errors.entity
                  ? errors.entity.FechaNoticia?.type === "required" &&
                    "El campo Fecha de publicación es obligatorio."
                  : ""}
              </span>
            </Col>
            <div className="col-md-12 mt-3">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  className="mr-2 w-100"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillFileArrowUpFill />}
                  onClick={() => {
                    setShowM(true);
                  }}
                >
                  Subir archivo
                </Button>
              </ThemeProvider>
              {showL ? (
                <div className="w-100">
                  <a className="w-100" href={prevDoc}>
                    {file.Media}
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-element">
            <Button
              className={classes.button}
              variant="contained"
              color="error"
              onClick={closeModal}
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
      {showM ? (
        <SLoadDocument
          setShow={closeSearchM}
          type={1}
          title={"Recurso"}
          getMedia={getItemM}
          show={showM}
          beanAction={null}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

export default NENew;
