import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Col } from "react-bootstrap";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { Toast } from "../../../utils/Toastify";
import { ConfigService } from "../../../core/services/ConfigService";
import { GlobalService } from "../../../core/services/GlobalService";
import { DataBeanProperties } from "../../../core/model/server-response.interface";

interface IPDFPermissionReport {
  obj: any;
}

const _weaponService = new WeaponsService();

export const PDFPermissionReport: React.FC<IPDFPermissionReport> = (
  props: IPDFPermissionReport
) => {
  const [spinner, setSpinner] = useState(true);
  const [listReport, setListReport] = useState<any>([]);
  const _configService = new ConfigService();
  const _globalService = new GlobalService();
  const [seccional, setSeccional] = useState("");
  const [asignados, setAsignados] = useState<any[]>([]);
  const [funcionario, setFuncionario] = useState<any>("");
  const [aux, setAux] = useState(0);
  let arreglo: any[] = [];

  useEffect(() => {
    getHojaPermisoCatalogPorPropiedades(props.obj);
    getNameSeccion();
  }, []);

  const stylesPag1 = StyleSheet.create({
    body: {
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: 30,
    },
    row: {
      marginTop: 20,
      marginHorizontal: 35,
    },
    chart: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 25,
      marginHorizontal: 50,
    },
    chartColumn: {
      flexDirection: "column",
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
      textAlign: "center",
    },
    text: {
      marginLeft: 0,
      fontSize: 12,
      textAlign: "left",
    },
    text2: {
      marginTop: 10,
      marginLeft: 35,
      fontSize: 12,
      textAlign: "left",
    },
    textJustify: {
      marginTop: 30,
      marginHorizontal: 35,
      marginBottom: 35,
      fontSize: 12,
      textAlign: "justify",
    },
    textChart: {
      flexDirection: "column",
      marginVertical: 2,
      marginHorizontal: 20,
      fontSize: 12,
      textAlign: "justify",
    },
    mainBox: {
      marginTop: 25,
    },
    observation: {
      marginTop: 5,
      width: 480,
      height: 150,
      border: "1px solid #503464",
      marginHorizontal: 35,
    },
    table: {
      margin: 20,
      border: "1px solid #000000",
      flexDirection: "column",
    },
    tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
  });

  const tableStyles = StyleSheet.create({
    table: {
      marginTop: 50,
      width: "100%",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #EEE",
      paddingTop: 5,
      paddingBottom: 5,
    },
    header: {
      borderTop: "none",
    },
    bold: {
      fontWeight: "bold",
    },
    // So Declarative and unDRY 👌
    row1: {
      fontSize: 6,
      width: "2%",
    },
    row2: {
      fontSize: 6,
      width: "10%",
    },
    row3: {
      fontSize: 6,
      width: "16%",
    },
    row4: {
      fontSize: 6,
      width: "16%",
    },
    row5: {
      fontSize: 6,
      width: "8%",
    },
    row6: {
      fontSize: 6,
      width: "23%",
    },
    row7: {
      fontSize: 6,
      width: "23%",
    },
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: 30,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 35,
      marginHorizontal: 35,
    },
    chart: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 35,
      marginHorizontal: 50,
    },
    chartColumn: {
      flexDirection: "column",
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
      border: "1px solid #503464",
      marginRight: 2,
    },
    image1: {
      height: 150,
      width: 237,
    },
    lineaSignatureLeft: {
      width: 160,
      border: "1px solid #503464",
    },
    lineaSignature: {
      width: 160,
      borderTop: "1px solid #503464",
    },
    marginImage: {
      paddingTop: 20,
    },
    marginSignature: {
      marginTop: 50,
      height: 20,
      width: 480,
      marginHorizontal: 35,
      padding: 5,
    },
    observation: {
      marginTop: 20,
      width: 480,
      height: 150,
      border: "1px solid #503464",
      marginHorizontal: 35,
      paddingRight: 15,
    },
    rowImage: {
      marginTop: 2,
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 35,
    },
    rowSignature: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 35,
    },
    rowSignatureText: {
      marginTop: 8,
      flexDirection: "row",
      marginHorizontal: 35,
    },
    textCenter: {
      marginTop: 10,
      fontSize: 12,
      textAlign: "center",
    },
    textImage: {
      fontSize: 12,
      textAlign: "center",
      border: "1px solid #503464",
    },
    textLef: {
      marginTop: 50,
      marginLeft: 50,
      fontSize: 11,
      textAlign: "left",
    },
    textLefObservation: {
      marginTop: 12,
      marginLeft: 20,
      fontSize: 11,
    },
    textObservation: {
      fontSize: 8,
      justifyContent: "center",
      lineHeight: 2,
    },
    textLefSignature: {
      marginTop: 12,
      marginLeft: 0,
      fontSize: 11,
    },
    textRightSignature: {
      marginTop: 12,
      marginLeft: 41,
      fontSize: 11,
    },
    text: {
      marginLeft: 0,
      fontSize: 12,
      textAlign: "left",
    },
    text2: {
      marginTop: 20,
      marginLeft: 35,
      fontSize: 12,
      textAlign: "left",
    },
    textJustify: {
      marginHorizontal: 35,
      marginBottom: 35,
      fontSize: 12,
      textAlign: "justify",
    },
    textChart: {
      flexDirection: "column",
      marginVertical: 2,
      marginHorizontal: 20,
      fontSize: 12,
      textAlign: "justify",
    },
    mainBox: {
      marginTop: 40,
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
    fixed: {
      position: "absolute",
      fontSize: 12,
      top: 5,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });
  const date = new Date().toLocaleDateString("es-es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const getHojaPermisoCatalogPorPropiedades = (obj: any) => {
    setSpinner(true);
    _weaponService
      .getHojaPermisoCatalogPorPropiedades(obj)
      .subscribe((resp) => {
        console.log(resp);
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          setListReport(resp.DataBeanProperties.ObjectValue);
          getFuncActualiza(resp);
          getlistAsignados(resp);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la información",
          });
        }
      });
  };
  const getNameSeccion = () => {
    _configService.getOfficeCatalog(props.obj.IDOffice).subscribe((resp) => {
      if (resp) {
        setSeccional(resp[0].Name);
      }
    });
  };
  const getFuncActualiza = (id: any) => {
    //   console.log('funcionario que actualiza',id.DataBeanProperties.ObjectValue[0].DataBeanProperties.IDFunActualiza)
    _globalService
      .getAccountByIDAccount(
        id.DataBeanProperties.ObjectValue[0].DataBeanProperties.IDFunActualiza
      )
      .subscribe((resp) => {
        setFuncionario(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
        console.log("funcionario", funcionario);
      });
  };
  const getlistAsignados = (list: any) => {
    if (props.obj.Estado === 5) {
      list.DataBeanProperties.ObjectValue.forEach((item: any) => {
        _globalService
          .getAccountByIDAccount(item.DataBeanProperties.IDAccount)
          .subscribe((resp: any) => {
            arreglo.push(
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.EntityName
            );
            setAsignados([...arreglo]);
          });
      });
    }
  };

  return (
    <>
      <PDFViewer>
        <Document title={props.obj.NumLote}>
          <Page style={stylesPag1.body} size="LETTER">
            <div style={stylesPag1.image}>
              <Image
                style={stylesPag1.image}
                src={process.env.PUBLIC_URL + "/assets/doc.png"}
                fixed
              />
            </div>
            <div style={stylesPag1.mainBox}>
              <Text style={stylesPag1.textCenter}>
                {props.obj.Estado === 4 &&
                  `PERMISOS ASIGNADOS A SECCIONAL: ${seccional}`}
                {props.obj.Estado === 5 && "PERMISOS ASIGNADOS"}
                {props.obj.Estado === 6 && "PERMISOS ANULADOS"}
              </Text>
              <div style={stylesPag1.row}>
                <Col sm={6}>
                  <Text style={stylesPag1.text}>
                    Fecha de generación:
                    {date}
                  </Text>
                </Col>
              </div>
              <View style={tableStyles.table}>
                <View
                  style={[
                    tableStyles.row,
                    tableStyles.bold,
                    tableStyles.header,
                  ]}
                >
                  <Text style={tableStyles.row1}>#</Text>
                  <Text style={tableStyles.row2}>Num. Lote</Text>
                  <Text style={tableStyles.row3}>Fecha Lote</Text>
                  <Text style={tableStyles.row4}>
                    Cód. Permiso/Cód. Seguridad
                  </Text>
                  <Text style={tableStyles.row5}>Tipo Permiso</Text>
                  {props.obj.Estado !== 5 && (
                    <Text style={tableStyles.row6}>Observaciones</Text>
                  )}
                  {props.obj.Estado === 5 && (
                    <>
                      <Text style={tableStyles.row6}>Solicitante</Text>
                      <Text style={tableStyles.row7}>Firma</Text>
                    </>
                  )}
                </View>
                {/* TABLEBODY */}
                {listReport.map((item: any, i: any) => (
                  <View key={i} style={tableStyles.row} wrap={false}>
                    <Text style={tableStyles.row1}>{i + 1}</Text>
                    <Text style={tableStyles.row2}>
                      {item.DataBeanProperties.Lote}
                    </Text>
                    <Text style={tableStyles.row3}>
                      {item.DataBeanProperties.Since}
                    </Text>
                    <Text style={tableStyles.row4}>
                      {item.DataBeanProperties.CodigoPermiso} /{" "}
                      {item.DataBeanProperties.CodigoSeguridad}
                    </Text>
                    <Text style={tableStyles.row5}>
                      {item.DataBeanProperties.NombreTipoPermiso}
                    </Text>

                    {props.obj.Estado !== 5 && (
                      <Text style={tableStyles.row6}>
                        {item.DataBeanProperties.Observaciones}
                      </Text>
                    )}
                    {props.obj.Estado === 5 && (
                      <>
                        <Text style={tableStyles.row6}>{asignados[i]}</Text>
                        <Text style={tableStyles.row7}></Text>
                      </>
                    )}
                  </View>
                ))}
              </View>
              {props.obj.Estado === 4 && (
                <div style={styles.marginSignature}>
                  <div style={styles.rowSignature}>
                    <Col sm={6} style={styles.lineaSignature}></Col>
                    <Col sm={6} style={styles.lineaSignature}></Col>
                  </div>
                  <div style={styles.rowSignatureText}>
                    <div style={styles.dimensionSignature}>
                      <Text style={styles.textLefSignature}>Firma</Text>
                      <Text style={styles.textLefSignature}>
                        {" "}
                        {funcionario.EntityName}
                      </Text>
                      <Text style={styles.textLefSignature}>
                        {" "}
                        {funcionario.Nit}
                      </Text>
                    </div>
                    <div style={styles.dimensionSignature}>
                      <Text style={styles.textRightSignature}>Firma</Text>
                      <Text style={styles.textRightSignature}>Enacargado de permisos DCCA </Text>
                      <Text style={styles.textRightSignature}>{seccional}</Text>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
              fixed
            />
          </Page>
        </Document>
      </PDFViewer>
      {spinner && <SSpinner show={spinner} />}
    </>
  );
};
