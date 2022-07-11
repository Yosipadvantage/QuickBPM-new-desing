import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, Button, IconButton, InputAdornment, MenuItem, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { BsArrowLeftShort, BsFillArrowLeftSquareFill, BsGearFill, BsSearch, BsUpload } from 'react-icons/bs';
import { FileService } from '../../../core/services/FileService';
import { GlobalService } from '../../../core/services/GlobalService';
import { TreeService } from '../../../core/services/TreeService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { env } from '../../../env';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { formatDate } from '../../../utils/formatDate';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme } from '../../../utils/Themes';
import { Toast, ToastCenter } from '../../../utils/Toastify';
import { IPersonPhotoData } from '../../citizenData/model/PersonPhotoData';
import { IBandejaImpresion } from '../../trays/model/bandejaImpresion-interface';
import { ModalSettings } from '../components/ModalSettings';

import { PDFCode } from '../components/PDFCode';
import { IDataPermission } from '../model/DataPermission';
import { ITypeProduct } from '../model/typeProduct';
import { getSession } from '../../../utils/UseProps';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
interface ISSpecialPermission {
    proCD: boolean,
    person: any,
    dataArma: any,
    type: number,
    itemBandeja: IBandejaImpresion | undefined
}

const PORTE: number = 1;
const TENENCIA: number = 2;
const ESPECIAL: number = 3;

const OTRO: number = 6;
const FACE: number = 6;
const DISPONIBLE: number = 4;

const _weaponService = new WeaponsService();
const _treeService = new TreeService();
const _globalService = new GlobalService();
const _fileService = new FileService();

