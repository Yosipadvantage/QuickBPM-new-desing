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
import { Toast } from "../../../utils/Toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { useStyles } from "../../../utils/Themes";
import { GlobalService } from '../../../core/services/GlobalService';

const _globalService=new GlobalService();

export const TAutorizado = () => {
  const [list, setlist] = useState<any>([]);
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
useEffect(()=>{
    getAutorizadosEmpresa(16462)
},[])

   const getAutorizadosEmpresa = (idAccount: number) => {
    setShowSpinner(true);
    _globalService
        .getAutorizadosEmpresa(idAccount)
        .subscribe(resp => {
            setShowSpinner(false);
            console.log('respuesta servicio autorizados',resp);
            if (resp.length > 0) {
                console.log('listado autorizados',resp);
                setlist(resp)
            } else{
                console.log('no se encontro informacion')
            }
        })
};
// hola


  return (
    <>
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
                  <TableCell>Tramite</TableCell>
                  <TableCell>descripcion</TableCell>
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Caracterizacion</TableCell>
                  <TableCell>Nombre Usuario</TableCell>
                  <TableCell>Paso Actual</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {list
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: any, index: number) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={item.IDProcedureImp}
                    >
                      <TableCell>{item.DataBeanProperties.Name}</TableCell>
                      <TableCell>
                        {item.DataBeanProperties.Description}
                      </TableCell>
                      {}
                      <TableCell>{item.DataBeanProperties.Since}</TableCell>
                      <TableCell>
                        {item.DataBeanProperties.CharacterizationName}
                      </TableCell>
                      <TableCell>
                        {item.DataBeanProperties.AccountName}
                      </TableCell>
                      <TableCell>
                        {item.DataBeanProperties.ProcedureName} /<br />
                        {item.DataBeanProperties.AlphaCode}
                      </TableCell>
                      <TableCell>{item.DataBeanProperties.StateName}</TableCell>
                    </TableRow>
                  ))} */}
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
    </>
  );
};
