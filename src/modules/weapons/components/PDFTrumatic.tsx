import { Document, Page, PDFViewer, Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap';
import { ConfigService } from '../../../core/services/ConfigService';
import { FileService } from '../../../core/services/FileService';
import { GlobalService } from '../../../core/services/GlobalService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { Toast } from '../../../utils/Toastify';

interface IPDFTraumatic {
    dataSolicitante?: any;
    dataActa: any;
    dataAttach: any;
    type: number
}

const _configService = new ConfigService();
const _fileService = new FileService();
const _weaponService = new WeaponsService();

export const PDFTrumatic: React.FC<IPDFTraumatic> = (props: IPDFTraumatic) => {

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const [spinner, setSpinner] = useState<any>({});
    const [arma, setArma] = useState<any>({});
    const [fecha, setFecha] = useState<string>('');
    const [seccional, setSeccional] = useState<string>('');
    const [lugarExpedicion, setLugarExpedicion] = useState<string>('Bogotá'); //FALTA EL RENDER DE LUGAR DE EXPEDICION
    const [siteSeccional, setSiteSeccional] = useState<string>('Bogotá');
    const [numActa, setNumActa] = useState<string>('');
    const [codTramite, setCodTramite] = useState<string>('DAPJ');
    const [codSeccional, setCodSeccional] = useState<string>('');
    const [funcionario, setFuncionario] = useState<any>();
    const [base64Cuerpo, setBase64Cuerpo] = useState<any>();
    const [base64Serie, setBase64Serie] = useState<any>();

    const [loteArmas, setLoteArmas] = useState<any[]>([]);
    const [loteArmasPag, setLoteArmasPag] = useState<any[]>([]);
    const [lista1, setListaTiposArma] = useState<any>();

    useEffect(() => {
        getCodTramite();
        getList([4]);
        console.log(props.type);
        getArmasPorIDSalida();
        setFuncionario(getSession());
        let data = JSON.parse(props.dataActa.Propiedades);
        console.log(data.DataArma);
        setLugarExpedicion(camelize(props.dataSolicitante.BornSiteIDName));
        setSeccional(props.dataActa.OfficeName);
        getCodeSeccional(props.dataActa.IDOffice);
        setFecha(getRenderFecha(new Date()));
        setArma(data.DataArma);
        getNumActa(new Date());
    }, [])

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

    const getArmasPorIDSalida = () => {
        let aux: any[] = [];
        let auxPag: any[] = [];
        setSpinner(true);
        _weaponService.getArmasPorIDSalida(props.dataActa.IDSalidaAlmacen, props.dataActa.FechaDocumento)
            .subscribe((resp) => {
                setSpinner(false);
                console.log(resp);
                if (resp) {
                    if (resp.length > 0) {
                        let propiedades: any = {};
                        let count: number = 0;
                        resp.map((item: any) => {
                            propiedades = JSON.parse(item.Propiedades);
                            /* if (count < 6) { //limitar el numero de registros por pagina
                                auxPag.push(propiedades.DataArma);
                                count++;
                            } else {
                                count = 1;
                                aux.push(auxPag);
                                auxPag = [];
                                auxPag.push(item.Propiedades);
                            } */
                            aux.push(propiedades.DataArma);
                            console.log(propiedades.DataArma);

                        })
                        console.log(aux);
                        setLoteArmas(aux);
                    } else {
                        setSpinner(true);
                        _fileService.imagenToBase64(props.dataAttach.fileCuerpo.ContextMedia, props.dataAttach.fileCuerpo.Media)
                            .subscribe((resp) => {
                                setSpinner(false);
                                if (resp.DataBeanProperties.ObjectValue) {
                                    setBase64Cuerpo(resp.DataBeanProperties.ObjectValue.Base64);
                                    _fileService.imagenToBase64(props.dataAttach.fileSerie.ContextMedia, props.dataAttach.fileSerie.Media).subscribe((resp) => {
                                        if (resp.DataBeanProperties.ObjectValue) {
                                            setBase64Serie(resp.DataBeanProperties.ObjectValue.Base64);
                                        }
                                    });
                                }
                            });
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error en el servidor'
                    })
                }
            })
    };

    function camelize(str: string) {
        let msg: string = '';
        let first: string = '';
        console.log(str);
        if (str !== undefined) {
            let aux: string[] = str.split(' ');
            first = aux[0].replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                return index === 0 ? word.toUpperCase() : word.toLowerCase();
            }).replace(/\s+/g, '');

            aux.map((word, index) => {
                if (index !== 0) {
                    msg += ' ' + word.toLowerCase();
                }
            });
        }
        return first + msg;
    };

    const getCodeSeccional = (id: number) => {
        setSpinner(true);
        _configService.getOfficeCatalog(id).subscribe((resp: any) => {
            setSpinner(false);
            if (resp) {
                if (resp[0].SiteIDName !== undefined) {
                    setSiteSeccional(camelize(resp[0].SiteIDName));
                    if (resp[0].Code) {
                        setCodSeccional(resp[0].Code);
                    } else {
                        setCodSeccional('NULL')
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error en el servidor'
                    })
                }

            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error en el servidor'
                })
            }
        })
    }

    const getCodTramite = () => {
        setSpinner(true);
        _configService.getSystemProperty("cod_devolucion_traumatica").subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setCodTramite(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error en el servidor'
                })
            }
        })
    };

    const getNumActa = (date: Date) => {
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        setNumActa((year + '') + ((month <= 9) ? ('0' + month) : month + '') + codTramite + codSeccional + props.dataActa.IDSalidaAlmacen);
    };

    const getSession = () => {
        if (localStorage.getItem('usuario')) {
            return JSON.parse(localStorage.getItem('usuario') ?? "")
        }
    };

    const getRenderFecha = (date: Date) => {
        let day = date.getDate();;
        let month = months[date.getMonth()];
        let year = date.getFullYear();
        return day + ' de ' + month + ' de ' + year
    };

    const stylesPag1 = StyleSheet.create({
        body: {
            paddingTop: 30,
            paddingBottom: 30,
            paddingHorizontal: 30,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 35,
            marginHorizontal: 35,
        },
        chart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 25,
            marginHorizontal: 50,
        },
        chartColumn: {
            flexDirection: 'column'
        },
        image: {
            marginVertical: 0,
            marginLeft: 68,
            height: 80,
            width: 300,
        },
        textCenter: {
            marginTop: 10,
            marginBottom: 15,
            fontSize: 12,
            textAlign: 'center',
        },
        text: {
            marginLeft: 0,
            fontSize: 12,
            textAlign: 'left',
        },
        text2: {
            marginTop: 10,
            marginLeft: 35,
            fontSize: 12,
            textAlign: 'left',
        },
        textJustify: {
            marginTop: 30,
            marginHorizontal: 35,
            marginBottom: 35,
            fontSize: 12,
            textAlign: 'justify',
        },
        textChart: {
            flexDirection: 'column',
            marginVertical: 2,
            marginHorizontal: 20,
            fontSize: 12,
            textAlign: 'justify',
        },
        mainBox: {
            marginTop: 25
        },
        observation: {
            marginTop: 5,
            width: 480,
            height: 150,
            border: '1px solid #503464',
            marginHorizontal: 35,
        },
        table: {
            margin: 20,
            border: '1px solid #000000',
            flexDirection: 'column',
        },
        tableContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        },

    });

    const tableStyles = StyleSheet.create({
        table: {
            width: '100%',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 5,
            paddingBottom: 5,
        },
        header: {
            borderTop: 'none',
        },
        bold: {
            fontWeight: 'bold',
        },
        // So Declarative and unDRY 👌
        row1: {
            fontSize: 6,
            width: '2%',
        },
        row2: {
            fontSize: 6,
            width: '10%',
        },
        row3: {
            fontSize: 6,
            width: '16%',
        },
        row4: {
            fontSize: 6,
            width: '16%',
        },
        row5: {
            fontSize: 6,
            width: '8%',
        },
        row6: {
            fontSize: 6,
            width: '23%',
        },
        row7: {
            fontSize: 6,
            width: '23%',
        },
    })

    const styles = StyleSheet.create({
        body: {
            paddingTop: 30,
            paddingBottom: 30,
            paddingHorizontal: 30,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 35,
            marginHorizontal: 35,
        },
        chart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 35,
            marginHorizontal: 50,
        },
        chartColumn: {
            flexDirection: 'column'
        },
        dimensionSignature: {
            width: 300,
            height: 80,
            /* border: '1px solid #503464', */
        },
        image: {
            marginVertical: 0,
            marginHorizontal: 100,
            height: 80,
            width: 300,
        },
        imageSquare: {
            height: 150,
            width: 250,
            border: '1px solid #503464',
            marginRight: 2
        },
        image1: {
            height: 150,
            width: 237,
        },
        lineaSignatureLeft: {
            width: 160,
            border: '1px solid #503464'
        },
        lineaSignature: {
            width: 160,
            borderTop: '1px solid #503464',
        },
        marginImage: {
            paddingTop: 20
        },
        marginSignature: {
            marginTop: 50,
            height: 20,
            width: 480,
            marginHorizontal: 35,
            padding: 5
        },
        observation: {
            marginTop: 20,
            width: 480,
            height: 150,
            border: '1px solid #503464',
            marginHorizontal: 35,
            paddingRight: 15
        },
        rowImage: {
            marginTop: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 35,
        },
        rowSignature: {
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 35,
        },
        rowSignatureText: {
            marginTop: 8,
            flexDirection: 'row',
            marginHorizontal: 35,
        },
        textCenter: {
            marginTop: 10,
            fontSize: 12,
            textAlign: 'center',
        },
        textImage: {
            fontSize: 12,
            textAlign: 'center',
            border: '1px solid #503464'
        },
        textLef: {
            marginTop: 50,
            marginLeft: 50,
            fontSize: 11,
            textAlign: 'left'
        },
        textLefObservation: {
            marginTop: 12,
            marginLeft: 20,
            fontSize: 11
        },
        textObservation: {
            fontSize: 8,
            justifyContent: 'center',
            lineHeight: 2
        },
        textLefSignature: {
            marginTop: 12,
            marginLeft: 0,
            fontSize: 11
        },
        textRightSignature: {
            marginTop: 12,
            marginLeft: 41,
            fontSize: 11,
        },
        text: {
            marginLeft: 0,
            fontSize: 12,
            textAlign: 'left',
        },
        text2: {
            marginTop: 20,
            marginLeft: 35,
            fontSize: 12,
            textAlign: 'left',
        },
        textJustify: {
            marginHorizontal: 35,
            marginBottom: 35,
            fontSize: 12,
            textAlign: 'justify',
        },
        textChart: {
            flexDirection: 'column',
            marginVertical: 2,
            marginHorizontal: 20,
            fontSize: 12,
            textAlign: 'justify',
        },
        mainBox: {
            marginTop: 40
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },
        fixed: {
            position: 'absolute',
            fontSize: 12,
            top: 5,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },
    });

    const getNombreTipo = (cod: number) => {
        let m = ''
        lista1?.Lista.map((item: any) => {
            if (item.Codigo === (cod + '')) {
                m = item.Valor
            }
        })
        return m;
    };

    return (
        <>
            <PDFViewer>
                <Document title={props.dataSolicitante.Nit + '-' + numActa}>
                    <Page style={stylesPag1.body} size='LETTER'>
                        <div style={stylesPag1.image}>
                            <Image
                                style={stylesPag1.image}
                                src={process.env.PUBLIC_URL + "/assets/doc.png"}
                            />
                        </div>
                        <div style={stylesPag1.mainBox}>
                            <Text style={stylesPag1.textCenter}>
                                ACTA DE RECEPCION DE ARMA TRAUMATICA
                            </Text>
                            <div style={stylesPag1.row}>
                                <Col sm={6}>
                                    <Text style={stylesPag1.text}>
                                        {fecha}
                                    </Text>
                                </Col>
                                <Col sm={6}>
                                    <Text style={stylesPag1.text}>
                                        ACTA N° {numActa}
                                    </Text>
                                </Col>
                            </div>
                            {props.dataSolicitante.DocType == 2
                                ?
                                <Text style={stylesPag1.textJustify}>
                                    En la fecha hace presentación personal en la seccional {seccional}, la empresa
                                    {' ' + props.dataSolicitante.EntityName + ' '}, identificado(a) con el Nit Nº {' ' + props.dataSolicitante.Nit + ' '}
                                    , con el fin de hacer entrega voluntaria del(las) arma(s) traumática(s),
                                    de conformidad con lo establecido en el Decreto 1417 de 2021 así:
                                </Text>
                                :
                                <Text style={stylesPag1.textJustify}>
                                    En la fecha hace presentación personal en la seccional {seccional}, el(la) señor(a)
                                    {' ' + props.dataSolicitante.EntityName + ' '}, identificado(a) con la Cédula de Ciudadanía Nº {' ' + props.dataSolicitante.Nit + ' '} de {lugarExpedicion}
                                    , con el fin de hacer entrega voluntaria del arma traumática,
                                    de conformidad con lo establecido en el Decreto 1417 de 2021 así:
                                </Text>
                            }
                            {props.type === 0 &&
                                <div>
                                    <Text style={stylesPag1.text2}>
                                        Descripción del arma devuelta:
                                    </Text>
                                    <div style={stylesPag1.chart}>
                                        <div style={stylesPag1.chartColumn}>
                                            <Text style={stylesPag1.textChart}>
                                                <b>Clase de Arma:</b> {arma.NombreTipo}
                                            </Text>
                                            <Text style={stylesPag1.textChart}>
                                                Número de Serie: {arma.Serial}
                                            </Text>
                                            <Text style={stylesPag1.textChart}>
                                                Calibre: {arma.Calibre}
                                            </Text>
                                            <Text style={stylesPag1.textChart}>
                                                Capacidad: {arma.Capacidad} (cartuchos)
                                            </Text>
                                            <Text style={stylesPag1.textChart}>
                                                Marca: {arma.Descripcion}
                                            </Text>
                                            <Text style={stylesPag1.textChart}>
                                                Modelo: {arma.Modelo}
                                            </Text>
                                        </div>
                                    </div>
                                    <div style={stylesPag1.observation}>
                                        <Text style={styles.textLefObservation}>
                                            Descripción de accesorios:
                                            <div style={styles.textObservation}>
                                                {
                                                    props.dataAttach.acc
                                                        ? ' ' + props.dataAttach.acessorios
                                                        : ' NO INCLUYE ACCESORIOS'
                                                }
                                            </div>
                                        </Text>
                                    </div>
                                </div>
                            }
                        </div>
                        {props.type === 1 &&
                            <div>
                                <div style={styles.observation}>
                                    <Text style={styles.textLefObservation}>
                                        Observaciones:
                                        <div style={styles.textObservation}>
                                            En la(s) siguiente(s) hojas del presente documento se anexa la lista de ({loteArmas.length}) armas devueltas en la seccional {seccional}.
                                        </div>
                                    </Text>
                                </div>
                            </div>
                        }
                        {props.type === 1 &&
                            <div style={styles.marginSignature}>
                                <div style={styles.rowSignature}>
                                    <Col sm={6} style={styles.lineaSignature}></Col>
                                    <Col sm={6} style={styles.lineaSignature}></Col>
                                </div>
                                <div style={styles.rowSignatureText}>
                                    <div style={styles.dimensionSignature}>
                                        <Text style={styles.textLefSignature}>
                                            Firma
                                        </Text>
                                        <Text style={styles.textLefSignature}>
                                            {props.dataSolicitante.EntityName}
                                        </Text>
                                        <Text style={styles.textLefSignature}>
                                            {props.dataSolicitante.DocType == 2 ? 'NIT.' : 'CC.'} {props.dataSolicitante.Nit}
                                        </Text>
                                    </div>
                                    <div style={styles.dimensionSignature}>
                                        <Text style={styles.textRightSignature}>
                                            Firma
                                        </Text>
                                        {funcionario !== undefined &&
                                            <Text style={styles.textRightSignature}>
                                                {funcionario.Grade + '. ' +
                                                    (funcionario.Name1 ? funcionario.Name1 : '') + ' ' +
                                                    (funcionario.Name2 ? funcionario.Name2 : '') + ' ' +
                                                    (funcionario.Surname1 ? funcionario.Surname1 : '') + ' ' +
                                                    (funcionario.Surname2 ? funcionario.Surname2 : '')}
                                            </Text>
                                        }
                                        <Text style={styles.textRightSignature}>
                                            {seccional}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        }
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>

                    {props.type === 1 &&

                        <Page style={styles.body} size='LETTER'>
                            <div style={stylesPag1.image}>
                                <Image
                                    style={stylesPag1.image}
                                    src={process.env.PUBLIC_URL + "/assets/doc.png"}
                                />
                            </div>
                            <div>
                                <Text style={styles.fixed} fixed >
                                    ACTA N° {numActa}
                                </Text>
                            </div>
                            <div style={styles.mainBox}>


                                <View style={tableStyles.table}>
                                    <View style={[tableStyles.row, tableStyles.bold, tableStyles.header]}>
                                        <Text style={tableStyles.row1}>#</Text>
                                        <Text style={tableStyles.row2}>Clase Arma</Text>
                                        <Text style={tableStyles.row3}>Serial</Text>
                                        <Text style={tableStyles.row4}>Descripción</Text>
                                        <Text style={tableStyles.row5}>Capacidad (cartuchos)</Text>
                                        <Text style={tableStyles.row6}>Accesorios</Text>
                                        <Text style={tableStyles.row7}>Observaciones</Text>
                                    </View>
                                    {loteArmas.map((row, i) => (
                                        <View key={i} style={tableStyles.row} wrap={false}>
                                            <Text style={tableStyles.row1}>{i + 1}</Text>
                                            <Text style={tableStyles.row2}>{getNombreTipo(row.CodigoTipoArma)}</Text>
                                            <Text style={tableStyles.row3}>{row.Serial}</Text>
                                            <Text style={tableStyles.row4}>{row.Descripcion}-{row.Calibre}-{row.Modelo}</Text>
                                            <Text style={tableStyles.row5}>{row.Capacidad}</Text>
                                            <Text style={tableStyles.row6}>{row.Accesorios}</Text>
                                            <Text style={tableStyles.row7}>{row.Observaciones}</Text>
                                        </View>
                                    ))}
                                </View>
                            </div>
                            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                                `${pageNumber} / ${totalPages}`
                            )} fixed />
                        </Page>
                    }

                    {props.type === 0 &&
                        <Page style={styles.body} size='LETTER'>
                            <div style={stylesPag1.image}>
                                <Image
                                    style={stylesPag1.image}
                                    src={process.env.PUBLIC_URL + "/assets/doc.png"}
                                />
                            </div>
                            <div style={styles.mainBox}>
                                <Text style={stylesPag1.textCenter}>
                                    ACTA DE RECEPCION DE ARMA TRAUMATICA
                                </Text>
                                <div>
                                    <Text style={styles.textLef}>
                                        Fotografías:
                                    </Text>
                                    <div style={styles.marginImage}>
                                        <div style={styles.rowImage}>
                                            <Col sm={6} style={styles.imageSquare}>
                                                <Image
                                                    style={styles.image1}
                                                    src={`data:image/${props.dataAttach.fileCuerpo.Media.split('.')[1]};base64,${base64Cuerpo}`}
                                                />
                                                <Text style={styles.textImage}>
                                                    Cuerpo del arma
                                                </Text>
                                            </Col>
                                            <Col sm={6} style={styles.imageSquare}>
                                                <Image
                                                    style={styles.image1}
                                                    src={`data:image/${props.dataAttach.fileSerie.Media.split('.')[1]};base64,${base64Serie}`}
                                                />
                                                <Text style={styles.textImage}>
                                                    Número de serie
                                                </Text>
                                            </Col>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.observation}>
                                    <Text style={styles.textLefObservation}>
                                        Observaciones:
                                        <div style={styles.textObservation}>
                                            {
                                                props.dataAttach.obs
                                                    ? ' ' + props.dataAttach.observacion
                                                    : ' NINGUNA'
                                            }
                                        </div>
                                    </Text>
                                </div>
                            </div>
                        </Page>
                    }
                </Document>
            </PDFViewer>
            {spinner && <SSpinner show={spinner} />}
        </>
    )
}
