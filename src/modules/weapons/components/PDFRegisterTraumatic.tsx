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
                            <b>FORMULARIO PARA EL SERVICIO DE MARCACI??N DE  ARMAS TRAUM??TICAS</b>
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    LUGAR Y FECHA:
                                </Text>
                            </div>
                            <div style={styles.textR}>
                                <Text style={styles.textP}>
                                    N??. DE FORMULARIO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            TIPO DE PERSONA PROPIETARIO DEL ARMA TRAUM??TICA
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    PERSONAL NATURAL:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    PERSONA JUR??DICA:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            DATOS DE CONTACTO PROPIETARIO DEL ARMA TRAUM??TICA PERSONA NATURAL
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
                                    C??DULA DE CIUDADAN??A N??: {/* {"  " + user.DataBeanProperties.Nit} */}
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
                                    FECHA  DE  EXPEDICI??N:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    TEL??FONO DE CONTACTO:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    DIRECCI??N DE DOMICILIO:
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
                                    CORREO ELETR??NICO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            DATOS DE CONTACTO PROPIETARIO DEL ARMA TRAUM??TICA PERSONA JUR??DICA
                        </Text>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    RAZ??N SOCIAL:
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
                                    C??DULA DE CIUDADAN??A N??:
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
                                    FECHA  DE  EXPEDICI??N:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    TEL??FONO EMPRESA:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    DIRECCI??N EMPRESA:
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
                                    NOMBRES Y APELLIDOS COMPLETOS DE LA PERSONA AUTORIZADA PARA ENTREGA Y RECEPCI??N
                                    DEL ARMA TRAUM??TICA:
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
                                    C??DULA DE CIUDADAN??A N??:
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
                                    FECHA  DE  EXPEDICI??N:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    TEL??FONO CONTACTO:
                                </Text>
                            </div>
                            <div style={styles.text}>
                                <Text style={styles.textP}>
                                    CORREO:
                                </Text>
                            </div>
                        </div>
                        <Text style={styles.tittle}>
                            INFORMACI??N  DEL  ARMA  TRAUM??TICA
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
                                    N??MERO DE SERIAL DEL FABRICANTE (ORIGEN): {"  " + property.DataArma.Serial}
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
                                    N??MERO DE LA FACTURA DE COMPRA: {"  " + property.DataArma.NoFacturaCompra}
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
                                    N??MERO DE MANIFIESTO DE IMPORTACI??N DE LA DIAN: {"  " + property.DataArma.ManifiestoDian}
                                </Text>
                            </div>
                        </div>
                    </Page>
                    <Page style={styles.body} size='LETTER'>
                        <Text style={styles.header}>
                            <b>FORMULARIO PARA EL SERVICIO DE MARCACI??N DE  ARMAS TRAUM??TICAS</b>
                        </Text>
                        <Text style={styles.tittle}>
                            AUTORIZACI??N PARA EL SERVICIO DE MARCACI??N DEL ARMA TRAUM??TICA:
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
                                    YO {"  " + user.DataBeanProperties.EntityName} identificado con la cedula de ciudadan??a n??mero
                                    {"  " + user.DataBeanProperties.Nit} expedida en 
                                    {"  " + user.DataBeanProperties.BornSiteIDName}, autorizo a la Industria Militar para
                                    el marcaje del ARMA TRAUM??TICA de mi propiedad, por lo cual acepto que:
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
                                    a.	La Industria Militar no se hace responsable si durante el proceso de marcaci??n y registro del arma traum??tica, sufre alg??n desperfecto y/o da??o t??cnico por composici??n o manipulaci??n de la misma.
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textB}>
                                    b.	Al momento de la entrega del arma traum??tica a la Industria Militar
                                    para el correspondiente proceso de marcaci??n y registro, se debe anexar
                                    copia de la factura de compra y manifiesto de importaci??n del arma.
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textB}>
                                    c.	El presente documento solo servir?? como consentimiento para el proceso
                                    de marcaje, sin que ello configure la autorizaci??n inmediata para el porte
                                    y del arma traum??tica, ya que este ??ltimo, corresponde solo a uno de los
                                    tr??mites que se exigen para la expedici??n del permiso por la autoridad
                                    competente. Lo anterior conforme a lo previsto por el Decreto 1417 del
                                    2021 ???Por el cual se adicionan unos art??culos al Libro2, Parte2, T??tulo 4,
                                    Cap??tulo 3 del Decreto 1070 de 2015 Decreto ??nico Reglamentario del Sector
                                    Administrativo de Defensa sobre la clasificaci??n reglamentaci??n de la
                                    tenencia y el porte de las armas traum??ticas???.
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
                                    FIRMA Y POSTFIRMA DEL JEFE DE ALMAC??N O
                                    REPRESENTANTE DE VENTAS QUIEN RECIBE EL ARMA TRAUM??TICA
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA DEL CIUDADANO QUE ENTREGA
                                    EL ARMA TRAUM??TICA PARA SERVICIO DE MARCACI??N
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
                                    FECHA DE MARCACI??N:
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    ALMACEN INDUMIL DONDE SE RECIBE EL ARMA TRAUM??TICA: {"  " + data.NombreAlmacen}
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textMain}>
                                <Text style={styles.textP}>
                                    N??MERO DE SERIAL INDUMIL (ALFAN??MERICO):
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA FUNCIONARIO QUE EFECTUA
                                    EL SERVICIO DE MARCAJE DEL ARMA TRAUM??TICA
                                </Text>
                            </div>
                        </div>
                        <div style={styles.rowText}>
                            <div style={styles.textFirma}>
                                <Text style={styles.textP}>
                                    FIRMA Y POSTFIRMA DEL CIUDADANO QUE RECIBE
                                    A SATISFACCI??N EL SERVICIO DE MARCACI??N DEL ARMA TRAUM??TICA
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
