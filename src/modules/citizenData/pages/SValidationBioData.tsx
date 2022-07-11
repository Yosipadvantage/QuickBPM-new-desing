import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BsArrowLeftCircle, BsSearch } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { FileService } from "../../../core/services/FileService";
import { GlobalService } from "../../../core/services/GlobalService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { User } from "../../../shared/model/User";
import { inputsTheme } from "../../../utils/Themes";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { IFingerPrintData } from "../model/FingerPrintData";
import { IPersonPhotoData } from "../model/PersonPhotoData";
import { SRegisterBioData } from "./SRegisterBioData";

interface ISValidationBioData {}

const _globalService = new GlobalService();
const _fileService=new FileService();

const LEFT_HAND: number = 5;
const RIGHT_HAND: number = 6;
const FRONT_FACE: number = 0;
const RIGHT_FACE: number = 3;
const LEFT_FACE: number = 4;
const FACE: number = 6;

export const SValidationBioData: React.FC<ISValidationBioData> = (
  props: ISValidationBioData
) => {
  const fingerNames: string[] = [
    "PULGAR",
    "INDICE",
    "MEDIO",
    "ANULAR",
    "MEÑIQUE",
  ];
  const history = useHistory();

  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerValidation, setShowSpinnerValidation] = useState(false);
  const [state, setState] = useState(0);
  const [identification, setIdentification] = useState(0);
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User[]>([]);
  const [fingerRightPhotos, setFingerRightPhotos] = useState<string[]>([]);
  const [fingerLeftPhotos, setFingerLeftPhotos] = useState<string[]>([]);
  const [alreadyBioData, setAlreadyBioData] = useState<boolean>(false);
  const [personPhotos, setPersonPhotos] = useState<string[]>([]);
  const [hand, setHand] = useState<number>(0);
  const [counterFinger, setCounterFinger] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  const [finger, setFinger] = useState<string>("");

  useEffect(() => {
    setFinger(fingerNames[counterFinger]);
    setHand(RIGHT_HAND);
  }, []);

  useEffect(() => {
    setFinger(
      fingerNames[counterFinger <= 4 ? counterFinger : counterFinger - 5]
    );
  }, [counterFinger]);

  const getAccountByNit = (nit: number) => {
    setShowSpinner(true);
    _globalService.getAccountByNit(nit).subscribe((resp) => {
      setShowSpinner(false);
      if (resp.length > 0) {
        getFingerPrintDataByAccount(resp[0].IDAccount);
        getPersonPhotoDataByAccount(resp[0].IDAccount);
        setUser(resp);
        setName(resp[0].Surname1 !== undefined ? resp[0].EntityName : "");
        Toast.fire({
          icon: "success",
          title: "Se han encontrado coincidencias",
        });
        setState(1);
      } else {
        Toast.fire({
          icon: "error",
          title: "El usuario buscado no existe!",
        });
      }
    });
  };

  const getFingerPrintDataByAccount = (idAccount: number) => {
    let auxR: string[] = [...fingerRightPhotos];
    let auxL: string[] = [...fingerLeftPhotos];
    _globalService.getFingerPrintDataCatalog(idAccount).subscribe((resp) => {
      if (resp.length > 0) {
        setAlreadyBioData(true);
        resp.map((data: IFingerPrintData) => {
          if (data.HandType === RIGHT_HAND) {
            auxR[data.FingerType] = data.URL;
          } else if (data.HandType === LEFT_HAND) {
            auxL[data.FingerType + 5] = data.URL;
          }
        });
        setFingerRightPhotos(auxR);
        setFingerLeftPhotos(auxL);
      }
    });
  };

  const getPersonPhotoDataByAccount = (idAccount: number) => {
    let aux: string[] = [...fingerRightPhotos];
    _globalService.getPersonPhotoDataCatalog(idAccount).subscribe((resp) => {

      console.log(resp);
      
      if (resp.length > 0) {
        setAlreadyBioData(true);
        resp.map((data: IPersonPhotoData) => {
          if (data.SideType === FACE) {
            aux[data.ViewType]=_fileService.getUrlFile(data.Context,data.Filename);
          }
        });
        console.log(aux);
        
        setPersonPhotos(aux);
      }
    });
  };

  const handleNext = (type: number) => {
    if (type === 0) {
      setCounterFinger(counterFinger + 1);
    } else {
      setCounterFinger(counterFinger - 1);
    }
  };

  const calcNumRecords = (arr: string[]) => {
    let counter = 0;
    arr.map((item: string) => {
      if (item !== "" && item !== undefined) {
        counter++;
      }
    });
    return counter;
  };

  const handleScan = async () => {
    setShowSpinnerValidation(true);
    await _globalService
      .validateFingerPrint(
        user[0].IDAccount + "",
        hand,
        hand === RIGHT_HAND ? counterFinger : counterFinger - 5
      )
      .subscribe((resp) => {
        setShowSpinnerValidation(false);
        let jsonResp = JSON.parse(decodeURIComponent(resp));
        console.log(jsonResp);
        if (jsonResp.Result !== null) {
          if (jsonResp.Result.DataBeanProperties.Result === true) {
            ToastCenter.fire({
              icon: "success",
              title: "Validación Biométrica Correcta",
            });
          } else {
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (identification === 0) {
      Toast.fire({
        icon: "warning",
        title: "Introduzca una Identificación",
      });
    } else {
      getAccountByNit(identification);
    }
  };

  const renderSwitch = () => {
    switch (state) {
      case 0:
        return (
          <div className="container d-flex justify-content-center">
            <form>
              <Row className="card box-s m-3 d-block">
                <Col sm={12} className="mt-5 mb-3 mr-5 ml-5">
                  <h1>..::VALIDACIÓN BIOMÉTRICA::..</h1>
                </Col>
                <Col sm={11} className="mt-5 mb-3">
                  <TextField
                    className="m-3"
                    type="number"
                    size="small"
                    fullWidth
                    color="secondary"
                    margin="normal"
                    label="No. Identificación"
                    id="write"
                    onChange={(e) =>
                      setIdentification(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            onClick={(e) => onSubmit(e)}
                          >
                            <BsSearch />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
                <Col
                  sm={6}
                  className="mb-3 ml-12 d-flex justify-content-center"
                >
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => onSubmit(e)}
                    >
                      BUSCAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
          </div>
        );
      case 1:
        return (
          <div>
            <Row className="d-flex justify-content-center align-items-center m-5">
              <Col sm={12} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="ml-3"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      window.location.reload();
                      setState(0);
                    }}
                  >
                    <BsArrowLeftCircle className="mr-2" />
                    ATRAS
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className=" mt-5 d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    No se encontraron Datos Biométricos para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Validación de Datos Biométricos registrados para{" "}
                    <b>{name}</b> - <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {alreadyBioData && (
                <Col className="d-flex justify-content-center">
                  <Card
                    className="card-zoom m-10 img-view"
                    onClick={() => setState(2)}
                  >
                    <Card.Title className="mt-3 ml-5">
                      <h1 className="">VALIDACIÓN DE HUELLAS</h1>
                    </Card.Title>
                    <div className="d-flex flex-column justify-component-center">
                      <img
                        className="mw-250 ml-5"
                        src={
                          process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"
                        }
                        alt="fingerprint-sgv"
                      />
                      <h2 className="ml-5 mt-3">
                        {calcNumRecords(fingerRightPhotos) +
                          calcNumRecords(fingerLeftPhotos)}{" "}
                        Registros encontrados
                      </h2>
                    </div>
                  </Card>
                </Col>
              )}
              {alreadyBioData && (
                <Col className="d-flex justify-content-center">
                  <Card
                    className="card-zoom m-10 img-view"
                    onClick={() => setState(3)}
                  >
                    <Card.Title className="mt-3 ml-5">
                      <h1 className="">VALIDACIÓN DE FOTOS</h1>
                    </Card.Title>
                    <div className="d-flex flex-column">
                      <img
                        className="mw-250 ml-5"
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/fingerprints/profile.png"
                        }
                        alt="userCam-sgv"
                      />
                      <h2 className="ml-5 mt-3">
                        {calcNumRecords(personPhotos)} Registros encontrados
                      </h2>
                    </div>
                  </Card>
                </Col>
              )}
              {!alreadyBioData && (
                <Col className="mt-3" sm={8}>
                  <Card
                    className="card-zoom m-10 img-view d-flex justify-content-center align-items-center"
                    onClick={() => /* setState(6) */ history.push("/bio-data")}
                  >
                    <Card.Title className="mt-3 ml-5">
                      <h1 className="">REGISTRAR DATOS BIOMÉTRICOS</h1>
                    </Card.Title>
                    <img
                      className="mw-250 ml-5"
                      src={
                        process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"
                      }
                      alt="userCam-sgv"
                    />
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        );
      //ESCOGER MANO A VALIDAR
      case 2:
        return (
          <div>
            <Row className="d-flex justify-content-between m-10">
              <Col sm={12} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="ml-3"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setState(1);
                    }}
                  >
                    <BsArrowLeftCircle className="mr-2" />
                    ATRAS
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                <h1>
                  Validación de Huellas para <b>{name}</b> -{" "}
                  <b>{identification}</b>
                </h1>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                <h1>POR FAVOR ESCOJA LA MANO DE LA HUELLA QUE DESEA VALIDAR</h1>
              </Col>
              <Col className="mt-3">
                <div
                  className="card-zoom m-10 img-view d-flex justify-content-between"
                  onClick={(e) => {
                    setState(4);
                    setHand(RIGHT_HAND);
                  }}
                >
                  <img
                    className="mw-250"
                    src={process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"}
                    alt="right hand fg"
                  />
                  <Row className="d-flex flex-column">
                    <Col sm={12} className=" mt-3 d-flex flex-column">
                      <h1 className="">Mano Derecha</h1>
                      <h2 className="ml-5 mt-3">
                        {calcNumRecords(fingerRightPhotos)} Registros
                        encontrados
                      </h2>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col className="mt-3">
                <div
                  className="card-zoom m-10 img-view d-flex justify-content-between "
                  onClick={(e) => {
                    setState(5);
                    setHand(LEFT_HAND);
                    setCounterFinger(5);
                  }}
                >
                  <img
                    className="mw-250"
                    src={process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"}
                    alt="left hand fg"
                  />
                  <Row className="d-flex flex-column">
                    <Col sm={12} className="mt-3 d-flex flex-column">
                      <h1 className="">Mano Izquierda</h1>
                      <h2 className="ml-5 mt-3">
                        {calcNumRecords(fingerLeftPhotos)} Registros encontrados
                      </h2>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        );
      //VALIDACION DE FOTOS
      case 3:
        return (
          <>
            <Row className="d-flex justify-content-center mt-3">
              <Col sm={6} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="ml-3"
                    variant="contained"
                    color="secondary"
                    onClick={() => setState(1)}
                  >
                    <BsArrowLeftCircle className="mr-2" />
                    ATRAS
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={6} className="d-flex justify-content-end">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="color-white mr-3"
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setState(1);
                      Toast.fire({
                        icon: "success",
                        title: "Se guardó correctamente!",
                      });
                    }}
                  >
                    OK
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                <h1>
                  Fotos registradas para <b>{name}</b> - <b>{identification}</b>
                </h1>
              </Col>
            </Row>
            <Row className="mt-3 d-flex justify-content-center">
              <Col sm={6} className=" mt-5 d-flex justify-content-center">
                <h1 className="h0">
                  {view === FRONT_FACE && <b>PERFIL FRONTAL</b>}
                  {view === RIGHT_FACE && <b>PERFIL DERECHO</b>}
                  {view === LEFT_FACE && <b>PERFIL IZQUIERDO</b>}
                </h1>
              </Col>
            </Row>
            <div className="container d-flex justify-content-center m-5">
              <Row className="d-flex justify-content-center">
                <Col sm={6}>
                  <img
                    className="img-fluid"
                    src={
                      process.env.PUBLIC_URL +
                      `/assets/personProfiles/${view}.png`
                    }
                    alt="Toma de fotos"
                    style={{
                      width: 500,
                      maxHeight: 500,
                    }}
                  />
                </Col>
                <Col sm={6}>
                  {personPhotos[view] !== undefined ? (
                    <img
                      className="img-fluid"
                      src={personPhotos[view]}
                      alt="Toma de fotos"
                      style={{
                        width: 500,
                        maxHeight: 500,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/personProfiles/noFront.png`
                      }
                      alt=""
                      className="img-fluid"
                      style={{
                        width:500,
                        maxHeight:500
                    }}
                    />
                  )}
                </Col>
                <Col sm={12} className="mt-3 ">
                  <Row className="d-flex justify-content-center">
                    <Col sm={2}>
                      <div
                        className={
                          "card-zoom m-2" +
                          (personPhotos[0] !== undefined
                            ? " data-done"
                            : " data-none")
                        }
                        onClick={() => setView(0)}
                      >
                        <img
                          className="img-fluid"
                          src={
                            process.env.PUBLIC_URL +
                            `/assets/personProfiles/0.png`
                          }
                          alt="Toma de huellas"
                          style={{
                            width:500,
                            maxHeight:500
                        }}
                        />
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div
                        className={
                          "card-zoom m-2" +
                          (personPhotos[3] !== undefined
                            ? " data-done"
                            : " data-none")
                        }
                        onClick={() => setView(3)}
                      >
                        <img
                          className="img-fluid"
                          src={
                            process.env.PUBLIC_URL +
                            `/assets/personProfiles/3.png`
                          }
                          alt="Toma de huellas"
                          
                        />
                      </div>
                    </Col>
                    <Col sm={2}>
                      <div
                        className={
                          "card-zoom m-2 " +
                          (personPhotos[4] !== undefined
                            ? " data-done"
                            : " data-none")
                        }
                        onClick={() => setView(4)}
                      >
                        <img
                          className="img-fluid"
                          src={
                            process.env.PUBLIC_URL +
                            `/assets/personProfiles/4.png`
                          }
                          alt="Toma de huellas"
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </>
        );
      //VALIDACION DE HUELLAS DE MANO DERECHA
      case 4:
        return (
          <>
            <Row className="d-flex justify-content-center mt-3">
              <Col sm={6} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="ml-3"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setState(2);
                      setCounterFinger(0);
                    }}
                  >
                    <BsArrowLeftCircle className="mr-1" />
                    ATRAS
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={6} className="d-flex justify-content-end">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="mr-5"
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setState(2);
                      Toast.fire({
                        icon: "success",
                        title: "Se guardó correctamente!",
                      });
                    }}
                  >
                    OK
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center ">
                <h1>
                  Validaciòn de Huellas para <b>{name}</b> -{" "}
                  <b>{identification}</b>
                </h1>
              </Col>
            </Row>
            <Row className="mt-3 d-flex justify-content-between">
              <Col sm={6} className=" mt-5 d-flex justify-content-end">
                <h1 className="h0">
                  <b>{finger} - MANO DERECHA</b>
                </h1>
              </Col>
              <Col sm={6} className="mt-5 d-flex justify-content-center">
                {counterFinger > 0 && (
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNext(1)}
                    >
                      ANTERIOR
                    </Button>
                  </ThemeProvider>
                )}
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="color-white mr-3 ml-3"
                    variant="contained"
                    color="primary"
                    onClick={() => handleScan()}
                  >
                    VALIDAR HUELLA
                  </Button>
                </ThemeProvider>
                {counterFinger < 4 && (
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNext(0)}
                    >
                      SIGUIENTE
                    </Button>
                  </ThemeProvider>
                )}
              </Col>
            </Row>
            {
              <div className="container d-flex justify-content-center">
                <Row className="d-flex justify-content-center">
                  <Col sm={6} className="mt-5 d-flex justify-content-center">
                    <img
                      className="img-fluid"
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/fingerprints/right/${counterFinger}.png`
                      }
                      alt="Toma de huellas"
                      style={{
                        width: 500,
                        height: 500,
                      }}
                    />
                  </Col>
                  <Col sm={6} className="mt-5 d-flex justify-content-center">
                    {fingerRightPhotos[counterFinger] !== undefined ? (
                      <img
                        className="img-fluid"
                        src={fingerRightPhotos[counterFinger]}
                        alt="Huella"
                        style={{
                          width: 500,
                          height: 500,
                        }}
                      />
                    ) : (
                      <img
                        className="img-fluid"
                        src={
                          process.env.PUBLIC_URL +
                          `/assets/fingerprints/noFingerPrint.png`
                        }
                        alt=""
                        style={{
                          width: 500,
                          height: 500,
                        }}
                      />
                    )}
                  </Col>
                  <Col sm={12} className="mt-5 d-flex">
                    <Row>
                      {fingerNames.map((item: any, index) => (
                        <Col sm={2}>
                          <div
                            className={"card__huella__item p-3"}
                            onClick={() => setCounterFinger(index)}
                          >
                            <img
                              className="img-fluid  "
                              src={
                                process.env.PUBLIC_URL +
                                `/assets/fingerprints/right/${index}.png`
                              }
                              alt="Toma de huellas"
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </div>
            }
          </>
        );
      //VALIDACION DE HUELLAS DE MANO IZQUIERDA
      case 5:
        return (
          <>
            <Row className="d-flex justify-content-center mt-3">
              <Col sm={6} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="ml-3"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setState(2);
                      setCounterFinger(0);
                    }}
                  >
                    <BsArrowLeftCircle className="mr-1" />
                    ATRAS
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={6} className="d-flex justify-content-end">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="mr-5"
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setState(2);
                      Toast.fire({
                        icon: "success",
                        title: "Se guardó correctamente!",
                      });
                    }}
                  >
                    OK
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                <h1>
                  Validaciòn de Huellas para <b>{name}</b> -{" "}
                  <b>{identification}</b>
                </h1>
              </Col>
            </Row>
            <Row className="mt-3 d-flex justify-content-between">
              <Col sm={6} className=" mt-5 d-flex justify-content-end">
                <h1 className="h0">
                  <b>{finger} - MANO IZQUIERDA</b>
                </h1>
              </Col>
              <Col sm={6} className="mt-5 d-flex justify-content-center">
                {counterFinger > 5 && (
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNext(1)}
                    >
                      ANTERIOR
                    </Button>
                  </ThemeProvider>
                )}
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="color-white mr-3 ml-3"
                    variant="contained"
                    color="primary"
                    onClick={() => handleScan()}
                  >
                    VALIDAR HUELLA
                  </Button>
                </ThemeProvider>
                {counterFinger < 9 && (
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNext(0)}
                    >
                      SIGUIENTE
                    </Button>
                  </ThemeProvider>
                )}
              </Col>
            </Row>
            <div className="container d-flex justify-content-center">
              <Row className="d-flex justify-content-center">
                <Col sm={6} className="d-flex justify-content-center mt-5">
                  <img
                    className="img-fluid"
                    src={
                      process.env.PUBLIC_URL +
                      `/assets/fingerprints/left/${counterFinger}.png`
                    }
                    alt="Toma de huellas"
                    style={{
                      width: 500,
                      height: 500,
                    }}
                  />
                </Col>
                <Col sm={6} className=" d-flex justify-content-center mt-5">
                  {fingerLeftPhotos[counterFinger] !== undefined ? (
                    <img
                      className="img-fluid"
                      src={fingerLeftPhotos[counterFinger]}
                      alt="Huella"
                      style={{
                        width: 500,
                        height: 500,
                      }}
                    />
                  ) : (
                    <img
                      className="img-fluid"
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/fingerprints/noFingerPrint.png`
                      }
                      alt=""
                      style={{
                        width: 500,
                        height: 500,
                      }}
                    />
                  )}
                </Col>
                <Col sm={12} className="mt-5 ">
                  <Row className="d-flex justify-content-center">
                    {fingerNames.map((item: any, index) => (
                      <Col sm={2}>
                        <div
                          className="card__huella__item p-3"
                          onClick={() => {
                            setCounterFinger(index + 5);
                          }}
                        >
                          <img
                            className="mw-100"
                            src={
                              process.env.PUBLIC_URL +
                              `/assets/fingerprints/left/${index + 5}.png`
                            }
                            alt="Toma de huellas"
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </div>
          </>
        );
      case 6:
        return {
          /* <SRegisterBioData idAccount={identification} /> */
        };
    }
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <div className="mt-15">{renderSwitch()}</div>
        <SSpinner show={showSpinner} />
        <SSpinner
          show={showSpinnerValidation}
          message="VALIDACIÓN BIOMETRICA EN PROCESO"
        />
      </div>
    </>
  );
};
