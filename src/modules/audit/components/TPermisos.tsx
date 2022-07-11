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
import { FC, useEffect, useState } from "react";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { useStyles } from "../../../utils/Themes";
import { WeaponsService } from "../../../core/services/WeaponsService";

interface Props {
  nit: number | undefined;
}
const _weaponService = new WeaponsService();

export const TPermisos: FC<Props> = ({ nit }) => {
  const [list, setList] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  /**
   * *Seccion funciones necesarias para las tablas
   */
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const classes = useStyles();
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  /**
   * *Fin Secciones funciones tablas
   */

  useEffect(() => {
    if (nit) {
      getPermissionByIdentification(nit);
    }
  }, [nit]);

  const getPermissionByIdentification = (id: number) => {
    setShowSpinner(true);
    _weaponService.getPermissionByIdentification(id).subscribe((resp: any) => {
      setShowSpinner(false);
      if (resp) {
        if (resp.length > 0) {
          console.log('id usuario buscado', id)
          console.log("respuesta permisos ", resp);
          setList(resp);
        }
      }
    });
  };
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 2 }}>
        <TableContainer sx={{ height: "70vh" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className={classes.root}
          >
            <TableHead>
              <TableRow>
                <TableCell>ID Permiso</TableCell>
                <TableCell>Tipo de Permiso</TableCell>
                <TableCell>Código Fijo</TableCell>
                <TableCell>Código Aleatorio</TableCell>
                <TableCell>Fecha de Vencimiento</TableCell>
                <TableCell>Hashval</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any, index: number) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={item.IDProcedureImp}
                  >
                    <TableCell>{item.IDPermiso}</TableCell>
                    <TableCell>{item.NombreTipo}</TableCell>
                    <TableCell>{item.CodeA}</TableCell>
                    <TableCell>{item.CodeB}</TableCell>
                    <TableCell>{item.FechaVencimiento}</TableCell>
                    <TableCell>{item.Hashval}</TableCell>
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

      {showSpinner && <SSpinner show={showSpinner} />}
    </>
  );
};
