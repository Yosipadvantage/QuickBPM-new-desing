import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BsArrowLeftCircle, BsSearch } from "react-icons/bs";
import { GlobalService } from "../../../core/services/GlobalService";

import { SSpinner } from "../../../shared/components/SSpinner";
import { User } from "../../../shared/model/User";
import { inputsTheme } from "../../../utils/Themes";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import { IFingerPrintData } from "../model/FingerPrintData";
import { IPersonPhotoData } from "../model/PersonPhotoData";
import { MCargaFoto } from "../components/MCargaFoto.jsx";
import { View } from "@react-pdf/renderer";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { getSession } from "../../../utils/UseProps";
import { FileService } from '../../../core/services/FileService';
//  cambio menor

interface ISRegisterBioData {
  idAccount: number;
}

const _globalService = new GlobalService();
const _fileService = new FileService();

const LEFT_HAND: number = 5;
const RIGHT_HAND: number = 6;
const FRONT_FACE: number = 0;
const RIGHT_FACE: number = 3;
const LEFT_FACE: number = 4;
const FACE: number = 6;

export const SRegisterBioData: React.FC<ISRegisterBioData> = (
  props: ISRegisterBioData
) => {
  const fingerNames: string[] = [
    "PULGAR",
    "INDICE",
    "MEDIO",
    "ANULAR",
    "MEÑIQUE",
  ];

  const [counterFinger, setCounterFinger] = useState<number>(0);
  const [counterPhotos, setCounterPhotos] = useState<number>(0);
  const [view, setView] = useState<number>(0);
  const [identification, setIdentification] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [state, setState] = useState<number>(0);
  const [finger, setFinger] = useState<string>("");
  const [hand, setHand] = useState<number>(0);
  const [progressFingerR, setProgressFingerR] = useState<number>(0);
  const [progressFingerL, setProgressFingerL] = useState<number>(0);
  const [progressPersonP, setProgressPersonP] = useState<number>(0);
  const [showSpinnerScan, setShowSpinnerScan] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const [fingerRightPhotos, setFingerRightPhotos] = useState<string[]>([]);
  const [fingerLeftPhotos, setFingerLeftPhotos] = useState<string[]>([]);
  const [personPhotos, setPersonPhotos] = useState<string[]>([]);
  const [alreadyBioData, setAlreadyBioData] = useState<boolean>(false);
  const [takePicture, setTakePicture] = useState<boolean>(false);

  useEffect(() => {
    /* if (props.idAccount) {
            getAccountByNit(props.idAccount);
            setState(1);
        } */
    setFinger(fingerNames[counterFinger]);
  }, []);

  useEffect(() => {
    setFinger(
      fingerNames[counterFinger <= 4 ? counterFinger : counterFinger - 5]
    );
  }, [counterFinger]);

  const getFingerPrintDataByAccount = (idAccount: number) => {
    let auxR: string[] = [...fingerRightPhotos];
    let auxL: string[] = [...fingerLeftPhotos];
    _globalService.getFingerPrintDataCatalog(idAccount).subscribe((resp) => {
      console.log(resp);
      if (resp.length > 0) {
        setAlreadyBioData(true);
        resp.map((data: IFingerPrintData) => {
          if (data.HandType === RIGHT_HAND) {
            auxR[data.FingerType] = data.URL;
            setProgressFingerR(calcNumRecords(auxR) * 20);
          } else if (data.HandType === LEFT_HAND) {
            auxL[data.FingerType + 5] = data.URL;
            setProgressFingerL(calcNumRecords(auxL) * 20);
          }
        });
        console.log(auxR);
        console.log(auxL);
        setFingerRightPhotos(auxR);
        setFingerLeftPhotos(auxL);
      } else {
        setState(1);
      }
    });
  };

  const getPersonPhotoDataByAccount = (idAccount: number) => {
    let aux: string[] = [...fingerRightPhotos];
    _globalService.getPersonPhotoDataCatalog(idAccount).subscribe((resp) => {
      if (resp.length > 0) {
        setAlreadyBioData(true);
        resp.map((data: IPersonPhotoData) => {
          if (data.SideType === FACE) {
            // aux[data.ViewType] = data.URL; 
            aux[data.ViewType] = _fileService.getUrlFile(data.Context, data.Filename);
          }
        });
        setProgressPersonP(
          calcNumRecords(aux) === 3 ? 100 : calcNumRecords(aux) * 33.3
        );
        setPersonPhotos(aux);
      }
    });
  };

  const getAccountByNit = (nit: number) => {
    setShowSpinner(true);
    _globalService.getAccountByNit(nit).subscribe((resp) => {
      setShowSpinner(false);
      if (resp.length > 0) {
        console.log(resp);
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
          title: "No se han encontrado coincidencias",
        });
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

  const handleChangeView = (type: number) => {
    if (type === 0) {
      setCounterPhotos(counterPhotos + 1);
      if (view === FRONT_FACE) {
        setView(RIGHT_FACE);
      } else if (view === RIGHT_FACE) {
        setView(LEFT_FACE);
      }
    } else {
      if (view === RIGHT_FACE) {
        setCounterPhotos(counterPhotos - 1);
        setView(FRONT_FACE);
      } else if (view === LEFT_FACE) {
        setCounterPhotos(counterPhotos - 1);
        setView(RIGHT_FACE);
      }
    }
  };

  const activateUserByBioData = (idAccount: number) => {
    _globalService.activarUsuarioCiu(idAccount).subscribe((resp) => {
      if (resp.DataBeanProperties.ObjectValue) {
        if (resp.DataBeanProperties.ObjectValue.DataBeanProperties) {
          ToastCenter.fire({
            icon: "success",
            title: "Se ha activado el usuario " + name + " exitosamente",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido activar el usuario",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const handleScan = async () => {
    setShowSpinnerScan(true);
    let aux: string[] =
      hand === RIGHT_HAND ? [...fingerRightPhotos] : [...fingerLeftPhotos];
    await _globalService
      .registerFingerPrint(
        user[0].IDAccount + "",
        hand,
        hand === RIGHT_HAND ? counterFinger : counterFinger - 5
      )
      .subscribe((resp) => {
        console.log(resp);
        setShowSpinnerScan(false);
        let jsonResp = JSON.parse(decodeURIComponent(resp));
        console.log(jsonResp);
        if (
          jsonResp.Result !== null &&
          jsonResp.Result.DataBeanProperties.Result !== false
        ) {
          aux[counterFinger] = jsonResp.Result.DataBeanProperties.URL;
          if (hand === RIGHT_HAND) {
            setFingerRightPhotos(aux);
            setProgressFingerR(calcNumRecords(aux) * 20);
          } else {
            setFingerLeftPhotos(aux);
            setProgressFingerL(calcNumRecords(aux) * 20);
          }
          calcTotalPercentFinger();
          if (calcTotalPercentFinger() === 20) {
            activateUserByBioData(user[0].IDAccount);
          }
          Toast.fire({
            icon: "success",
            title: "Huella Escaneada Correctamente",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo completar la accción",
          });
        }
      });
  };

  const handleShoot = async () => {
    setShowSpinnerScan(true);

    let aux: string[] = [...personPhotos];

    await _globalService
      .registerPersonPhoto(user[0].IDAccount + "", view, FACE)
      .subscribe((resp) => {
        setShowSpinnerScan(false);
        console.log(resp);
        let jsonResp = JSON.parse(decodeURIComponent(resp));
        if (jsonResp.Result !== null) {
          activateUserByBioData(user[0].IDAccount);
          aux[view] = jsonResp.Result.DataBeanProperties.URL;
          setPersonPhotos(aux);
          setProgressPersonP(
            calcNumRecords(aux) === 3 ? 100 : calcNumRecords(aux) * 33.3
          );
          handleChangeView(0);
          Toast.fire({
            icon: "success",
            title: "Foto Capturada Correctamente",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se pudo completar la accción",
          });
        }
      });
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

  const calcTotalPercent = () => {
    let x = calcTotalPercentFinger();
    let y = progressPersonP;
    return x / 2 + y / 2;
  };

  const calcTotalPercentFinger = () => {
    let x = progressFingerR;
    let y = progressFingerL;
    return x / 2 + y / 2;
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

  const closeTakePicture = (data: boolean) => {
    setTakePicture(data);
  };

  const renderSwitch = (state: number) => {
    switch (state) {
      case 0:
        return (
          <div className="container d-flex justify-content-center">
            <form>
              <Row className="card box-s m-3 d-block">
                <Col sm={12} className="mt-5 mb-3 mr-5 ml-5">
                  <h1>..::ENROLAMIENTO BIOMÉTRICO::..</h1>
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
            {/*
             * *BOTON ATRAS
             */}
            <Row className="d-flex justify-content-between p-5">
              <Col sm={12} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="mb-5"
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
              {/*
               * *FIN BOTON ATRAS
               */}
              <Col sm={12} className="d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    Toma de Datos Biométricos para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Datos Biométricos registrados para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {
                /**
                 * * INICIO PROGRESS BAR
                 */
                <div className="d-block w-100 justify-content-center  ">
                  <Col sm={12} className="mt-5 d-flex justify-content-center">
                    <h1>{calcTotalPercent()}% Completado</h1>
                  </Col>
                  <Col sm={12} className="mt-3 card box-s">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        className="mt-3 mb-3 mr-2 ml-2"
                        variant="determinate"
                        value={calcTotalPercent()}
                      />
                    </Box>
                  </Col>
                </div>
                /**
                 * *FIN PROGRESS BAR
                 * *--------------------------------------------------------------------------------------
                 */
              }

              <div className="container d-flex card__huella mt-5 ">
                {/*
                 * *INICIO CARD HUELLAS
                 */}

                <Col className="d-flex justify-content-center  ">
                  <div
                    className="card__huella__item"
                    onClick={() => setState(2)}
                  >
                    <div className="card__huella__item__title mt-3">
                      {!alreadyBioData ? (
                        <h1 className="">TOMA DE HUELLAS</h1>
                      ) : (
                        <h1 className="">VER HUELLAS REGISTRADAS</h1>
                      )}
                    </div>
                    <div className="card__huella__item__image">
                      <img
                        className="card__huella__item__image__src"
                        src={
                          process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"
                        }
                        alt="fingerprint-sgv"
                      />
                      <div className="card__huella__item__image__info">
                        <h1 className="h0">{`${calcTotalPercentFinger()}%`}</h1>
                        <h2 className="">Completado</h2>
                      </div>
                    </div>
                  </div>
                </Col>

                {/*
                 * *FIN CARD HUELLAS
                 * *-----------------------------------------------------------------------------------------------
                 */}

                {/*
                 * * INICIO CARD IMAGENES
                 */}

                <Col className="d-flex justify-content-center ">
                  <div
                    className="card__huella__item"
                    onClick={() => setState(4)}
                  >
                    <div className="card__huella__item__title mt-3">
                      {!alreadyBioData ? (
                        <h1 className="">TOMA DE FOTOS</h1>
                      ) : (
                        <h1 className="">VER FOTOS REGISTRADAS</h1>
                      )}
                    </div>
                    <div className="card__huella__item__image">
                      <img
                        className="card__huella__item__image__src"
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/fingerprints/profile.png"
                        }
                        alt="userCam-sgv"
                      />
                      <div className="card__huella__item__image__info">
                        <h1 className="h0 ">{progressPersonP}%</h1>
                        <h2 className="">Completado</h2>
                      </div>
                    </div>
                  </div>
                </Col>

                {/*
                 * * FIN CARD IMAGENES
                 * *------------------------------------------------------------------------------------------------
                 */}
              </div>
            </Row>
          </div>
        );
      case 2:
        return (
          <div>
            <Row className="d-flex justify-content-between m-10 chgDir">
              {/* INICIO BOTON ATRAS  */}

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

              {/* FIN BOTON ATRAS  */}

              {/* INICIO INFO USUARIO */}
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    Toma de Huellas para <b>{name}</b> - <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Huellas resgistradas para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {/* FIN INFO USUARIO */}

              {/**
               * *INICIO PROGRESS BAR
               */}
              <div className="d-block w-100 justify-content-center">
                <Col sm={12} className="mt-5 d-flex justify-content-center">
                  <h1>{calcTotalPercentFinger()}% Completado</h1>
                </Col>

                <Col sm={12} className="mt-3 card box-s">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress
                      className="mt-3 mb-3 mr-2 ml-2"
                      variant="determinate"
                      value={calcTotalPercentFinger()}
                    />
                  </Box>
                </Col>
              </div>
              {/**
               * *FINAL PROGRESS BAR
               */}

              {/* INICIO MANO DERECHA */}
              <Col className="mt-5 d-flex justify-content-center">
                <div
                  className="card__huella__item w-75"
                  onClick={(e) => {
                    setState(5);
                    setHand(RIGHT_HAND);
                  }}
                >
                  <div className=" card__huella__item__image mt-3">
                    <img
                      className="card__huella__item__image__src "
                      src={
                        process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"
                      }
                      alt="right hand fg"
                    />
                  </div>
                  <Row className="card__huella__item__info ">
                    <Col sm={12} className="mt-3 d-flex justify-content-end">
                      <h1 className="">Mano Derecha</h1>
                    </Col>
                    <Col sm={12} className="mt-2 d-flex justify-content-end">
                      <h1 className="h0">{`${progressFingerR}%`}</h1>
                    </Col>
                  </Row>
                </div>
              </Col>
              {/* FIN MANO DERECHA */}

              {/* INICIO MANO IZQUIERDA */}
              <Col className="mt-5 d-flex justify-content-center">
                <div
                  className="card__huella__item w-75"
                  onClick={(e) => {
                    setState(6);
                    setHand(LEFT_HAND);
                    setCounterFinger(5);
                  }}
                >
                  <div className="card__huella__item__image mt-3">
                    <img
                      className="card__huella__image__src"
                      src={
                        process.env.PUBLIC_URL + "/assets/fingerprints/fg.svg"
                      }
                      alt="left hand fg"
                    />
                  </div>
                  <Row className="card__huella__image__info">
                    <Col sm={12} className="mt-3 d-flex justify-content-end">
                      <h1 className="">Mano Izquierda</h1>
                    </Col>
                    <Col sm={12} className="mt-2 d-flex justify-content-end">
                      <h1 className="h0">{`${progressFingerL}%`}</h1>
                    </Col>
                  </Row>
                </div>
              </Col>
              {/* FIN  MANO IZQUIERDA */}
            </Row>
          </div>
        );
      case 3:
        return <div></div>;
      //Modulo de toma de FOTOS
      case 4:
        return (
          <>
            <Row className="d-flex justify-content-between mt-3">
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
                    GUARDAR
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    Toma de Fotos para <b>{name}</b> - <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Fotos registradas para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {counterPhotos <= 2 && !alreadyBioData && (
                <Col sm={12} className="mt-3 d-flex justify-content-center">
                  <h2>
                    {"Por favor ingrese la foto del "}
                    {view === FRONT_FACE && <b>PERFIL FRONTAL</b>}
                    {view === RIGHT_FACE && <b>PERFIL DERECHO</b>}
                    {view === LEFT_FACE && <b>PERFIL IZQUIERDO</b>}
                  </h2>
                </Col>
              )}
              <Col sm={12} className="mt-3 card box-s">
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    className="mt-3 mb-3 mr-2 ml-2"
                    variant="determinate"
                    value={progressPersonP}
                  />
                </Box>
              </Col>
            </Row>
            {counterPhotos <= 2 && (
              <Row className="mt-3 d-flex justify-content-center">
                <Col sm={6} className=" mt-5 d-flex justify-content-center">
                  <h1 className="h0">
                    {view === FRONT_FACE && <b>PERFIL FRONTAL</b>}
                    {view === RIGHT_FACE && <b>PERFIL DERECHO</b>}
                    {view === LEFT_FACE && <b>PERFIL IZQUIERDO</b>}
                  </h1>
                </Col>
                <Col sm={6} className="mt-3 d-flex justify-content-center">
                  {counterPhotos > 0 && (
                    <ThemeProvider theme={inputsTheme}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleChangeView(1)}
                      >
                        ANTERIOR
                      </Button>
                    </ThemeProvider>
                  )}
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="color-white ml-3"
                      variant="contained"
                      color="primary"
                      onClick={() => setTakePicture(!takePicture)}
                    >
                      {alreadyBioData ? "ACTUALIZAR FOTO" : "TOMAR FOTO"}
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            )}
            {counterPhotos <= 2 ? (
              <div className="container d-flex justify-content-center m-5">
                <Row className="d-flex justify-content-center">
                  <Col sm={6} className="d-flex justify-content-center">
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
                        style={{
                          width: 480,
                          maxHeight: 500,
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
                            className="mw-100"
                            src={
                              process.env.PUBLIC_URL +
                              `/assets/personProfiles/0.png`
                            }
                            alt="Toma de huellas"
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
                            className="mw-100"
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
                            "card-zoom m-2" +
                            (personPhotos[4] !== undefined
                              ? " data-done"
                              : " data-none")
                          }
                          onClick={() => setView(4)}
                        >
                          <img
                            className="mw-100"
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
            ) : (
              <div>
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
                <h5 className="w-100 text-center">
                  Proceso de escaneo Biométrico de FOTOS terminado con éxito!{" "}
                  {/* Para seguir con otro proceso click */}{" "}
                  {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}
                </h5>
              </div>
            )}
          </>
        );
      //Módulo de toma de HUELLAS MANO DERECHA
      case 5:
        return (
          <>
            <Row className="d-flex justify-content-center mt-3">
              {/* INICIO  DE BOTON ATRAS */}
              <Col sm={6} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Tooltip title="Ir Atrás">
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
                  </Tooltip>
                </ThemeProvider>
              </Col>
              {/* FIN BOTON ATRAS  */}

              {/* INICIO BOTON GUARDAR */}
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
                    GUARDAR
                  </Button>
                </ThemeProvider>
              </Col>
              {/* FIN  BOTON GUARDAR */}

              {/* INICIO TITULOS */}
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    Toma de Huellas para <b>{name}</b> - <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Huellas resgistradas para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {/* FIN DE TITULOS */}

              {/* FIN DE  TITULO INSTRUCCION DEDO */}
              {!alreadyBioData && (
                <Col sm={12} className="mt-3 d-flex justify-content-center">
                  <h2>
                    {"Por favor ingrese la huella del "}
                    <b>{finger}</b>
                    {" de la mano "}
                    <b>DERECHA</b>
                  </h2>
                </Col>
              )}
              {/* FIN DE  TITULO INSTRUCCION DEDO */}

              {/* INICIO PROGRESSBAR */}
              <Col sm={9} className="mt-3 card box-s">
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    className="mt-3 mb-3 mr-2 ml-2"
                    variant="determinate"
                    value={progressFingerR}
                  />
                </Box>
              </Col>
              {/* FIN PROGRESSBAR */}
            </Row>

            <Row className="mt-3 d-flex justify-content-between chgDir align-center text-center ">
              {/* INDICADOR DE HUELLA */}
              <Col sm={6} className=" mt-5 d-flex justify-content-end">
                <h1 className="h0">
                  <b>{finger} - MANO DERECHA</b>
                </h1>
              </Col>
              {/* INDICADOR DE HUELLA */}

              {/* CONTROLES */}
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
                    {alreadyBioData ? "ACTUALIZAR HUELLA" : "ESCANEAR HUELLA"}
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
              {/* CONTROLES */}
            </Row>

            {counterFinger <= 9 ? (
              <div className="container d-flex justify-content-center ">
                <Row className="d-flex justify-content-center ">
                  {/* MANO DE MUESTRA */}
                  <Col sm={6} className="mt-5">
                    <img
                      className="img-fluid "
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/fingerprints/right/${counterFinger}.png`
                      }
                      alt="Toma de huellas"
                      style={{
                        width: 500,
                        maxHeight: 500,
                      }}
                    />
                  </Col>
                  {/* MANO DE MUESTRA */}

                  {/* HUELLA GUARDADA */}
                  <Col sm={6} className="mt-5 d-flex justify-content-end">
                    {fingerRightPhotos[counterFinger] !== undefined ? (
                      <img
                        className="img-fluid "
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
                        alt="sin huella"
                        style={{
                          width: 500,
                          height: 500,
                        }}
                      />
                    )}
                  </Col>
                  {/* HUELLA GUARDADA */}

                  <Col sm={12} className="mt-5 d-flex">
                    <Row className="hand__grid">
                      {fingerNames.map((item: any, index) => (
                        <Col sm={2}>
                          <div
                            className="card__huella__item p-3"
                            onClick={() => setCounterFinger(index)}
                          >
                            <img
                              className="img-fluid"
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
            ) : (
              !alreadyBioData && (
                <div>
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                  <h5 className="w-100 text-center">
                    Proceso de escaneo Biométrico de HUELLAS terminado con
                    éxito! {/* Para seguir con otro proceso click */}{" "}
                    {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}
                  </h5>
                </div>
              )
            )}
          </>
        );
      //Módulo de toma de HUELLAS MANO IZQUIERDA
      case 6:
        return (
          <>
            {/* INICIO BOTON ATRAS Y GUARDAR */}
            <Row className="d-flex justify-content-center mt-3">
              <Col sm={6} className="d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <Tooltip title="Ir Atrás">
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
                  </Tooltip>
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
                    GUARDAR
                  </Button>
                </ThemeProvider>
              </Col>
              <Col sm={12} className="mt-4 d-flex justify-content-center">
                {!alreadyBioData ? (
                  <h1>
                    Toma de Huellas para <b>{name}</b> - <b>{identification}</b>
                  </h1>
                ) : (
                  <h1>
                    Huellas resgistradas para <b>{name}</b> -{" "}
                    <b>{identification}</b>
                  </h1>
                )}
              </Col>
              {counterFinger <= 9 && !alreadyBioData && (
                <Col sm={12} className="mt-3 d-flex justify-content-center">
                  <h2>
                    {"Por favor ingrese la huella del "}
                    <b>{finger}</b>
                    {" de la mano "}
                    <b>IZQUIERDA</b>
                  </h2>
                </Col>
              )}
              <Col sm={9} className="mt-3 card box-s">
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    className="mt-3 mb-3 mr-2 ml-2"
                    variant="determinate"
                    value={progressFingerL}
                  />
                </Box>
              </Col>
            </Row>
            {/* FIN BOTON ATRAS Y GUARDAR */}

            {counterFinger <= 9 && (
              <Row className="mt-3 d-flex justify-content-between">
                <Col sm={6} className=" mt-5 d-flex justify-content-end">
                  <h1 className="h0">
                    <b>{finger} - MANO IZQUIERDA</b>
                  </h1>
                </Col>
                {/* CONTROLES */}
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
                      {alreadyBioData ? "ACTUALIZAR HUELLA" : "ESCANEAR HUELLA"}
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
                {/* CONTROLES */}
              </Row>
            )}
            {counterFinger <= 9 ? (
              <div className="container d-flex justify-content-center">
                <Row className="d-flex justify-content-center">
                  <Col sm={6} className="mt-5">
                    <img
                      className="img-fluid"
                      src={
                        process.env.PUBLIC_URL +
                        `/assets/fingerprints/left/${counterFinger}.png`
                      }
                      alt="Toma de huellas"
                      style={{
                        width: 500,
                        maxHeight: 500,
                      }}
                    />
                  </Col>
                  <Col sm={6} className="mt-5 d-flex justify-content-end">
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
                        alt="huella guardada"
                        style={{
                          width: 500,
                          height: 500,
                        }}
                      />
                    )}
                  </Col>
                  <Col sm={12} className="mt-5 d-flex">
                    <Row className="hand__grid">
                      {fingerNames.map((item: any, index) => (
                        <Col sm={2}>
                          <div
                            onClick={() => {
                              setCounterFinger(index + 5);
                            }}
                            className="card__huella__item p-3"
                          >
                            <img
                              className="img-fluid"
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
            ) : (
              !alreadyBioData && (
                <div>
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                  <h5 className="w-100 text-center">
                    Proceso de escaneo Biométrico de HUELLAS terminado con
                    éxito! {/* Para seguir con otro proceso click */}{" "}
                    {/* <b onClick={() => { handleReset(); getProcedureImpForVerify() }}> <u> AQUI</u></b>*/}
                  </h5>
                </div>
              )
            )}
          </>
        );
    }
  };

  const getItemM = (data: any) => {
    setShowSpinner(true);
    console.log("informacio0n de la imagen", data);
    const newPhotos: string[] = [];
    _globalService
      .registrarPersonPhotoByMedia(
        user[0].IDAccount,
        view,
        data.Media,
        data.MediaContext
      )
      .subscribe((resp: any) => {
        setShowSpinner(false);
        console.log("repsuesta servicio cargue de imagen", resp)
        if (resp.DataBeanProperties.ObjectValue) {
          activateUserByBioData(user[0].IDAccount);
          resp.DataBeanProperties.ObjectValue.forEach((element: any, idx: number) => {
            getPersonPhotoDataByAccount(user[0].IDAccount);
            setPersonPhotos([...newPhotos]);
          });
        } else {
          Toast.fire({
            icon: "error",
            title: resp.DataBeanProperties.ErrorMessage
          })
        }
      }
      );
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <div className="mt-15">{renderSwitch(state)}</div>
        <SSpinner
          show={showSpinnerScan}
          message="ESCANEANDO DATOS BIOMÉTRICOS"
        />
        <SSpinner show={showSpinner} message="DCCAE" />
      </div>
      {takePicture && (
        <SLoadDocument
          setShow={closeTakePicture}
          type={1}
          title={"Captura de foto"}
          getMedia={getItemM}
          show={takePicture}
          beanAction={null}
          accept={[".pdf", ".jpg", ".jpge", ".mp4", ".png"]}
        />
      )}
    </>
  );
};
