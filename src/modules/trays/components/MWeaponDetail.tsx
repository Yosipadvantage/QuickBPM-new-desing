import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, IconButton, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsFillEnvelopeFill, BsXSquare } from 'react-icons/bs'
import { GiPistolGun } from 'react-icons/gi';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { formatDate } from '../../../utils/formatDate';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { getSession } from '../../../utils/UseProps';
import { IDataUpdate } from '../../admin/model/DataUpdate';
import { DataItemCiudadano } from '../../weapons/model/item-ciudadano.interface';

interface IMWeaponDetail {
    show: boolean,
    setShow: Function,
    data: any,
    refresh: Function
}

const _weaponService = new WeaponsService();

const PENDIENTE_POR_MARCAR = 1;
const RECIBIDA = 2;
const MARCADA = 3;
const ENTREGADA = 4;

export const MweaponDetail: React.FC<IMWeaponDetail> = (props: IMWeaponDetail) => {

    const [weapons, setWeapons] = useState<any[]>([]);
    const [state, setState] = useState<number>(-1);
    const [idItem, setIdItem] = useState<number>(-1);
    const [idFuncionario, setIdFuncionario] = useState<number>(-1);
    const [spinner, setSpinner] = useState(false);
    const [modalAction, setModalAction] = useState(false);
    const [confirmAction, setConfirmAction] = useState(false);
    const [dataArma, setDataArma] = useState<any>({});
    const [obs, setObs] = useState('');
    const [serialIndumil, setSerialIndumil] = useState('');
    const [fechaMarcaje, setFechaMarcaje] = useState<Date | null>(null);

    useEffect(() => {
        if (props.data.ID_ITEM !== null) {
            getItem();
        } else {
            getItemsPorCiudadano();
        }
        setState(props.data.ESTADO);
        setIdFuncionario(getSession().IDAccount);
    }, []);

    const getItem = () => {
        let aux: any[] = [];
        setSpinner(true);
        _weaponService.getItem(props.data.ID_ITEM, props.data.FECHDOCUMENTO).subscribe(resp => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                console.log(resp);
                aux.push(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
                aux.forEach((item: DataItemCiudadano) => {
                    if (item.Propiedades) {
                        let obj;
                        obj = JSON.parse(item.Propiedades);
                        console.log(obj, item);
                        setDataArma(obj.DataArma);
                        if (item.NombreProducto == "TRAUMATICA") {
                            item.ItemEstado = obj.EstadoTraumatica.nombreEstado;
                        }
                    }
                });
                setWeapons(aux);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getItemsPorCiudadano = () => {
        let aux: any[] = [];
        setSpinner(true);
        _weaponService.getItemsPorCiudadano(props.data.IDACCOUNT, null, null).subscribe(resp => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                console.log(resp);
                resp.forEach((item: DataItemCiudadano) => {
                    if (item.Propiedades) {
                        let obj;
                        obj = JSON.parse(item.Propiedades);
                        console.log(obj, item);
                        setDataArma(obj.DataArma);
                        if (item.NombreProducto == "TRAUMATICA") {
                            if (obj.EstadoTraumatica.nombreEstado == 'PENDIENTE POR MARCAR') {
                                item.ItemEstado = obj.EstadoTraumatica.nombreEstado;
                                aux.push(item);
                            }
                        }
                    }
                });
                setWeapons(aux);
                /* setCases(1); */
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const cambiarEstado = () => {
        setSpinner(true);
        let dataUpdate: IDataUpdate = {
            IDFuncionario: idFuncionario,
            IDItem: idItem,
            Observaciones: obs,
            FechaMarcaje: formatDate(fechaMarcaje),
            SerialIndumil: serialIndumil,
            TipoUso: 0, //PENDIENTE POR CONFIRMAR
            NombreTipoUso: '', //PENDIENTE POR CONFIRMAR
        };
        _weaponService.actualizarEstadoMarcaje((state + 1), props.data.IDACCOUNT, props.data.IDMARCAINDUMIL, idFuncionario, dataUpdate).subscribe(resp => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                props.setShow(false);
                props.refresh(new Date());
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const onSubmit = () => {
        if (props.data.ESTADO === RECIBIDA) {
            if (serialIndumil.length > 0 && fechaMarcaje !== null) {
                setConfirmAction(true);
            } else {
                Toast.fire({
                    icon: "warning",
                    title: 'Debe ingresar todos los campos'
                });
            }
        } else {
            if (obs === '' || obs.length === 0) {
                Toast.fire({
                    icon: "warning",
                    title: 'Debe ingresar todos los campos'
                });
            } else {
                setConfirmAction(true);
            }
        }
    };

    const confirmActionFunction = (data: boolean) => {
        if (data) {
            cambiarEstado();
        }
    };

    return (
        <>
            <Modal show={props.show}   size="lg" centered  onHide={() => props.setShow(false)}>
                <Modal.Header>
                    SOLICITANTE {props.data.SURNAME1} {props.data.SURNAME2} {props.data.NAME1}
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body className='mh-70 overflow-auto'>
                    {weapons.length > 0 ?

                        weapons.map((item: any) => (
                            <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                <Col sm={10} className='p-0'>
                                    <div className='d-flex flex-wrap flex-row'>
                                        {/* <div className='m-2'>
                                        <small>{user?.Nit}</small>
                                    </div> */}
                                        <div className='m-2'>
                                            <small>ESTADO: </small>
                                            {item.ItemEstado}
                                        </div>
                                        {/* <div className='m-2'>
                                            <small>DATOS DEL ARMA: </small>
                                            {user?.Active === true ? <b className="text-success">Activo</b> : <b className="text-danger">Activo</b>}
                                        </div>
                                        <div className='m-2'>
                                            <small>DATOS DEL ARMA: </small>
                                            {user?.Active === true ? <b className="text-success">Activo</b> : <b className="text-danger">Activo</b>}
                                        </div> */}
                                    </div>
                                    <Row>
                                        <Col sm={12}>
                                            <div className='m-2'>
                                                <small>DATOS DEL ARMA</small>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={3} className='m-2'>
                                            <b>Serial:</b> {" "}{dataArma.Serial}
                                        </Col>
                                        <Col sm={3} className='m-2'>
                                            <b>Marca:</b> {" "}{dataArma.Descripcion}
                                        </Col>
                                        <Col sm={3} className='m-2'>
                                            <b>Calibre:</b> {" "}{dataArma.Calibre}
                                        </Col>
                                        <Col sm={3} className='m-2'>
                                            <b>Capacidad:</b> {" "}{dataArma.Capacidad}
                                        </Col>
                                        <Col sm={3} className='m-2'>
                                            <b>Modelo:</b> {" "}{dataArma.Modelo}
                                        </Col>
                                        <Col sm={3} className='m-2'>
                                            <b>Tipo Arma:</b> {" "}{dataArma.NombreTipo}
                                        </Col>
                                    </Row>
                                </Col>
                                {props.data.ESTADO !== ENTREGADA &&
                                    <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                        <ThemeProvider theme={inputsTheme}>
                                            <Tooltip title="ACTUALIZAR ESTADO">
                                                <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => { setIdItem(item.IDItem); setModalAction(true) }}>
                                                    <GiPistolGun />
                                                </IconButton>
                                            </Tooltip>
                                        </ThemeProvider>
                                    </Col>}
                            </Row>
                        ))
                        :
                        <NoInfo />
                    }
                </Modal.Body>
            </Modal>
            {spinner && <SSpinner show={spinner} />}
            {modalAction &&
                <Modal show={modalAction}   size="lg" centered  >
                    <Modal.Header>
                        {props.data.ESTADO === PENDIENTE_POR_MARCAR && 'RECEPCIÓN DEL ARMA'}
                        {props.data.ESTADO === RECIBIDA && 'ASIGNAR SERIAL INDUMIL'}
                        {props.data.ESTADO === MARCADA && 'ENTREGA DEL ARMA MARCADA'}
                        <BsXSquare  className='pointer' onClick={() => setModalAction(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        {
                            props.data.ESTADO === PENDIENTE_POR_MARCAR &&
                            <Row>
                                <Col sm={12}>
                                    <TextField
                                        value={obs}
                                        id="Observaciones"
                                        color="secondary"
                                        label="Observaciones"
                                        placeholder='Observaciones acerca de la recepción del arma'
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                        onChange={(e) => { setObs(e.target.value) }}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant='contained' color='secondary'
                                            onClick={() => onSubmit()}
                                        >
                                            MARCAR COMO 'RECIBIDA'
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        }
                        {
                            props.data.ESTADO === RECIBIDA &&
                            <Row>
                                <Col sm={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            /* disablePast */
                                            label="Fecha marcaje indumil "
                                            value={fechaMarcaje}
                                            onChange={(e) => {
                                                setFechaMarcaje(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <TextField
                                        value={serialIndumil}
                                        color="secondary"
                                        size="small"
                                        id="serialIndumil"
                                        label="Serial Indumil"
                                        fullWidth
                                        variant="outlined"
                                        onChange={(e) => { setSerialIndumil(e.target.value) }}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <TextField
                                        value={obs}
                                        id="Observaciones"
                                        color="secondary"
                                        label="Observaciones"
                                        placeholder='Observaciones acerca del marcaje del arma'
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                        onChange={(e) => { setObs(e.target.value) }}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant='contained' color='secondary'
                                            onClick={() => onSubmit()}
                                        >
                                            ASIGNAR SERIAL DE MARCAJE
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        }
                        {
                            props.data.ESTADO === MARCADA &&
                            <Row>
                                <Col sm={12}>
                                    <TextField
                                        value={obs}
                                        id="Observaciones"
                                        color="secondary"
                                        label="Observaciones"
                                        placeholder='Observaciones acerca de la entrega del arma al solicitante'
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                        onChange={(e) => { setObs(e.target.value) }}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant='contained' color='secondary'
                                            onClick={() => onSubmit()}
                                        >
                                            MARCAR COMO 'ENTREGADA'
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        }
                    </Modal.Body>
                </Modal>
            }
            {confirmAction && (
                <GenericConfirmAction
                    show={confirmAction}
                    setShow={setConfirmAction}
                    confirmAction={confirmActionFunction}
                    title={"¿Está seguro de completar la acción?"}
                />
            )}
        </>
    )
}
