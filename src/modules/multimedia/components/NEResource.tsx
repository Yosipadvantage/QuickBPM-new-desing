import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
  BsFillCaretUpFill,
  BsFillFileArrowUpFill,
  BsJustifyRight,
  BsXSquare,
} from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button, MenuItem, ThemeProvider } from "@mui/material";
import { Resource } from "../model/Resource";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { ListParameter } from "../../admin/model/ListParameter";
import { FileService } from "../../../core/services/FileService";


interface INEResource {
  getShow: Function;
  dataShow: boolean;
  dataObj: Resource | any;
  dataTitle: string;
  dataType: number;
}

const _adminService = new AdminService();
const _fileService = new FileService();

const NEResource: React.FC<INEResource> = (props: INEResource) => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [showM, setShowM] = useState(false);
  const [showL, setShowL] = useState(false);
  const [listParameter, setListParameter] = useState<ListParameter[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [prevDoc, setUrl] = useState<any>();
  const [file, setFile] = useState<any>(props.dataTitle === 'Editar' ? props.dataObj : null);
  const [IDTipoMedia, setIDTipoMedia] = useState(
    props.dataTitle === "Editar" ? props.dataObj.IDTipoMedia : null
  );

  useEffect(() => {
    getValueData(props.dataTitle);
    getListaParametrosOrdenado(1);
  }, []);

  const getListaParametrosOrdenado = (id: number) => {
    _adminService.getListaParametrosOrdenado(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListParameter(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const updateRecursos = (bean: Resource) => {
    _adminService.updateRecursos(bean).subscribe((resp) => {
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

  const getValueData = (dataTitle: string) => {
    if (dataTitle === "Crear") {
      setValue("entity", {
        IDTipoMedia: 0,
        Context: "",
        MediaContext: "",
        IDRecursos: null,
        Nombre: "",
        Descripcion: "",
      });
    } else if (dataTitle === "Editar") {
      setValue("entity", props.dataObj);
    }
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();
    const aux = data.entity;
    console.log(file);
    aux.IDCategoriaRecurso = props.dataType;
    aux.MediaContext = file.Media;
    aux.Context = file.MediaContext;
    console.log(aux);
    updateRecursos(aux);
    closeModal();
  };

  const closeModal = () => {
    clearErrors("entity");
    props.getShow(false);
  };

  const classes = useStyles();

  /* const onChangeComponent = (e: any) => {
    console.log(e);
    setSelector(e);
  }; */

  const getItemM = async (data: any) => {
    console.log(data);
    setUrl(data.URL);
    setFile(data);
    setShowL(true);
  };

  const closeSearchM = (data: any) => {
    setShowM(data);
  };

  return (
    <>
      <Modal show={props.dataShow}   centered  onHide={closeModal}>
        <Modal.Header>
          {props.dataTitle} Recurso
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <b>Campo obligatorio *</b>
            <Row>
              <Col sm={12} className="mt-3">
                <TextField
                  value={IDTipoMedia}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione un tipo *"
                  id="tipoMedia"
                  {...register("entity.IDTipoMedia", { required: true })}
                  onChange={(e) => setIDTipoMedia(e.target.value)}
                >
                  {listParameter.map((item: ListParameter) => (
                    <MenuItem value={item.CodigoP}>
                      {item.Valor}
                    </MenuItem>
                  ))}
                </TextField>
                <span className="text-danger">
                  {errors.entity
                    ? errors.entity.IDTipoMedia?.type === "required" &&
                    "El campo Tipo Media es obligatorio."
                    : ""}
                </span>
              </Col>
              {IDTipoMedia !== null &&
                <Col sm={12} className="mt-3">
                  <TextField
                    color="secondary"
                    id="outlined-required"
                    label="Nombre *"
                    fullWidth
                    size="small"
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
                </Col>}
              <Col sm={12} className="mt-3">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="mr-2 w-100"
                    variant="contained"
                    color="secondary"
                    endIcon={<BsFillCaretUpFill />}
                    onClick={() => {
                      setShowM(true);
                    }}
                  >
                    Archivo
                  </Button>
                </ThemeProvider>
                {showL ? (
                  <div className="w-100">
                    <a className="w-100" href={prevDoc}>
                      {file.Name}
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </Col>
              {props.dataTitle === "Editar" && props.dataObj.IDTipoMedia === 2 && (
                <Col
                  sm={12}
                  className="mt-3 d-flex justify-content-center img-view"
                >
                  <img
                    className="pointer"
                    src={_fileService.getUrlFile(
                      props.dataObj.Context,
                      props.dataObj.MediaContext
                    )}
                    alt="recursoRepo"
                    onClick={() => {
                      setShowDetail(true);
                    }}
                  />
                </Col>
              )}
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
            accept={[".pdf", ".jpg", ".jpge", ".mp4", ".png"]}
          />
        ) : (
          ""
        )}
      </Modal>
      {showDetail && (
        <Modal
          show={showDetail}
           
          centered
           
          size="xl"
        >
          <Modal.Header>
            {props.dataTitle} Recurso
            <BsXSquare  className='pointer' onClick={() => setShowDetail(false)} />
          </Modal.Header>
          <Modal.Body>
            <Row className="d-flex justify-content-center">
              <Col sm={12} className="m-3 img-view">
                <img
                  src={_fileService.getUrlFile(
                    props.dataObj.Context,
                    props.dataObj.MediaContext
                  )}
                  alt="recursoRepo"
                />
              </Col>
            </Row>
          </Modal.Body>
          {showM ? (
            <SLoadDocument
              setShow={closeSearchM}
              type={1}
              title={"Recurso"}
              getMedia={getItemM}
              show={showM}
              beanAction={null}
              accept={[".pdf", ".jpg", ".jpge", ".mp4", ".png"]}
            />
          ) : (
            ""
          )}
        </Modal>
      )}
    </>
  );
};

export default NEResource;
