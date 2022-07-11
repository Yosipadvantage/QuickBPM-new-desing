import { Button, Checkbox, FormControlLabel, FormGroup, InputAdornment, MenuItem, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsTextRight, BsUpload, BsXSquare } from 'react-icons/bs';
import { FileService } from '../../../core/services/FileService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { formatDate } from '../../../utils/formatDate';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast, ToastCenter } from '../../../utils/Toastify';
import { getSession } from '../../../utils/UseProps';
import { Iweapon } from '../model/modelWeapon';
import { IProduct } from '../model/product';

interface INEWeapons {
    idAlmaIndumil: number | null,
    idSeccional: number | null,
    show: boolean,
    setShow: Function,
    setSpinner: Function,
    user: User | undefined,
    setRender: Function,
    setFinalMessage: Function,
    setInfo: Function,
    seccional: string,
    tipoSolicitud: string
}

const ESTADOS_TRAUMATICAS = [{ "id": 1, "nombreEstado": 'PENDIENTE POR MARCAR' }, { "id": 2, "nombreEstado": 'MARCADO' }, { "id": 3, "nombreEstado": 'EN DEVOLUCIÓN' }, { "id": 4, "nombreEstado": 'DEVUELTA' }]
const OTRO = '6';

const _weaponService = new WeaponsService();
const _fileService = new FileService();

