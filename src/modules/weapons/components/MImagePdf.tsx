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

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMImagePdf {
  getShowMImagePdf: Function;
  dataShowMImagePdf: boolean;
  setDevolucion: Function;
  setDataImagePdf: Function;
}

const MImagePdf: React.FC<IMImagePdf> = (props: IMImagePdf) => {

  const [showM, setShowM] = useState(false);
  const [showL, setShowL] = useState(false);
  const [prevDoc, setUrl] = useState<any>();
  const [showM2, setShowM2] = useState(false);
  const [showL2, setShowL2] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [file2, setFile2] = useState<any>(null);
  const [prevDoc2, setUrl2] = useState<any>();
  const [accesorios, setAccesorios] = useState<boolean>(false);
  const [obs, setObs] = useState<boolean>(false);
  const [obsText, setObsText] = useState("");
  const [accesoriosText, setAccesoriosText] = useState("");

  useEffect(() => { }, []);

  const closeModal = () => {
    props.getShowMImagePdf(false);
    /* props.refresh(); */
  };

  /**
   * Metodo que permite cerrar el modal de archivo
   * @param data
   */
  const closeSearchM = (data: any) => {
    setShowM(data);
  };

  /**
   * Metodo que permite cerrar el modal e archivo
   * @param data
   */
  const closeSearchM2 = (data: any) => {
    setShowM2(data);
  };

  /**
   * Metodo que permite guardar la información
   */
  const handleSearch = () => {
    if (file !== null && file2 !== null) {
      const obj = {
        "fileCuerpo": file,
        "fileSerie": file2,
        "acc": accesorios,
        "obs": obs,
        "acessorios": accesoriosText,
        "observacion": obsText,
      };
      props.setDataImagePdf(obj);
      props.setDevolucion(true);
    } else {
      Toast.fire({
        icon: "warning",
        title: 'Debe cargar las imagenes del Arma'
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

  return (
    <Modal
      show={props.dataShowMImagePdf}
      onHide={closeModal}
      size="lg"
      centered
       
    >
      <Modal.Header>
        Información Anexa
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="container">
          <Col sm={6} className="mt-3 d-flex justify-content-center">
            <ThemeProvider theme={inputsTheme}>
              <FormGroup>
                <FormControlLabel control={
                  <ThemeProvider theme={inputsTheme}>
                    <Checkbox color="secondary" defaultChecked={accesorios} onChange={() => setAccesorios(!accesorios)} />
                  </ThemeProvider>
                } label="¿Incluye accesorios?" />
              </FormGroup>
            </ThemeProvider>
          </Col>
          <Col sm={6} className="mt-3 d-flex justify-content-center">
            <ThemeProvider theme={inputsTheme}>
              <FormGroup>
                <FormControlLabel control={
                  <ThemeProvider theme={inputsTheme}>
                    <Checkbox color="secondary" defaultChecked={obs} onChange={() => setObs(!obs)} />
                  </ThemeProvider>
                } label="¿Incluye observaciones?" />
              </FormGroup>
            </ThemeProvider>
          </Col>
          {accesorios &&
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="Accesorios"
                placeholder="Escriba aqui una breve descripción de los accesorios devueltos con el arma"
                label="Accesorios"
                fullWidth
                variant="outlined"
                multiline
                inputProps={{
                  maxLength: 450,
                }}
                rows={5}
                onChange={(e) => {
                  setAccesoriosText(e.target.value);
                }}
              />
            </Col>
          }
          {obs &&
            <Col sm={12} className="mt-3">
              <TextField
                size="small"
                color="secondary"
                id="Observaciones"
                placeholder="Escriba aqui las observaciones anexadas al acta de devolución de arma traumática."
                label="Observaciones"
                fullWidth
                variant="outlined"
                multiline
                rows={7}
                inputProps={{
                  maxLength: 535,
                }}
                onChange={(e) => {
                  setObsText(e.target.value);
                }}
              />
            </Col>}
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
                  handleSearch();
                }}
              >
                GENERAR ACTA
              </Button>
            </ThemeProvider>
          </Col>
        </Row>
      </Modal.Body>
      {showM ? (
        <SLoadDocument
          setShow={closeSearchM}
          type={1}
          title={"Recurso"}
          getMedia={getItemM}
          show={showM}
          beanAction={null}
        />
      ) : (
        ""
      )}
      {showM2 ? (
        <SLoadDocument
          setShow={closeSearchM2}
          type={1}
          title={"Recurso"}
          getMedia={getItemM2}
          show={showM2}
          beanAction={null}
        />
      ) : (
        ""
      )}
    </Modal>
  );
};

export default MImagePdf;
