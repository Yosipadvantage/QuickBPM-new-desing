import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BsArrowRight, BsCheck2Circle, BsFillCaretDownFill, BsSearch } from "react-icons/bs";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { BsXCircleFill } from "react-icons/bs";
import { ICinar } from "../model/cinar.interface";
import { getSession } from "../../../utils/UseProps";
import { IProduct } from "../model/product";
import { TItemsCiudadano } from "../../audit/components/TItemCiudadano";
import { useForm } from "react-hook-form";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { pipeSort } from "../../../utils/pipeSort";
import { TreeService } from "../../../core/services/TreeService";

const _weaponService = new WeaponsService();
const _treeService = new TreeService();

export const SGenerateCinar = () => {
  const [render, setRender] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [forces, setForces] = useState<any>([]);
  const [grades, setGrades] = useState<any>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<any>([]);
  const [confirmAction, setConfirmAction] = useState(false);
  const [numRadicado, setNumRadicado] = useState(-1);
  const [fecha, setFecha] = useState("");

  const [force, setForce] = useState(-1);
  const [grade, setGrade] = useState(-1);
  const [tipoId, setTipoId] = useState(-1);
  const [dptos, setDptos] = useState<any>([]);
  const [mpios, setMpios] = useState<any>([]);
  const [identificacion, setIdentificacion] = useState(-1);
  const [names, setNames] = useState("");
  const [surnames, setSurnames] = useState("");
  const [bean, setBean] = useState<any>();
  const [dpto, setDpto] = useState("");
  const [mpio, setMpio] = useState("");
  const [idLugar, setIdLugar] = useState(-1);
  const [medio, setMedio] = useState("");
  const [spoa, setSpoa] = useState("");

  const [msg, setMsg] = useState<any>();
  const [code, setCode] = useState("");
  const [codeP, setCodeP] = useState("");
  const [codeS, setCodeS] = useState("");

  const [armaRelacionada, setArmaRelacionada] = useState(false);
  const [dataArma, setDataArma] = useState<any>(null);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [listProducts, setListProducts] = useState<IProduct[]>([]);
  const [user, setUser] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [idAccount, setIdAccount] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  useEffect(() => {
    getList([10, 14, 40]);
    getSiteIDChilds(0);
  }, []);

  const getList = (lista: number[]) => {
    setSpinner(true);
    _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
      setSpinner(false);
      console.log();
      if (resp.DataBeanProperties.ObjectValue) {
        setForces(resp.DataBeanProperties.ObjectValue[0]?.Lista);
        setGrades(resp.DataBeanProperties.ObjectValue[1]?.Lista);
        setTiposIdentificacion(resp.DataBeanProperties.ObjectValue[2]?.Lista);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const updateCinar = (bean: ICinar) => {
    setSpinner(true);
    _weaponService.updateAtencionCINAR(bean).subscribe((res) => {
      if (res) {
        console.log(res);
        setNumRadicado(res.IDAtencionCINAR);
        setFecha(res.Since);
        setSpinner(false);
        setRender(1);
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

  const updateElement = (data: boolean) => {
    if (data) {
      updateCinar(bean);
      console.log(bean);
    }
  };

  const getSiteIDChilds = (id: number) => {
    setSpinner(true);
    let aux: any = [];
    let auxSorted: any = [];
    _treeService
      .getSiteIDChilds(id)
      .subscribe((resp: any) => {
        setSpinner(false);
        console.log(resp);
        if (resp.DataBeanProperties.ObjectValue) {
          resp.DataBeanProperties.ObjectValue.map((item: any) =>
            aux.push({
              label: item.DataBeanProperties.Name,
              id: item.DataBeanProperties.IDLn,
            }));
          auxSorted = pipeSort([...aux], "label");
          if (id === 0) {
            setDptos(auxSorted);
          } else {
            setMpios(auxSorted);
          }
        } else {
          Toast.fire({
            icon: 'error',
            title: 'No se ha podido cargar la información'
          })
        }
      });
  };

  const buscarPermiso = (e: any) => {
    e.preventDefault();
    setSpinner(true);
    _weaponService
      .hojaPermisoRender({
        CodigoPermiso: code,
      })
      .subscribe((resp) => {
        setSpinner(false);
        if (resp) {
          if (resp.DataBeanProperties.ObjectValue.length > 0) {
            console.log(
              resp.DataBeanProperties.ObjectValue[0].DataBeanProperties
            );
            let item =
              resp.DataBeanProperties.ObjectValue[0].DataBeanProperties;
            setCodeP(item.CODIGOPERMISO);
            setCodeS(item.CODIGOSEGURIDAD);
            let name =
              (item.SURNAME1 !== null ? item.SURNAME1 : "") +
              " " +
              (item.SURNAME2 !== null ? item.SURNAME2 : "") +
              " " +
              (item.NAME1 !== null ? item.NAME1 : "") +
              " " +
              (item.NAME2 !== null ? item.NAME2 : "");
            let msg = `${codeP + " "}  /  ${codeS + " "
              } asignado a ${name} identificado con CC. ${item.NIT
              }, para el arma con serial: ${item.SERIAL}`;
            setMsg({
              encontrado: true,
              mensaje: msg,
            });
            Toast.fire({
              icon: "success",
              title: "Se encontraron coincidencias",
            });
            /* setIdItem(); */
          } else {
            setCodeS("");
            setMsg({
              encontrado: false,
              mensaje: "PERMISO INEXISTENTE",
            });
            Toast.fire({
              icon: "warning",
              title: "No se encontraron coincidencias",
            });
          }
        } else {
          Toast.fire({
            icon: "warning",
            title: "EN DESARROLLO...",
          });
        }
      });
  };
  /**
   * *Funciones para el acordeon
   * @param panel
   * @returns
   */
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const openUser = () => {
    setShowUser(true);
  };
  const closeSearch = (data: any) => {
    setShowUser(data);
  };
  const getItem = (data: any) => {
    clearErrors("NombreAccount");
    setArmaRelacionada(false);
    setValue("Account", data.IDAccount);
    setValue("NombreAccount", data.EntityName);
    setIdAccount(data.IDAccount);
    console.log("id usuario encontrado", idAccount);
    setUser(data.EntityName);
    setShowTable(true);
  };

  const renderSwitch = () => {
    switch (render) {
      case 0:
        return (
          <>
            <form onSubmit={(e) => onSubmit(e)}>
              <Row className="mt-5 d-flex justify-content-center">
                <Col sm={12} className="mb-5 d-flex justify-content-center">
                  <h1>.:: CINAR ::.</h1>
                </Col>
                <Col sm={12}>
                  <fieldset>
                    <legend>Información del solicitante</legend>
                    <Row>
                      <Col sm={6} className="mt-3">
                        <TextField
                          size="small"
                          select
                          fullWidth
                          color="secondary"
                          label="Institución *"
                          id="force"
                          onChange={(e) => {
                            setForce(parseInt(e.target.value));
                          }}
                        >
                          {forces.map((item: any) => (
                            <MenuItem key={item.Valor} value={item.Codigo}>
                              {item.Valor}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          size="small"
                          select
                          fullWidth
                          color="secondary"
                          label="Grado *"
                          id="grade"
                          onChange={(e) => {
                            setGrade(parseInt(e.target.value));
                          }}
                        >
                          {grades.map((item: any) => (
                            <MenuItem key={item.Valor} value={item.Codigo}>
                              {item.Valor}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          size="small"
                          select
                          fullWidth
                          color="secondary"
                          label="Tipo de Identificación *"
                          id="tipoId"
                          onChange={(e) => {
                            setTipoId(parseInt(e.target.value));
                          }}
                        >
                          {tiposIdentificacion.map((item: any) => (
                            <MenuItem key={item.Valor} value={item.Codigo}>
                              {item.Valor}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          color="secondary"
                          label="Indentificación *"
                          id="identification"
                          onChange={(e) => {
                            setIdentificacion(parseInt(e.target.value));
                          }}
                        ></TextField>
                      </Col>
                      <Col sm={6} className="mt-3 mb-3">
                        <TextField
                          value={names}
                          size="small"
                          fullWidth
                          color="secondary"
                          label="Nombres *"
                          id="Name"
                          onChange={(e) => {
                            setNames(e.target.value.toUpperCase());
                          }}
                        ></TextField>
                      </Col>
                      <Col sm={6} className="mt-3 mb-3">
                        <TextField
                          value={surnames}
                          size="small"
                          fullWidth
                          color="secondary"
                          label="Apellidos *"
                          id="Surnames"
                          onChange={(e) => {
                            setSurnames(e.target.value.toUpperCase());
                          }}
                        ></TextField>
                      </Col>
                      <Col sm={6}>
                        <Autocomplete
                          onChange={(e: any, value: any) => { setDpto(value ? value.label : ""); getSiteIDChilds(parseInt(value.id)) }}
                          fullWidth
                          size="small"
                          disablePortal
                          id="departamentos"
                          options={dptos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              key={params.id}
                              label="Departamento *"
                              fullWidth
                              color="secondary"
                            />
                          )}
                        />
                      </Col>
                      <Col sm={6}>
                        <Autocomplete
                          onChange={(e: any, value: any) => { setMpio(value ? value.label : ""); }}
                          fullWidth
                          size="small"
                          disablePortal
                          id="municipios"
                          options={mpios}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              key={params.id}
                              label="Municipios *"
                              fullWidth
                              color="secondary"
                            />
                          )}
                        />
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          value={medio}
                          size="small"
                          fullWidth
                          color="secondary"
                          label="Telefono/Avantel/MK *"
                          id="spoa"
                          onChange={(e) => {
                            setMedio(e.target.value.toUpperCase());
                          }}
                        ></TextField>
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          size="small"
                          select
                          fullWidth
                          color="secondary"
                          label="Unidad/Estación/Oficina *"
                          id="ueo"
                          onChange={(e) => {
                            setIdLugar(parseInt(e.target.value));
                          }}
                        >
                          <MenuItem key={1} value={1}>
                            UNIDAD
                          </MenuItem>
                          <MenuItem key={2} value={2}>
                            ESTACIÓN
                          </MenuItem>
                          <MenuItem key={3} value={3}>
                            OFICINA
                          </MenuItem>
                        </TextField>
                      </Col>
                      <Col sm={6} className="mt-3">
                        <TextField
                          value={spoa}
                          size="small"
                          fullWidth
                          color="secondary"
                          label="Número SPOA a NUNC (opcional)"
                          id="spoa"
                          onChange={(e) => {
                            setSpoa(e.target.value.toUpperCase());
                          }}
                        ></TextField>
                      </Col>
                    </Row>
                  </fieldset>
                </Col>
                <fieldset className="mt-5 w-100">
                  <legend>Infomarción del Arma</legend>
                  <div>
                    <Accordion
                      expanded={expanded === "panel1"}
                      onChange={handleChange("panel1")}
                      style={{ width: "100%" }}
                    >
                      <AccordionSummary
                        expandIcon={<BsFillCaretDownFill />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => { setShowTable(false); setArmaRelacionada(false) }}
                      >
                        <Typography>BUSCAR ARMA POR PERMISO</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <form onSubmit={(e) => buscarPermiso(e)}>
                            <Row className="mt-3">
                              <div className="col-md-12">
                                <TextField
                                  size="small"
                                  fullWidth
                                  color="secondary"
                                  label="Buscar permiso *"
                                  id="codeP"
                                  onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setCodeP(e.target.value.toUpperCase());
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          type="submit"
                                          onClick={(e) => buscarPermiso(e)}
                                        >
                                          <BsSearch />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </div>
                              <div className="col-md-6 mt-3">
                                <TextField
                                  disabled
                                  value={codeP}
                                  size="small"
                                  fullWidth
                                  color="secondary"
                                  label="Código Permiso *"
                                  name="codep"
                                  key={"codep"}
                                  id="codB"
                                  onChange={(e) => setCodeP(e.target.value)}
                                ></TextField>
                              </div>
                              <div className="col-md-6 mt-3">
                                <TextField
                                  disabled
                                  value={codeS}
                                  size="small"
                                  fullWidth
                                  color="secondary"
                                  label="Código Seguridad *"
                                  name="codeB"
                                  key={"codeB"}
                                  id="codB"
                                  onChange={(e) => setCodeS(e.target.value)}
                                ></TextField>
                              </div>
                            </Row>
                          </form>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === "panel2"}
                      onChange={handleChange("panel2")}
                      style={{ width: "100%", marginBottom: 50 }}
                    >
                      <AccordionSummary
                        expandIcon={<BsFillCaretDownFill />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => console.log("Si se puede")}
                      >
                        <Typography>BUSCAR ARMAS POR INDENTIFICACIÓN</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <Col sm={12} className="mt-3">
                            <TextField
                              value={user}
                              size="small"
                              label="Usuario *"
                              fullWidth
                              color="secondary"
                              id="user"
                              {...register("NombreAccount", { required: true })}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => { openUser(); setShowTable(false) }}>
                                      <BsSearch />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              onClick={() => { openUser(); setShowTable(false) }}
                            />
                            <span className="text-danger">
                              {errors
                                ? errors.NombreAccount?.type === "required" &&
                                "El campo Nombre usuario es obligatorio."
                                : ""}
                            </span>
                          </Col>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </fieldset>
                {showTable &&
                  <TItemsCiudadano idAccount={idAccount} proCD={true} setItem={setItem} />
                }
                {armaRelacionada &&

                  <Col
                    sm={12}
                    className="mt-3 d-flex justify-content-center mb-5"
                  >
                    <div className="mt-3 d-flex flex-column">
                      <div className="">
                        <b>DESCRIPCIÓN:</b> <span>{dataArma.Descripcion}</span> <br />
                      </div>
                      <div className="">
                        <b>SERIAL:</b> <span>{dataArma.Serial}</span> <br />
                      </div>
                      <div className="">
                        <b>USO:</b> <span>{dataArma.Uso}</span> <br />
                      </div>
                      <div className="">
                        <b>FUEGO:</b> <span>{dataArma.Fire ? <BsCheck2Circle /> : <BsXCircleFill />}</span> <br />
                      </div>
                      <div className="">
                        <b>TRAUMATICA:</b> <span>{!dataArma.Fire ? <BsCheck2Circle /> : <BsXCircleFill />}</span> <br />
                      </div>
                    </div>
                  </Col>

                }
                {msg !== undefined && (
                  <Col
                    sm={12}
                    className="mt-3 d-flex justify-content-center mb-5"
                  >
                    <div className="mt-3 d-flex flex-column justify-content-center">
                      {msg.encontrado !== false && (
                        <span>
                          PERMISO
                          <b> {" " + codeP}</b> - <b>{codeS}</b>
                        </span>
                      )}
                      <span>
                        {msg.encontrado === false && <BsXCircleFill />}
                        {" " + msg.mensaje}
                      </span>
                    </div>
                  </Col>
                )}
                {/* BOTON SIGUINTE */}
                <Col sm={9} className="mt-3 mb-5 d-flex justify-content-center">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        onSubmit(e);
                      }}
                    >
                      REGISTRAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
          </>
        );
      case 1:
        return (
          <>
            <div className="mb-5">
              <div className="d-flex justify-content-center mt-10">
                <h1>REGISTRO SOLICITUD CINAR DCCAE REALIZADA CON ÉXITO!</h1>
              </div>
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
              <h4 className="w-100 text-center">
                <b>NÚMERO DE RADICADO:</b> {numRadicado}
              </h4>
              <h4 className="w-100 text-center">
                <b>FECHA DE REGISTRO:</b> {fecha}
              </h4>
              <h5 className="mt-5 w-100 text-center">
                Registro CINAR DCCAE terminado con éxito. Para crear un nuevo
                registro click{" "}
                <b
                  onClick={() => {
                    onBack();
                  }}
                >
                  {" "}
                  <u className="pointer">AQUI</u>
                </b>
              </h5>
            </div>
          </>
        );
      default:
        break;
    }
  };

  const setItem = (item: any) => {
    setShowTable(false);
    setArmaRelacionada(true);
    let aux = JSON.parse(item.Propiedades);
    if (item.NombreProducto == 'TRAUMATICA') {
      console.log(aux);
      aux.DataArma.Serial = aux.DataArma.SerieFabricante;
      aux.DataArma.Uso = "Defensa  Personal";
      setDataArma(aux.DataArma);
    } else {
      console.log(aux);
      setDataArma(aux.DataArma);
    }
  }

  const onBack = () => {
    //SETEAR TOD.OS LOS CAMPOS AL SU ESTADO INCIAL
    setTipoId(-1);
    setForce(-1);
    setGrade(-1);
    setIdentificacion(-1);
    setSpoa("");
    setDpto("");
    setMpio("");
    setIdLugar(-1);
    setMsg("");
    setNames("");
    setSurnames("");
    setMedio("");
    setRender(0);
    setShowTable(false);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (force !== -1 && grade !== -1 && names !== "" && surnames !== "" && tipoId !== -1 && dpto !== "" && mpio !== "") {
      if (showTable) {
        if (dataArma !== null) {
          setConfirmAction(true);
          setBean({
            Fuerza: force,
            Grado: grade,
            Identificacion: identificacion,
            IDFuncionario: getSession().IDAccount,
            CodigoPermiso: codeP,
            CodigoSeguridad: codeS,
            NombresApellidos: surnames + " " + names,
            IDLugar: idLugar,
            Departamento: dpto,
            Ciudad: mpio,
            Medio: medio,
            IDTipoIdentificacion: tipoId,
            DataArma: JSON.stringify(dataArma),
            SPOA: spoa
          });
        } else {
          Toast.fire({
            icon: "warning",
            title: "Debe buscar asociar un Arma",
          });
        }
      } else {
        if (dataArma !== null) {
          setConfirmAction(true);
          setBean({
            Fuerza: force,
            Grado: grade,
            Identificacion: identificacion,
            IDFuncionario: getSession().IDAccount,
            CodigoPermiso: codeP,
            CodigoSeguridad: codeS,
            NombresApellidos: surnames + " " + names,
            IDLugar: idLugar,
            Departamento: dpto,
            Ciudad: mpio,
            Medio: medio,
            IDTipoIdentificacion: tipoId,
            DataArma: JSON.stringify(dataArma),
            SPOA: spoa
          });
        } else {
          Toast.fire({
            icon: "warning",
            title: "Debe buscar asociar un Arma",
          });
        }
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "Debe completar todos los campos",
      });
    }
  };

  return (
    <>
      <div className="nWhite p-3 m-3 w-80">
        <div className="px-5 mt-5 card box-s container">{renderSwitch()}</div>
      </div>
      {spinner && <SSpinner show={spinner} />}
      {confirmAction && (
        <GenericConfirmAction
          show={confirmAction}
          setShow={setConfirmAction}
          confirmAction={updateElement}
          title={"¿Está seguro de realizar el registro?"}
        />
      )}
      {showUser && (
        <SSearchPerson
          getShow={closeSearch}
          getPerson={getItem}
          dataShow={showUser}
        />
      )}
    </>
  );
};
