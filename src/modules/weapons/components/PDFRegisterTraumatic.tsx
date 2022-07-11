import { Document, Page, PDFViewer, Image, StyleSheet, Text, Font } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap';
import { GlobalService } from '../../../core/services/GlobalService';
import { FileService } from '../../../core/services/FileService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { Toast } from '../../../utils/Toastify';

interface IPDFRegisterTraumatic {
    dataObj: any;
}

/* getAccountByIDAccount */

const _globalService = new GlobalService();
const _fileService = new FileService();

const PDFRegisterTraumatic: React.FC<IPDFRegisterTraumatic> = (props: IPDFRegisterTraumatic) => {

    const [data, setData] = useState<any>(props.dataObj);
    const [property, setProperty] = useState<any>(JSON.parse(props.dataObj.Propiedades));

    useEffect(() => {
        console.log(data);
        console.log(property);
        console.log(data.IDCiudadano);
    }, []);


    Font.register({
        family: 'Roboto',
        src: './assets/font/Roboto-Bold.ttf',
    })

    const styles = StyleSheet.create({
        body: {
            paddingTop: 30,
            paddingBottom: 30,
            paddingHorizontal: 30,
        },
        header: {
            paddingHorizontal: 30,
            fontSize: 13,
            textAlign: 'center',
            color: 'grey',
            fontWeight: 'bold'
        },
        tittle: {
            marginTop: 10,
            paddingHorizontal: 30,
            fontSize: 10,
            textAlign: 'center',
            fontFamily: 'Roboto',
            fontWeight: 600
        },
        rowText: {
            marginTop: 8,
            flexDirection: 'row',
            marginHorizontal: 25,
        },
        text: {
            width: 600,
            /* border: '1px solid #503464', */
        },
        textMain: {
            width: 520,
            /* border: '1px solid #503464', */
        },
        textFirma: {
            marginTop: 40,
            width: 520,
            borderTop: '1px solid #503464',
            fontFamily: 'Roboto',
            fontWeight: 600
        },
        textR: {
            width: 300,
            /* border: '1px solid #503464', */
        },
        textP: {
            fontSize: 9,
        },
        textA: {
            fontSize: 11,
        },
        textB: {
            fontSize: 10,
        },
    });

    return (
        <>
            <PDFViewer>
                <Document>
                    <Page style={styles.body} size='LETTER'>
                        {/* <div style={styles.mainBox}>
                            
                        </div> */}
                        <Text style={styles.header}>
                            <b>FORMULARIO PARA EL SERVICIO DE MARCACIÓN DE  ARMAS TRAUMÁTICAS</b>
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    LUGAR Y FECHA:
                                </Text>
                            </div>
                            <div style={styles.textR}>
                                <Text style={styles.textP}>
                                    N°. DE FORMULARIO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            TIPO DE PERSONA PROPIETARIO DEL ARMA TRAUMÁTICA
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    PERSONAL NATURAL:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    PERSONA JURÍDICA:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            DATOS DE CONTACTO PROPIETARIO DEL ARMA TRAUMÁTICA PERSONA NATURAL
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NOMBRES  Y  APELLIDOS  COMPLETOS: {/* {"  " + user.DataBeanProperties.EntityName.toUpperCase()} */}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CÉDULA DE CIUDADANÍA N°: {/* {"  " + user.DataBeanProperties.Nit} */}
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    EXPEDIDA EN: {/* {"  " + user.DataBeanProperties.BornSiteIDName.toUpperCase()} */}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    FECHA  DE  EXPEDICIÓN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    TELÉFONO DE CONTACTO:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    DIRECCIÓN DE DOMICILIO:
                                </Text>
                            </div>
                            <div style={styles.textR}>
                                <Text style={styles.textP}>
                                    CIUDAD:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    CORREO ELETRÓNICO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            DATOS DE CONTACTO PROPIETARIO DEL ARMA TRAUMÁTICA PERSONA JURÍDICA
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    RAZÓN SOCIAL:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NIT:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NOMBRES  Y  APELLIDOS  COMPLETOS REPRESENTANTE LEGAL:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    R
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CÉDULA DE CIUDADANÍA N°:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    EXPEDIDA EN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    FECHA  DE  EXPEDICIÓN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    TELÉFONO EMPRESA:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    DIRECCIÓN EMPRESA:
                                </Text>
                            </div>
                            <div style={styles.textR}>
                                <Text style={styles.textP}>
                                    CIUDAD:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NOMBRES Y APELLIDOS COMPLETOS DE LA PERSONA AUTORIZADA PARA ENTREGA Y RECEPCIÓN
                                    DEL ARMA TRAUMÁTICA:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    R
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CÉDULA DE CIUDADANÍA N°:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    EXPEDIDA EN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    FECHA  DE  EXPEDICIÓN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    TELÉFONO CONTACTO:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CORREO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            INFORMACIÓN  DEL  ARMA  TRAUMÁTICA
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CLASE DE ARMA: {"  " + property.DataArma.NombreTipo}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    MARCA: {"  " + property.DataArma.Descripcion}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NÚMERO DE SERIAL DEL FABRICANTE (ORIGEN): {"  " + property.DataArma.Serial}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CAPACIDAD DE CARGA: {"  " + property.DataArma.Capacidad}
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CALIBRE: {"  " + property.DataArma.Calibre}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NÚMERO DE LA FACTURA DE COMPRA: {"  " + property.DataArma.NoFacturaCompra}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    FECHA DE LA FACTURA DE COMPRA: {"  " + property.DataArma.FechaFacCompra}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NÚMERO DE MANIFIESTO DE IMPORTACIÓN DE LA DIAN: {"  " + property.DataArma.ManifiestoDian}
                                </Text>
                            </div>
                        </div>
                    </Page>
                    <Page style={styles.body} size='LETTER'>
                        <Text style={styles.header}>
                            <b>FORMULARIO PARA EL SERVICIO DE MARCACIÓN DE  ARMAS TRAUMÁTICAS</b>
                        </Text>
                        <Text style={styles.tittle}>
                            AUTORIZACIÓN PARA EL SERVICIO DE MARCACIÓN DEL ARMA TRAUMÁTICA:
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                {/* <Text style={styles.textA}>
                                    YO {"  " + user.DataBeanProperties.EntityName} identificado con la cedula de ciudadanía número
                                    {"  " + user.DataBeanProperties.Nit} expedida en 
                                    {"  " + user.DataBeanProperties.BornSiteIDName}, autorizo a la Industria Militar para
                                    el marcaje del ARMA TRAUMÁTICA de mi propiedad, por lo cual acepto que:
                                </Text> */}
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textB}>
                                    a.	La Industria Militar no se hace responsable si durante el proceso de marcación y registro del arma traumática, sufre algún desperfecto y/o daño técnico por composición o manipulación de la misma.
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textB}>
                                    b.	Al momento de la entrega del arma traumática a la Industria Militar
                                    para el correspondiente proceso de marcación y registro, se debe anexar
                                    copia de la factura de compra y manifiesto de importación del arma.
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textB}>
                                    c.	El presente documento solo servirá como consentimiento para el proceso
                                    de marcaje, sin que ello configure la autorización inmediata para el porte
                                    y del arma traumática, ya que este último, corresponde solo a uno de los
                                    trámites que se exigen para la expedición del permiso por la autoridad
                                    competente. Lo anterior conforme a lo previsto por el Decreto 1417 del
                                    2021 “Por el cual se adicionan unos artículos al Libro2, Parte2, Título 4,
                                    Capítulo 3 del Decreto 1070 de 2015 Decreto único Reglamentario del Sector
                                    Administrativo de Defensa sobre la clasificación reglamentación de la
                                    tenencia y el porte de las armas traumáticas”.
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    OBSERVACIONES:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA DEL JEFE DE ALMACÉN O
                                    REPRESENTANTE DE VENTAS QUIEN RECIBE EL ARMA TRAUMÁTICA
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA DEL CIUDADANO QUE ENTREGA
                                    EL ARMA TRAUMÁTICA PARA SERVICIO DE MARCACIÓN
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>

                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    FECHA DE MARCACIÓN:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    ALMACEN INDUMIL DONDE SE RECIBE EL ARMA TRAUMÁTICA: {"  " + data.NombreAlmacen}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    NÚMERO DE SERIAL INDUMIL (ALFANÚMERICO):
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA FUNCIONARIO QUE EFECTUA
                                    EL SERVICIO DE MARCAJE DEL ARMA TRAUMÁTICA
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA DEL CIUDADANO QUE RECIBE
                                    A SATISFACCIÓN EL SERVICIO DE MARCACIÓN DEL ARMA TRAUMÁTICA
                                </Text>
                            </div>
                        </div>
                    </Page>
                </Document>
            </PDFViewer>
            {/* {spinner && <SSpinner show={spinner} />} */}
        </>
    )
}

export default PDFRegisterTraumatic;
