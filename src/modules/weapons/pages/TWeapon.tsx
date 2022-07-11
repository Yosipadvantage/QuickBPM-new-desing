import { Autocomplete, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { BsFillFileEarmarkCheckFill, BsPencilSquare, BsPlus, BsSearch, BsTrash } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { ConfigService } from '../../../core/services/ConfigService';
import { GlobalService } from '../../../core/services/GlobalService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import SSearchPerson from '../../../shared/components/SSearchPerson';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { RootState } from '../../../store/Store';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { getSession } from '../../../utils/UseProps';
import { NEWeapons } from '../components/NEWeapons';
import { IndumilOffice } from '../model/AlmacenIndumil';
import { Iweapon } from '../model/modelWeapon';

interface ITWeapon {
  beanAction: any,
  setShow: Function,
  type: string
}

const _weaponService = new WeaponsService();
const _configService = new ConfigService();
const _globalService = new GlobalService();

export const TWeapon: React.FC<ITWeapon> = (props: ITWeapon) => {

  const [showSpinner, setShowSpinner] = useState(false);
  const [render, setRender] = useState(0);
  const [citizen, setCitizen] = useState<User>()
  const [funcionario, setFuncionario] = useState<User>()
  const [citizenName, setCitizenName] = useState<string>('')
  const [listAlIndumil, setListAlIndumil] = useState<IndumilOffice[]>([]);
  const [showUser, setShowUser] = useState(false);
  const [showNE, setShowNE] = useState(false);
  const [idSeccional, setIdSeccional] = useState<number | null>(null);
  const [idAlmaIndumil, setIdAlmaIndumil] = useState<number | null>(null);
  const [seccional, setSeccional] = useState<string>('');
  const [lote, setLote] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('')
  const [IDSalidaAlmacen, setIDSalidaAlmacen] = useState(0);
  const [Fecha, setFecha] = useState("");
  const [listOffice, setListOffice] = useState([]);
  const [showDocument, setShowDocument] = useState(false);
  const [media, setMedia] = useState("");
  const [context, setContex] = useState("");
  const [beanDoc, setBeanDoc] = useState<any>(null);

  useEffect(() => {
    if (props.beanAction) {
      console.log(props.beanAction);
      getAccount(props.beanAction.IDAccountProcedureImp);
      setTipoSolicitud(props.type);
    }
    getIndumilOffices();
    getOfficeCatalog();
    setFuncionario(getSession());
  }, [])

  useEffect(() => {

  }, [citizen])

  const getAccount = (idAcount: number) => {
    setShowSpinner(true);
    _globalService.getAccountByIDAccount(idAcount)
      .subscribe((resp) => {
        setShowSpinner(false);
        console.log(resp);
        if (resp.DataBeanProperties.ObjectValue) {
          //SET CITIZEN
          setCitizenName(resp.DataBeanProperties.ObjectValue.DataBeanProperties.EntityName);
          setCitizen(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
        } else {
          Toast.fire({
            icon: "error",
            title: 'ERROR INTERNO DEL SERVIDOR'
          })
        }
      })
  }

  const getIndumilOffices = () => {
    setShowSpinner(true);
    _weaponService.getIndumilOffices().subscribe(resp => {
      console.log(resp);
      if (resp) {
        setListAlIndumil(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const cargueListaTraumaticasDevolucion = () => {
    setShowSpinner(true);
    _weaponService.cargueListaTraumaticasDevolucion(citizen?.IDAccount, funcionario?.IDAccount, (idSeccional !== null ? idSeccional : -1), context, media).subscribe(resp => {
      setShowSpinner(false);
      console.log(resp);
      if (resp) {
        console.log(resp);
        /* let msg = resp.DataBeanProperties.ObjectValue.Report.Message; */
        /* msg += '\n ,' + resp.DataBeanProperties.ObjectValue.MSG; */
        if (resp.DataBeanProperties.ObjectValue.Report.SalidaAlmacen) {
          let msg = resp.DataBeanProperties.ObjectValue.MSG;
          setFinalMessage(msg);
          setInfo(resp.DataBeanProperties.ObjectValue.Report.SalidaAlmacen);
          //MANIPULAR LÑA RESPUESTA DEL SERVICIO
          setRender(3);
        } else {
          Toast.fire({
            icon: "error",
            title: resp.DataBeanProperties.ObjectValue.Report.Message,
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const cargueListaTraumaticasMarcaje = () => {
    setShowSpinner(true);
    _weaponService.cargueListaTraumaticasMarcaje(citizen?.IDAccount, funcionario?.IDAccount, (idSeccional !== null ? idSeccional : -1), context, media).subscribe(resp => {
      setShowSpinner(false);
      console.log(resp);
      if (resp) {
        console.log(resp);
        /* let msg = resp.DataBeanProperties.ObjectValue.Report.Message; */
        /* msg += '\n ,' + resp.DataBeanProperties.ObjectValue.MSG; */
        if (resp.DataBeanProperties.ObjectValue.Report.SalidaAlmacen) {
          let msg = resp.DataBeanProperties.ObjectValue.MSG;
          setFinalMessage(msg);
          setInfo(resp.DataBeanProperties.ObjectValue.Report.SalidaAlmacen);
          //MANIPULAR LÑA RESPUESTA DEL SERVICIO
          setRender(3);
        } else {
          Toast.fire({
            icon: "error",
            title: resp.DataBeanProperties.ObjectValue.Report.Message,
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const getOfficeCatalog = () => {
    let aux: any = [];
    let auxSorted: any = [];
    _configService
      .getOfficeCatalog()
      .subscribe((res: any) => {
        if (res) {
          res.map((item: any) =>
            aux.push({
              label: item.Name,
              id: item.IDOffice
            }))
          auxSorted = pipeSort([...aux], 'label');
          setListOffice(auxSorted);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido listar información de sucursales",
          });
        }
      });
  };

  const onNext = () => {
    console.log(beanDoc);
    console.log(lote);
    if (tipoSolicitud === 'DEVOLUCION') {
      if (citizen !== undefined && idSeccional != null) {
        if (!lote) {
          setShowNE(true);
          setRender(1);
        } else {
          if (beanDoc !== null) {
            //CONSUMIR SERVICIO
            cargueListaTraumaticasDevolucion();
          } else {
            Toast.fire({
              icon: "warning",
              title: "Debe cargar Archivo de Lote"
            })
          }
        }
      } else {
        Toast.fire({
          icon: "warning",
          title: "Por favor copleto TODOS los campos"
        })
      }
    } else {
      console.log("Si es este-------->", idAlmaIndumil);

      if (citizen !== undefined && idAlmaIndumil != null) {
        if (!lote) {
          setShowNE(true);
          setRender(1);
        } else {
          if (beanDoc !== null) {
            //CONSUMIR SERVICIO
            /* cargueListaTraumaticasDevolucion(); */
            cargueListaTraumaticasMarcaje();
          } else {
            Toast.fire({
              icon: "warning",
              title: "Debe cargar Archivo de Lote"
            })
          }
        }
      } else {
        Toast.fire({
          icon: "warning",
          title: "Por favor copleto TODOS los campos"
        })
      }
    }
  };

  const closeSearch = (data: any) => {
    setShowUser(data);
  };

  const setInfo = (data: any) => {
    console.log(data);
    setIDSalidaAlmacen(data.DataBeanProperties.IDSalidaAlmacen);
    setFecha(data.DataBeanProperties.FechaDocumento);
  }

  const getItem = (data: any) => {
    setCitizen(data);
    setCitizenName(data.EntityName)
  };

  const onBack = () => {
    setCitizen(undefined);
    setCitizenName('');
    setIdSeccional(null);
    setIdAlmaIndumil(null);
    setTipoSolicitud('');
    setLote(false);
    setBeanDoc(null);
    setRender(0);
  }

  const renderSwitch = () => {
    switch (render) {
      case 0: return (
        <div>
          <form>
            <Row className="card box-s m-3 d-block">
              <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                <h1>REGISTRO ARMAS TRAUMÁTICAS</h1>
              </Col>
              <Col sm={12} className="mt-3 mb-3">
                <TextField
                  disabled={props.beanAction !== undefined}
                  size="small"
                  value={citizenName}
                  label="Solicitante *"
                  fullWidth
                  color="secondary"
                  id="solicitante"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => { setShowUser(true); }}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onClick={() => { setShowUser(true); }}
                />
              </Col>
              <Col sm={12} className="mt-3 mb-3">
                <TextField
                  disabled={props.beanAction !== undefined}
                  value={tipoSolicitud}
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Tipo de solicitud"
                  id="state"
                  onChange={(e) => setTipoSolicitud(e.target.value)}
                >
                  <MenuItem value={'SOLICITUD DE MARCAJE'}>
                    SOLICITUD DE MARCAJE
                  </MenuItem>
                  <MenuItem value={'DEVOLUCION'}>
                    SOLICITUD DE DEVOLUCIÓN
                  </MenuItem>
                </TextField>
              </Col>
              {tipoSolicitud === 'DEVOLUCION' &&
                <div>
                  <Col sm={12} className="mt-3 mb-3">
                    <Autocomplete
                      fullWidth
                      size="small"
                      disablePortal
                      id="forms"
                      options={listOffice}
                      onChange={(e, value: any) => { setIdSeccional(value ? value.id : 0); setSeccional(value ? value.label : '') }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          color="secondary"
                          label="Seccional"
                          id="state"
                        />)}
                    />
                  </Col>
                  <Col sm={12} className="d-flex justify-content-center">
                    <FormGroup>
                      <FormControlLabel control={
                        <ThemeProvider theme={inputsTheme}>
                          <Checkbox color="secondary" defaultChecked={lote} onChange={() => setLote(!lote)} />
                        </ThemeProvider>
                      } label="¿Cargar Lote de Devolución?" />
                    </FormGroup>
                  </Col>
                  <Col sm={12} className="mt-3 mb-3">
                    <ThemeProvider theme={inputsTheme}>
                      <Button
                        disabled={!lote}
                        className="w-100"
                        color='secondary'
                        variant='contained'
                        onClick={() => { setShowDocument(true) }}  >
                        CARGAR LOTE DE DEVOLUCIÓN
                      </Button>
                    </ThemeProvider>
                  </Col>
                  {beanDoc !== null &&
                    <Col sm={12} className="mt-1 mb-1 d-flex justify-content-center">
                      <BsFillFileEarmarkCheckFill /> LOTE DE DEVOLUCIÓN LISTO PARA EJECUTAR
                    </Col>
                  }
                </div>
              }
              {tipoSolicitud === 'SOLICITUD DE MARCAJE' &&
                <div>
                  <Col sm={12} className="mt-3">
                    <p>
                      Por favor escoja el almacén INDUMIL donde desea marcar el(las) arma(s)
                    </p>
                  </Col>
                  <Col sm={12} className="mb-3">
                    <TextField
                      value={idAlmaIndumil}
                      margin="normal"
                      size="small"
                      select
                      fullWidth
                      color="secondary"
                      label="Almacén Indumil"
                      id="state"
                      onChange={(e) => { setIdAlmaIndumil(parseInt(e.target.value)); }}
                    >
                      {listAlIndumil.map((item: IndumilOffice) => (
                        <MenuItem value={item.IDAlmaIndumil}>
                          {item.Nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Col>
                  <Col sm={12} className="d-flex justify-content-center">
                    <FormGroup>
                      <FormControlLabel control={
                        <ThemeProvider theme={inputsTheme}>
                          <Checkbox color="secondary" defaultChecked={lote} onChange={() => setLote(!lote)} />
                        </ThemeProvider>
                      } label="¿Cargar Lote de Marcaje?" />
                    </FormGroup>
                  </Col>
                  <Col sm={12} className="mt-3 mb-3">
                    <ThemeProvider theme={inputsTheme}>
                      <Button
                        disabled={!lote}
                        className="w-100"
                        color='secondary'
                        variant='contained'
                        onClick={() => { setShowDocument(true) }}  >
                        CARGAR LOTE DE MARCAJE
                      </Button>
                    </ThemeProvider>
                  </Col>
                  {beanDoc !== null &&
                    <Col sm={12} className="mt-1 mb-1 d-flex justify-content-center">
                      <BsFillFileEarmarkCheckFill /> LOTE DE MARCAJE LISTO PARA EJECUTAR
                    </Col>
                  }
                </div>
              }
              <Col sm={6} className="mb-3 ml-12 d-flex justify-content-center">
                <ThemeProvider theme={inputsTheme}>
                  <Button className=" mt-3 w-100" variant="contained" color="secondary" onClick={(e) => { onNext() }}>
                    SIGUIENTE
                  </Button>
                </ThemeProvider>
              </Col>
            </Row>
          </form>
        </div>
      )
      case 1: return (
        <div>
          {showNE &&
            <NEWeapons
              idAlmaIndumil={idAlmaIndumil}
              idSeccional={idSeccional}
              show={showNE}
              setShow={setShowNE}
              setSpinner={setShowSpinner}
              user={citizen}
              setRender={setRender}
              setFinalMessage={setFinalMessage}
              setInfo={setInfo}
              seccional={seccional}
              tipoSolicitud={tipoSolicitud}
            />
          }
        </div>
      )
      case 2: return (
        /* IDSalidaAlmacen
        Fecha */
        <div>
          <div className="d-flex justify-content-center mt-15">
            <h1>REGISTRO DE ARMA TRAUMÁTICA REALIZADO CON ÉXITO</h1>
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
          <h4 className="w-100 text-center"><b>NÚMERO DE RADICADO:</b> {IDSalidaAlmacen}</h4>
          <h4 className="w-100 text-center"><b>FECHA DE REGISTRO:</b> {Fecha}</h4>
          <h5 className="mt-5 w-100 text-center">
            Registro de descargo terminado con éxito. Para crear
            un nuevo registro click{" "}
            <b onClick={() => { onBack() }}>
              {" "}
              <u className="pointer"> AQUI</u>
            </b>
          </h5>
        </div>
      )
      case 3: return (
        /* IDSalidaAlmacen
        Fecha */
        <div>
          <div className="d-flex justify-content-center mt-15">
            <h1>REGISTRO DE LOTE DE ARMAS TRAUMÁTICA REALIZADO CON ÉXITO</h1>
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
          <h4 className="w-100 text-center"><b>NÚMERO DE RADICADO:</b> {IDSalidaAlmacen}</h4>
          <h4 className="w-100 text-center"><b>FECHA DE REGISTRO:</b> {Fecha}</h4>
          <h1 className="w-100 text-center"> <b>N. REGISTROS REALIZADOS:</b> {finalMessage}</h1>
          <h5 className="mt-5 w-100 text-center">
            Registro de descargo por lote terminado con éxito. Para crear
            un nuevo registro click{" "}
            <b onClick={() => { onBack() }}>
              {" "}
              <u className="pointer"> AQUI</u>
            </b>
          </h5>
        </div>
      )

      default:
        break;
    }
  };

  const getMedia = (doc: any) => {
    if (doc) {
      setMedia(doc.Media);
      setContex(doc.MediaContext);
      setBeanDoc(doc)
      console.log(doc);

      Toast.fire({
        icon: "success",
        title: "Docuemento seleccionado",
      });
    }
  };

  return (
    <>
      {props.beanAction === undefined &&
        <div className="nWhite w-80 p-3 m-3">
          <main className='container d-flex justify-content-center mt-15'>
            {renderSwitch()}
          </main >
        </div >}
      {props.beanAction !== undefined &&
        <div>
          <main className='container d-flex justify-content-center'>
            {renderSwitch()}
          </main >
        </div>}
      {
        showUser &&
        <SSearchPerson
          getShow={closeSearch}
          getPerson={getItem}
          dataShow={showUser}
          create={false}
        />
      }
      {showSpinner && <SSpinner show={showSpinner} />}
      {<SLoadDocument show={showDocument} setShow={setShowDocument} title="CARGAR LOTE DE DEVOLUCIÓN" type={1} beanAction={null} getMedia={getMedia} accept={[".xlsx"]} />}
    </>
  )
}

