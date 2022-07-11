import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
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

import { BsArrowRepeat, BsSearch, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Office } from "../../configuration/model/Office";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { formatDate } from "../../../utils/formatDate";
import { inputsTheme, useStyles } from "../../../utils/Themes";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMFilterTray {
  getShowMFilterTray: Function;
  dataShowMFilterTray: boolean;
  dataType: number;
}

const MFilterTray: React.FC<IMFilterTray> = (
  props: IMFilterTray
) => {
  const [dateInit, setDateInit] = useState<Date | null>(null);
  const [dateInitError, setDateInitError] = useState<boolean>(false);
  const [dateFinal, setDateFinal] = useState<Date | null>(null);
  const [dateFinalError, setDateFinalError] = useState<boolean>(false);
  const [showEstadoAntecedente, setEstadoAntecedente] = useState<boolean>(false);
  const [showEstadoMarcaje, setEstadoMarcaje] = useState<boolean>(false);
  const [showEstadoImpresion, setEstadoImpresion] = useState<boolean>(false);
  const [estado, setEstado] = useState(0);
  const [estadoCiu, setEstadoCiu] = useState(0);

  const [listEstado, setListEstado] = useState([
    { id: 1, nombre: "PENDIENTE VALIDACION" },
    { id: 2, nombre: "CON ANTECEDENTES" },
    { id: 3, nombre: "SIN ANTECEDENTES" },
    { id: 4, nombre: "CON EXCEPCION" },
  ]);
  const [listEstadoMarcaje, setListEstadoMarcaje] = useState([
    { id: 1, nombre: "SOLICITADO" },
    { id: 2, nombre: "RECIBIDA" },
    { id: 3, nombre: "MARCADA" },
    { id: 4, nombre: "ENTREGADA" },
    /* { id: 5, nombre: "PERMISO" },
    { id: 6, nombre: "ACEPTADO" },
    { id: 7, nombre: "IMPRESO" },
    { id: 8, nombre: "ENTREGADO" }, */
  ]);
  const [listEstadoImpresion, setListEstadoImpresion] = useState([
    { id: 1, nombre: "POR_IMPRIMIR" },
    { id: 2, nombre: "IMPRESOS" },
    { id: 3, nombre: "ENTREGADOS" },
    { id: 4, nombre: "ANULADOS" },
  ]);
  const [listAprobCiu, setListAprobCiu] = useState([
    { id: 5, nombre: "APROBADO_SI" },
    { id: 6, nombre: "APROBADO_NO" },
    { id: 7, nombre: "APROBADO_PENDIENTE" },
  ]);

  useEffect(() => {
    if (props.dataType === 1) {
      setEstadoAntecedente(true);
      setEstadoMarcaje(false);
      setEstadoImpresion(false);
    }
    if (props.dataType === 2) {
      setEstadoAntecedente(false);
      setEstadoMarcaje(true);
      setEstadoImpresion(false);
    }
    if (props.dataType === 3) {
      setEstadoImpresion(true);
      setEstadoAntecedente(false);
      setEstadoMarcaje(false);
    }
  }, []);

  const closeModal = () => {
    props.getShowMFilterTray(false);
    /* props.refresh(); */
  };

  const handleSearch = () => {
    if (estado) {
      let obj = {
        'Estado': estado,
        'AprobadoCiu': estadoCiu,
        'FechaInicial': dateInit,
        'FechaFinal': dateFinal
      };
      props.getShowMFilterTray(false, obj, 1);
    } else {
      Toast.fire({
        icon: "error",
        title: "Debe seleccionar un estado.",
      });
    }
  };

  return (
    <Modal
      show={props.dataShowMFilterTray}
       onHide={closeModal}
      size="lg"
      centered
       
    >
      <Modal.Header>
        Buscar
        <BsXSquare className='pointer' onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="container">
          <Col sm={12} className="mt-2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label="Fecha Inicial: "
                value={dateInit}
                onChange={(e) => {
                  setDateInit(e);
                  e !== null ? setDateInitError(false) : setDateInitError(true);
                }}
                renderInput={(props) => (
                  <TextField
                    size="small"
                    fullWidth
                    color="secondary"
                    {...props}
                  />
                )}
              />
            </LocalizationProvider>
            <span className="mt-2 text-danger">
              {dateInitError ? "El campo Fecha Inicial es obligatorio" : ""}
            </span>
          </Col>
          <Col sm={12} className="mt-3">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label="Fecha Final: "
                value={dateFinal}
                onChange={(e) => {
                  setDateFinal(e);
                  e !== null ? setDateFinalError(false) : setDateFinalError(true);
                }}
                renderInput={(props) => (
                  <TextField
                    size="small"
                    fullWidth
                    color="secondary"
                    {...props}
                  />
                )}
              />
            </LocalizationProvider>
            <span className="mt-2 text-danger">
              {dateFinalError ? "El campo Fecha Final es obligatorio" : ""}
            </span>
          </Col>
          {showEstadoAntecedente && (
            <Col sm={12} className="mt-1">
              <TextField
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un estado"
                id="state"
                onChange={(e) => setEstado(parseInt(e.target.value))}
              >
                {listEstado.map((item: any) => (
                  <MenuItem value={item.id}>{item.nombre}</MenuItem>
                ))}
              </TextField>
            </Col>
          )}
          {showEstadoMarcaje && (
            <Col sm={12} className="mt-1">
              <TextField
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un estado"
                id="state"
                onChange={(e) => setEstado(parseInt(e.target.value))}
              >
                {listEstadoMarcaje.map((item: any) => (
                  <MenuItem value={item.id}>{item.nombre}</MenuItem>
                ))}
              </TextField>
            </Col>
          )}
          {showEstadoImpresion && (
            <Col sm={6} className="mt-1">
              <TextField
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un estado de impresión"
                id="state"
                onChange={(e) => setEstado(parseInt(e.target.value))}
              >
                {listEstadoImpresion.map((item: any) => (
                  <MenuItem value={item.id}>{item.nombre}</MenuItem>
                ))}
              </TextField>
            </Col>
          )}
          {showEstadoImpresion && (
            <Col sm={6} className="mt-1 w-100">
              <TextField
                margin="normal"
                size="small"
                select
                fullWidth
                color="secondary"
                label="Seleccione un estado de aprobación"
                id="state"
                onChange={(e) => setEstadoCiu(parseInt(e.target.value))}
              >
                {listAprobCiu.map((item: any) => (
                  <MenuItem value={item.id}>{item.nombre}</MenuItem>
                ))}
              </TextField>
            </Col>
          )}
          <Col sm={12}>
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<BsSearch />}
                className="my-3"
                fullWidth
                onClick={() => {
                  handleSearch();
                }}
              >
                Buscar
              </Button>
            </ThemeProvider>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MFilterTray;
