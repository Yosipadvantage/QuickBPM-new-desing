import { useState, useEffect } from "react";

import { BsArrowRight, BsCloudDownloadFill, BsFillCaretDownFill, BsFillCloudUploadFill, BsSearch, BsXSquare } from 'react-icons/bs';
import { MenuItem, TextField, ThemeProvider, IconButton, Button, InputAdornment, Autocomplete, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import { inputsTheme } from "../../../utils/Themes";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { Col, Modal, Row } from "react-bootstrap";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { Toast, ToastStatic } from '../../../utils/Toastify';
import { FiSend } from "react-icons/fi";
import { pipeSort } from "../../../utils/pipeSort";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { IProduct } from "../model/product";
import { SSpinner } from "../../../shared/components/SSpinner";
import { IProductKind } from "../model/ProductKind";
import { ITypeProduct } from "../model/typeProduct";
import { FileService } from "../../../core/services/FileService";
import { formatDate } from "../../../utils/formatDate";
import { getSession } from "../../../utils/UseProps";

const _weaponService = new WeaponsService();
const _files = new FileService();

export const TloadStore = () => {

    const [Url, setUrl] = useState("");
    const [render, setRender] = useState(0);
    const [show, setShow] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [showLoad, setShowLoad] = useState(false);

    const [codSAP, setCodSAP] = useState<number | null>(null);
    const [cantidad, setCantidad] = useState<number | null>(null);
    const [valor, setValor] = useState<number | null>(null);
    const [serial, setSerial] = useState<string>('');
    const [dateLote, setDateLote] = useState<Date | null>(null);
    const [dateMani, setDateMani] = useState<Date | null>(null);
    const [manifiesto, setManifiesto] = useState<string>('');
    const [listProducts, setListProducts] = useState<IProduct[]>([]);
    const [product, setProduct] = useState<IProduct>();
    const [productKind, setProductKind] = useState<number | null>(null);
    const [listProductKind, setListProductKind] = useState<IProductKind[]>([]);
    const [productType, setProductType] = useState<number | null>(null);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);


    const [media, setMedia] = useState("");
    const [context, setContex] = useState("");
    const [beanDoc, setBeanDoc] = useState<any>();
    const [IDProvedor, setIDProvedor] = useState<number>(0);
    const [nameProvedor, setNameProvedor] = useState<string>("");
    const [listOffice, setListOffice] = useState([]);
    const [office, setOffice] = useState(0);

    const [numeroEntrada, setnumeroEntrada] = useState<string>("");
    const [conError, setConError] = useState<boolean>(false);
    const [respDoc, setRespDoc] = useState<any>();
    const [show2, setShow2] = useState(false);

    const onBack = () => {
        setNameProvedor('');
        setnumeroEntrada('');
        setCantidad(null);
        setValor(null);
        setDateLote(null);
        setDateMani(null);
        setManifiesto('');
        setExpanded('');
    }

    const setShowF = (show: boolean) => {
        setShow(show);
    }

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

    const openUser = (state: boolean) => {
        setShow2(state);
    };

    const getItem = (data: any) => {
        setIDProvedor(data.IDAccount);
        setNameProvedor(data.EntityName);
    };

    useEffect(() => {
        getProductKindCatalog();
        getAllTypes();
        descargarFormatoEntradaAlmacen();
        getOfficeCatalog();
    }, []);

    const descargarFormatoEntradaAlmacen = () => {
        _weaponService.descargarFormatoEntradaAlmacen().subscribe((resp: any) => {
            console.log(resp);
            if (resp.DataBeanProperties.ObjectValue) {
                // Se cambio URLLink para construir la URL
                /* setUrl(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.URLLink); */
                setUrl(
                    _files.getUrlFile(
                        resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.MediaContext,
                        resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.Media
                    )
                );
                console.log(_files.getUrlFile(
                    resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.MediaContext,
                    resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.Media
                ));
                console.log(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.URLLink);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'ERROR al cargar el formato de ENTRADA DE ALMACÉN'
                })
            }
        })
    };

    const getProductKindCatalog = () => {
        setSpinner(true);
        _weaponService.getClaseProductoCatalogLike().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListProductKind(resp);
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
        setSpinner(true);
        _weaponService.getIndumilOffices()
            .subscribe((res: any) => {
                setSpinner(false);
                if (res) {
                    console.log(res);
                    res.map((item: any) =>
                        aux.push({
                            label: item.Nombre,
                            id: item.IDAlmaIndumil
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

    const validarInicio = () => {
        if (IDProvedor === 0 || IDProvedor === undefined || IDProvedor === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene proveedor seleccionado",
            });
        } else if (numeroEntrada === "" || numeroEntrada === undefined || numeroEntrada === null) {
            Toast.fire({
                icon: "error",
                title: "No tiene Número de entrada",
            });
        }
        else if (office === 0 || office === undefined || office === null) {
            Toast.fire({
                icon: "error",
                title: "No selecciono la sucursal",
            });
        }
        else {
            setShowLoad(true);
            setRespDoc(null);
            setBeanDoc(null);
            setConError(false);
        }
    }

    const crearEntradaAlmacen = () => {
        if (expanded === 'panel1') {
            if (IDProvedor === 0 || IDProvedor === undefined || IDProvedor === null) {
                Toast.fire({
                    icon: "error",
                    title: "No tiene proveedor seleccionado",
                });
            } else if (numeroEntrada === "" || numeroEntrada === undefined || numeroEntrada === null) {
                Toast.fire({
                    icon: "error",
                    title: "No tiene Número de entrada",
                });
            } else if (codSAP === undefined || codSAP === null) {
                Toast.fire({
                    icon: "error",
                    title: "Código SAP es obligatorio",
                });
            } else if (cantidad === undefined || cantidad === null) {
                Toast.fire({
                    icon: "error",
                    title: "Debe especificar una cantidad",
                });
            } else if (valor === undefined || valor === null) {
                Toast.fire({
                    icon: "error",
                    title: "Debe especificar un valor",
                });
            }
            else if (office === 0 || office === undefined || office === null) {
                Toast.fire({
                    icon: "error",
                    title: "No selecciono la sucursal",
                });
            }
            else {
                let fecha = new Date();
                setConError(false);
                setSpinner(true);
                _weaponService.crearEntradaAlmacen2(formatDate(fecha), IDProvedor, parseInt(getSession().IDAccount), numeroEntrada, product, office).subscribe((resp: any) => {
                    setSpinner(false);
                    console.log(resp);
                    if (resp.DataBeanProperties.ObjectValue) {
                        let obs = '';
                        if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.ProcessResponse.length > 0) {
                            resp.DataBeanProperties.ObjectValue.DataBeanProperties.ProcessResponse.map((item: any) => {
                                obs += item + ' ';
                            })
                        }
                        ToastStatic.fire({
                            icon: "info",
                            title: resp.DataBeanProperties.ObjectValue.DataBeanProperties.Message,
                            text: obs
                        });
                        if (obs.includes('OK')) {
                            /* cleanup(); */
                            /* window.location.reload(); */
                        }
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "No se ha podido completar la acción",
                        });
                    }
                })
            }
        } else {
            if (IDProvedor === 0 || IDProvedor === undefined || IDProvedor === null) {
                Toast.fire({
                    icon: "error",
                    title: "No tiene proveedor seleccionado",
                });
            } else if (numeroEntrada === "" || numeroEntrada === undefined || numeroEntrada === null) {
                Toast.fire({
                    icon: "error",
                    title: "No tiene Número de entrada",
                });
            } else if (media === "" || media === undefined || media === null) {
                Toast.fire({
                    icon: "error",
                    title: "No tiene Docuemento cargado",
                });
            } else if (office === 0 || office === undefined || office === null) {
                Toast.fire({
                    icon: "error",
                    title: "No selecciono la sucursal",
                });
            } else {
                let fecha = new Date();
                setConError(false);
                _weaponService.crearEntradaAlmacen(formatDate(fecha), IDProvedor, parseInt(getSession().IDAccount), numeroEntrada, media, context, "", office).subscribe((resp: any) => {
                    console.log(resp);
                    if (resp.DataBeanProperties.ObjectValue) {
                        setConError(true);
                        setRespDoc(resp.DataBeanProperties.ObjectValue);
                        Toast.fire({
                            icon: "info",
                            title: resp.DataBeanProperties.ObjectValue.DataBeanProperties.Message,
                        });
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "No se ha podido completar la acción",
                        });
                    }
                })
            }
        }
    };

    const onSelect = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getProductoCatalogPorIDProducto(idProducto).subscribe((resp) => {
            setSpinner(false);
            console.log(resp);
            if (resp) {
                if (resp.length > 0) {
                    setCodSAP(parseInt(resp[0].CodSAP));
                    resp[0].RequiereSerial ? setSerial('') : setSerial('No Aplica');
                    setProduct(resp[0]);
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

    const onNext = () => {
        let aux: any = product;
        aux.Serial = serial;
        aux.Cantidad = cantidad;
        aux.ValorUnitario = valor;
        aux.FechaManifiesto = formatDate(dateMani);
        aux.FechaLote = formatDate(dateLote);
        aux.Manifiesto = manifiesto;
        setProduct(aux);
        crearEntradaAlmacen();
    }

    const getAllTypes = () => {
        setSpinner(true);
        _weaponService.getTipoProducto().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListTypeProducts(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getProductoCatalogPorClaseTipo = () => {
        let aux: any = [];
        let auxSorted: any = [];
        setSpinner(true);
        _weaponService.getProductoCatalogPorClaseProducto(productKind, productType).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    /* Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias",
                    }); */
                    resp.map((item: any) =>
                        aux.push({
                            label: item.Descripcion,
                            id: item.IDProducto
                        }))
                    auxSorted = pipeSort([...aux], 'label');
                    setListProducts(auxSorted);
                } else {
                    setListProducts([]);
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

    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const cleanup = () => {
        setnumeroEntrada('');
        setProductKind(null);
        setListProducts([]);
        setCodSAP(null);
        setSerial('');
        setCantidad(null);
        setValor(null);
        setDateMani(null);
        setManifiesto('');
        setDateLote(null);
    };

    useEffect(() => {
    }, [expanded]);

    useEffect(() => {
        getProductoCatalogPorClaseTipo()
    }, [productKind, productType]);

    const renderSwitch = () => {

        switch (render) {
            case 0: return (
                <main>
                    <div className="px-5 mt-2">
                        <div className="row justify-content-center">
                            <div className="mt-15">
                                <div className="card p-4 h-100">
                                    <div className="container h-100 mt-2">
                                        <div className="d-flex justify-content-center">
                                            <h1>.::REGISTRAR ENTRADA ALMACÉN::.</h1>
                                        </div>
                                        <div className="mt-3">
                                            <Row>
                                                <Col sm={6} className="mt-3">
                                                    <TextField
                                                        value={nameProvedor}
                                                        size="small"
                                                        label="Proveedor *"
                                                        fullWidth
                                                        color="secondary"
                                                        id="user"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => openUser(true)}>
                                                                        <BsSearch />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        onClick={() => openUser(true)}
                                                    />
                                                </Col>
                                                <Col sm={6} className="mt-3">
                                                    <TextField
                                                        value={numeroEntrada}
                                                        size="small"
                                                        label="Numero de Entrada *"
                                                        fullWidth
                                                        color="secondary"
                                                        id="user"
                                                        onChange={(e) => setnumeroEntrada(e.target.value)}
                                                    />
                                                </Col>
                                                <Col sm={12} className="mt-3">
                                                    <Autocomplete
                                                        fullWidth
                                                        size="small"
                                                        disablePortal
                                                        id="forms"
                                                        options={listOffice}
                                                        onChange={(e, value: any) => { setOffice(value ? value.id : 0); }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                fullWidth
                                                                color="secondary"
                                                                label=".:Seleccione un Almacén:."
                                                                id="state"
                                                            />)}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="mt-5">
                                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                                <AccordionSummary
                                                    expandIcon={<BsFillCaretDownFill />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    onClick={() => console.log('Si se puede')}
                                                >
                                                    <Typography>REGISTRAR UN PRODUCTO</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography>
                                                        <div>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <TextField
                                                                        className="mt-3"
                                                                        value={productKind}
                                                                        size="small"
                                                                        fullWidth
                                                                        select
                                                                        color="secondary"
                                                                        label="Clase Producto *"
                                                                        id="state"
                                                                        onChange={(e) => { setProductKind(parseInt(e.target.value)); getProductoCatalogPorClaseTipo() }}
                                                                    >
                                                                        {listProductKind.map((item: IProductKind) => (
                                                                            <MenuItem key={item.IDClaseProducto} value={item.IDClaseProducto}>
                                                                                {item.Nombre}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <TextField
                                                                        className="mt-3"
                                                                        value={productType}
                                                                        size="small"
                                                                        fullWidth
                                                                        select
                                                                        color="secondary"
                                                                        label="Tipo Producto *"
                                                                        id="state"
                                                                        onChange={(e) => { setProductType(parseInt(e.target.value)); getProductoCatalogPorClaseTipo() }}
                                                                    >
                                                                        {listTypeProducts.map((item: ITypeProduct) => (
                                                                            <MenuItem key={item.IDTipoProducto} value={item.IDTipoProducto}>
                                                                                {item.Nombre}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </Col>
                                                                <Col sm={12} className="mt-3">
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
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <TextField
                                                                        value={codSAP}
                                                                        size="small"
                                                                        label="Cod. SAP *"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        id="user"
                                                                        onChange={(e) => setCodSAP(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <TextField
                                                                        value={serial}
                                                                        size="small"
                                                                        label="Serial *"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        id="user"
                                                                        onChange={(e) => setSerial(e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <TextField
                                                                        value={cantidad}
                                                                        type="number"
                                                                        inputProps={{ min: 0 }}
                                                                        size="small"
                                                                        label="Cantidad *"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        id="user"
                                                                        onChange={(e) => setCantidad(1)}
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <TextField
                                                                        value={valor}
                                                                        type="number"
                                                                        inputProps={{ min: 0 }}
                                                                        size="small"
                                                                        label="Valor Unitario *"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        id="user"
                                                                        onChange={(e) => setValor(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                        <DatePicker
                                                                            label="Fecha de Manifiesto: "
                                                                            value={dateMani}
                                                                            onChange={(e) => {
                                                                                setDateMani(e);
                                                                            }}
                                                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <TextField
                                                                        value={manifiesto}
                                                                        size="small"
                                                                        label="Manifiesto *"
                                                                        fullWidth
                                                                        color="secondary"
                                                                        id="user"
                                                                        onChange={(e) => setManifiesto(e.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={6} className="mt-3">
                                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                        <DatePicker
                                                                            label="Fecha de Lote: "
                                                                            value={dateLote}
                                                                            onChange={(e) => {
                                                                                setDateLote(e);
                                                                            }}
                                                                            renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </Col>
                                                            </Row>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <div className="d-flex justify-content-end">
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        endIcon={<BsArrowRight />}
                                                                        className="my-3 "
                                                                        color="secondary"
                                                                        onClick={() => { onNext() }}>
                                                                        Siguiente
                                                                    </Button>
                                                                </div>
                                                            </ThemeProvider>
                                                        </div>
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                                <AccordionSummary
                                                    expandIcon={<BsFillCaretDownFill />}
                                                    aria-controls="panel2a-content"
                                                    id="panel2a-header"
                                                >
                                                    <Typography>REGISTRAR LISTA DE PRODUCTOS</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography>
                                                        <div>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <div className="row justify-content-between">
                                                                    <Button type="submit" variant="contained" endIcon={<BsArrowRight />} className=" my-3 " color="secondary" onClick={() => { validarInicio() }}>
                                                                        CARGAR ARCHIVO
                                                                    </Button>
                                                                    <a href={Url}>
                                                                        <Button type="submit" variant="contained" endIcon={<BsCloudDownloadFill />} className="my-3" color="secondary" onClick={() => { descargarFormatoEntradaAlmacen() }}>
                                                                            Descargar formato
                                                                        </Button>
                                                                    </a>
                                                                </div>
                                                            </ThemeProvider>
                                                        </div>
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    </div>
                                    {setShowF && <SLoadDocument setShow={setShowF} type={1} show={show} title={'Cargar formato'} getMedia={getMedia} beanAction={null} accept={[".xlsx"]} />}
                                    {show2 &&
                                        <SSearchPerson
                                            getShow={openUser}
                                            getPerson={getItem}
                                            dataShow={show2}
                                        />
                                    }
                                    <Modal show={showLoad}   centered   size="lg" onHide={() => setShowLoad(false)}>
                                        <Modal.Header>
                                            Entrada de Almacén
                                            <BsXSquare className='pointer' onClick={() => setShowLoad(false)} />
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button type="submit" variant="contained" endIcon={<BsFillCloudUploadFill />} className=" mt-3" color="secondary" onClick={() => setShowF(true)}>
                                                    Cargar formato
                                                </Button>
                                                {beanDoc &&
                                                    <div>
                                                        <p className="my-2"> <a className="text-secondary " href={beanDoc?.URL} target="_blank">{beanDoc?.Name}</a> </p>
                                                        <Button type="submit" variant="contained" endIcon={<FiSend />} className=" my-3 " color="secondary" onClick={() => crearEntradaAlmacen()}>
                                                            Enviar
                                                        </Button>
                                                    </div>
                                                }
                                            </ThemeProvider>
                                            {conError && <div className="mt-3"><h3>Documento con Observaciones</h3>  <div className="mb-2"><p className="text-muted m-0"> *Haga clic en el enlace para ver el documento</p> <a className="text-secondary" href={_files.getUrlFile(respDoc?.DataBeanProperties.MediaContext, respDoc?.DataBeanProperties.Media)}>{respDoc?.DataBeanProperties.Media}</a> </div></div>}
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )
            case 1: return (
                <div>
                    <div className="d-flex justify-content-center mt-15">
                        <h1>REGISTRO DE ENTRADA DE ALMACEN REALIZADO CON ÉXITO</h1>
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
            )
        }
    };

    return (
        <div className="nWhite w-80 p-3 m-3">
            {renderSwitch()}
            {spinner && <SSpinner show={spinner} />}
        </div>
    )
}