export const NEWeapons: React.FC<INEWeapons> = (props: INEWeapons) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [spinner, setSpinner] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [codigoTipoArma, setCodigoTipoArma] = useState<string>('');
    const [capacidad, setCapacidad] = useState<string>('');
    const [calibre, setCalibre] = useState<string>('');
    const [modelo, setModelo] = useState<string>('');
    const [fechaFacCompra, setFechaFacCompra] = useState("01/01/2000");
    const [producto, setProducto] = useState<any>();
    const [serial, setSerial] = useState('')
    const [lista1, setListaTiposArma] = useState<any>(); // TIPO DE ARMA
    const [render, setRender] = useState(0);

    const [accesorios, setAccesorios] = useState<boolean>(false);
    const [obs, setObs] = useState<boolean>(false);
    const [obsText, setObsText] = useState("");
    const [accesoriosText, setAccesoriosText] = useState("");
    const [showM, setShowM] = useState(false);
    const [showM2, setShowM2] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [file2, setFile2] = useState<any>(null);

    const classes = useStyles();

    useEffect(() => {
        getList([4]);
    }, []);

    const getList = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setListaTiposArma(resp.DataBeanProperties.ObjectValue[0]);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const enviarBandejaMarcaje = (idAccount: number, idSalida: number, fechaSalida: string) => {
        props.setSpinner(true);
        _weaponService.agregarListaMarcaje(idAccount, idSalida, fechaSalida)
            .subscribe((resp) => {
                props.setSpinner(false);
                console.log(resp);
                if (resp) {
                    if (resp.DataBeanProperties.ObjectValue) {
                        props.setShow(false);
                        props.setRender(2);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "No se ha podido enviar la solicitud de MARCAJE"
                        })
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción!"
                    })
                }
            })
    };

    const asignarTraumatica = (product: IProduct | undefined) => {
        let fecha = new Date();
        props.setSpinner(true);
        _weaponService.crearEntradaSalidaAlmacen(formatDate(fecha), (props.user ? props.user?.IDAccount : 0), (props.user ? props.user?.IDAccount : 0), parseInt(getSession().IDAccount), '0', product, props.idAlmaIndumil ? props.idAlmaIndumil : -1, props.idSeccional ? props.idSeccional : 0)
            .subscribe((resp: any) => {
                props.setSpinner(false);
                console.log(resp);
                if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.SalidaAlmacen) {
                    if (props.tipoSolicitud === 'SOLICITUD DE MARCAJE') {
                        enviarBandejaMarcaje(props.user ? props.user?.IDAccount : 0, resp.DataBeanProperties.ObjectValue.DataBeanProperties.SalidaAlmacen.DataBeanProperties.IDSalidaAlmacen, formatDate(fecha))
                    } else {
                        props.setInfo(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SalidaAlmacen);
                        props.setShow(false);
                        props.setRender(2);
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    };

    const getNombreTipo = (cod: number) => {
        let m = ''
        lista1?.Lista.map((item: any) => {
            console.log(item.Codigo);
            if (item.Codigo === (cod + '')) {
                m = item.Valor
            }
        })
        return m;
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        if (codigoTipoArma === OTRO && data.entity.Otro === '') {
            Toast.fire({
                icon: 'warning',
                title: 'Debe introducir el Tipo de Arma'
            })
        } else {
            setRender(1);
        }
    };

    const onSubmit2 = (data: any, e: any) => {
        e.preventDefault();
        if (file !== null && file2 !== null) {
            const aux = data.entity;
            let auxPropiedades: any = {};
            let auxArma: any = {};
            auxArma.Fire = false;
            auxArma.CodigoTipoArma = codigoTipoArma;
            auxArma.Capacidad = aux.Capacidad;
            auxArma.Calibre = aux.Calibre;
            auxArma.Descripcion = aux.Descripcion;
            auxArma.Serial = aux.Serial;
            auxArma.Modelo = aux.Modelo;
            auxArma.FechaFacCompra = aux.FechaFacCompra;
            auxArma.NoFacturaCompra = aux.NoFacturaCompra;
            auxArma.ManifiestoDian = aux.ManifiestoDian;
            auxArma.DocType = props.user?.DocType;

            let documentos: any[] = [];
            auxArma.NombreTipo = codigoTipoArma === OTRO ? data.entity.Otro : getNombreTipo(data.entity.CodigoTipoArma);
            aux.Otro = codigoTipoArma === OTRO ? data.entity.Otro : '';
            aux.IDTipo = data.entity.CodigoTipoArma;
            aux.IDFuncionario = parseInt(getSession().IDAccount);
            aux.IDProducto = 9; //IDTRAUMATICA DESDE PROPIEDADES DEL SISTEMA
            aux.IDSolicitante = (props.user ? props.user.IDAccount : 0);
            aux.FechaFacCompra = aux.FechaFacCompra + " 00:00:00";
            if (props.tipoSolicitud === 'DEVOLUCION') {
                auxPropiedades = ESTADOS_TRAUMATICAS[2];
                //AGREGAR LOS CAMPOS DE DOCTYPE, ACCESORIOS, OBSERVACIONES Y DOCUMENTO
                auxArma.DocType = props.user?.DocType;
                auxArma.Accesorios = accesoriosText;
                auxArma.Observaciones = obsText;
                documentos.push({
                    ContextMedia: file.MediaContext,
                    Media: file.Media,
                    Nombre: "IMG_CUERPO"
                });
                documentos.push({
                    ContextMedia: file2.MediaContext,
                    Media: file2.Media,
                    Nombre: "IMG_SERIAL"
                });
            }
            else if (props.tipoSolicitud === 'SOLICITUD DE MARCAJE') {
                auxPropiedades = ESTADOS_TRAUMATICAS[0];
            }
            aux.Propiedades = JSON.stringify({ "EstadoTraumatica": auxPropiedades, "DataArma": auxArma, "Seccional": props.seccional, "Documentos": documentos });
            aux.Cantidad = 1;
            aux.IDOffice = props.idSeccional;
            console.log(aux);
            setConfirm(true);
            setProducto(aux);
            console.log(JSON.parse(aux.Propiedades));
        } else {
            Toast.fire({
                icon: "warning",
                title: 'Debe cargar las imagenes del Arma'
            });
        }
    };

    const getItemM = async (data: any) => {
        console.log(data);
        setFile(data);
        //OBTENER IMAGEN Y MOSTRARLA
    };

    const getItemM2 = async (data: any) => {
        console.log(data);
        setFile2(data);
        //OBTENER IMAGEN Y MOSTRARLA
    };

    return (
        <>
            <Modal
                show={props.show}
                onHide={() => { props.setShow(false); props.setRender(0) }}
                size="xl"
                centered
            >
                <Modal.Header>
                    REGISTRO DE {props.tipoSolicitud} ARMA TRAUMÁTICA
                </Modal.Header>
                {(!confirm && render === 0) &&
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Modal.Body>
                            <div className="m-3 d-flex justify-content-center flex-column" >
                                <h6> <b>SECCIONAL DE RECEPCIÓN:</b> {props.seccional}</h6>
                                <h6> <b>SOLICITANTE:</b> {props.user?.EntityName} - {props.user?.Nit}</h6>
                            </div>
                            <b>Campo obligatorio *</b>
                            <fieldset>
                                <legend>Información del arma</legend>
                                <Row>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            value={codigoTipoArma}
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Tipo de Arma"
                                            id="state"
                                            {...register("entity.CodigoTipoArma", { required: true })}
                                            onChange={(e) => {
                                                setCodigoTipoArma(e.target.value);
                                            }}
                                        >
                                            {lista1?.Lista.map((item: any) => (
                                                <MenuItem key={item.Valor} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))}
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.CodigoTipoArma?.type === "required" &&
                                                "El campo Clase Producto es requerido."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            value={capacidad}
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Capacidad de carga (cartuchos)"
                                            id="capacity"
                                            {...register("entity.Capacidad", { required: true })}
                                            onChange={(e) => setCapacidad(e.target.value.toUpperCase())}
                                        >
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Capacidad?.type === "required" &&
                                                "El campo Capacidad de carga es requerido."
                                                : ""}
                                        </span>
                                    </Col>
                                    {codigoTipoArma === OTRO &&
                                        <Col sm={12} className="mt-3">
                                            <TextField
                                                size="small"
                                                color="secondary"
                                                id="name1"
                                                label="Escriba el otro tipo de arma a registar *"
                                                fullWidth
                                                variant="outlined"
                                                {...register("entity.Otro", { required: true })}
                                            />
                                        </Col>
                                    }
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            value={calibre}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Calibre"
                                            id="state"
                                            {...register("entity.Calibre", { required: true })}
                                            onChange={(e) => setCalibre(e.target.value.toUpperCase())}
                                        >
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Calibre?.type === "required" &&
                                                "El campo Calibre es requerido."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            id="outlined-required"
                                            label="Marca *"
                                            fullWidth
                                            size="small"
                                            color='secondary'
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <BsTextRight />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...register("entity.Descripcion", { required: true })}
                                        />
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Descripcion?.type === "required" &&
                                                "El campo Marca es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            value={serial}
                                            id="outlined-required"
                                            label="Serie del fabricante *"
                                            fullWidth
                                            size="small"
                                            color='secondary'
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <BsTextRight />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...register("entity.Serial", { required: true })}
                                            onChange={(e) => {
                                                setSerial(e.target.value);
                                            }}
                                        />
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Serial?.type === "required" &&
                                                "El campo Serie del fabricante es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            value={modelo}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Modelo"
                                            id="state"
                                            {...register("entity.Modelo")}
                                            onChange={(e) => {
                                                setModelo(e.target.value);
                                            }}
                                        >
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Modelo?.type === "required" &&
                                                "El campo Modelo es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                </Row>
                            </fieldset>
                            <fieldset className="mt-3">
                                <legend>Información de la compra (opcional)</legend>
                                <Row>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            id="outlined-required"
                                            label="Fecha de factura de compra"
                                            fullWidth
                                            size="small"
                                            color='secondary'
                                            variant="outlined"
                                            type="Date"
                                            value={fechaFacCompra}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            {...register("entity.FechaFacCompra")}
                                            onChange={(e) => { setFechaFacCompra(e.target.value) }}
                                        />
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.FechaFacCompra?.type === "required" &&
                                                "El campo Fecha de factura de compra es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            id="outlined-required"
                                            label="No Factura de Compra"
                                            fullWidth
                                            size="small"
                                            color='secondary'
                                            variant="outlined"
                                            type="number"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <BsTextRight />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...register("entity.NoFacturaCompra")}
                                        />
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            id="outlined-required"
                                            label="Manifiesto de la Dian"
                                            fullWidth
                                            size="small"
                                            color='secondary'
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <BsTextRight />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            {...register("entity.ManifiestoDian")}
                                        />
                                    </Col>
                                </Row>
                            </fieldset>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-element">
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="error"
                                    onClick={() => { props.setRender(0); props.setShow(false); setAccesoriosText(''); setObsText('') }}
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
                                    SIGUIENTE
                                </Button>
                            </div>
                        </Modal.Footer>
                    </form>
                }
                {(!confirm && render === 1) &&
                    <form onSubmit={handleSubmit(onSubmit2)}>
                        <Modal.Body>
                            <div className="m-3 d-flex justify-content-center flex-column" >
                                <h6> <b>SECCIONAL DE RECEPCIÓN:</b> {props.seccional}</h6>
                                <h6> <b>SOLICITANTE:</b> {props.user?.EntityName} - {props.user?.Nit}</h6>
                            </div>
                            <b>Campo obligatorio *</b>
                            <Row className="m-3 d-flex">
                                <Col sm={6} className="hover-box">
                                    <div className={'div-border img-view'} >
                                        <img className="hover-image" src={
                                            file !== null
                                                ? _fileService.getUrlFile(file.MediaContext, file.Media)
                                                : process.env.PUBLIC_URL + '/assets/gun-body.png'
                                        } alt="FOTO SERIAL ARMA" />
                                        <div className="hover-middle">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button variant="contained" color="secondary"
                                                    onClick={() => { setShowM(true) }}
                                                >
                                                    <BsUpload className="ml-2 mr-2" />
                                                    FOTO CUERPO DEL ARMA
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="hover-box">
                                    <div className={'div-border img-view'} >
                                        <img className="hover-image" src={
                                            file2 !== null
                                                ? _fileService.getUrlFile(file2.MediaContext, file2.Media)
                                                : process.env.PUBLIC_URL + '/assets/gun-serial.jpg'
                                        } alt="FOTO SERIAL ARMA" />
                                        <div className="hover-middle">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button variant="contained" color="secondary"
                                                    onClick={() => { setShowM2(true) }}
                                                >
                                                    <BsUpload className="ml-2 mr-2" />
                                                    FOTO SERIAL DEL ARMA
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="mt-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Checkbox color="secondary" defaultChecked={accesorios} onChange={() => setAccesorios(!accesorios)} />
                                                </ThemeProvider>
                                            } label="¿Incluye accesorios?" />
                                        </FormGroup>
                                    </ThemeProvider>
                                </Col>
                                <Col sm={6} className="mt-3 d-flex justify-content-center">
                                    <ThemeProvider theme={inputsTheme}>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Checkbox color="secondary" defaultChecked={obs} onChange={() => setObs(!obs)} />
                                                </ThemeProvider>
                                            } label="¿Incluye observaciones?" />
                                        </FormGroup>
                                    </ThemeProvider>
                                </Col>
                                {accesorios &&
                                    <Col sm={12} className="mt-3">
                                        <TextField
                                            value={accesoriosText}
                                            size="small"
                                            color="secondary"
                                            id="Accesorios"
                                            placeholder="Escriba aqui una breve descripción de los accesorios devueltos con el arma"
                                            label="Accesorios"
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            inputProps={{
                                                maxLength: 450,
                                            }}
                                            rows={5}
                                            onChange={(e) => {
                                                setAccesoriosText(e.target.value);
                                            }}
                                        />
                                    </Col>
                                }
                                {obs &&
                                    <Col sm={12} className="mt-3">
                                        <TextField
                                            value={obsText}
                                            size="small"
                                            color="secondary"
                                            id="Observaciones"
                                            placeholder="Escriba aqui las observaciones anexadas al acta de devolución de arma traumática."
                                            label="Observaciones"
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={7}
                                            inputProps={{
                                                maxLength: 535,
                                            }}
                                            onChange={(e) => {
                                                setObsText(e.target.value);
                                            }}
                                        />
                                    </Col>}
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-element">
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="error"
                                    onClick={() => { setRender(0); }}
                                >
                                    ATRÁS
                                </Button>
                            </div>
                            <div className="modal-element">
                                <Button
                                    className={classes.button}
                                    type='submit'
                                    variant="contained"
                                    color="success"
                                >
                                    SIGUIENTE
                                </Button>
                            </div>
                        </Modal.Footer>
                    </form>

                }
                {confirm &&
                    <div>
                        <Modal.Header>
                            CONFIRMAR REGISTRO DE TRAUMÁTICA
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="p-4 ">
                                <Col sm={6}>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-25" variant="contained" color="secondary" onClick={() => { setConfirm(false); props.setShow(true) }}>
                                            ATRÁS
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-50" variant="contained" color="success" onClick={() => { asignarTraumatica(producto); }}>
                                            CONFIRMAR REGISTRO
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <h1>Resumen del registro</h1>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <div className="d-flex flex-row">
                                        <p><b>SOLICITANTE: </b> <h4>{props.user?.EntityName + ' - ' + props.user?.Nit}</h4></p>
                                    </div>
                                </Col>
                                <Col sm={12} className="mt-2 mh-70 overflow-auto">
                                    {
                                        <div className="m-2 d-flex flex-column border-top border-bottom">
                                            <div className="d-flex flex-row">
                                                <small><b>TIPO DE ARMA:</b></small><small className="ml-3">{producto?.CodigoTipoArma === OTRO ? producto?.Otro : getNombreTipo(producto?.CodigoTipoArma)}</small>
                                            </div>
                                            <div>
                                                <small><b>MARCA:</b></small><small className="ml-3">{producto?.Descripcion}</small>
                                            </div>
                                            <div>
                                                <small><b>CAPACIDAD:</b></small><small className="ml-3">{producto?.Capacidad} (CARTUCHOS)</small>
                                            </div>
                                            <div>
                                                <small><b>CALIBRE:</b></small><small className="ml-3">{producto?.Calibre}</small>
                                            </div>
                                            <div>
                                                <small><b>SERIAL:</b></small><small className="ml-3">{producto?.Serial}</small>
                                            </div>
                                        </div>
                                    }
                                </Col>
                                <Col sm={6} className="mt-2 d-flex justify-content-center flex-column">
                                    <div>
                                        <h6>CUERPO DEL ARMA</h6>
                                    </div>
                                    <div className={'div-border img-view'} >
                                        <img className="op-90 hover-image" src={
                                            file !== null
                                                ? _fileService.getUrlFile(file.MediaContext, file.Media)
                                                : process.env.PUBLIC_URL + '/assets/gun-body.png'
                                        } alt="FOTO SERIAL ARMA" />
                                    </div>
                                </Col>
                                <Col sm={6} className="mt-2 d-flex flex-column">
                                    <div>
                                        <h6>SERIAL DEL ARMA</h6>
                                    </div>
                                    <div className={'div-border img-view'} >
                                        <img className="op-90 hover-image" src={
                                            file !== null
                                                ? _fileService.getUrlFile(file2.MediaContext, file2.Media)
                                                : process.env.PUBLIC_URL + '/assets/gun-body.png'
                                        } alt="FOTO SERIAL ARMA" />
                                    </div>
                                </Col>
                                {accesorios &&
                                    <Col sm={12} className="m-3">
                                        <b>ACCESORIOS: </b><p>{accesoriosText}</p>
                                    </Col>}
                                {obs &&
                                    <Col sm={12} className="m-3">
                                        <b>OBSERVACIONES:</b><p>{obsText}</p>
                                    </Col>
                                }
                            </Row>
                        </Modal.Body>
                    </div>
                }
            </Modal>
            {/* {confirm &&
                <Modal show={confirm}   size="xl" centered  >
                    
                </Modal>
            } */}
            {spinner && <SSpinner show={spinner} />}
            {showM &&
                <SLoadDocument
                    setShow={setShowM}
                    type={1}
                    title={"Recurso"}
                    getMedia={getItemM}
                    show={showM}
                    beanAction={null}
                />
            }
            {showM2 &&
                <SLoadDocument
                    setShow={setShowM2}
                    type={1}
                    title={"Recurso"}
                    getMedia={getItemM2}
                    show={showM2}
                    beanAction={null}
                />
            }
        </>
    )
}
