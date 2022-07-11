import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { BsSearch, BsXSquare } from "react-icons/bs";
import { GlobalService } from "../../../core/services/GlobalService";
import { SuscriptionService } from "../../../core/services/SuscriptionService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme } from "../../../utils/Themes";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { IAutorizaado } from "../model/autorizado";
import { IFingerPrintData } from "../model/FingerPrintData";
import { IPersonPhotoData } from "../model/PersonPhotoData";
import { FileService } from '../../../core/services/FileService';

interface IBioValidationForm {
  beanAction: any;
  setShow: Function;
  idAction: number;
}

const _globalService = new GlobalService();
const _suscripcionService = new SuscriptionService();
const _fileService=new FileService();
const RIGHT_HAND: number = 6;

const FACE: number = 6;

export const BioValidationForm: React.FC<IBioValidationForm> = (
  props: IBioValidationForm
) => {
  const [render, setRender] = useState(-1);
  const [spinner, setSpinner] = useState(false);
  const [spinnerV, setSpinnerV] = useState(false);
  const [validado, setValidado] = useState(true);
  const [correct, setCorrect] = useState(false);
  const [photos, setPhotos] = useState(false);
  const [autorizados, setAutorizados] = useState<IAutorizaado[]>([]);
  const [dataSelected, setDataSelected] = useState("");
  const [alreadyBioData, setAlreadyBioData] = useState(false);
  const [validate, setValidate] = useState(true);
  const [name, setName] = useState("");
  const [autorizado, setAutorizado] = useState<IAutorizaado>();
  const [fingerPData, setFingerPData] = useState<IFingerPrintData[]>([]);
  const [personPhotos, setPersonPhotos] = useState<string[]>([]);

  useEffect(() => {
    getAccountByNit(props.beanAction.AccountID);
  }, []);

  const getAccountByNit = (nit: number) => {
    setSpinner(true);
    _globalService.getAccountByNit(nit).subscribe((resp) => {
      setSpinner(false);
      console.log(resp);
      if (resp) {
        //SI DocType === 2 es una persona Juridica, sino es persona Natural
        if (resp[0].DocType === 2) {
          getAutorizadosEmpresa(resp[0].Nit);
        } else {
          setName(resp[0].EntityName);
          setRender(1);
          getFingerPrintDataByAccount(resp[0].IDAccount);
          getPersonPhotoDataByAccount(resp[0].IDAccount);
        }
        /* Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias"
                    }) */
      } else {
        setAlreadyBioData(false);
        Toast.fire({
          icon: "error",
          title: "El usuario buscado no existe!",
        });
      }
    });
  };

  const getAutorizadosEmpresa = (idAccount: number) => {
    setSpinner(true);
    _globalService.getAutorizadosEmpresa(idAccount).subscribe((resp) => {
      setSpinner(false);
      console.log(resp);
      if (resp.length > 0) {
        //HAY AUTOLIZADOS
        console.log(resp);
        setAutorizados(resp);
        setRender(0);
      } else {
        Toast.fire({
          icon: "warning",
          title: "El usuario " + name + " NO tiene AUTORIZADOS registrados",
        });
      }
    });
  };

  const getFingerPrintDataByAccount = (idAccount: number) => {
    setSpinner(true);
    _globalService.getFingerPrintDataCatalog(idAccount).subscribe((resp) => {
      console.log(resp);
      setSpinner(false);
      if (resp.length > 0) {
        setAlreadyBioData(true);
        setFingerPData(resp);
      } else {
        setAlreadyBioData(false);
        Toast.fire({
          icon: "warning",
          title: "El usuario " + name + " NO tiene datos registrados",
        });
      }
    });
  };

  const getPersonPhotoDataByAccount = (idAccount: number) => {
    let aux: string[] = [];
    _globalService.getPersonPhotoDataCatalog(idAccount).subscribe((resp) => {
      if (resp.length > 0) {
        setAlreadyBioData(true);
        resp.map((data: IPersonPhotoData) => {
            console.log('respuestade busqueda de fotos del usuario',data);
          if (data.SideType === FACE) {
            console.log("repsuesta peticion fotos del usuario", data.URL);
            aux[data.ViewType] = _fileService.getUrlFile(data.Context, data.Filename);;
          }
        });
        setPersonPhotos(aux);
      }
    });
  };

  const getLabel = (finger: number, hand: number) => {
    let label = "";
    if (finger === 0) {
      label = "PULGAR ";
    } else if (finger === 1) {
      label = "INDICE ";
    } else if (finger === 2) {
      label = "MEDIO ";
    } else if (finger === 3) {
      label = "ANULAR ";
    } else if (finger === 4) {
      label = "MEÑIQUE ";
    }
    if (hand === RIGHT_HAND) {
      label += "- M. DERECHA";
    } else {
      label += "- M. IZQUIERDA";
    }
    return label;
  };

  const onValidate = async () => {
    setSpinnerV(true);
    let data = dataSelected.split(",");
    let finger = data[0];
    let hand = data[1];
    await _globalService
      .validateFingerPrint(
        props.beanAction.IDAccount + "",
        parseInt(hand),
        parseInt(finger)
      )
      .subscribe((resp) => {
        setSpinnerV(false);
        let jsonResp = JSON.parse(decodeURIComponent(resp));
        console.log(jsonResp);
        if (jsonResp.Result !== null) {
          if (jsonResp.Result.DataBeanProperties.Result === true) {
            ToastCenter.fire({
              icon: "success",
              title: "Validación Biométrica Correcta",
            });
            setValidado(false);
            setCorrect(true);
          } else {
            setCorrect(false);
            ToastCenter.fire({
              icon: "error",
              title: "Validación Biométrica Incorrecta",
            });
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo completar la accción",
          });
        }
      });
  };

  /* const onSubmit = (e: any) => {
        e.preventDefault();
        if (identification === 0) {
            Toast.fire({
                icon: 'warning',
                title: 'Introduzca una Identificación'
            });
        } else {
            getAccountByNit(identification);
        }
    }; */

  useEffect(() => {
    setName(autorizado ? autorizado.EntityName : "");
  }, [autorizado]);

  const getData = (idAutorizado: number) => {
    getPersonPhotoDataByAccount(idAutorizado);
    getFingerPrintDataByAccount(idAutorizado);
  };

  const onSend = async () => {
    setSpinner(true);
    await _suscripcionService
      .responseProcedureAction2(
        props.idAction,
        null,
        null,
        {
          CORRECTO: correct,
        },
        false
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          Toast.fire({
            icon: "success",
            title: "Resultado de la validacion enviada correctamente",
          });
          props.setShow(false);
        }
      });
  };

  const onSend2 = async (opc: boolean) => {
    setSpinner(true);
    await _suscripcionService
      .responseProcedureAction2(
        props.idAction,
        null,
        null,
        {
          CORRECTO: opc,
        },
        false
      )
      .then((resp: any) => {
        setSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          Toast.fire({
            icon: "success",
            title: "Resultado de la validacion enviada correctamente",
          });
          props.setShow(false);
        }
      });
  };

  const renderSwitch = () => {
    switch (render) {
      case 0:
        return (
          <div className="w-100">
            <Col sm={12}>
              <TextField
                value={autorizado?.IDAccount}
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Autorizado a validar"
                id="state"
                onChange={(e) => {
                  getData(parseInt(e.target.value));
                }}
              >
                {autorizados.map((item: IAutorizaado) => (
                  <MenuItem
                    value={item.IDAccount}
                    onClick={() => setAutorizado(item)}
                  >
                    {item.EntityName} - {item.Nit}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            {alreadyBioData && (
              <div className="">
                <Col sm={12} className="mt-3">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setPhotos(true);
                      }}
                    >
                      VER FOTOS
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col sm={12}>
                  <TextField
                    value={dataSelected}
                    margin="normal"
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label="Huella a validar"
                    id="state"
                    onChange={(e) => {
                      setDataSelected(e.target.value);
                      setValidate(false);
                    }}
                  >
                    {fingerPData.map((item: IFingerPrintData) => (
                      <MenuItem value={item.FingerType + "," + item.HandType}>
                        {getLabel(item.FingerType, item.HandType)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Col>
                <Col sm={12} className="mt-3">
                  
                  {/**
                   * TODO: ACTIVAR Y DESACTIVAR EL BOTON SI HAY O NO HAY HUELLAS
                   */}
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      disabled={true}
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onValidate();
                      }}
                    >
                      VALIDAR
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col
                  sm={12}
                  className="mt-3 mb-3 d-flex justify-content-between flex-row"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        onSend2(false);
                      }}
                    >
                      INCORRECTO
                    </Button>
                  </ThemeProvider>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onSend2(true);
                      }}
                    >
                      CORRECTO
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col sm={12} className="mt-5">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      disabled={validado}
                      variant="contained"
                      color="info"
                      onClick={() => {
                        onSend();
                      }}
                    >
                      ENVIAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </div>
            )}
            {name !== "" && !alreadyBioData && (
              <div className=" mt-2">
                <Col sm={12}>
                  <h6>
                    NO SE REGISTRAN DATOS BIOMÉTRICOS PARA EL USUARIO:{" "}
                    <b>{name}</b>
                  </h6>
                </Col>
                <Col
                  sm={12}
                  className="mt-3 mb-3 d-flex justify-content-between flex-row"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        onSend2(false);
                      }}
                    >
                      INCORRECTO
                    </Button>
                  </ThemeProvider>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onSend2(true);
                      }}
                    >
                      CORRECTO
                    </Button>
                  </ThemeProvider>
                </Col>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            {alreadyBioData && (
              <div className="">
                <div className="d-flex flex-column justify-content-center">
                  {/* <b>VALIDACION BIOMÉTRICA PARA:</b> */}
                  <small>{name}</small>
                </div>
                <Col sm={12} className="mt-3">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setPhotos(true);
                      }}
                    >
                      VER FOTOS
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col sm={12}>
                  <TextField
                    value={dataSelected}
                    margin="normal"
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label="Huella a validar"
                    id="state"
                    onChange={(e) => {
                      setDataSelected(e.target.value);
                      setValidate(false);
                    }}
                  >
                    {fingerPData.map((item: IFingerPrintData) => (
                      <MenuItem value={item.FingerType + "," + item.HandType}>
                        {getLabel(item.FingerType, item.HandType)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Col>
                <Col sm={12} className="mt-3">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      disabled={validate}
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onValidate();
                      }}
                    >
                      VALIDAR
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col
                  sm={12}
                  className="mt-3 mb-3 d-flex justify-content-between flex-row"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        onSend2(false);
                      }}
                    >
                      INCORRECTO
                    </Button>
                  </ThemeProvider>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onSend2(true);
                      }}
                    >
                      CORRECTO
                    </Button>
                  </ThemeProvider>
                </Col>
                <Col sm={12} className="mt-5">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      disabled={validado}
                      variant="contained"
                      color="info"
                      onClick={() => {
                        onSend();
                      }}
                    >
                      ENVIAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </div>
            )}
            {name !== "" && !alreadyBioData && (
              <div className="mt-2">
                <Col sm={12}>
                  <h6>
                    NO SE REGISTRAN DATOS BIOMÉTRICOS PARA EL USUARIO:{" "}
                    <b>{name}</b>
                  </h6>
                </Col>
                <Col
                  sm={12}
                  className="mt-3 mb-3 d-flex justify-content-between flex-row"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        onSend2(false);
                      }}
                    >
                      INCORRECTO
                    </Button>
                  </ThemeProvider>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100 m-3"
                      variant="contained"
                      color="success"
                      onClick={() => {
                        onSend2(true);
                      }}
                    >
                      CORRECTO
                    </Button>
                  </ThemeProvider>
                </Col>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          //
          <div></div>
        );

      default:
        break;
    }
  };
  console.log(personPhotos)

  return (
    <>
      <Row className="d-flex justify-content-center">
        {/*  <Col sm={12} className="d-flex justify-content-center">
                    <h4>VALIDACION BIOMÉTRICA</h4>
                </Col> */}
        {renderSwitch()}
      </Row>
      {spinner && <SSpinner show={spinner} />}
      {spinnerV && (
        <SSpinner show={spinnerV} message="VALIDACIÓN BIOMETRICA EN PROCESO" />
      )}
      {photos && (
        <Modal
          show={photos}
         
          centered
          onHide={() => setPhotos(false)}
          size="xl"
        >
          <Modal.Header>
            Configuración toma de datos Biométricos
            <BsXSquare className="pointer" onClick={() => setPhotos(false)} />
          </Modal.Header>
          <Modal.Body>
            <h1>Fotos registradas</h1>
            <Row className="mt-3 d-flex justify-content-center overflow-auto">
              <div className="" >
                {personPhotos.length > 0 ? (
                  personPhotos.map((url: string) => (
                    <Col sm={4} className="mt-3">
                      <div>
                        <img
                          src={url}
                          alt="FOTO PERSONA"
                          style={{maxWidth:'350px',maxHeight:'350px'}}
                        />
                      </div>
                    </Col>
                  ))
                ) : (
                  <h3>NO HAY REGISTRO FOTOGRÁFICO</h3>
                )}
              </div>
            </Row>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
