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
  IconButton,
  InputAdornment,
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
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { AiOutlineClose } from "react-icons/ai";

/**
 * Servicios
 */
const _configService = new ConfigService();

interface IMFilterCINAR {
  getShowMFilterCINAR: Function;
  dataShowMFilterCINAR: boolean;
  /* dataList: any[]; */
}

export const MFilterCINAR: React.FC<IMFilterCINAR> = (props: IMFilterCINAR) => {
  const [dateInit, setDateInit] = useState<Date | null>(null);
  const [dateInitError, setDateInitError] = useState<boolean>(false);
  const [dateFinal, setDateFinal] = useState<Date | null>(null);
  const [dateFinalError, setDateFinalError] = useState<boolean>(false);
  const [showPerson, setShowPerson] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [IDAccount, setIDAccount] = useState<number>(-1);

  useEffect(() => { }, []);

  const closeModal = () => {
    props.getShowMFilterCINAR(false);
  };

  const handleSearch = () => {
    if (dateInit) {
      if (dateFinal) {
        const obj = {
          IDAccount: IDAccount > 0 ? IDAccount : null,
          FechaInicial: formatDate(dateInit),
          FechaFinal: formatDate(dateFinal),
        };
        props.getShowMFilterCINAR(false, obj);
      } else {
        Toast.fire({
          icon: "error",
          title: "Debe seleccionar una fecha final.",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Debe seleccionar una fecha inicial.",
      });
    }
  };

  const getItem = (data: any) => {
    console.log('respuesta de busqueda de persona', data);
    setUser(data);
    setIDAccount(data.IDAccount);
  };

  const closeSearch = (data: any) => {
    setShowPerson(data);
  };

  return (
    <Modal
      show={props.dataShowMFilterCINAR}
      onHide={closeModal}
      size="lg"
      centered
       
    >
      <Modal.Header>
        Buscar
        <BsXSquare className="pointer" onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="container">
          <Col sm={12} className="mt-2">
            <TextField
              size="small"
              value={user ? user.EntityName : ""}
              label=".:Usuario:. *"
              fullWidth
              color="secondary"
              id="distributionChanel"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <ButtonGroup>
                      <IconButton
                        onClick={() => {
                          setUser(undefined);
                          setIDAccount(-1);
                        }}
                      >
                        <AiOutlineClose />
                      </IconButton>

                      <IconButton onClick={() => setShowPerson(true)}>
                        <BsSearch />
                      </IconButton>
                    </ButtonGroup>
                  </InputAdornment>
                ),
              }}
              onClick={() => {
                setShowPerson(true);
              }}
            />
          </Col>
          <Col sm={12} className="mt-2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
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
              {dateFinalError ? "El campo Fecha Final es obligatorio" : ""}
            </span>
          </Col>
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
      <SSearchPerson
        getShow={closeSearch}
        getPerson={getItem}
        dataShow={showPerson}
      />
    </Modal>
  );
};
