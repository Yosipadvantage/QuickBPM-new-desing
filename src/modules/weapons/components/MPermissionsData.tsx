import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, Button, IconButton, MenuItem, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsGearFill, BsPencilFill, BsSave2Fill, BsUpload, BsXSquare } from 'react-icons/bs';
import { TreeService } from '../../../core/services/TreeService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { env } from '../../../env';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IDataPermission } from '../model/DataPermission';
import { ModalSettings } from './ModalSettings';
import { PDFCode } from './PDFCode';


interface IMPermissionsData {
    show: boolean,
    setShow: Function,
    data: any,
    idPermiso: number | null,
    refresh: Function
}

const PORTE: number = 1;
const TENENCIA: number = 2;
const ESPECIAL: number = 3;
const OTRO = 6;

const _weaponService = new WeaponsService();
const _treeService = new TreeService();

export const MPermissionsData: React.FC<IMPermissionsData> = (props: IMPermissionsData) => {

    const [spinner, setSpinner] = useState(false);
    const [showLoad, setShowLoad] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [tiposArmas, setTiposArmas] = useState<[]>([]);
    /* const [calibres, setCalibres] = useState<[]>([]);
    const [capacidades, setCapacidades] = useState<[]>([]); */
    const [dptos, setDptos] = useState<any>([]);
    const [mpios, setMpios] = useState<any>([]);
    const [type, setType] = useState(1);
    const [name, setName] = useState(props.data.Nombre);
    const [codeA, setCodeA] = useState<string>(props.data.CodeA);
    const [codeB, setCodeB] = useState<string>(props.data.CodeB);
    const [nombreTipo, setNombreTipo] = useState<string>(props.data.NombreTipo);

    const [user, setUser] = useState(0);
    const [cc, setCc] = useState(props.data.Identificacion);
    const [names, setNames] = useState(props.data.Nombres);
    const [surNames, setSurNames] = useState(props.data.Apellidos);
    const [brand, setBrand] = useState(props.data.Marca);
    const [weaponKind, setWeaponKind] = useState<number | null>(props.data.TipoArma);
    const [otro, setOtro] = useState<string>(props.data.ClaseArma);
    const [caliber, setCaliber] = useState<string | null>(props.data.Calibre);
    const [capacity, setCapacity] = useState<number | null>(props.data.Capacidad);
    const [serie, setSerie] = useState(props.data.Serie);
    const [dpto, setDpto] = useState(props.data.Dpto);
    const [mpio, setMpio] = useState(props.data.Mpio);
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [media, setMedia] = useState(props.data.Media);
    const [context, setContex] = useState(props.data.Contex);
    const [dataPermission, setDataPermission] = useState<IDataPermission>({ Names: '', Surnames: '', Vence: '', CodeA: '', CodeB: '', TipoPermiso: 0, NombreTipo: '', Estado: '', DocType: 0 });
    const [qr, setQr] = useState('');
    const [foto, setFoto] = useState('');
    const [render, setRender] = useState(0);

    const [codeY, setCodeY] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontY, setFrontY] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [codeX, setCodeX] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontX, setFrontX] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [height, setHeight] = useState(0); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [show, setShow] = useState(false);

    const getCode = (list: [], value: string) => {
        let code: number = -1;
        list.map((item: any) => {
            if (item.Valor.toUpperCase() === value.toUpperCase()) {
                code = item.Codigo
            }
        })
        console.log(value, code);
        return code;
    };

    useEffect(() => {
        console.log(props.data);
        if (props.data.TipoPermiso == TENENCIA) { //TENENCIA
            getSiteIDChilds(0);
        }
        if (localStorage.getItem('usuario') !== null) {
            let user: User = JSON.parse(localStorage.getItem('usuario') ?? "");
            setUser(user.IDAccount);
        }
        getList([4]);
        if (props.data.TipoArma === OTRO) {
            setWeaponKind(OTRO);
        }
        let date: string[] = props.data.FechaVencimiento.split('-');
        setDateInit(new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2])));
    }, [])

    const getList = (lista: number[]) => {
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            if (resp.DataBeanProperties.ObjectValue) {
                setTiposArmas(resp.DataBeanProperties.ObjectValue[0].Lista);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
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

    const format = (date: Date | null) => {
        let dateFormated: string = "";
        if (date !== null) {
            dateFormated = date.getFullYear() + "-" + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getDate();
        }
        return dateFormated;
    };

    const iterator = (list: any[], cod: number | null) => {
        let rps = '';
        list.map((item: any) => {
            if (parseInt(item.Codigo) == cod) {
                rps = rps + item.Valor;
            }
        })
        return rps
    };

    const generateCryptoCode = () => {
        setSpinner(true);
        let data: any = {
            IDPermiso: props.idPermiso ? props.idPermiso : 0,
            Names: names,
            Surnames: surNames,
            ClaseArma: weaponKind == OTRO ? otro.toUpperCase() : iterator(tiposArmas, weaponKind).toUpperCase(),
            TipoArma: weaponKind,
            Marca: brand,
            Serie: serie,
            Calibre: caliber,
            Capacidad: capacity,
            Vence: format(dateInit),
            CodeA: codeA,
            CodeB: codeB,
            TipoPermiso: props.data.TipoPermiso,
            NombreTipo: props.data.NombreTipo,
            Estado: props.data.Estado
        }
        setDataPermission(data);
        _weaponService
            .generateCryptoCode(context, media, data.Names, data.Surnames, parseInt(cc), data, data.Vence, type, user)
            .subscribe(rps => {
                setSpinner(false);
                console.log(rps);
                if (rps.DataBeanProperties.ObjectValue.Permiso) {
                    let datosPermiso = JSON.parse(rps.DataBeanProperties.ObjectValue.datosPermiso);
                    setQr(`data:image/png;base64,${datosPermiso.QrCode64}`);
                    setFoto(`data:image/jpg;base64,${datosPermiso.Photo64}`);
                    setRender(1);
                    let msg: string = rps.DataBeanProperties.ObjectValue.MSG;
                    if (msg.includes('no pudo generar')) {
                        Toast.fire({
                            icon: "error",
                            title: msg,
                        });
                    } else {
                        updatePermission(dataPermission)
                        Toast.fire({
                            icon: "success",
                            title: msg,
                        });
                    }
                    props.refresh();
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    };

    const updatePermission = (bean: any) => {
        _weaponService.updatePermission(bean).subscribe((res) => {
            if (res) {
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

    const onSave = () => {
        if (weaponKind == OTRO && otro === '') {
            Toast.fire({
                icon: 'warning',
                title: 'Debe introducir el Tipo de Arma'
            })
        } else {
            if (
                cc === '' ||
                surNames === '' ||
                names === '' ||
                weaponKind === null ||
                serie === '' ||
                caliber === null ||
                brand === '' ||
                capacity === null ||
                dateInit === null ||
                codeA === '' ||
                codeB === ''
            ) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Debe llenar todos los campos'
                });
            }
            else {
                if (type !== 0) {
                    setEdit(!edit);
                    setRender(0);
                    /* setName(surNames + " " + names); */
                    let dataPermission: IDataPermission = {
                        IDPermiso: props.idPermiso ? props.idPermiso : 0,
                        Names: names,
                        Surnames: surNames,
                        ClaseArma: weaponKind === OTRO ? otro : iterator(tiposArmas, weaponKind).toUpperCase(),
                        TipoArma: weaponKind,
                        Marca: brand,
                        Serie: serie,
                        Calibre: (caliber + ''),
                        Capacidad: (capacity + ''),
                        Vence: format(dateInit),
                        CodeA: codeA,
                        CodeB: codeB,
                        DocType: props.data.DocType,
                        TipoPermiso: props.data.TipoPermiso,
                        NombreTipo: props.data.NombreTipo,
                        Estado: props.data.Estado
                    }
                    setDataPermission(dataPermission);
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Seleccione una clase de código'
                    });
                }
            }
        }
    };

    const getMedia = (doc: any) => {
        setMedia(doc.Media);
        setContex(doc.MediaContext);
    };

    return (
        <>
            <Modal show={props.show}   centered   size="xl" onHide={() => props.setShow(false)}>
                <Modal.Header>
                    Datos del Permiso
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <span className="font-weight-bold my-3">FOTO DEL PERMISO</span>
                                <div className="hover-box">
                                    <img className={(edit) ? "rounded-circle-bordered hover-image" : "rounded-circle-bordered"}
                                        src={env.REACT_APP_ENDPOINT + `/filedownload?ContextMedia@=${context}@@Media@=${media}`}
                                        width="120" alt="Profile Img" />
                                    {edit &&
                                        <div className="hover-middle">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button variant="contained" color="secondary"
                                                    onClick={() => setShowLoad(true)}
                                                >
                                                    <BsUpload className="ml-2 mr-2" />
                                                    ACTUALIZAR
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    }
                                </div>
                                <span className="font-weight-bold my-3">{cc}</span>
                                <span className="font-weight-bold">{surNames + ' ' + names}</span>
                                {(render === 0 && !edit) &&
                                    <div className="mt-5 d-flex flex-column">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Tooltip title="Genera un documento con los datos del permiso">
                                                <Button disabled={true} variant="contained" color="secondary" className="white-link"
                                                    onClick={() => generateCryptoCode()}
                                                >
                                                    GENERAR PERMISO
                                                </Button>
                                            </Tooltip>
                                        </ThemeProvider>
                                    </div>
                                }
                                {(render === 1 && !edit) &&
                                    <div className="mt-10 d-flex flex-column">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary">
                                                <PDFCode
                                                    src={qr}
                                                    title={cc}
                                                    data={dataPermission}
                                                    photo={foto}
                                                    frontY={frontY}
                                                    frontX={frontX}
                                                    codeY={codeY}
                                                    codeX={codeX}
                                                    height={height}
                                                    label="RE-IMPRIMIR PERMISO"
                                                    type={props.data.TipoPermiso}
                                                />
                                            </Button>
                                        </ThemeProvider>
                                        <div className="mt-3">
                                            <Tooltip title="Ajustar medidas">
                                                <IconButton onClick={() => setShow(true)}>
                                                    <BsGearFill />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Información del Permiso ({nombreTipo})</h4>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button disabled={true} variant="contained" color={edit ? "success" : "secondary"}
                                            onClick={() => { (edit) ? onSave() : setEdit(!edit) }}
                                        >
                                            {edit ? <BsSave2Fill className="mr-3" /> : <BsPencilFill className="mr-3" />}
                                            {edit ? 'GUARDAR' : 'EDITAR'}
                                        </Button>
                                    </ThemeProvider>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <TextField
                                            disabled={!edit}
                                            value={cc}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="No. Identificación"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setCc(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                {edit &&
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <TextField
                                                disabled={!edit}
                                                value={surNames}
                                                size="small"
                                                color="secondary"
                                                id="Name1"
                                                label="Apellidos *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setSurNames(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                disabled={!edit}
                                                value={names}
                                                size="small"
                                                color="secondary"
                                                id="Name1"
                                                label="Nombres *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setNames(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>}
                                {!edit &&
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <TextField
                                                disabled={!edit}
                                                value={(surNames !== undefined) || (surNames !== undefined) ? surNames + ' ' + names : name}
                                                size="small"
                                                color="secondary"
                                                id="Name1"
                                                label="Nombre Completo *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setSurNames(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>
                                }
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={weaponKind}
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Clase de Arma"
                                            id="state"
                                            onChange={(e) => setWeaponKind(parseInt(e.target.value))}
                                        >
                                            {tiposArmas.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={brand}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="Marca *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setBrand(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                                {weaponKind == OTRO &&
                                    <div className="row mt-3">
                                        <Col sm={12} className="">
                                            <TextField
                                                value={otro}
                                                disabled={!edit}
                                                size="small"
                                                color="secondary"
                                                id="name1"
                                                label="Escriba el otro tipo de arma *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => { setOtro(e.target.value.toUpperCase()) }}
                                            />
                                        </Col>
                                    </div>
                                }
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={serie}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="No. Serie *"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setSerie(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={caliber}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Calibre *"
                                            id="state"
                                            onChange={(e) => setCaliber(e.target.value.toUpperCase())}
                                        >
                                            {/* {calibres.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))} */}
                                        </TextField>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={capacity}
                                            type="number"
                                            size="small"
                                            /* select */
                                            fullWidth
                                            color="secondary"
                                            label="Capacidad de carga *"
                                            id="state"
                                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                                        >
                                            {/* {capacidades.map((item: any) => (
                                                <MenuItem key={item.Codigo} value={item.Codigo}>{item.Valor}</MenuItem>
                                            ))} */}
                                        </TextField>
                                    </div>
                                    <div className="col-md-6">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                disablePast
                                                disabled={!edit}
                                                label="Fecha de vencimiento: "
                                                value={dateInit}
                                                onChange={(e) => {
                                                    setDateInit(e)
                                                }}
                                                renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                {props.data.TipoPermiso == TENENCIA && //TENENCIA
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            {!edit &&
                                                <TextField
                                                    disabled={!edit}
                                                    value={dpto}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Departamento *"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={(e) => setDpto(e.target.value.toUpperCase())}
                                                />
                                            }
                                            {edit &&
                                                <Autocomplete
                                                    onChange={(e: any, value: any) => { setDpto(value ? value.label.toUpperCase() : ''); getSiteIDChilds(parseInt(value.id)) }}
                                                    fullWidth
                                                    size="small"
                                                    disablePortal
                                                    id="departamentos"
                                                    defaultValue={dpto}
                                                    /* getOptionLabel={(option) => option.label} */
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
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            {!edit &&
                                                <TextField
                                                    disabled={!edit}
                                                    value={mpio}
                                                    size="small"
                                                    color="secondary"
                                                    id="Name1"
                                                    label="Municipio o Ciudad *"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={(e) => setMpio(e.target.value.toUpperCase())}
                                                />
                                            }
                                            {edit &&
                                                <Autocomplete
                                                    onChange={(e: any, value: any) => { setMpio(value ? value.label.toUpperCase() : ''); }}
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
                                            }
                                        </div>
                                    </div>
                                }
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={codeA}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Codigó A *"
                                            id="state"
                                            onChange={(e) => setCodeA(e.target.value)}
                                        >
                                        </TextField>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={!edit}
                                            value={codeB}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Codigó B *"
                                            id="state"
                                            onChange={(e) => setCodeB(e.target.value)}
                                        >
                                        </TextField>
                                    </div>
                                </div>
                                <div className=" row mt-5 text-right">
                                    <div className="col-md-8">
                                        <TextField
                                            disabled={!edit}
                                            value={type}
                                            margin="normal"
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Clase de Código"
                                            id="state"
                                            onChange={(e) => setType(parseInt(e.target.value))}
                                        >
                                            <MenuItem value={1}>
                                                CRYPTO-CODE
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                PDF_417
                                            </MenuItem>
                                        </TextField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <SSpinner show={spinner} />
            <SLoadDocument show={showLoad} setShow={setShowLoad} title={"Cargar Imagen"} type={1} getMedia={getMedia} />
            <ModalSettings
                show={show}
                setShow={setShow}
                frontY={frontY}
                setFrontY={setFrontY}
                frontX={frontX}
                setFrontX={setFrontX}
                codeX={codeX}
                setCodeX={setCodeX}
                codeY={codeY}
                setCodeY={setCodeY}
                height={height}
                setHeight={setHeight}
            />
        </>
    )
}
