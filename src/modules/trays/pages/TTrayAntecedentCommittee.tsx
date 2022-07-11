import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

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
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { NoInfo } from "../../../utils/NoInfo";
import {
  Button,
  ButtonGroup,
  MenuItem,
  ThemeProvider,
  Tooltip,
  TextField,
} from "@mui/material";
import { BsArrowLeftRight, BsLayersFill } from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import MProtocolo from "../components/MHistoric";
import MStateAntecedent from "../components/MStateAntecedent";

/**
 * Servicios
 */
 const _configService = new ConfigService();

interface ITTrayAntecedentCommittee {}

const TTrayAntecedentCommittee: React.FC<ITTrayAntecedentCommittee> = () => {

  const [list, setList] = useState<any[]>([]); // Cambiar interface
  const [showStateAntecedent, setShowStateAntecedent] = useState(false);
  const [showProtocolo, setShowProtocolo] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // Tabla
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getAntecedentesEstadoRender();
    setRowsPerPage(parseInt(items));
  }, [items]);

  /**
   * Metodo que pemite cerrar el Modal de Cambio de Estado
   * @param data
   */
   const closeStateAntecedent = (data: any) => {
    setShowStateAntecedent(data);
  };

  /**
   * Metodo que pemite cerrar el Modal Protocolo
   * @param data
   */
   const closeProtocolo = (data: any) => {
    setShowProtocolo(data);
  };

  const getAntecedentesEstadoRender = () => {
    setShowSpinner(true);
    _configService.getAntecedentesEstadoRender().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setList(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  /**
   * Metodo de paginador para la tabla
   * @param event
   * @param newPage
   */
   const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const classes = useStyles();
  
  return (
    <div className="nWhite w-80 p-3 m-3">
      <header className="page-header page-header-light bg-light mb-0">
        <div className="container-fluid">
          <div className="page-header-content pt-4 pb-10">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1>Comité Antecedentes</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      {showSpinner ? (
        <SSpinner show={showSpinner} />
      ) : list.length > 0 ? (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: "70vh" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className={classes.root}
            >
              <TableHead>
                <TableRow>
                  {/* <TableCell>ID</TableCell> */}
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: any, index: number) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{item.NIT}</TableCell>
                      <TableCell>
                        {item.NAME1} {item.NAME2} {item.SURNAME1}{" "}
                        {item.SURNAME2}
                      </TableCell>
                      <TableCell>{item.NOMBREESTADO}</TableCell>
                      <TableCell>{item.FECH}</TableCell>
                      <TableCell>
                        <div className="d-lg-flex d-none">
                          <ButtonGroup>
                            <ThemeProvider theme={inputsTheme}>
                              <Tooltip title="Variables de respuesta">
                                <Button
                                  variant="contained"
                                  className="box-s mr-1 mt-2 mb-2"
                                  color="secondary"
                                  onClick={() => {
                                    setShowProtocolo(true);
                                  }}
                                >
                                  {<BsLayersFill />}
                                </Button>
                              </Tooltip>
                            </ThemeProvider>
                          </ButtonGroup>
                          <ButtonGroup>
                            <ThemeProvider theme={inputsTheme}>
                              <Tooltip title="Cambiar estado">
                                <Button
                                  variant="contained"
                                  className="box-s mr-1 mt-2 mb-2"
                                  color="secondary"
                                  onClick={() => {
                                    setShowStateAntecedent(true);
                                  }}
                                >
                                  {<BsArrowLeftRight />}
                                </Button>
                              </Tooltip>
                            </ThemeProvider>
                          </ButtonGroup>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.root}
            rowsPerPageOptions={[items, 10, 25, 100]}
            labelRowsPerPage="Columnas por Página"
            component="div"
            count={list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : list.length === 0 ? (
        <NoInfo />
      ) : (
        ""
      )}
      {showProtocolo && (
        <MProtocolo
          getShowMProtocolo={closeProtocolo}
          dataShowMProtocolo={showProtocolo}
          dataObjProtocolo={null}
        />
      )}
      {/* {showStateAntecedent && (
        <MStateAntecedent
          getShowMStateAntecedent={closeStateAntecedent}
          dataShowMStateAntecedent={showStateAntecedent}
        />
      )} */}
    </div>
  );
}

export default TTrayAntecedentCommittee;