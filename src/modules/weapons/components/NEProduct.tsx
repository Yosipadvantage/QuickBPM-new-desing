import React, { useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, ThemeProvider, MenuItem, Autocomplete } from '@mui/material';
import { Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsXSquare } from 'react-icons/bs';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IProduct } from '../model/product';
import { ITypeProduct } from '../model/typeProduct';
import { IProductKind } from '../model/ProductKind';
import { SSpinner } from '../../../shared/components/SSpinner';
import { pipeSort } from '../../../utils/pipeSort';

interface INEProduct {
    show: boolean,
    setShow: Function,
    setShowCapacity: Function,
    data: IProduct | null,
    title: string,
    productKind: number | null,
    productType: number | null,
    refresh: Function
}

const _weaponService = new WeaponsService();

export const NEProduct: React.FC<INEProduct> = (props: INEProduct) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const [calibres, setCalibres] = useState<[]>([]);
    const [caliber, setCaliber] = useState(props.title === 'Editar' ? (props.data ? props.data.CALIBRE : null) : null);

    const getRenderCalibre = () => {
        let m = ''
        calibres?.map((item: any) => {
            if (item.id == caliber) {
                m = item.label
            }
        })
        console.log(m);

        return m;
    };

    const [productKind, setProductKind] = useState(props.title === 'Editar' ? (props.data ? props.data.IDCLASEPRODUCTO : null) : props.productKind);
    const [productType, setProductType] = useState(props.title === 'Editar' ? (props.data ? props.data.IDTIPOPRODUCTO : null) : props.productType);

    const [codSAP, setCodSAP] = useState(props.title === 'Editar' ? (props.data ? props.data.CODSAP : null) : null);
    const [codDCCA, setCodDCCA] = useState(props.title === 'Editar' ? (props.data ? props.data.CODDCCAE : null) : null);

    const [caliberName, setCaliberName] = useState('');
    const [use, setUse] = useState(props.title === 'Editar' ? (props.data ? props.data.USO : null) : null);
    const [brand, setBrand] = useState(props.title === 'Editar' ? (props.data ? props.data.NOMBRE : null) : null);
    const [refModel, setRefModel] = useState(props.title === 'Editar' ? (props.data ? props.data.REFMODEL : null) : null);
    const [descripcion, setDescripcion] = useState(props.title === 'Editar' ? (props.data ? props.data.DESCRIPCION : null) : null);
    const [tiposUso, setTiposUso] = useState<[]>([]);

    const [loteR, setLoteR] = useState(props.data !== null ? (props.data.REQUIERELOTE === 1) : false);
    const [serialR, setSerialR] = useState(props.data !== null ? (props.data.REQUIERESERIAL === 1) : false);
    const [spinner, setSpinner] = useState(false);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [listProductKind, setListProductKind] = useState<IProductKind[]>([]);


    useEffect(() => {
        getList([6, 3]);
        getAllTypes();
        getProductKindCatalog();
        console.log(props.data);
        if (props.title === 'Editar' && props.data) {
            setValue('entity', props.data);
            setCaliberName(getRenderCalibre())
            clearErrors();
        }
    }, [])

    const getList = (lista: number[]) => {
        let aux: any = [];
        let auxSorted: any = [];
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue[0]) {
                if (resp.DataBeanProperties.ObjectValue[0].Lista.length > 0) {
                    resp.DataBeanProperties.ObjectValue[0].Lista.map((item: any) =>
                        aux.push({
                            label: item.Valor,
                            id: item.Codigo
                        }))
                    auxSorted = pipeSort([...aux], 'label');
                    setCalibres(auxSorted);
                } else {
                    setCalibres([]);
                }
                setTiposUso(resp.DataBeanProperties.ObjectValue[1].Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

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

    const updateProducto = (bean: IProduct) => {
        _weaponService.updateProducto(bean).subscribe((res) => {
            console.log(res);
            if (res) {
                props.setShow(false);
                if (props.title === 'Editar') {
                    props.refresh(props.productKind, props.productType);
                } else {
                    props.refresh(productKind, productType);
                }
                clearErrors("entity");
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
        if (type === 1) {
            setSerialR(e.target.checked);
        }
        else if (type === 2) {
            setLoteR(e.target.checked);
        }
    };

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        /* if (
            (codSAP !== null && codSAP !== '') ||
            (codDCCA !== null && codDCCA !== '') ||
            (brand !== null && brand !== '') ||
            (brand !== null && brand !== '') ||
            ) {

        } */
        let aux: IProduct = data.entity;
        aux.IDProducto = aux.IDPRODUCTO;
        aux.CodDCCAE = codDCCA ? codDCCA : '';
        aux.CodSAP = codSAP ? codSAP : '';
        aux.Descripcion = descripcion ? descripcion : '';
        aux.IDClaseProducto = productKind !== null ? productKind : -1;
        aux.IDTipoProducto = productType !== null ? productType : -1;
        aux.Nombre = brand ? brand : '';
        aux.refModel = refModel ? refModel : '';
        aux.Uso = use ? use : 0;
        aux.Calibre = caliber ? caliber : '0';
        aux.REQUIERESERIAL = serialR ? 1 : 0;
        aux.REQUIERELOTE = loteR ? 1 : 0;
        aux.RequiereSerial = serialR;
        aux.RequiereLote = loteR;
        console.log(productKind);
        console.log(aux);

        updateProducto(aux);
    };

    return (
        <>
            <Modal show={props.show}   centered   size="lg" onHide={() => props.setShow(false)}>
                <Modal.Header>
                    {props.title} Producto
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <b className="ml-3">Campo obligatorio *</b>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={codSAP}
                                    size="small"
                                    type="number"
                                    id="SAP"
                                    label="Cod.SAP *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.CodSAP")}
                                    onChange={(e) => { setCodSAP(e.target.value) }}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.CodSAP?.type === "required" &&
                                        "El campo Cod.SAP es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={codDCCA}
                                    size="small"
                                    type="number"
                                    id="DDCAE"
                                    label="Cod.DDCAE *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.CodDCCAE")}
                                    onChange={(e) => { setCodDCCA(e.target.value) }}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.CodDCCAE?.type === "required" &&
                                        "El campo Cod.DDCAE es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={productKind}
                                    size="small"
                                    fullWidth
                                    select
                                    color="secondary"
                                    label="Clase Producto *"
                                    id="state"
                                    {...register("entity.IDClaseProducto")}
                                    onChange={(e) => { setProductKind(parseInt(e.target.value)) }}
                                >
                                    {listProductKind.map((item: IProductKind) => (
                                        <MenuItem key={item.IDClaseProducto} value={item.IDClaseProducto}>
                                            {item.Nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDClaseProducto?.type === "required" &&
                                        "El campo Clase Producto es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={productType}
                                    size="small"
                                    fullWidth
                                    select
                                    color="secondary"
                                    label="Tipo Producto *"
                                    id="state"
                                    {...register("entity.IDTipoProducto")}
                                    onChange={(e) => { setProductType(parseInt(e.target.value)); console.log(parseInt(e.target.value)); }}
                                >
                                    {listTypeProducts.map((item: ITypeProduct) => (
                                        <MenuItem key={item.IDTipoProducto} value={item.IDTipoProducto}>
                                            {item.Nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.IDTipoProducto?.type === "required" &&
                                        "El campo Tipo Producto es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <TextField
                                    value={brand}
                                    size="small"
                                    id="Name"
                                    label="Marca *"
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    {...register("entity.Nombre")}
                                    onChange={(e) => { setBrand(e.target.value) }}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Nombre?.type === "required" &&
                                        "El campo Marca es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3 mb-3">
                                <TextField
                                    value={refModel}
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    label="Modelo *"
                                    id="state"
                                    {...register("entity.RefModel")}
                                    onChange={(e) => { setRefModel(e.target.value) }}
                                >
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.RefModel?.type === "required" &&
                                        "El campo Modelo es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <Autocomplete
                                    onChange={(e, value: any) => { setCaliber(value ? value.id : 0); }}
                                    fullWidth
                                    size="small"
                                    disablePortal
                                    defaultValue={caliberName}
                                    id="calibers"
                                    options={calibres}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Calibre *"
                                            id="calibers"
                                        />)}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Calibre?.type === "required" &&
                                        "El campo Calibre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="mt-3">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        disabled={props.title === 'Crear'}
                                        className="w-100"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { props.setShowCapacity(true); }}
                                    >
                                        VER/ASIGNAR CAPACIDADES
                                    </Button>
                                </ThemeProvider>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={use}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Tipo de uso *"
                                    id="state"
                                    {...register("entity.Uso")}
                                    onChange={(e) => setUse(parseInt(e.target.value))}
                                >
                                    {tiposUso.map((item: any) => (
                                        <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                    ))}
                                </TextField>
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Uso?.type === "required" &&
                                        "El campo Tipo de uso es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={descripcion}
                                    size="small"
                                    color="secondary"
                                    id="Descripcion"
                                    label="Descripción *"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    {...register("entity.Descripcion")}
                                    onChange={(e) => { setDescripcion(e.target.value) }}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Descripcion?.type === "required" &&
                                        "El campo Descripcion es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={6} className="d-flex justify-content-center mt-3">
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={serialR} onChange={(e) => handleChange(e, 1)} />
                                        </ThemeProvider>
                                    } label="¿Requiere Serial?" />
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="d-flex justify-content-center mt-3">
                                <FormGroup>
                                    <FormControlLabel control={
                                        <ThemeProvider theme={inputsTheme}>
                                            <Checkbox color="secondary" defaultChecked={loteR} onChange={(e) => handleChange(e, 2)} />
                                        </ThemeProvider>
                                    } label="¿Requiere Lote?" />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <ThemeProvider theme={inputsTheme}>
                            <Button variant="contained" color="error" onClick={() => props.setShow(false)}>
                                CANCELAR
                            </Button>
                            <Button type="submit" variant="contained" color="success" className="ml-3">
                                GUARDAR
                            </Button>
                        </ThemeProvider>
                    </Modal.Footer>
                </form>
            </Modal>
            <SSpinner show={spinner} />
        </>
    )
}
