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
import { WeaponsService } from "../../../core/services/WeaponsService";
import { Record } from "../model/record.interface";
import { FileService } from "../../../core/services/FileService";

/**
 * Servicios
 */
const _weaponService = new WeaponsService();
const _fileService = new FileService();

interface ITRecord { }

const TRecord: React.FC<ITRecord> = () => {

  const [list, setList] = useState<Record[]>([]); // Cambiar interface
  const [showSpinner, setShowSpinner] = useState(false);

  // Tabla
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getActaTraumaticaCatalogPorPropiedad();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getActaTraumaticaCatalogPorPropiedad = () => {
    setShowSpinner(true);
    _weaponService.getActaTraumaticaCatalogPorPropiedad().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        resp.forEach(element => {
          console.log(element.ListaDoc);
          if (element.ListaDoc) {
            const obj = JSON.parse(element.ListaDoc);
            element.document = obj.Documento.Media;
            element.record = obj.ActaFirmada.Media;
            element.URLdocument = _fileService.getUrlFile(obj.Documento.MediaContext, obj.Documento.Media);
            element.URLrecord = _fileService.getUrlFile(obj.ActaFirmada.MediaContext, obj.ActaFirmada.Media);
          } else {
            element.document = "No hay documento";
            element.record = "No hay acta";
          }
        });
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
                <h1>Actas</h1>
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
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Acta Firmada</TableCell>
                  {/* <TableCell>Tipo Acta</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {list
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: Record, index: number) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{item.Since}</TableCell>
                      <TableCell>{
                        <a href={item.URLdocument} target="_blank">{item.document}</a>}
                      </TableCell>
                      <TableCell>{
                        <a href={item.URLrecord} target="_blank">{item.record}</a>}
                      </TableCell>
                      {/* <TableCell>{item.TipoActa}</TableCell> */}
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
    </div>
  );
}

export default TRecord;