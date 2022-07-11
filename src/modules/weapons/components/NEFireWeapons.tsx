import { Autocomplete, Button, CircularProgress, InputAdornment, MenuItem, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsTextRight } from 'react-icons/bs';
import { FileService } from '../../../core/services/FileService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User'
import { formatDate } from '../../../utils/formatDate';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { getSession } from '../../../utils/UseProps';
import { IBandejaImpresion } from '../../trays/model/bandejaImpresion-interface';
import { IProduct } from '../model/product';
import { ITypeProduct } from '../model/typeProduct';

interface INEFIreWeapons {
    idAlmaIndumil: number | null,
    idSeccional: number | null,
    codSec: string,
    show: boolean,
    setShow: Function,
    setSpinner: Function,
    user: User | undefined,
    setRender: Function,
    setFinalMessage: Function,
    setInfo: Function,
    seccional: string,
    tipoSolicitud: string,
    idAction: number | null,
    TipoPermiso: number,
    responseProcedure: Function
}

const _weaponService = new WeaponsService();
const APROBADO_PENDIENTE = 7;

export const NEFireWeapon: React.FC<INEFIreWeapons> = (props: INEFIreWeapons) => {


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [spinner, setSpinner] = useState(false);
    const [spinnerTP, setSpinnerTP] = useState(false);
    const [spinnerProduct, setSpinnerProduct] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [codigoTipoArma, setCodigoTipoArma] = useState<string>('');
    const [modelo, setModelo] = useState<string>('');

    const [capacity, setCapacity] = useState<number>(-1);
    const [tipoUso, setTipoUso] = useState<string>('');
    const [capacidades, setCapacidades] = useState<any[]>([]);
    const [tiposUso, setTiposUso] = useState<any>([]);
    const [obsText, setObsText] = useState<string>('');

    const [codSAP, setCodSAP] = useState<number | null>(null);

    const [product, setProduct] = useState<IProduct>();
    const [fromProduct, setFromProduct] = useState<boolean>(false);


    const [serial, setSerial] = useState('')
    const [calibres, setCalibres] = useState<any>(); // TIPO DE ARMA
    const [render, setRender] = useState(0);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [listProducts, setListProducts] = useState<IProduct[]>([]);


    const classes = useStyles();

    useEffect(() => {
        getAllTypes();
        getList([6, 3]);
    }, []);

    const getList = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                console.log(resp.DataBeanProperties.ObjectValue);
                setCalibres(resp.DataBeanProperties.ObjectValue[0]);
                setTiposUso(resp.DataBeanProperties.ObjectValue[1]?.Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const getCapCargaCatalog = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getgetCapCargaCatalogPorIDProducto(idProducto).subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setCapacidades(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const enviarBandejaImpresion = (idSalida: number, fechaSalida: string) => {
        setSpinner(true);
        let propiedades: any = {
            "IDSalida": idSalida,
            "FechDocumento": fechaSalida,
            "IDAction": props.idAction,
            "TipoUso": product?.Uso,
            "Serial": serial,
            "IDOffice": props.idSeccional ? props.idSeccional : 0
        }
        _weaponService.agregaraArmaImpresion(props.user?.IDAccount, getSession().IDAccount, propiedades)
            .subscribe((resp) => {
                setSpinner(false);
                console.log(resp);
                if (resp) {
                    if (resp.DataBeanProperties.ObjectValue) {
                        console.log(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
                        /* updateBandeja(resp.DataBeanProperties.ObjectValue.DataBeanProperties) */
                        props.setShow(false);
                        props.setRender(2);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "No se ha podido enviar la solicitud de asignacion de ARMA DE FUEGO"
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

    const asignarArma = (product: IProduct | undefined) => {
        console.log(product);
        let fecha = new Date();
        setSpinner(true);
        _weaponService.crearEntradaSalidaAlmacen(formatDate(fecha), (props.user ? props.user?.IDAccount : 0), (props.user ? props.user?.IDAccount : 0), parseInt(getSession().IDAccount), '1', product, props.idAlmaIndumil ? props.idAlmaIndumil : 2, props.idSeccional ? props.idSeccional : 0)
            .subscribe((resp: any) => {
                props.setSpinner(false);
                console.log(resp);
                if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.SalidaAlmacen) {
                    let info = resp.DataBeanProperties.ObjectValue.DataBeanProperties.SalidaAlmacen.DataBeanProperties;
                    enviarBandejaImpresion(info.IDSalidaAlmacen, info.FechaDocumento);
                    props.setInfo(info);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    };

    const getRenderCalibre = (cod: number) => {
        let m = ''
        calibres?.Lista.map((item: any) => {
            if (item.Codigo === (cod + '')) {
                m = item.Valor
            }
        })
        return m;
    };

    const getRenderTipo = (cod: number) => {
        let m = ''
        listTypeProducts.map((item: ITypeProduct) => {
            if (item.IDTipoProducto === cod) {
                m = item.Nombre
            }
        })
        return m;
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();

        let aux: any = product;
        aux.CodigoTipoArma = codigoTipoArma;
        aux.Capacidad = capacity;
        aux.Calibre = fromProduct ? (product?.Calibre + '') : '';
        aux.Descripcion = fromProduct ? product?.Nombre : '';
        aux.Serial = serial;
        aux.Modelo = modelo;
        aux.Cantidad = 1;
        aux.IDOffice = props.idSeccional ? props.idSeccional : 0;

        let auxArma: any = {};
        auxArma.CodigoTipoArma = codigoTipoArma;
        auxArma.Capacidad = capacity;
        auxArma.Calibre = aux.Calibre;
        auxArma.Descripcion = fromProduct ? product?.Nombre : '';
        auxArma.Serial = serial;
        auxArma.Modelo = modelo;
        auxArma.Fire = true;
        auxArma.DocType = props.user?.DocType;
        auxArma.TipoPermiso = props.TipoPermiso;
        auxArma.Uso = tipoUso;
        auxArma.TipoUso = tipoUso;
        auxArma.CodSec = props.codSec;
        aux.Propiedades = aux.Propiedades = JSON.stringify({ "DataArma": auxArma, "Seccional": props.seccional, "Observaciones": obsText });

        setProduct(aux);
        console.log(aux);

        setConfirm(true);
        setRender(1);
    };

    const getAllTypes = () => {
        setSpinnerTP(true);
        _weaponService.getTipoProducto().subscribe((resp) => {
            setSpinnerTP(false);
            if (resp) {
                console.log(resp);
                setListTypeProducts(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    useEffect(() => {
        getProductoCatalogPorClaseTipo();
    }, [codigoTipoArma])

    useEffect(() => {
        getCapCargaCatalog(product ? product.IDProducto : -1)
    }, [product])


    const getProductoCatalogPorClaseTipo = () => {
        let aux: any = [];
        let auxSorted: any = [];
        setSpinnerProduct(true);
        _weaponService.getProductoCatalogPorClaseProducto(0, parseInt(codigoTipoArma)).subscribe((resp) => {
            setSpinnerProduct(false);
            if (resp) {
                if (resp.length > 0) {
                    resp.map((item: any) =>
                        aux.push({
                            label: (item.CodDCCAE + ' - ' + item.Descripcion),
                            id: item.IDProducto
                        }))
                    auxSorted = pipeSort([...aux], 'label');
                    setListProducts(auxSorted);
                } else {
                    setListProducts([]);
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const onSelect = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorIDProducto(idProducto).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    console.log('MASSSS', resp);
                    setCodSAP(parseInt(resp[0].CodSAP));
                    resp[0].RequiereSerial ? setSerial('') : setSerial('No Aplica');
                    setProduct(resp[0]);
                    setFromProduct(true);
                } else {

                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    return (
        <>
            <Modal
                show={props.show}
                onHide={() => props.setShow(false)}
                size="xl"
                centered
            >
                <Modal.Header>
                    REGISTRO DE ARMA DE FUEGO
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
                                <legend>Selección del Arma</legend>
                                <Row>
                                    <Col sm={6} className="mt-3">
                                        <TextField
                                            value={codigoTipoArma}
                                            size="small"
                                            fullWidth
                                            select
                                            color="secondary"
                                            label="Tipo Arma *"
                                            id="tipoArma"
                                            {...register("entity.CodigoTipoArma", { required: true })}
                                            onChange={(e) => { setCodigoTipoArma(e.target.value); getProductoCatalogPorClaseTipo() }}
                                        >
                                            {listTypeProducts.map((item: ITypeProduct) => (
                                                <MenuItem key={item.IDTipoProducto} value={item.IDTipoProducto}>
                                                    {item.Nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.CodigoTipoArma?.type === "required" &&
                                                "El campo Clase Producto es requerido."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            disabled
                                            value={modelo}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Modelo (opcional)"
                                            id="state"
                                            {...register("entity.Modelo")}
                                        >
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Modelo?.type === "required" &&
                                                "El campo Modelo es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={12} className="mt-3 mb-3">
                                        {spinnerProduct ?
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: '#503464',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    marginTop: '-12px',
                                                    marginLeft: '-12px',
                                                }}
                                            />
                                            :
                                            <Autocomplete
                                                fullWidth
                                                size="small"
                                                disablePortal
                                                id="weapons"
                                                options={listProducts}
                                                onChange={(e, value: any) => { onSelect(value ? value.id : 0); }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        fullWidth
                                                        color="secondary"
                                                        label="Selector de productos"
                                                        id="state"
                                                    />)}
                                            />}
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            value={capacity}
                                            size="small"
                                            fullWidth
                                            select
                                            color="secondary"
                                            label="Capacidad (cartuchos) *"
                                            id="capacidades"
                                            {...register("entity.Capacidad", { required: true })}
                                            onChange={(e) => { setCapacity(parseInt(e.target.value)); }}
                                        >
                                            {capacidades.map((item: any) => (
                                                <MenuItem key={item.IDCapCarga} value={item.IDCapacidades}>
                                                    {item.IDCapacidades}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <span className="text-danger">
                                            {errors.entity
                                                ? errors.entity.Capacidad?.type === "required" &&
                                                "El campo Capacidad es obligatorio."
                                                : ""}
                                        </span>
                                    </Col>
                                    <Col sm={6} className="mt-3 mb-3">
                                        <TextField
                                            value={serial}
                                            id="outlined-required"
                                            label="Serial *"
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
                                    {props.user?.DocType !== 2 &&
                                        <Col sm={12} className="mt-3 mb-3">
                                            <TextField
                                                value={tipoUso}
                                                size="small"
                                                fullWidth
                                                select
                                                color="secondary"
                                                label="Tipo de uso *"
                                                id="capacidades"
                                                {...register("entity.TipoUso", { required: true })}
                                                onChange={(e) => { setTipoUso(e.target.value); }}
                                            >
                                                {tiposUso.map((item: any) => (
                                                    <MenuItem key={item.Valor} value={item.Valor}>
                                                        {item.Valor}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <span className="text-danger">
                                                {errors.entity
                                                    ? errors.entity.TipoUso?.type === "required" &&
                                                    "El campo Tipo de uso es obligatorio."
                                                    : ""}
                                            </span>
                                        </Col>
                                    }
                                    <Col sm={12} className="mt-3 mb-3">
                                        <TextField
                                            value={obsText}
                                            size="small"
                                            color="secondary"
                                            id="Observaciones"
                                            placeholder="Escriba aqui las observaciones anexadas a la asignación del arma."
                                            label="Observaciones"
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            inputProps={{
                                                maxLength: 535,
                                            }}
                                            onChange={(e) => {
                                                setObsText(e.target.value);
                                            }}
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
                                    onClick={() => { props.setRender(0); props.setShow(false); }}
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
                {confirm &&
                    <div>
                        <Modal.Header>
                            CONFIRMAR REGISTRO DE ARMA DE FUEGO
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="p-4 ">
                                <Col sm={6}>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-25" variant="contained" color="secondary" onClick={() => { setConfirm(false); props.setShow(true); setRender(0) }}>
                                            ATRÁS
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                                <Col sm={6} className="d-flex justify-content-end">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className=" mt-3 w-50" variant="contained" color="success" onClick={() => { asignarArma(product); }}>
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
                                            <div>
                                                <small><b>COD SAP:</b></small><small className="ml-3">{product?.CodSAP}</small>
                                            </div>
                                            <div>
                                                <small><b>COD DDCAE:</b></small><small className="ml-3">{product?.CodSAP}</small>
                                            </div>
                                            <div className="d-flex flex-row">
                                                <small><b>TIPO DE ARMA:</b></small><small className="ml-3">{getRenderTipo(product ? product.IDTipoProducto : 0)}</small>
                                            </div>
                                            <div>
                                                <small><b>MARCA:</b></small><small className="ml-3">{product?.Descripcion}</small>
                                            </div>
                                            <div>
                                                <small><b>CALIBRE:</b></small><small className="ml-3">{getRenderCalibre(parseInt(product ? product.Calibre : '0'))}</small>
                                            </div>
                                            <div>
                                                <small><b>SERIAL:</b></small><small className="ml-3">{serial}</small>
                                            </div>
                                        </div>
                                    }
                                </Col>
                            </Row>
                        </Modal.Body>
                    </div>
                }
            </Modal>
            {spinner && <SSpinner show={spinner} />}
        </>
    )
}
