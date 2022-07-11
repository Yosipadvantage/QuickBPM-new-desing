import { Document, Image, Page, PDFDownloadLink, StyleSheet, Text } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import { IDataPermission } from '../model/DataPermission'

interface IPDF {
    src: string,
    title: string,
    data: IDataPermission,
    photo: string,
    frontY: string,
    codeY: string,
    frontX: string,
    codeX: string,
    height: number,
    label: string,
    type: number,
    docType?: number
}

const PORTE: number = 1;
const TENENCIA: number = 2;
const ESPECIAL: number = 3;

export const PDFCode = (props: IPDF) => {

    const [codeY, setCodeY] = useState(0);

    const [codeX, setCodeX] = useState(0);
    const [frontY, setFrontY] = useState(0);
    const [frontX, setFrontX] = useState(0);
    const [docType, setDocType] = useState(props.data.DocType !== undefined ? props.data.DocType : 1);


    useEffect(() => {
        if (props.docType) {
            props.data.DocType = props.docType;
        }
        setCodeY(parseInt(props.codeY));
        setCodeX(parseInt(props.codeX));
        setFrontY(parseInt(props.frontY));
        setFrontX(parseInt(props.frontX));
    }, [props.codeX, props.frontX, props.frontY, props.codeY])



    const styles = StyleSheet.create({
        body: {
            paddingTop: (632 + ((isNaN(codeY)) ? 0 : -codeY)),
            paddingBottom: 0,
            paddingHorizontal: (35 + ((isNaN(codeX)) ? 0 : codeX)),
        },
        image: {
            marginVertical: 0,
            marginHorizontal: 154,
            height: 51, //57
            width: 187 //208
        },
        text: {
            margin: 0,
            fontSize: 10,
            textAlign: 'justify',
        },
        text2: {
            margin: 0,
            fontSize: 18,
            textAlign: 'justify',
        },
        datos_hoja: {
            display: 'flex',
            maxWidth: '100%',
            flexWrap: 'wrap',
            flexDirection: 'column',
            marginTop: 50,
            marginBottom: 0,
            marginLeft: 120,
            marginRight: 10

        }
    });

    const styles2 = StyleSheet.create({

        bodySpecial: {
            flexDirection: 'row',
            paddingTop: (617 + ((isNaN(frontY)) ? 0 : -frontY)),
            paddingBottom: 0,
            paddingLeft: (205 + ((isNaN(frontX)) ? 0 : frontX)),
        },
        body: {
            flexDirection: 'row',
            paddingTop: (100),
            paddingBottom: 0,
            paddingLeft: (20),
        },
        photosSpecial: {
            marginVertical: 0,
            marginLeft: 30,
            height: 70,
            width: 55
        },
        photo: {
            marginLeft: 30,
            height: 65,
            width: 120
        },
        textName: {
            margin: 0,
            fontSize: 7,
            textAlign: 'justify',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        text: {
            margin: 0,
            fontSize: 7,
            textAlign: 'justify',
        },
        divName: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        text2Name: {
            margin: 0,
            fontSize: 7,
            textAlign: 'justify',
        },
        text2: {
            margin: 0,
            fontSize: 9,
            textAlign: 'justify',
        },
        textRight: {
            marginLeft: 150,
            fontSize: 6,
            textAlign: 'justify',
        },
        textRight2: {
            marginLeft: 50,
            fontSize: 9,
            textAlign: 'justify',
        },
        textRightTenencia: {
            marginLeft: 125,
            fontSize: 6,
            textAlign: 'justify',
        },
        textRight2Tenencia: {
            marginLeft: 200,
            fontSize: 9,
            textAlign: 'justify',
        },
        content: {
            flexDirection: 'row',
        },
        div_tenencia: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        datos_permiso: {
            /* marginTop: 520 + ((isNaN(frontY)) ? 0 : -frontY),
            marginRight: 160 + ((isNaN(frontX)) ? 0 : frontX), */
            marginRight: 20,
            flexDirection: 'column',
            width: '100%',
        },
        conjunto: {
            maxWidth: '100%',
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 520 + ((isNaN(frontY)) ? 0 : -frontY),
            marginRight: 200 + ((isNaN(frontX)) ? 0 : frontX),
        },
        conjuntoTenencia: {
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '100%',
            marginTop: 520 + ((isNaN(frontY)) ? 0 : -frontY),
            marginRight: 350 + ((isNaN(frontX)) ? 0 : frontX),
        }
    });

    const MyDocPorte = () => (
        <Document>
            <Page style={styles2.body} size='LETTER'>
                <div style={styles.datos_hoja}>
                    <div style={styles2.divName}>
                        <Text style={styles2.text2Name}>
                            {props.data.Surnames.toUpperCase() + ' ' + props.data.Names.toUpperCase()}
                        </Text>
                    </div>
                    {docType == 1 &&
                        <Text style={styles2.text2}>
                            CC.{props.title}
                        </Text>
                    }
                    {docType == 2 &&
                        <Text style={styles2.text2}>
                            NIT.{' ' + props.title}
                        </Text>
                    }
                    <Text style={styles2.text2}>
                        CLASE ARMA: {props.data.ClaseArma}
                    </Text>
                    <Text style={styles2.text2}>
                        MARCA: {props.data.Marca?.split('-')[0]}
                    </Text>
                    <Text style={styles2.text2}>
                        SERIE No: {props.data.Serie}
                    </Text>
                    <Text style={styles2.text2}>
                        CALIBRE: {props.data.Calibre}
                    </Text>
                    <Text style={styles2.text2}>
                        CAPACIDAD: {props.data.Capacidad}
                    </Text>
                    {docType != 2 &&
                        <Text style={styles2.text2}>
                            TIPO USO: {props.data.TipoUso?.toUpperCase()}
                        </Text>
                    }
                    <Text style={styles2.text2}>
                        VENCE: {props.data.Vence}
                    </Text>
                    <Text style={styles2.text2}>
                        {props.data.CodSec}
                    </Text>
                </div>
                <div style={styles2.conjunto}>
                    <div style={styles2.datos_permiso}>
                        <div style={styles2.divName}>
                            <Text style={styles2.text}>
                                {props.data.Surnames.toUpperCase() + ' ' + props.data.Names.toUpperCase()}
                            </Text>
                        </div>
                        {docType == 1 &&
                            <Text style={styles2.text}>
                                CC.{props.title}
                            </Text>
                        }
                        {docType == 2 &&
                            <Text style={styles2.text}>
                                NIT.{' ' + props.title}
                            </Text>
                        }
                        <Text style={styles2.text}>
                            CLASE ARMA: {props.data.ClaseArma}
                        </Text>
                        <Text style={styles2.text}>
                            MARCA: {props.data.Marca?.split('-')[0]}
                        </Text>
                        <Text style={styles2.text}>
                            SERIE No: {props.data.Serie}
                        </Text>
                        <Text style={styles2.text}>
                            CALIBRE: {props.data.Calibre}
                        </Text>
                        <Text style={styles2.text}>
                            CAPACIDAD: {props.data.Capacidad}
                        </Text>
                        {docType != 2 &&
                            <Text style={styles2.text}>
                                TIPO USO: {props.data.TipoUso?.toUpperCase()}
                            </Text>
                        }
                        <Text style={styles2.text}>
                            VENCE: {props.data.Vence}
                        </Text>
                        <Text style={styles2.text}>
                            {props.data.CodSec}
                        </Text>
                    </div>
                    {/* {docType != 2 &&
                        <Image
                            style={styles2.photo}
                            src={props.photo}
                        />
                    } */}
                </div>
            </Page>
            <Page style={styles.body} size='LETTER'>
                <Image
                    style={styles.image}
                    src={props.src}
                />
            </Page>
        </Document>
    );

    const MyDocTenencia = () => (
        <Document>
            <Page style={styles2.body} size='LETTER'>
                <div style={styles.datos_hoja}>
                    <div style={styles2.divName}>
                        <Text style={styles2.text2Name}>
                            {props.data.Surnames + ' ' + props.data.Names}
                        </Text>
                    </div>
                    {docType == 1 &&
                        <Text style={styles2.text2}>
                            CC.{props.title}
                        </Text>
                    }
                    {docType == 2 &&
                        <Text style={styles2.text2}>
                            NIT.{' ' + props.title}
                        </Text>
                    }
                    <div style={styles2.divName}>
                        <Text style={styles2.text2}>
                            UBICACIÓN: {props.data.Ubicacion}
                        </Text>
                    </div>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text2}>
                            M/PIO: {props.data.Mpio}
                        </Text>
                        <Text style={styles2.textRight2Tenencia}>
                            DPTO: {props.data.Dpto}
                        </Text>
                    </div>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text2}>
                            CLASE ARMA: {props.data.ClaseArma}
                        </Text>
                        <Text style={styles2.textRight2Tenencia}>
                            MARCA: {props.data.Marca}
                        </Text>
                    </div>
                    <Text style={styles2.text2}>
                        SERIE No: {props.data.Serie}
                    </Text>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text2}>
                            CALIBRE: {props.data.Calibre}
                        </Text>
                        <Text style={styles2.textRight2Tenencia}>
                            CAPACIDAD: {props.data.Capacidad}
                        </Text>
                    </div>
                    {docType != 2 &&
                        <Text style={styles2.text2}>
                            TIPO USO: {props.data.TipoUso?.toUpperCase()}
                        </Text>
                    }
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text2}>
                            VENCE: {props.data.Vence}
                        </Text>
                        <Text style={styles2.textRightTenencia}>
                            {props.data.CodSec}
                        </Text>
                    </div>
                </div>
                <div style={styles2.conjuntoTenencia}>
                    <div style={styles2.divName}>
                        <Text style={styles2.text}>
                            {props.data.Surnames + ' ' + props.data.Names}
                        </Text>
                    </div>
                    {docType == 1 &&
                        <Text style={styles2.text}>
                            CC.{props.title}
                        </Text>
                    }
                    {docType == 2 &&
                        <Text style={styles2.text}>
                            NIT.{' ' + props.title}
                        </Text>
                    }
                    <div style={styles2.divName}>
                        <Text style={styles2.text}>
                            UBICACIÓN: {props.data.Ubicacion}
                        </Text>
                    </div>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text}>
                            M/PIO: {props.data.Mpio}
                        </Text>
                        <Text style={styles2.textRightTenencia}>
                            DPTO: {props.data.Dpto}
                        </Text>
                    </div>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text}>
                            CLASE ARMA: {props.data.ClaseArma}
                        </Text>
                        <Text style={styles2.textRightTenencia}>
                            MARCA: {props.data.Marca}
                        </Text>
                    </div>
                    <Text style={styles2.text}>
                        SERIE No: {props.data.Serie}
                    </Text>
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text}>
                            CALIBRE: {props.data.Calibre}
                        </Text>
                        <Text style={styles2.textRightTenencia}>
                            CAPACIDAD: {props.data.Capacidad}
                        </Text>
                    </div>
                    {docType != 2 &&
                        <Text style={styles2.text}>
                            TIPO USO: {props.data.TipoUso?.toUpperCase()}
                        </Text>
                    }
                    <div style={styles2.div_tenencia}>
                        <Text style={styles2.text}>
                            VENCE: {props.data.Vence}
                        </Text>
                        <Text style={styles2.textRightTenencia}>
                            {props.data.CodSec}
                        </Text>
                    </div>
                </div>
            </Page>
            <Page style={styles.body} size='LETTER'>
                <Image
                    style={styles.image}
                    src={props.src}
                />
            </Page>
        </Document>
    );

    const MyDocEspecial = () => (
        <Document>
            <Page style={styles2.bodySpecial} size='LETTER'>
                <div>
                    <Text style={styles2.text}>
                        {props.data.Surnames + ' ' + props.data.Names}
                    </Text>
                    {props.data.DocType == 1 &&
                        <Text style={styles2.text}>
                            CC.{props.title}
                        </Text>
                    }
                    {props.data.DocType == 2 &&
                        <Text style={styles2.text}>
                            NIT.{' ' + props.title}
                        </Text>
                    }
                    <Text style={styles2.text}>
                        CLASE ARMA: {props.data.ClaseArma}
                    </Text>
                    <Text style={styles2.text}>
                        MARCA: {props.data.Marca}
                    </Text>
                    <Text style={styles2.text}>
                        SERIE No: {props.data.Serie}
                    </Text>
                    <Text style={styles2.text}>
                        CALIBRE: {props.data.Calibre}
                    </Text>
                    <Text style={styles2.text}>
                        CAPACIDAD: {props.data.Capacidad + ' (CARTUCHOS)'}
                    </Text>
                    <Text style={styles2.text}>
                        VENCE: {props.data.Vence}
                    </Text>
                </div>
                <Image
                    style={styles2.photosSpecial}
                    src={props.photo}
                />
            </Page>
            <Page style={styles.body} size='LETTER'>
                <Image
                    style={styles.image}
                    src={props.src}
                />
            </Page>
        </Document>
    );

    return (
        <>
            {props.type === PORTE &&
                <PDFDownloadLink className="white-link" document={<MyDocPorte />} fileName={`${props.title}-${props.data.NombreTipo}.pdf`}>
                    {({ blob, url, loading, error }) =>
                        loading ? '... CARGANDO' : props.label
                    }
                </PDFDownloadLink>
            }
            {props.type === TENENCIA &&
                <PDFDownloadLink className="white-link" document={<MyDocTenencia />} fileName={`${props.title}-${props.data.NombreTipo}.pdf`}>
                    {({ blob, url, loading, error }) =>
                        loading ? '... CARGANDO' : props.label
                    }
                </PDFDownloadLink>
            }
            {props.type === ESPECIAL &&
                <PDFDownloadLink className="white-link" document={<MyDocEspecial />} fileName={`${props.title}-${props.data.NombreTipo}.pdf`}>
                    {({ blob, url, loading, error }) =>
                        loading ? '... CARGANDO' : props.label
                    }
                </PDFDownloadLink>
            }
        </>
    )
}
