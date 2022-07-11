import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Button, Checkbox, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, TextField, ThemeProvider, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsFillArrowRightSquareFill, BsFillDashCircleFill, BsPlus, BsSearch, BsX, BsXCircleFill, BsXSquare } from 'react-icons/bs'
import { WeaponsService } from '../../../core/services/WeaponsService'
import SSearchPerson from '../../../shared/components/SSearchPerson'
import { SSpinner } from '../../../shared/components/SSpinner'
import { formatDate } from '../../../utils/formatDate'
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction'
import { pipeSort } from '../../../utils/pipeSort'
import { inputsTheme } from '../../../utils/Themes'
import { Toast, ToastCenter } from '../../../utils/Toastify'
import { getSession } from '../../../utils/UseProps'
import { IndumilOffice } from '../model/AlmacenIndumil'
import { IProduct } from '../model/product'
import { MResume } from './MResume'

interface ITPushStore {
    show: boolean,
    setShow: Function
    setList: Function
}

const _weaponService = new WeaponsService();

export const TPushStore: React.FC<ITPushStore> = (props: ITPushStore) => {


    const [spinner, setSpinner] = useState(false);
    const [showResume, setShowResume] = useState(false);
    const [showConfirmation, setConfirmation] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const [serialRequired, setSerialRequiered] = useState(false);
    const [item, setItem] = useState<IProduct | null>(null);
    const [itemDevolver, setItemDevolver] = useState<any>(null);
    const [itemSinSerial, setItemSinSerial] = useState<any>(null);
    const [showValidation, setShowValidation] = useState(false);
    const [render, setRender] = useState(0);
    const [cases, setCases] = useState(0);
    const [serial, setSerial] = useState<string | null>(null);
    const [codeSAP, setCodeSAP] = useState<number | null>(null);
    const [codeDCCAE, setCodeDCCAE] = useState<number | null>(null);
    const [listProducts, setListProducts] = useState<IProduct[]>([]);
    const [siHay, setSiHay] = useState(false);
    const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
    const [listProducts2, setListProducts2] = useState<IProduct[]>([]);
    const [listAlIndumil, setListAlIndumil] = useState<IndumilOffice[]>([]);
    const [dateRecord, setDateRecord] = useState<Date | null>(null);
    const [dates, setDates] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateUpto, setDateUpto] = useState<Date | null>(null);
    const [name, setName] = useState('');
    const [citizen, setCitizen] = useState<any>();
    const [idFuncionario, setIdFuncionario] = useState(0);
    const [idAlmaIndumil, setIdAlmaIndumil] = useState(0);
    const [cantidadDisponible, setCantidadDisponible] = useState(0);
    const [cantidadM, setCantidadM] = useState(false);
    const [cantidadDescargar, setCantidadDescargar] = useState<any>(1);
    const [devolverM, setDevolverM] = useState(false);
    const [cantidadDevolver, setCantidadDevolver] = useState<any>(1);
    const [finalMessage, setFinalMessage] = useState('');

    useEffect(() => {
        if (getSession().IDAccount) {
            setIdFuncionario(getSession().IDAccount)
        }
        getIndumilOffices();
    }, [])

    useEffect(() => {
    }, [listProducts, listProducts2])

    const getProductoCatalogPorCod = (cod: number | null, type: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorCod(cod, type).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    setSiHay(false);
                    Toast.fire({
                        icon: "success",
                        title: "Se encontraron coincidencias",
                    });
                    let aux = pipeSort([...resp], "Nombre");
                    setListProducts(aux);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const getIndumilOffices = () => {
        setSpinner(true);
        _weaponService.getIndumilOffices().subscribe(resp => {
            console.log(resp);
            if (resp) {
                setListAlIndumil(resp);
                setSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getProductoCatalogPorNombre = (nombre: string) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorNombre(nombre).subscribe((resp) => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                setSiHay(false);
                if (resp.length > 0) {
                    Toast.fire({
                        icon: "success",
                        title: "Se encontraron coincidencias",
                    });
                    let aux = pipeSort([...resp], "Nombre");
                    setListProducts(aux);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const validate = () => {
        setSpinner(true);
        _weaponService.getAvailableItems(idAlmaIndumil, (item ? item.IDProducto : 0), dateFrom !== null ? (formatDate(dateFrom)) : null, dateUpto !== null ? (formatDate(dateUpto)) : null, serial)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue.length > 0) {
                    setSiHay(true);
                    if (item?.RequiereSerial) {
                        setCantidadDisponible(resp.DataBeanProperties.ObjectValue.length)
                        setProductosDisponibles(resp.DataBeanProperties.ObjectValue)
                    } else {
                        setProductosDisponibles(resp.DataBeanProperties.ObjectValue)
                        let existe = false;
                        let aux: IProduct[] = [...listProducts2];
                        aux.forEach((item2: any) => {
                            if (item2.IDProducto === item?.IDProducto) {
                                existe = true;
                                setCantidadDisponible(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.Cantidad - item2.Cantidad);
                            }
                        });
                        if (!existe) {
                            setCantidadDisponible(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.Cantidad);
                        }
                    }
                    setSerial(null);
                    setDateFrom(null);
                    setDateUpto(null);
                    setShowValidation(false);
                } else {
                    if (serialRequired) {
                        Toast.fire({
                            icon: "warning",
                            title: "No existe producto con serial: " + serial,
                        });
                    } else {
                        Toast.fire({
                            icon: "warning",
                            title: "No existen productos disponibles en el inventario",
                        });
                    }
                }
            })
    };

    const crearSalidaAlmacen = () => {
        setSpinner(true);
        _weaponService.crearSalidaAlmacen(formatDate(dateRecord), idAlmaIndumil, citizen.IDAccount, idFuncionario, listProducts2).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.ErrorList) {
                    let message = '';
                    resp.DataBeanProperties.ObjectValueDataBeanProperties.ErrorList.map((item: string) => {
                        message += item + "/br";
                    })
                    ToastCenter.fire({
                        icon: 'error',
                        title: { message },
                    })
                    setCases(3);
                } else {
                    setFinalMessage(resp.DataBeanProperties.ObjectValue.DataBeanProperties.Message);
                    setCases(2);
                    Toast.fire({
                        icon: "success",
                        title: "Proceso completado con éxito"
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const onSearch = () => {
        if (render === 0) {
            getProductoCatalogPorCod(codeSAP, 1);
        } else if (render === 1) {
            getProductoCatalogPorCod(codeDCCAE, 2);
        } else {
            getProductoCatalogPorNombre(name);
        }
    };

    const onSelect = (item: IProduct | null) => {
        setItem(item);
        setShowValidation(true);
    };

    const exist = (elemento: any) => {
        let a = false;
        listProducts2.forEach((item: any) => {
            console.log();
            if (item.Serial == elemento.Serial) {
                a = true;
            };
        }
        );
        return a;
    }

    const onAdd = (item: IProduct | null, elemento: any) => {
        if (item?.RequiereSerial) {
            if (exist(elemento) === false) {
                let aux: IProduct[] = [...listProducts2];
                if (item) {
                    let auxProduct: any = item;
                    auxProduct.IDItem = elemento.IDItem;
                    auxProduct.FechaDocumento = elemento.FechaDocumento
                    auxProduct.FechaDocumentoSalida = elemento.FechaDocumentoSalida
                    auxProduct.Serial = elemento.Serial
                    auxProduct.Cantidad = elemento.Cantidad
                    aux.push(auxProduct);
                    setListProducts2(aux);
                    /* onMinus(elemento, 1); */
                    Toast.fire({
                        icon: "success",
                        title: "Producto añadido",
                    });
                }
            } else {
                Toast.fire({
                    icon: "warning",
                    title: "El Producto ya ha sido añadido.",
                });
            }
        } else {
            setItemSinSerial(elemento);
            setCantidadM(true);
        }
    };

    const onAdd2 = () => {
        console.log(itemSinSerial);
        let aux: IProduct[] = [...listProducts2];
        if (exist(itemSinSerial) === false) {
            if (item) {
                let auxProduct: any = item;
                auxProduct.IDItem = itemSinSerial.IDItem;
                auxProduct.FechaDocumento = itemSinSerial.FechaDocumento
                auxProduct.FechaDocumentoSalida = itemSinSerial.FechaDocumentoSalida
                auxProduct.Serial = itemSinSerial.Serial
                auxProduct.Cantidad = cantidadDescargar
                setCantidadDisponible(cantidadDisponible - cantidadDescargar);
                aux.push(auxProduct);
                setListProducts2(aux);
                Toast.fire({
                    icon: "success",
                    title: "Producto añadido",
                });
                /* setCantidadDescargar(1); */
            }
        } else {
            // pensar en que pasa si ya existe y no ha buscado mas
            aux.forEach((item: any) => {
                if (item.IDProducto === itemSinSerial.IDProducto) {
                    item.Cantidad = (item.Cantidad + cantidadDescargar);
                    setCantidadDisponible(cantidadDisponible - cantidadDescargar);
                    Toast.fire({
                        icon: "success",
                        title: "Cantidad actualizadad",
                    });
                }
            });

        }
        setCantidadDescargar(1);
        setCantidadM(false);
    };

    const onMinus = (item: any, type: number) => {
        if (type === 2) {
            let aux: IProduct[] = listProducts2;
            if (item.RequiereSerial) {
                aux.splice(aux.indexOf(item), 1);
                setListProducts2([...aux]);
            } else {
                setDevolverM(true);
            }

        } else if (type === 1) {
            let aux: any[] = productosDisponibles;
            aux.splice(aux.indexOf(item), 1);
            setProductosDisponibles([...aux]);
        }
    };

    const onMinus2 = () => {
        let aux: IProduct[] = [...listProducts2];
        if (item?.IDProducto === itemDevolver.IDProducto) {
            aux.forEach((item: any) => {
                if (item.IDProducto === itemDevolver.IDProducto) {
                    item.Cantidad = (item.Cantidad - cantidadDevolver);
                    setCantidadDisponible(cantidadDisponible + cantidadDevolver);
                    if (item.Cantidad === 0) {
                        aux.splice(aux.indexOf(item), 1);
                        setListProducts2([...aux]);
                    }
                    setCantidadDevolver(1);
                    Toast.fire({
                        icon: "success",
                        title: "Cantidad actualizadad",
                    });
                    setDevolverM(false);
                }
            });
        } else {
            aux.forEach((item: any) => {
                if (item.IDProducto === itemDevolver.IDProducto) {
                    item.Cantidad = (item.Cantidad - cantidadDevolver);
                    if (item.Cantidad === 0) {
                        aux.splice(aux.indexOf(item), 1);
                        setListProducts2([...aux]);
                    }
                    setCantidadDevolver(1);
                    Toast.fire({
                        icon: "success",
                        title: "Cantidad actualizadad",
                    });
                    setDevolverM(false);
                }
            });
        }
    };

    const onNext = () => {
        if (dateRecord === null || idAlmaIndumil === 0 || citizen === 0) {
            Toast.fire({
                icon: "warning",
                title: "Debe introducir todo los campos",
            });
        } else {
            setCases(1);
        }
    };

    const onBack = () => {
        setSiHay(false);
        setCases(0);
        setDateRecord(null);
        setCitizen({});
        setCodeSAP(null);
        setCodeDCCAE(null);
        setName('');
        setListProducts([]);
        setListProducts2([]);
    };

    const onValidate = () => {
        if (dates && (dateFrom === null || dateUpto === null)) {
            Toast.fire({
                icon: "warning",
                title: "Ingrese fechas",
            });
        } else if (serialRequired && serial === null) {
            Toast.fire({
                icon: "warning",
                title: "Ingrese serial",
            });
        } else { validate(); }

    };

    const renderSwitch = () => {
        switch (cases) {
            case 0:
                return (
                    <div className="container d-flex justify-content-center">
                        <form>
                            <Row className="card box-s m-3 d-block">
                                <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                    <h1>..::REGISTRAR SALIDA ALMACÉN::..</h1>
                                </Col>
                                <Col sm={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de registro: "
                                            value={dateRecord}
                                            onChange={(e) => {
                                                setDateRecord(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        select
                                        fullWidth
                                        color="secondary"
                                        label="Almacén Indumil"
                                        id="state"
                                        onChange={(e) => setIdAlmaIndumil(parseInt(e.target.value))}
                                    >
                                        {listAlIndumil.map((item: IndumilOffice) => (
                                            <MenuItem value={item.IDAlmaIndumil}>
                                                {item.Nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Col>
                                <Col sm={12} className="mt-5 mb-3">
                                    <TextField
                                        size="small"
                                        value={citizen ? citizen.EntityName : ''}
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
                );
            case 1:
                return (
                    <Modal show={cases === 1}  size="xl" centered onHide={() => onBack()} >
                        <Modal.Header>
                            Registrar salida de almacén para:  <b>{citizen.EntityName}</b>
                            <BsXSquare className='pointer' onClick={() => onBack()} />
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row w-100">
                                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                                    <div className="pull-title-top">
                                        <h1 className="m-3 mt-3">Por favor busque y seleccione los productos que desea descargar</h1>
                                    </div>
                                    <div className="row card box-s ml-3">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <Col sm={6} className="d-flex justify-content-start align-items-center">
                                                            <h4>Buscar producto por:</h4>
                                                        </Col>
                                                        <Col sm={6} className="d-flex justify-content-end">
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    className="mt-3 mb-3"
                                                                    onClick={() => { onSearch() }}
                                                                >
                                                                    BUSCAR
                                                                </Button>
                                                            </ThemeProvider>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <TextField
                                                                className="mt-1"
                                                                value={render}
                                                                size="small"
                                                                fullWidth
                                                                select
                                                                color="secondary"
                                                                label="Clase Producto *"
                                                                id="state"
                                                                onChange={(e) => { setRender(parseInt(e.target.value)); setListProducts([]); }}
                                                            >
                                                                <MenuItem key={render} value={0}>
                                                                    CÓDIGO SAP
                                                                </MenuItem>
                                                                <MenuItem key={render + 1} value={1}>
                                                                    CÓDIGO DCCAE
                                                                </MenuItem>
                                                                <MenuItem key={render + 2} value={2}>
                                                                    NOMBRE
                                                                </MenuItem>
                                                            </TextField>
                                                        </Col>
                                                        {render === 0 &&
                                                            <Col sm={4}>
                                                                <TextField
                                                                    className="mt-1"
                                                                    value={codeSAP}
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    label="Código SAP"
                                                                    id="state"
                                                                    onChange={(e) => {
                                                                        setCodeSAP(parseInt(e.target.value));
                                                                    }}
                                                                >
                                                                </TextField>
                                                            </Col>
                                                        }
                                                        {render === 1 &&
                                                            <Col sm={4}>
                                                                <form >
                                                                    <TextField
                                                                        className="mt-1"
                                                                        value={codeDCCAE}
                                                                        size="small"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        margin="normal"
                                                                        label="Código DCCAE"
                                                                        id="write"
                                                                        onChange={(e) => {
                                                                            setCodeDCCAE(parseInt(e.target.value));
                                                                        }}
                                                                    />
                                                                </form>
                                                            </Col>
                                                        }
                                                        {render === 2 &&
                                                            <Col sm={4}>
                                                                <TextField
                                                                    className="mt-1"
                                                                    value={name}
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    margin="normal"
                                                                    label="Nombre"
                                                                    id="write"
                                                                    onChange={(e) => {
                                                                        setName(e.target.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                        }
                                                        {listProducts2.length > 0 &&
                                                            <Col sm={4} className="d-flex justify-content-end">
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        className="mt-3 mb-3"
                                                                        onClick={() => { setConfirmation(true); }}
                                                                    >
                                                                        GENERAR SALIDA ALMACÉN
                                                                    </Button>
                                                                </ThemeProvider>
                                                            </Col>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row m-3 mt-5">
                                        <div className="col-md-6 border-right">
                                            {
                                                siHay === true &&
                                                <div className="d-flex flex-column align-items-center">
                                                    {listProducts.length === 0 ?
                                                        <div className="mt-5 d-flex flex-column align-items-center">
                                                            <img src={process.env.PUBLIC_URL + '/assets/search.png'} alt="Productos buscados" />
                                                            <h1>Productos disponibles</h1>
                                                        </div>
                                                        :
                                                        <div className="mt-3">
                                                            <div className="m-3">
                                                                <h1> <b>{item?.Descripcion}</b> </h1>
                                                            </div>
                                                            <div className="m-3">
                                                                <h1>Productos disponibles {!item?.RequiereSerial && <b>{cantidadDisponible}</b>}</h1>
                                                            </div>

                                                            <div className='d-flex flex-row justify-content-start flex-wrap '>
                                                                {
                                                                    productosDisponibles.map((elemento: any) => (
                                                                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list mh-70 overflow-auto'>
                                                                            <Col sm={10} className='p-0'>
                                                                                {
                                                                                    item?.RequiereSerial
                                                                                        ? <div><small>Serial:</small> <b>{elemento.DataBeanProperties.Serial}</b></div>
                                                                                        : <b>{elemento.DataBeanProperties.NombreProducto}</b>
                                                                                }
                                                                                <div className='d-flex flex-wrap flex-column'>
                                                                                    <div className='m-1'>
                                                                                        <ThemeProvider theme={inputsTheme}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                color="secondary"
                                                                                            /* className="mt-3 mb-3" */
                                                                                            /* onClick={() => {
                                                                                                setShowSerial(false);
                                                                                                onAdd2(item);
                                                                                            }} */
                                                                                            >
                                                                                                VER DETALLES
                                                                                            </Button>
                                                                                        </ThemeProvider>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                                <Tooltip title="Agregar producto">
                                                                                    <IconButton className="box-s" aria-label="ver" color="secondary"
                                                                                        onClick={() => {
                                                                                            cantidadDisponible !== 0 ?
                                                                                                onAdd(item, elemento.DataBeanProperties)
                                                                                                :
                                                                                                Toast.fire({
                                                                                                    icon: "warning",
                                                                                                    title: "No hay productos disponibles",
                                                                                                });
                                                                                        }}>
                                                                                        <BsPlus />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                            {siHay === false &&
                                                <div className="d-flex flex-column align-items-center">
                                                    {listProducts.length === 0 ?
                                                        <div className="mt-5 d-flex flex-column align-items-center">
                                                            <img src={process.env.PUBLIC_URL + '/assets/search.png'} alt="Productos buscados" />
                                                            <h1>Productos buscados</h1>
                                                        </div>
                                                        :
                                                        <div className="mt-3">
                                                            <div className="m-3">
                                                                <h1>Productos buscados</h1>
                                                            </div>
                                                            <div className='d-flex flex-row justify-content-start flex-wrap mh-70 overflow-auto'>
                                                                {
                                                                    listProducts.map((item: IProduct) => (
                                                                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                                                            <Col sm={10} className='p-0'>
                                                                                <b>{item.Descripcion}</b>
                                                                                <div className='d-flex flex-wrap flex-column'>
                                                                                    <div className='m-1'>
                                                                                        <small>Cod.SAP : </small>
                                                                                        {item.CodSAP}
                                                                                    </div>
                                                                                    <div className='m-1'>
                                                                                        <small>Cod.DCCAE: </small>
                                                                                        {item.CodDCCAE}
                                                                                    </div>
                                                                                    <div className='m-1 d-flex flex-wrap flex-row'>
                                                                                        <small>Req. Serial: </small>
                                                                                        {item.RequiereSerial
                                                                                            ? <p className=' ml-1 text-success'>SI</p>
                                                                                            : <p className=' ml-1 text-danger'>NO</p>
                                                                                        }
                                                                                    </div>
                                                                                    <div className='m-1'>
                                                                                        <ThemeProvider theme={inputsTheme}>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                color="secondary"
                                                                                            >
                                                                                                VER DETALLES
                                                                                            </Button>
                                                                                        </ThemeProvider>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                                <ThemeProvider theme={inputsTheme}>
                                                                                    <Tooltip title="Seleccionar producto">
                                                                                        <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => { onSelect(item); }}>
                                                                                            <BsFillArrowRightSquareFill />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </ThemeProvider>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex flex-column align-items-center">
                                                {listProducts2.length === 0 ?
                                                    <div className="mt-5 d-flex flex-column align-items-center">
                                                        <img src={process.env.PUBLIC_URL + '/assets/box.png'} alt="Productos a descargar" />
                                                        <h1>Productos a descargar</h1>
                                                    </div>
                                                    :
                                                    <div className="mt-3">
                                                        <div className="m-3">
                                                            <h1>Productos a descargar</h1>
                                                        </div>
                                                        <div className='d-flex flex-row justify-content-start flex-wrap mh-70 overflow-auto'>
                                                            {
                                                                listProducts2.map((item: any) => (
                                                                    <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                                                        <Col sm={10} className='p-0'>
                                                                            <b>{item.Descripcion}</b>
                                                                            <div className='d-flex flex-wrap flex-column'>
                                                                                <div className='m-1'>
                                                                                    <small>Cod.SAP : </small>
                                                                                    {item.CodSAP}
                                                                                </div>
                                                                                <div className='m-1'>
                                                                                    <small>Cod.DCCAE: </small>
                                                                                    {item.CodDCCAE}
                                                                                </div>
                                                                                {item.RequiereSerial &&
                                                                                    <div className='m-1'>
                                                                                        <small>Serial: </small>
                                                                                        {item.Serial}
                                                                                    </div>
                                                                                }
                                                                                {!item.RequiereSerial &&
                                                                                    <div className='m-1'>
                                                                                        <small>Serial: </small>
                                                                                        No aplica
                                                                                    </div>
                                                                                }
                                                                                <div className='m-1'>
                                                                                    <small>Cantidad: </small>
                                                                                    {item.Cantidad}
                                                                                </div>
                                                                                <div className='m-1'>
                                                                                    <ThemeProvider theme={inputsTheme}>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            color="secondary"
                                                                                        /* className="mt-3 mb-3" */
                                                                                        /* onClick={() => {
                                                                                            setShowSerial(false);
                                                                                            onAdd2(item);
                                                                                        }} */
                                                                                        >
                                                                                            VER DETALLES
                                                                                        </Button>
                                                                                    </ThemeProvider>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                                            <Tooltip title="Quitar producto de la lista">
                                                                                <IconButton className="box-s" aria-label="ver" color="error" onClick={() => { setItemDevolver(item); onMinus(item, 2); }}>
                                                                                    <BsFillDashCircleFill />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Col>
                                                                    </Row>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                );
            case 2:
                return (
                    <div>
                        <div className="d-flex justify-content-center mt-15">
                            <h1>{finalMessage}</h1>
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
                        <h5 className="w-100 text-center">
                            Registro de descargo terminado con éxito. Para crear
                            un nuevo registro click{" "}
                            <b onClick={() => onBack()}>
                                {" "}
                                <u className="pointer"> AQUI</u>
                            </b>
                        </h5>
                    </div>
                );

            case 3: return (
                <div className="d-flex justify-content-center mt-15">
                    <h1>{finalMessage}</h1>
                </div>
            )

            default:
                <div></div>
        }
    }

    const closeSearch = (data: any) => {
        setShowUser(data);
    };

    const getItem = (data: any) => {
        setCitizen(data);
    };

    const confirmAction = (data: boolean) => {
        if (data) {
            /* crearSalidaAlmacen(); */
            setShowResume(true);
            setCases(10);
        }
    };

    return (
        <>
            <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                <div className="mt-15">
                    {renderSwitch()}
                </div>
            </div>
            {spinner &&
                <SSpinner show={spinner} />
            }
            {showValidation &&
                <Modal show={showValidation}   size="lg" centered  onHide={() => { setShowValidation(false); setSerialRequiered(false) }}>
                    <Modal.Header>
                        Validar Disponibilidad para:
                        <BsXSquare className='pointer' onClick={() => { setShowValidation(false); setSerialRequiered(false) }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="p-4">
                            <Col sm={12}>
                                <h4>{item?.Descripcion}</h4>
                            </Col>
                            {item?.RequiereSerial &&
                                <Col sm={12}>
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <ThemeProvider theme={inputsTheme}>
                                                <Checkbox color="secondary" defaultChecked={serialRequired} onChange={() => { setSerialRequiered(!serialRequired); setSerial(null); }} />
                                            </ThemeProvider>
                                        } label="¿Buscar por serial?" />
                                    </FormGroup>
                                </Col>}
                            {serialRequired &&
                                <Col sm={12}>
                                    <TextField
                                        value={serial}
                                        size="small"
                                        fullWidth
                                        color="secondary"
                                        margin="normal"
                                        label="Serial"
                                        id="serial"
                                        onChange={(e) => {
                                            setSerial(e.target.value);
                                        }}
                                    />
                                </Col>
                            }
                            <Col sm={12}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={dates} onChange={() => { setDates(!dates); setDateFrom(null); setDateUpto(null); }} />
                                        </ThemeProvider>
                                    } label="¿Limitar fechas?" />
                                </FormGroup>
                            </Col>
                            {dates &&
                                <Col sm={12} className="mt-3">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Desde: "
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>
                            }
                            {dates &&
                                <Col sm={12} className="mt-3">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Hasta "
                                            value={dateUpto}
                                            onChange={(e) => {
                                                setDateUpto(e);
                                            }}
                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Col>}
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mt-3 mb-3"
                                        onClick={() => {
                                            onValidate();
                                        }}
                                    >
                                        VALIDAR DISPONIBILIDAD
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
            {
                showUser &&
                <SSearchPerson
                    getShow={closeSearch}
                    getPerson={getItem}
                    dataShow={showUser}
                />
            }
            {
                cantidadM &&
                <Modal show={cantidadM}   size="lg" centered onHide={() => { setCantidadM(false); setCantidadDescargar(1); }} >
                    <Modal.Header>
                        Cantidad a descargar
                        <BsXSquare className='pointer' onClick={() => { setCantidadM(false); setCantidadDescargar(1); }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="p-4">
                            <Col sm={12}>
                                <b>{cantidadDescargar}</b> <small>{item?.Descripcion}</small>
                            </Col>
                            <Col sm={12}>
                                <TextField
                                    value={cantidadDescargar}
                                    type="number"
                                    InputProps={{ inputProps: { min: 1, max: cantidadDisponible } }}
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    margin="normal"
                                    label="Ingrese la cantidad de productos a descargar"
                                    id="cantidadDescargar"
                                    onChange={(e) => {
                                        e.target.value === '' ? setCantidadDescargar(null)
                                            : (parseInt(e.target.value) < cantidadDisponible)
                                                ? setCantidadDescargar(parseInt(e.target.value))
                                                : setCantidadDescargar(cantidadDisponible)
                                    }}
                                />
                            </Col>
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mt-3 mb-3"
                                        onClick={() => {
                                            cantidadDescargar !== null ? onAdd2() :
                                                Toast.fire({
                                                    icon: "warning",
                                                    title: "Debe introducir una cantidad"
                                                })
                                        }}
                                    >
                                        CONFIRMAR
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
            {
                devolverM &&
                <Modal show={devolverM}   size="lg" centered onHide={() => { setDevolverM(false); setCantidadDescargar(1); }} >
                    <Modal.Header>
                        Cantidad a devolver
                        <BsXSquare className='pointer' onClick={() => { setDevolverM(false); setCantidadDescargar(1); }} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="p-4">
                            <Col sm={12}>
                                <b>{cantidadDevolver}</b> <small>{itemDevolver?.Descripcion}</small>
                            </Col>
                            <Col sm={12}>
                                <TextField
                                    value={cantidadDevolver}
                                    type="number"
                                    InputProps={{ inputProps: { min: 1, max: itemDevolver?.Cantidad } }}
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    margin="normal"
                                    label="Ingrese la cantidad de productos a devolver"
                                    id="catidadDevolver"
                                    onChange={(e) => {
                                        e.target.value === '' ? setCantidadDevolver(null)
                                            : (parseInt(e.target.value) < itemDevolver?.Cantidad)
                                                ? setCantidadDevolver(parseInt(e.target.value))
                                                : setCantidadDevolver(itemDevolver?.Cantidad)
                                    }}
                                />
                            </Col>
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mt-3 mb-3"
                                        onClick={() => {
                                            cantidadDevolver !== null ? onMinus2() :
                                                Toast.fire({
                                                    icon: "warning",
                                                    title: "Debe introducir una cantidad"
                                                })
                                        }}
                                    >
                                        CONFIRMAR
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }
            {showConfirmation && (
                <GenericConfirmAction
                    show={showConfirmation}
                    setShow={setConfirmation}
                    confirmAction={confirmAction}
                    title={"¿Desea continuar con el descargo?"}
                />
            )}
            {
                showResume &&
                <MResume
                    show={showResume}
                    setShow={setShowResume}
                    listProducts={listProducts2}
                    citizen={citizen}
                    setCases={setCases}
                    crearSalidaAlmacen={crearSalidaAlmacen}
                />

            }
        </>
    )
}
