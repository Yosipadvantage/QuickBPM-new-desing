import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import {
  Button,
  ButtonGroup,
  MenuItem,
  ThemeProvider,
  Tooltip,
  TextField,
} from "@mui/material";

import { BsArrowRepeat, BsFillCaretUpFill, BsFillFileArrowUpFill, BsFillFileEarmarkPdfFill, BsSave, BsSearch, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { Toast } from "../../../utils/Toastify";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { getSession } from "../../../utils/UseProps";
import { GlobalService } from "../../../core/services/GlobalService";
import { SSpinner } from "../../../shared/components/SSpinner";

/**
 * Servicios
 */
const _weaponService = new WeaponsService();
const _globalService = new GlobalService();

interface IMUploadRecord {
  getShowMUploadRecord: Function;
  dataShowMUploadRecord: boolean;
  dataItemData: any;
  docType: number
}


const MUploadRecord: React.FC<IMUploadRecord> = (props: IMUploadRecord) => {


  const [showM4, setShowM4] = useState(false);
  const [showL4, setShowL4] = useState(false);
  const [prevDoc4, setUrl4] = useState<any>();
  const [file4, setFile4] = useState<any>(null);
  const [showM3, setShowM3] = useState(false);
  const [showL3, setShowL3] = useState(false);
  const [prevDoc3, setUrl3] = useState<any>();
  const [file3, setFile3] = useState<any>(null);
  const [showM, setShowM] = useState(false);
  const [showL, setShowL] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [prevDoc, setUrl] = useState<any>();
  const [showM2, setShowM2] = useState(false);
  const [showL2, setShowL2] = useState(false);
  const [file2, setFile2] = useState<any>(null);
  const [prevDoc2, setUrl2] = useState<any>();
  const [docType, setDocType] = useState<any>(0);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log(props.dataItemData);
    setDocType(props.docType)
  }, []);

  const updateActaTraumatica = (bean: any) => {
    _weaponService.updateActaTraumatica(bean).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        closeModal();
        Toast.fire({
          icon: "success",
          title: "Se ha guardado la información",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const closeModal = () => {
    props.getShowMUploadRecord(false);
    /* props.refresh(); */
  };

  /**
   * Metodo que permite cerrar el modal de archivo
   * @param data
   */
  const closeSearchM = (data: any) => {
    setShowM(false);
  };

  /**
   * Metodo que permite cerrar el modal e archivo
   * @param data
   */
  const closeSearchM2 = (data: any) => {
    setShowM2(false);
  };

  const closeSearchM3 = (data: any) => {
    setShowM3(false);
  };

  const closeSearchM4 = (data: any) => {
    setShowM4(false);
  };

  /**
   * Metodo que permite guardar la información
   */
  const handleSearch = () => {
    if (file !== null && file2 !== null) {
      const obj = {
        'IDOffice': props.dataItemData?.IDOffice,
        'IDSalidaAlmacen': props.dataItemData?.IDSalidaAlmacen,
        'IDAccount': props.dataItemData?.IDCiudadano,
        'IDFuncionario': parseInt(getSession().IDAccount),
        'TipoActa': 1,
        'ListaDoc': JSON.stringify(
          {
            "Documento": {
              "MediaContext": file.MediaContext,
              "Media": file.Media,
            },
            "ActaFirmada": {
              "MediaContext": file2.MediaContext,
              "Media": file2.Media,
            }
          }
        )
      }
      console.log(obj);
      updateActaTraumatica(obj);
    } else {
      Toast.fire({
        icon: "warning",
        title: 'Debe subir todos los archivos'
      });
    }
  };

  const handleSearch2 = () => {
    if (file !== null && file2 !== null) {
      const obj = {
        'IDOffice': props.dataItemData?.IDOffice,
        'IDSalidaAlmacen': props.dataItemData?.IDSalidaAlmacen,
        'IDAccount': props.dataItemData?.IDCiudadano,
        'IDFuncionario': parseInt(getSession().IDAccount),
        'TipoActa': 1,
        'ListaDoc': JSON.stringify(
          {
            "Documento": {
              "MediaContext": file.MediaContext,
              "Media": file.Media,
            },
            "ActaFirmada": {
              "MediaContext": file2.MediaContext,
              "Media": file2.Media,
            },
            "CamaraComercio": {
              "MediaContext": file3.MediaContext,
              "Media": file3.Media,
            },
            "DocFotos": {
              "MediaContext": file4.MediaContext,
              "Media": file4.Media,
            }
          }
        )
      }
      console.log(obj);
      updateActaTraumatica(obj);
    } else {
      Toast.fire({
        icon: "warning",
        title: 'Debe subir todos los archivos'
      });
    }
  };

  const getItemM = async (data: any) => {
    console.log(data);
    setFile(data);
    setShowL(true);
  };

  const getItemM2 = async (data: any) => {
    console.log(data);
    setFile2(data);
    setShowL2(true);
  };

  const getItemM3 = async (data: any) => {
    console.log(data);
    setFile3(data);
    setShowL3(true);
  };

  const getItemM4 = async (data: any) => {
    console.log(data);
    setFile4(data);
    setShowL4(true);
  };

  return (
    <>
      <Modal
        show={props.dataShowMUploadRecord}
         onHide={closeModal}
        size="lg"
        centered
         
      >
        <Modal.Header>
          Información Anexa
          <BsXSquare className='pointer' onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Row className="container">
            {docType == 2 &&
              <Col sm={12}>
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="mr-2 w-100"
                    variant="contained"
                    color="secondary"
                    endIcon={<BsFillCaretUpFill />}
                    onClick={() => {
                      setShowM3(true);
                    }}
                  >
                    Subir Camara de comercio de la entidad (opcional)
                  </Button>
                </ThemeProvider>
                {showL3 ? (
                  <div className="w-100">
                    <a className="w-100" href={prevDoc3}>
                      {file3.Media}
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </Col>}
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  className="mr-2 w-100"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillCaretUpFill />}
                  onClick={() => {
                    setShowM(true);
                  }}
                >
                  {(docType == 2) ? 'Subir Copia Documento de Identidad del Respresentante Legal' : 'Subir Copia Documento de Identidad del Solicitante'}
                </Button>
              </ThemeProvider>
              {showL ? (
                <div className="w-100">
                  <a className="w-100" href={prevDoc}>
                    {file.Media}
                  </a>
                </div>
              ) : (
                ""
              )}
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  className="mr-2 w-100"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillCaretUpFill />}
                  onClick={() => {
                    setShowM4(true);
                  }}
                >
                  Fotos por lote (opcional)
                </Button>
              </ThemeProvider>
              {showL2 ? (
                <div className="w-100">
                  <a className="w-100" href={prevDoc4}>
                    {file4.Media}
                  </a>
                </div>
              ) : (
                ""
              )}
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  className="mr-2 w-100"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillCaretUpFill />}
                  onClick={() => {
                    setShowM2(true);
                  }}
                >
                  Acta Devolución Traumatica Firmada
                </Button>
              </ThemeProvider>
              {showL2 ? (
                <div className="w-100">
                  <a className="w-100" href={prevDoc2}>
                    {file2.Media}
                  </a>
                </div>
              ) : (
                ""
              )}
            </Col>
            <Col sm={12} className="mt-3">
              <ThemeProvider theme={inputsTheme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<BsFillFileEarmarkPdfFill />}
                  className="my-3"
                  fullWidth
                  onClick={() => {
                    docType != 2
                      ? handleSearch()
                      : handleSearch2();
                  }}
                >
                  ADJUNTAR
                </Button>
              </ThemeProvider>
            </Col>
          </Row>
        </Modal.Body>
        {showM &&
          <SLoadDocument
            accept={['.pdf']}
            setShow={closeSearchM}
            type={1}
            title={"Recurso"}
            getMedia={getItemM}
            show={showM}
            beanAction={null}
          />
        }
        {showM2 &&
          <SLoadDocument
            accept={['.pdf']}
            setShow={closeSearchM2}
            type={1}
            title={"Recurso"}
            getMedia={getItemM2}
            show={showM2}
            beanAction={null}
          />
        }
        {showM3 &&
          <SLoadDocument
            accept={['.pdf']}
            setShow={closeSearchM3}
            type={1}
            title={"Recurso"}
            getMedia={getItemM3}
            show={showM3}
            beanAction={null}
          />
        }
        {showM4 &&
          <SLoadDocument
            accept={['.pdf']}
            setShow={closeSearchM4}
            type={1}
            title={"Recurso"}
            getMedia={getItemM4}
            show={showM4}
            beanAction={null}
          />
        }
      </Modal>
      {spinner && <SSpinner show={spinner} />}
    </>
  );
};

export default MUploadRecord;
