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

import { BsArrowRepeat, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Office } from "../../configuration/model/Office";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { formatDate } from "../../../utils/formatDate";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { getSession } from "../../../utils/UseProps";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMUpdateAntecedent {
  getShowMUpdateAntecedent: Function;
  dataShowMUpdateAntecedent: boolean;
  /* dataList: any[]; */
}

const MUpdateAntecedent: React.FC<IMUpdateAntecedent> = (
  props: IMUpdateAntecedent
) => {
  const [dateInit, setDateInit] = useState<Date | null>(null);
  const [dateInitError, setDateInitError] = useState<boolean>(false);
  const [dateFinal, setDateFinal] = useState<Date | null>(null);
  const [dateFinalError, setDateFinalError] = useState<boolean>(false);
  const [listOffice, setListOffice] = useState<Office[]>([]);
  const [office, setOffice] = useState(0);

  useEffect(() => {
    getOfficeCatalogForAccount(parseInt(getSession().IDAccount));
  }, []);

  const closeModal = () => {
    props.getShowMUpdateAntecedent(false);
    /* props.refresh(); */
  };

  /**
   * Metodo que permite actualizar antecedente
   * @param idAccount ID de la persona que esta en sesión
   * @param idOffice Seccional
   * @param dateInit Fecha Desde
   * @param dateFinal Fecha Hasta
   */
  const actualizarTablaAntecendetes = (
    idAccount: number,
    idOffice: number,
    dateInit: string,
    dateFinal: string
  ) => {
    _configService
      .actualizarTablaAntecendetes(idAccount, idOffice, dateInit, dateFinal)
      .subscribe((res) => {
        if (res) {
          console.log(idAccount, idOffice, dateInit, dateFinal);
          closeModal();
          Toast.fire({
            icon: "success",
            title: "Se ha actualizado",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción",
          });
        }
      });
  };

  const handleUpdate = () => {
    console.log(office);
    if (office) {
      if (dateInit) {
        if (dateFinal) {
          actualizarTablaAntecendetes(
            parseInt(getSession().IDAccount),
            office,
            formatDate(dateInit),
            formatDate(dateFinal)
          );
        } else {
          Toast.fire({
            icon: "error",
            title: "Debe seleccionar una Fecha Final.",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Debe seleccionar una Fecha Inicial.",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Debe seleccionar una oficina.",
      });
    }
  };

  /**
   * Metodo que permiete consultar seccionales.
   * @param idAccount id de la persona que esta en sesion.
   */
  const getOfficeCatalogForAccount = (idAccount: number) => {
    console.log(idAccount);
    _configService.getOfficeCatalogForAccount(idAccount).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListOffice(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la accion",
        });
      }
    });
  };

  return (
    <Modal
      show={props.dataShowMUpdateAntecedent}
      onHide={closeModal} 
      size="lg"
      centered
       
    >
      <Modal.Header>
        Antecedente
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="container">
          <Col sm={12}>
            <TextField
              margin="normal"
              size="small"
              select
              fullWidth
              color="secondary"
              label="Seleccione una seccional"
              id="state"
              onChange={(e) => setOffice(parseInt(e.target.value))}
            >
              {listOffice.map((item: Office) => (
                <MenuItem value={item.IDOffice}>{item.Name}</MenuItem>
              ))}
            </TextField>
          </Col>
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
                  e !== null
                    ? setDateFinalError(false)
                    : setDateFinalError(true);
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
              {dateFinalError ? "El campo Fecha Inicial es obligatorio" : ""}
            </span>
          </Col>
          <Col sm={12}>
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<BsArrowRepeat />}
                className="my-3"
                fullWidth
                onClick={() => {
                  handleUpdate();
                }}
              >
                Actualizar
              </Button>
            </ThemeProvider>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MUpdateAntecedent;
