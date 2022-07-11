import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { WeaponsService } from "../../../core/services/WeaponsService";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { SSpinner } from "../../../shared/components/SSpinner";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { getSession } from "../../../utils/UseProps";
import { ICallCenter } from "../model/call-center.interface";

const _weaponService = new WeaponsService();

export const RegisterCall = () => {

  const [render, setRender] = useState(0);
  const [numRadicado, setNumRadicado] = useState(-1);
  const [fecha, setFecha] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState<any>();
  const [bean, setBean] = useState<any>();
  const [motive, setMotive] = useState(-1);
  const [obs, setObs] = useState('');
  const [motives, setMotives] = useState<any>([]);
  const [confirmAction, setConfirmAction] = useState(false);
  const [yaResgistra, setYaRegistra] = useState(false);
  const [dataUser, setDataUser] = useState(false);
  const [identificacion, setIdentificacion] = useState<any>(null);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    getList([36])
  }, [])


  const getList = (lista: number[]) => {
    setSpinner(true);
    _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
      setSpinner(false);
      console.log();
      if (resp.DataBeanProperties.ObjectValue) {
        setMotives(resp.DataBeanProperties.ObjectValue[0]?.Lista);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    })
  };


  const getItem = (data: any) => {
    setYaRegistra(true);
    setDataUser(false);
    setIdentificacion(data.Nit);
    setNombre(data.EntityName)
    setUser(data);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (dataUser) {
      if (identificacion !== null && nombre.length > 0) {
        if (motive !== -1 && obs !== '') {
          setBean({
            IDAccount: user ? user.IDAccount : null,
            IDFuncionario: getSession().IDAccount,
            Identificacion: identificacion,
            NombresApellidos: nombre,
            Motivo: motive,
            Observacion: obs
          });
          setConfirmAction(true);
        } else {
          Toast.fire({
            icon: 'warning',
            title: 'Debe registrar un motivo y completar una observación'
          })
        }
      } else {
        Toast.fire({
          icon: 'warning',
          title: 'Debe registrar una Identificacion y un Nombre'
        })
      }
    } else {
      if (user !== undefined) {
        if (motive !== -1 && obs !== '') {
          setBean({
            IDAccount: user.IDAccount ? user.IDAccount : null,
            IDFuncionario: getSession().IDAccount,
            Identificacion: identificacion,
            NombresApellidos: nombre,
            Motivo: motive,
            Observacion: obs
          });
          setConfirmAction(true);
        } else {
          Toast.fire({
            icon: 'warning',
            title: 'Debe registrar un motivo y completar una observación'
          })
        }
      } else {
        Toast.fire({
          icon: 'warning',
          title: 'Debe seleccionar un usuario'
        })
      }
    }
  }

  const renderSwitch = () => {
    switch (render) {
      case 0:
        return (
          <>
            <form>
              <Row className="mt-5 d-flex justify-content-center">
                <Col sm={12} className="mb-5 d-flex justify-content-center">
                  <h1>.:: CALL CENTER DCCAE ::.</h1>
                </Col>
                <Row className="mt-3 container pl-10 pr-10">
                  <Col sm={12} className="mt-3">
                    <TextField
                      size="small"
                      select
                      fullWidth
                      color="secondary"
                      label="Motivo *"
                      id="force"
                      onChange={(e) => {
                        setMotive(parseInt(e.target.value));
                      }}
                    >
                      {motives.map((item: any) => (
                        <MenuItem key={item.Valor} value={item.Codigo}>{item.Valor}</MenuItem>
                      ))}
                    </TextField>
                  </Col>
                  <Col sm={6} className="mt-3 mb-3 d-flex justify-content-center">
                    <FormControlLabel control={
                      <ThemeProvider theme={inputsTheme}>
                        <Checkbox
                          checked={dataUser}
                          disabled={yaResgistra}
                          name={'user'}
                          color="secondary"
                          onChange={() => setDataUser(!dataUser)}
                        />
                      </ThemeProvider>}
                      label='Registrar datos manualmente'
                    />
                  </Col>
                  <Col sm={6} className="mt-3 mb-3">
                    <TextField
                      size="small"
                      value={user ? user.EntityName : ''}
                      label=".:Usuario:. *"
                      fullWidth
                      color="secondary"
                      id="distributionChanel"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowUser(true)}>
                              <BsSearch />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      onClick={() => setShowUser(true)}
                    />
                  </Col>
                  {dataUser &&
                    <Col sm={6}>
                      <TextField
                        value={identificacion}
                        type="number"
                        size="small"
                        color="secondary"
                        id="nombre"
                        label="Identificación *"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => { setIdentificacion(parseInt(e.target.value)) }}
                      />
                    </Col>
                  }
                  {dataUser &&
                    <Col sm={6}>
                      <TextField
                        value={nombre}
                        size="small"
                        color="secondary"
                        id="nombre"
                        label="Nombre Completo del Solicitante *"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => { setNombre(e.target.value.toUpperCase()) }}
                      />
                    </Col>
                  }
                </Row>
                <Col sm={12} className="mt-5 mb-5 container pl-10 pr-10">
                  <fieldset>
                    <legend>Motivo de la llamada</legend>
                    <TextField
                      size="small"
                      color="secondary"
                      id="description"
                      label="Descripción del motivo"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={5}
                      onChange={(e) => { setObs(e.target.value) }}
                    />
                  </fieldset>
                </Col>
                <Col sm={9} className="mb-5 d-flex justify-content-center">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="w-100"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => { onSubmit(e) }}
                    >
                      REGISTRAR
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
          </>
        )

      case 1:
        return (
          <>
            <div className="mb-5">
              <div className="d-flex justify-content-center mt-10">
                <h1>REGISTRO SOLICITUD CALL CENTER DCCAE REALIZADA CON ÉXITO!</h1>
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
              <h4 className="w-100 text-center"><b>NÚMERO DE RADICADO:</b> {numRadicado}</h4>
              <h4 className="w-100 text-center"><b>FECHA DE REGISTRO:</b> {fecha}</h4>
              <h5 className="mt-5 w-100 text-center">
                Registro de Call Center DCCAE terminado con éxito. Para crear
                un nuevo registro click{" "}
                <b onClick={() => { onBack() }}>
                  {" "}
                  <u className="pointer">AQUI</u>
                </b>
              </h5>
            </div>
          </>
        )
      default:
        break;
    }
  }

  const onBack = () => {
    //SETEAR TODOS LOS CAMPOS AL SU ESTADO INCIAL
    setUser(undefined);
    setMotive(-1);
    setObs('');
    setIdentificacion(null);
    setNombre('')
    setYaRegistra(false);
    setDataUser(false);
    setRender(0);
  }

  const updateCall = (bean: ICallCenter) => {
    setSpinner(true);
    _weaponService.updateCallCenter(bean).subscribe((res) => {
      if (res) {
        setNumRadicado(res.IDCallCenter);
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
    })
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      updateCall(bean)
    }
  };

  const closeSearch = (data: any) => {
    setShowUser(data);
  };

  return (
    <>
      <div className="nWhite p-3 m-3 w-80">
        <div className="px-5 mt-5 card box-s container">
          {renderSwitch()}
        </div>
      </div>
      {showUser &&
        <SSearchPerson
          getShow={closeSearch}
          getPerson={getItem}
          dataShow={showUser}
        />
      }
      {spinner && <SSpinner show={spinner} />}
      {confirmAction && (
        <GenericConfirmAction
          show={confirmAction}
          setShow={setConfirmAction}
          confirmAction={deleteElement}
          title={"¿Está seguro de realizar el registro?"}
        />
      )}
    </>
  );
};