export const SSpecialPermission: React.FC<ISSpecialPermission> = (props: ISSpecialPermission) => {

    const [calibres, setCalibres] = useState<any>();

    const getRenderTipo = (cod: number) => {
        let m = ''
        listTypeProducts.map((item: ITypeProduct) => {
            if (item.IDTipoProducto === cod) {
                m = item.Nombre
            }
        })
        return m;
    };

    const getRenderCalibre = (cod: number) => {
        let m = ''
        calibres?.Lista.map((item: any) => {
            if (item.Codigo == (cod + '')) {
                m = item.Valor
            }
        })
        return m;
    };

    const [permissionType, setPermissionType] = useState(props.proCD ? props.type : 0);
    const [docType, setDocType] = useState(0);
    const [photo, setPhoto] = useState('img_avatar.png');
    const [cc, setCc] = useState(props.proCD ? (props.person.Nit + '') : '');
    const [names, setNames] = useState(props.proCD ? ((props.person.Name1 ? props.person.Name1 : '') + ' ' + (props.person.Name2 ? props.person.Name2 : '')) : '');
    const [surNames, setSurNames] = useState(props.proCD ? ((props.person.Surname1 ? props.person.Surname1 : '') + ' ' + (props.person.Surname2 ? props.person.Surname2 : '')) : '');
    const [brand, setBrand] = useState('');
    const [weaponKind, setWeaponKind] = useState<number | null>(props.proCD ? props.dataArma.IDTipo : null);
    const [otro, setOtro] = useState<string>(props.proCD ? props.dataArma.NombreTipo : '');
    const [caliber, setCaliber] = useState<string | null>(props.proCD ? props.dataArma.Calibre : null);
    const [capacity, setCapacity] = useState<number | null>(props.proCD ? props.dataArma.Capacidad : null);
    const [serie, setSerie] = useState(props.proCD ? props.dataArma.Serial : '');
    const [code, setCode] = useState<string>('');
    const [codeP, setCodeP] = useState<string>('');
    const [codeS, setCodeS] = useState<string>('');
    const [state, setState] = useState<string>('IMPRESO');

    const [dpto, setDpto] = useState('');
    const [mpio, setMpio] = useState('');
    const [ubi, setUbi] = useState('');
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [showLoad, setShowLoad] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(false);
    const [media, setMedia] = useState('');
    const [contex, setContex] = useState('');
    const [user, setUser] = useState(0);
    const [type, setType] = useState(0);
    const [render, setRender] = useState(props.proCD ? 0 : 3);
    const [qr, setQr] = useState('');
    const [foto, setFoto] = useState('');
    const [fechaGen, setFechaGen] = useState('');
    const [hashVal, setHasVal] = useState('');
    const [dataPermission, setDataPermission] = useState<IDataPermission>({ Names: '', Surnames: '', Vence: '', CodeA: '', CodeB: '', TipoPermiso: 0, NombreTipo: '', Estado: '', DocType: 0 });
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [dptos, setDptos] = useState<any>([]);
    const [mpios, setMpios] = useState<any>([]);
    const [tiposArma, setListaTiposArma] = useState<any>(); // TIPO DE ARMA O CLASE DE ARMA

    const [capacidades, setCapacidades] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const [codeY, setCodeY] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontY, setFrontPosition] = useState('1'); // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [height, setHeight] = useState(1);  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [frontX, setFrontX] = useState('1');  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA
    const [codeX, setCodeX] = useState('1');  // TODO: INICIALIZAR EL VALOR CON LA VARIABLE DE SISTEMA

    const [idHojaPermiso, setIdHojaPermiso] = useState<number>(0);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        console.log(props.itemBandeja);
        getList([6]);
        calcExpirationDate(new Date());
        getList2([4]);
        if (props.proCD) {
            if (props.dataArma.DocType == 2) {
                //Foto del representante
                getPersonPhotoDataByAccount(props.person.idAccount);
            } else {
                getPersonPhotoDataByAccount(props.person.idAccount);
            }
            if (props.dataArma.Fire === true) {
                console.log(props.dataArma);
                /* console.log(props.dataArma);
                setCaliber(getRenderCalibre(props.dataArma.Calibre));
                setTipoArma(getRenderTipo(parseInt(props.dataArma.CodigoTipoArma))) */
                getAllTypes();
                getCapCargaCatalog(props.dataArma.IDProducto);
                setBrand(props.dataArma.Descripcion);
                setWeaponKind(props.dataArma.IDTipo);
                setOtro(props.dataArma.NombreTipo);
                setCaliber(props.dataArma.Calibre);
                setCapacity(props.dataArma.Capacidad);
                setSerie(props.dataArma.Serial);
            }
        }
        if (localStorage.getItem('usuario') !== null) {
            let user: User = JSON.parse(localStorage.getItem('usuario') ?? "");
            setUser(user.IDAccount);
        }
    }, [props.proCD, props.dataArma, props.itemBandeja]);

    useEffect(() => {
        calcExpirationDate(new Date())
    }, [permissionType]);

    useEffect(() => {
        if (permissionType === TENENCIA) {
            getSiteIDChilds(0);
        }
    }, [permissionType]);

    const getPersonPhotoDataByAccount = (idAccount: number) => {
        setSpinner(true);
        let aux: any[] = [];
        _globalService
            .getPersonPhotoDataCatalog(idAccount)
            .subscribe(resp => {
                setSpinner(false);
                if (resp.length > 0) {
                    resp.map((data: IPersonPhotoData) => {
                        if (data.SideType === FACE) {
                            aux[data.ViewType] = data;
                        }
                    })
                    console.log(aux[0])
                    setPhoto(_fileService.getUrlFile(aux[0].Context, aux[0].Filename));
                    setContex(aux[0].Context);
                    setMedia(aux[0].Filename);
                } else {
                    setPhoto('no_biophoto.png');
                }
            })
    };

    const getList = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setCalibres(resp.DataBeanProperties.ObjectValue[0]);
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
            setSpinner(false);
            if (resp) {
                setListTypeProducts(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const calcExpirationDate = (today: Date) => {
        //calcular fecha de expiracion
        let day = (today.getDate() < 10 ? parseInt('0' + today.getDate()) : today.getDate());
        let month = (today.getMonth() < 10 ? parseInt('0' + today.getMonth()) : today.getMonth());
        let year = today.getFullYear();
        if (permissionType === PORTE) {
            setDateInit(new Date((year + 3), (month), day));
        } else if (permissionType === TENENCIA) {
            setDateInit(new Date((year + 10), (month), day));
        } else {
            setDateInit(new Date(year, 11, 31));
        }
    };

    const getCapCargaCatalog = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getgetCapCargaCatalogPorIDProducto(idProducto).subscribe((resp) => {
            setSpinner(false);
            if (resp) {
                console.log(resp);
                setCapacidades(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getList2 = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                console.log(resp.DataBeanProperties.ObjectValue[0]);
                setListaTiposArma(resp.DataBeanProperties.ObjectValue[0]);
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


    const buscarPermiso = (e: any) => {
        e.preventDefault();
        setSpinner(true);
        _weaponService.getHojaPermisoCatalogPorPropiedades
            (
                {
                    'CodigoPermiso': code,
                    'Estado': 4
                }
            )
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                    if (resp.DataBeanProperties.ObjectValue.length > 0) {
                        setIdHojaPermiso(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.IDHojaPermiso);
                        setCodeP(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.CodigoPermiso);
                        setCodeS(resp.DataBeanProperties.ObjectValue[0].DataBeanProperties.CodigoSeguridad);
                        Toast.fire({
                            icon: 'success',
                            title: 'Se encontraron coincidencias'
                        })
                    } else {
                        setCodeP('');
                        setCodeS('');
                        Toast.fire({
                            icon: 'warning',
                            title: 'No se encontraron coincidencias'
                        })
                    }
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'EN DESARROLLO...'
                    })
                }
            })
    };

    const getMedia = (doc: any) => {
        setMedia(doc.Media);
        setPhoto(doc.Media);
        setContex(doc.MediaContext);
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

    const getNombreTipo = () => {
        if (permissionType === PORTE) {
            return 'PORTE';
        } else if (permissionType === TENENCIA) {
            return 'TENENCIA'
        } else {
            return 'ESPECIAL'
        }
    };

    const generateCryptoCode = (data: any) => {
        setSpinner(true);
        _weaponService
            .generateCryptoCode(contex, media, data.Names, data.Surnames, parseInt(cc), data, data.Vence, type, user)
            .subscribe(rps => {
                setSpinner(false);
                if (rps.DataBeanProperties.ObjectValue) {
                    if (rps.DataBeanProperties.ObjectValue.datosPermiso) {
                        let msg: string = rps.DataBeanProperties.ObjectValue.MSG;
                        if (msg.includes('no pudo generar')) {
                            ToastCenter.fire({
                                icon: "error",
                                title: msg,
                            });
                        } else {
                            let datosPermiso = JSON.parse(rps.DataBeanProperties.ObjectValue.datosPermiso);
                            setQr(`data:image/png;base64,${datosPermiso.QrCode64}`);
                            setFoto(`data:image/jpg;base64,${datosPermiso.Photo64}`);
                            setFechaGen(rps.DataBeanProperties.ObjectValue.Permiso.DataBeanProperties.Since);
                            setHasVal(rps.DataBeanProperties.ObjectValue.Permiso.DataBeanProperties.Hashval);
                            setState('IMPRESO');
                            if (!props.proCD) {
                                setRender(4);
                            }
                            else {
                                Toast.fire({
                                    icon: "success",
                                    title: msg,
                                });
                                asginarPermiso();
                            }
                        }
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "No se ha podido completar la acción",
                        });
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "ERROR INTERNO DEL SERVIDOR",
                    });
                }
            })
    };

    const generateDataPermission = () => {
        let data: IDataPermission = {
            Names: names,
            Surnames: surNames,
            ClaseArma: props.dataArma ? (props.dataArma.Fire ? getRenderTipo(parseInt(props.dataArma.CodigoTipoArma)).toUpperCase() : (weaponKind === OTRO ? otro.toUpperCase() : iterator(tiposArma.Lista, weaponKind).toUpperCase())) : (weaponKind === OTRO ? otro.toUpperCase() : iterator(tiposArma.Lista, weaponKind).toUpperCase()),
            TipoArma: weaponKind,
            Marca: brand,
            Serie: serie,
            Calibre: props.dataArma ? (props.dataArma.Fire && getRenderCalibre(parseInt(caliber ? caliber : '0'))) : caliber,
            Capacidad: (capacity + ''),
            Vence: formatDate(dateInit).split(' ')[0],
            Dpto: dpto,
            Mpio: mpio,
            Ubicacion: ubi,
            CodeA: codeP,
            CodeB: codeS,
            TipoPermiso: permissionType,
            NombreTipo: getNombreTipo(),
            Estado: state,
            TipoUso: props.dataArma ? props.dataArma.Uso : '',
            DocType: props.dataArma ? props.dataArma.DocType : 1,
            Fire: props.dataArma ? props.dataArma.Fire : false,
            IDItem: props.dataArma ? props.dataArma.IDItem : null,
            FechDocumento: props.dataArma ? props.dataArma.fechaDocumento : null
        };
        setDataPermission(data);
        setRender(1); //VISTA PREVIA
    }

    const onNext = () => {
        if (weaponKind === OTRO && otro === '') {
            Toast.fire({
                icon: 'warning',
                title: 'Debe introducir el Tipo de Arma'
            })
        } else {
            if (permissionType === TENENCIA) {
                if (
                    dpto === '' ||
                    mpio === '' ||
                    ubi === ''
                ) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Debe llenar todos los campos!'
                    });
                } else {
                    if (
                        cc === '' ||
                        names === '' ||
                        weaponKind === null ||
                        serie === '' ||
                        caliber === null ||
                        brand === '' ||
                        capacity === null ||
                        dateInit === null ||
                        codeP === '' ||
                        codeS === ''
                    ) {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Debe llenar todos los campos!'
                        });
                    }
                    else {
                        if (photo !== 'img_avatar.png') {
                            if (type !== 0) {
                                /* generateCryptoCode(); */
                                generateDataPermission();
                            } else {
                                Toast.fire({
                                    icon: 'warning',
                                    title: 'Seleccione una clase de código'
                                });
                            }
                        }
                        else {
                            Toast.fire({
                                icon: 'warning',
                                title: 'Debe cargar una FOTO'
                            });
                        }
                    }
                }
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
                    codeP === '' ||
                    codeS === ''
                ) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Debe llenar todos los campossssss'
                    });
                }
                else {
                    if (photo !== 'img_avatar.png') {
                        if (photo === 'no_biophoto.png') {
                            ToastCenter.fire({
                                icon: 'warning',
                                title: 'El usuario ' + names + ' NO TIENE fotos registradas, por favor verifique el enrolamiento biométrico.'
                            });
                            //BY PASS
                            if (type !== 0) {
                                generateDataPermission();
                            } else {
                                Toast.fire({
                                    icon: 'warning',
                                    title: 'Seleccione una clase de código'
                                });
                            }
                        } else {
                            if (type !== 0) {
                                generateDataPermission();
                                /* generateCryptoCode(); */
                            } else {
                                Toast.fire({
                                    icon: 'warning',
                                    title: 'Seleccione una clase de código'
                                });
                            }
                        }
                    }
                    else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Debe cargar una FOTO'
                        });
                    }
                }
            }
        }
    };

    const updateBandeja = (bean: IBandejaImpresion, idHojaPermiso: number) => {
        setSpinner(true);
        let aux: any = bean;
        aux.IDBandejaImpresion = bean.IDBANDEJAIMPRESION;
        aux.Estado = 2;
        aux.ESTADO = 2;
        aux.IDHojaPermiso = idHojaPermiso;
        _weaponService.updateBandejaImpresion(aux)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    setRender(4);
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Debe cargar una FOTO'
                    });
                }
            })
    }

    const onInit = (render: number) => {
        setRender(render);
        //Reiniciar todas los estados
        setCc('');
        setSurNames('');
        setNames('');
        setWeaponKind(null);
        setBrand('');
        setSerie('');
        setCaliber(null);
        setCapacity(null);
        setDateInit(null);
        setUbi('');
        setCodeP('');
        setCodeS('');
        setType(0);
        setPhoto('img_avatar.png');
    }

    const asginarPermiso = () => {
        setSpinner(true);
        _weaponService.asignarPermiso(idHojaPermiso, props.person.idAccount, props.dataArma.IDItem, props.dataArma.fechaDocumento, getSession().IDAccount)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue) {
                    if (props.proCD && props.itemBandeja) {
                        updateBandeja(props.itemBandeja, idHojaPermiso)
                    }
                } else {
                    Toast.fire({
                        icon: "error",
                        title: 'ERROR INTERNO DEL SERVIDOR'
                    })
                }
            })
    }

    const asignarPermisoConfirm = (data: boolean) => {
        if (data) {
            generateCryptoCode(dataPermission);
            /* if (props.proCD) {
                asginarPermiso();
            } */
        }
    };

    return (
        <>
            {
                render === 0 &&
                <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
                    <Row>
                        {!props.proCD &&
                            <Col sm={12}>
                                <ThemeProvider theme={inputsTheme}>
                                    <Button variant="contained" color="secondary" onClick={() => {
                                        onInit(3);
                                    }}>
                                        <BsArrowLeftShort className="mr-2" />
                                        ATRAS
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        }
                        <Col sm={12} className="d-flex justify-content-center">
                            <div className="pull-title-top">
                                <h1 className="m-3 ">GENERADOR DE PERMISOS - {getNombreTipo()}</h1>
                            </div>
                        </Col>
                        <div className="col-md-4 border-right">
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <span className="font-weight-bold my-3">FOTO DEL PERMISO</span>
                                <div className="hover-box">
                                    {props.proCD !== undefined &&
                                        <img className="rounded-circle-bordered hover-image"
                                            //BY PASS
                                            src={(photo === 'no_biophoto.png')
                                                ? process.env.PUBLIC_URL + `/assets/${photo}`
                                                : photo
                                            }
                                            style={{ width: 200, height: 200 }} alt="Profile Img" />
                                    }
                                    {photo === 'no_biophoto.png' &&
                                        <div className="hover-middle">
                                            <h4>EL SOLICITANTE NO TIENE FOTOS REGISTRADAS</h4>
                                            {/* //BY PASS */}
                                            <div className="hover-middle">
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Button variant="contained" color="secondary"
                                                        onClick={() => setShowLoad(true)}
                                                    >
                                                        <BsUpload className="ml-2 mr-2" />
                                                        SUBIR
                                                    </Button>
                                                </ThemeProvider>
                                            </div>
                                        </div>
                                    }
                                    {(props.proCD === undefined) &&
                                        <img className="rounded-circle-bordered hover-image"
                                            src=
                                            {(photo === 'img_avatar.png')
                                                ? process.env.PUBLIC_URL + `/assets/${photo}`
                                                : env.REACT_APP_ENDPOINT + `/filedownload?ContextMedia@=${contex}@@Media@=${photo}`
                                            }
                                            style={{
                                                width: 200,
                                                height: 200
                                            }} alt="Profile Img" />}
                                    {(props.proCD === undefined) &&
                                        <div className="hover-middle">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button variant="contained" color="secondary"
                                                    onClick={() => setShowLoad(true)}
                                                >
                                                    <BsUpload className="ml-2 mr-2" />
                                                    SUBIR
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    }
                                </div>
                                <span className="font-weight-bold my-3">{cc}</span>
                                <span className="font-weight-bold">{surNames + ' ' + names}</span>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Información del Permiso</h4>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <TextField
                                            disabled={props.proCD}
                                            value={cc}
                                            size="small"
                                            color="secondary"
                                            id="Name1"
                                            label="No. Identificación"
                                            fullWidth
                                            variant="outlined"
                                            onChange={(e) => setCc(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {(props.dataArma?.DocType ? props.dataArma?.DocType : 1) == 1 &&
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <TextField
                                                disabled={props.proCD}
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
                                                disabled={props.proCD}
                                                value={names}
                                                size="small"
                                                color="secondary"
                                                id="Name2"
                                                label="Nombres *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setNames(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>
                                }
                                {(props.dataArma?.DocType ? props.dataArma?.DocType : 1) == 2 &&
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <TextField
                                                disabled={props.proCD}
                                                value={names}
                                                size="small"
                                                color="secondary"
                                                id="Name2"
                                                label="Nombre de la entidad *"
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setNames(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>
                                }
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        {(props.dataArma ? props.dataArma.Fire : false) &&
                                            <TextField
                                                disabled={props.proCD}
                                                value={getRenderTipo(parseInt(props.dataArma.TipoArma))}
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                label="Tipo de Arma"
                                                id="tipoArma"
                                            >
                                            </TextField>
                                        }
                                        {(props.dataArma ? !props.dataArma.Fire : false) &&
                                            <TextField
                                                disabled={props.proCD}
                                                value={weaponKind}
                                                size="small"
                                                select
                                                fullWidth
                                                color="secondary"
                                                label="Tipo de Arma"
                                                id="weaponKind"
                                                onChange={(e) => {
                                                    setWeaponKind(parseInt(e.target.value));
                                                }}
                                            >
                                                {tiposArma?.Lista.map((item: any) => (
                                                    <MenuItem key={item.Valor} value={item.Codigo}>{item.Valor}</MenuItem>
                                                ))}
                                            </TextField>
                                        }
                                        {!props.proCD &&
                                            <TextField
                                                disabled={props.proCD}
                                                value={weaponKind}
                                                size="small"
                                                select
                                                fullWidth
                                                color="secondary"
                                                label="Tipo de Arma"
                                                id="weaponKind"
                                                onChange={(e) => {
                                                    setWeaponKind(parseInt(e.target.value));
                                                }}
                                            >
                                                {tiposArma?.Lista.map((item: any) => (
                                                    <MenuItem key={item.Valor} value={item.Codigo}>{item.Valor}</MenuItem>
                                                ))}
                                            </TextField>}
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            disabled={props.proCD}
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
                                {weaponKind === OTRO &&
                                    <div className="row mt-3">
                                        <Col sm={12} className="">
                                            <TextField
                                                disabled={props.proCD}
                                                value={otro}
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
                                            disabled={props.proCD}
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
                                            disabled={props.proCD}
                                            value={props.dataArma ? (props.dataArma.Fire && getRenderCalibre(parseInt(caliber ? caliber : '0'))) : caliber}
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            label="Calibre *"
                                            id="state"
                                            onChange={(e) => setCaliber(e.target.value.toUpperCase())}
                                        >
                                        </TextField>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        {(props.dataArma ? props.dataArma.Fire : false) &&
                                            <TextField
                                                disabled={props.proCD}
                                                value={capacity}
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                label="Capacidad (cartuchos) *"
                                                id="capacidades"
                                                onChange={(e) => { setCapacity(parseInt(e.target.value)); }}
                                            >
                                            </TextField>
                                        }
                                        {(props.dataArma ? !props.dataArma.Fire : true) &&
                                            <TextField
                                                disabled={props.proCD}
                                                value={capacity}
                                                type="number"
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                label="Capacidad de carga (cartuchos) *"
                                                id="state"
                                                onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))}
                                            >
                                            </TextField>
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                disablePast
                                                label="Fecha de vencimiento: "
                                                value={dateInit}
                                                onChange={(e) => { }}
                                                renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                {permissionType === TENENCIA &&
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <Autocomplete
                                                onChange={(e: any, value: any) => { setDpto(value ? value.label.toUpperCase() : ''); getSiteIDChilds(parseInt(value.id)) }}
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
                                        </div>
                                        <div className="col-md-6">
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
                                        </div>
                                    </div>
                                }
                                {permissionType === TENENCIA &&
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <TextField
                                                value={ubi}
                                                size="small"
                                                color="secondary"
                                                id="ubi"
                                                label="Ubicación *"
                                                placeholder='CRR 118 BIS N 89A 26, BARRIO COLSUBSIDIO'
                                                fullWidth
                                                variant="outlined"
                                                onChange={(e) => setUbi(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>}
                                {!props.proCD &&
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <TextField
                                                disabled={props.proCD}
                                                value={codeP}
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                label="Codigó Permiso *"
                                                name='codeA'
                                                key={'codeA'}
                                                id="codA"
                                                onChange={(e) => setCodeP(e.target.value)}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                disabled={props.proCD}
                                                value={codeS}
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                label="Código Seguridad *"
                                                name='codeB'
                                                key={'codeB'}
                                                id="codB"
                                                onChange={(e) => setCodeS(e.target.value)}
                                            >
                                            </TextField>
                                        </div>
                                    </div>
                                }
                                {props.proCD &&
                                    <form onSubmit={(e) => buscarPermiso(e)}>
                                        <div className="row mt-3">
                                            <div className="col-md-12">
                                                <TextField
                                                    value={code.toUpperCase()}
                                                    size="small"
                                                    fullWidth
                                                    color="secondary"
                                                    label="Buscar permiso *"
                                                    id="codeP"
                                                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeP(e.target.value.toUpperCase()) }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton type="submit" onClick={(e) => buscarPermiso(e)}>
                                                                    <BsSearch />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-3">
                                                <TextField
                                                    disabled={props.proCD}
                                                    value={codeP}
                                                    size="small"
                                                    fullWidth
                                                    color="secondary"
                                                    label="Código Permiso *"
                                                    name='codeB'
                                                    key={'codeB'}
                                                    id="codB"
                                                    onChange={(e) => setCodeP(e.target.value.toUpperCase())}
                                                >
                                                </TextField>
                                            </div>
                                            <div className="col-md-6 mt-3">
                                                <TextField
                                                    disabled={props.proCD}
                                                    value={codeS.toUpperCase()}
                                                    size="small"
                                                    fullWidth
                                                    color="secondary"
                                                    label="Código Seguridad *"
                                                    name='codeB'
                                                    key={'codeB'}
                                                    id="codB"
                                                    onChange={(e) => setCodeS(e.target.value.toUpperCase())}
                                                >
                                                </TextField>
                                            </div>
                                        </div>
                                    </form>
                                }
                                <div className=" row mt-5 text-right">
                                    <div className="col-md-8">
                                        <TextField
                                            margin="normal"
                                            size="small"
                                            select
                                            fullWidth
                                            color="secondary"
                                            label="Clase de Código"
                                            id="state"
                                            onChange={(e) => setType(parseInt(e.target.value))}
                                        >
                                            <MenuItem key={1} value={1}>
                                                CRYPTO-CODE
                                            </MenuItem>
                                            <MenuItem key={2} value={2}>
                                                PDF_417
                                            </MenuItem>
                                        </TextField>
                                    </div>
                                    <div className="col-md-4 d-flex justify-content-center">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary"
                                                onClick={() => onNext()}
                                            >
                                                SIGUIENTE
                                            </Button>
                                        </ThemeProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div >
            }
            {
                render === 1 && //VISTA PREVIA
                <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap flex-column justify-content-center p-2 mt-5">
                    <div className="row">
                        <Col sm={12} className="mt-3 d-flex justify-content-center">
                            <div className="pull-title-top">
                                <h1 className="m-5 ">PERMISO {getNombreTipo()}</h1>
                            </div>
                        </Col>
                        <div className="col-md-6 border-right">
                            <div className="mb-3">

                            </div>
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <div className="hover-box">
                                    <img className="rounded-circle-bordered"
                                        src={env.REACT_APP_ENDPOINT + `/filedownload?ContextMedia@=${contex}@@Media@=${photo}`}
                                        width="120" height="auto" alt="Profile Img" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex flex-column p-3 py-5">
                                <span className="font-weight-bold my-3"> <b>Identificación: </b> {cc}</span>
                                <span className="font-weight-bold"> <b>Nombre: </b> {surNames + ' ' + names}</span>
                                <span className="font-weight-bold my-3"> <b>DATOS DEL ARMA</b></span>
                                <span className="font-weight-bold"> <b>ARMA: </b> {dataPermission.ClaseArma} - {brand}</span>
                                <span className="font-weight-bold"> <b>NO. SERIE: </b> {serie} </span>
                                <span className="font-weight-bold"> <b>CAPACIDAD: </b> {dataPermission.Capacidad} </span>
                                <span className="font-weight-bold"> <b>CALIBRE: </b> {dataPermission.Calibre} </span>
                                <span className="font-weight-bold mt-3"> <b>CÓDIGO PERMISO: </b> <h4>{codeP}</h4> </span>
                                <span className="font-weight-bold"> <b>CÓDIGO SEGURIDAD: </b> <h4>{codeS}</h4> </span>
                                {permissionType === TENENCIA &&
                                    <div className='d-flex flex-column'>
                                        <span className="font-weight-bold"> <b>DPTO: </b> {dataPermission.Dpto} </span>
                                        <span className="font-weight-bold"> <b>M/PIO: </b> {dataPermission.Mpio} </span>
                                        <span className="font-weight-bold"> <b>UBICACIÓN: </b> {dataPermission.Ubicacion} </span>
                                    </div>
                                }
                                <span className="font-weight-bold"> <b>FECHA / VENCIMIENTO: </b> {formatDate(dateInit)} </span>
                                <div>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className="mt-5" variant="contained" color="error" onClick={() => setRender(0)}>
                                            CAMBIAR DATOS
                                        </Button>
                                    </ThemeProvider>
                                </div>
                                <div className="mt-15">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button className="w-100 mt-3" variant="contained" color="secondary"
                                            onClick={() => {
                                                setShowConfirm(true);
                                            }}
                                        >
                                            ASIGNAR PERMISO
                                        </Button>
                                    </ThemeProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {render === 3 &&
                <div className="container d-flex justify-content-center mt-15">
                    <form>
                        <Row className="card box-s m-3 d-block">
                            <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                <h1>..::GENERARDOR DE PERMISOS::..</h1>
                            </Col>
                            <Col sm={12} className="mt-3 d-flex justify-content-center">
                                <TextField
                                    margin="normal"
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label="Tipo de permiso"
                                    id="state"
                                    onChange={(e) => setPermissionType(parseInt(e.target.value))}
                                >
                                    {/* <MenuItem value={PORTE}>
                                        PORTE
                                    </MenuItem>
                                    <MenuItem value={TENENCIA}>
                                        TENENCIA
                                    </MenuItem> */}
                                    <MenuItem value={ESPECIAL}>
                                        ESPECIAL
                                    </MenuItem>
                                </TextField>
                            </Col>
                            {(!props.proCD) &&
                                <Col sm={12} className="mt-3 d-flex justify-content-center">
                                    <TextField
                                        margin="normal"
                                        size="small"
                                        select
                                        fullWidth
                                        color="secondary"
                                        label="Tipo de persona"
                                        id="personType"
                                        onChange={(e) => setDocType(parseInt(e.target.value))}
                                    >
                                        <MenuItem value={1}>
                                            PERSONA NATURAL
                                        </MenuItem>
                                        <MenuItem value={2}>
                                            PERSONA JURIDICA
                                        </MenuItem>
                                    </TextField>
                                </Col>
                            }
                            <Col sm={6} className="mb-3 ml-12 d-flex justify-content-center">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button className=" mt-3 w-100" variant="contained" color="secondary" onClick={(e) => {
                                        if (permissionType !== 0) {
                                            if (docType !== 0) {
                                                setRender(0);
                                            } else {
                                                Toast.fire({
                                                    icon: 'warning',
                                                    title: 'Debe seleccionar un tipo de persona'
                                                })
                                            }
                                        } else {
                                            Toast.fire({
                                                icon: 'warning',
                                                title: 'Debe seleccionar un tipo de permiso'
                                            })
                                        }
                                    }}>
                                        SIGUIENTE
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </form>
                </div>
            }
            {
                render === 4 &&
                <div className='d-flex nWhite w-80 p-3 m-3 flex-wrap flex-column justify-content-center p-2 mt-5'>
                    <div className="col-md-12">
                        <div className="d-flex justify-content-end">
                            <Tooltip title="Ajustar medidas">
                                <IconButton onClick={() => setShow(true)}>
                                    <BsGearFill />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <span className="font-weight-bold my-3">CRYPTO-CODE</span>
                            <div className="hover-box">
                                <img className=" hover-image"
                                    src={qr}
                                    width="auto"
                                    height="50"
                                    alt="Crypto Code" />
                                {props.proCD &&
                                    <div className="hover-middle">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary" className="white-link">
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
                                                    label="DESCARGAR"
                                                    type={permissionType}
                                                    docType={docType}
                                                />
                                            </Button>
                                        </ThemeProvider>
                                    </div>}
                                {!props.proCD &&
                                    <div className="hover-middle">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary" className="white-link">
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
                                                    label="DESCARGAR"
                                                    type={permissionType}
                                                    docType={docType}
                                                />
                                            </Button>
                                        </ThemeProvider>
                                    </div>}
                            </div>
                            <span className="font-weight-bold my-3">HAGA CLICK EN EL CODIGO PARA DESCARGARLO</span>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Row className="d-flex justify-content-center">
                                {!props.proCD &&
                                    <Col sm={12} className="mt-3">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button variant="contained" color="secondary" fullWidth
                                                onClick={() => { onInit(0) }}
                                            >
                                                <BsFillArrowLeftSquareFill className="ml-2 mr-2" />
                                                GENERAR OTRO PERMISO
                                            </Button>
                                        </ThemeProvider>
                                    </Col>
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            }
            {
                showLoad &&
                <SLoadDocument show={showLoad} setShow={setShowLoad} title={"Cargar Imagen"} type={1} getMedia={getMedia} accept={["image/*"]} />
            }
            {
                spinner &&
                <SSpinner show={spinner} />
            }
            {
                show &&
                <ModalSettings
                    show={show}
                    setShow={setShow}
                    frontY={frontY}
                    setFrontY={setFrontPosition}
                    frontX={frontX}
                    setFrontX={setFrontX}
                    codeY={codeY}
                    setCodeY={setCodeY}
                    codeX={codeX}
                    setCodeX={setCodeX}
                    height={height}
                    setHeight={setHeight}
                />
            }
            {
                showConfirm && (
                    <GenericConfirmAction
                        show={showConfirm}
                        setShow={setShowConfirm}
                        confirmAction={asignarPermisoConfirm}
                        title={"Está apunto de asignar el permiso ¿Desea continuar?"}
                    />
                )
            }
        </>
    )
}
