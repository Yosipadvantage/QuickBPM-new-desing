import {
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Button,
  ThemeProvider,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { getSession } from "../../../utils/UseProps";
import { SSpinner } from "../../../shared/components/SSpinner";
import { Toast } from "../../../utils/Toastify";
import { SuscriptionService } from "../../../core/services/SuscriptionService";
import { formatDate } from "../../../utils/formatDate";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { useStyles, inputsTheme } from "../../../utils/Themes";
import { MuiThemeProvider } from "@material-ui/core";
import { BsLayersFill } from "react-icons/bs";
import { GiFamilyTree } from "react-icons/gi";
import { SButtonHistory } from "../../../shared/components/SButtonHistory";
import { MModelAsignacion } from "./MModelAsignacion";

interface Props {
  idAcount: number;
}
const _suscripcionService = new SuscriptionService();

export const TTramites: FC<Props> = ({ idAcount }) => {
  const [list, setList] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showAsignar, setShowAsignar] = useState(false);
  const [idProcedure, setIdProcedure] = useState();
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
    listarMisProcedimientos(idAcount);
  }, [idAcount]);

  const listarMisProcedimientos = async (id: number) => {
    setShowSpinner(true);
    await _suscripcionService
      .getProcedureImpByAccount(id)
      .then((resp: any) => {
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          console.log(
            "respuesta servidor",
            resp.data.DataBeanProperties.ObjectValue
          );
          setList(resp.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };
  console.log("lista de tramites ", list);

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
                <TableCell>Tramite</TableCell>
                <TableCell>descripcion</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Caracterizacion</TableCell>
                <TableCell>Nombre Usuario</TableCell>
                <TableCell>Paso Actual</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Aciones</TableCell>
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
                    <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                    <TableCell>{item.DataBeanProperties.Description}</TableCell>
                    {}
                    <TableCell>{item.DataBeanProperties.Since}</TableCell>
                    <TableCell>
                      {item.DataBeanProperties.CharacterizationName}
                    </TableCell>
                    <TableCell>{item.DataBeanProperties.AccountName}</TableCell>
                    <TableCell>
                      {item.DataBeanProperties.ProcedureName} /<br />
                      {item.DataBeanProperties.AlphaCode}
                    </TableCell>
                    <TableCell>{item.DataBeanProperties.StateName}</TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <div className="d-lg-flex d-none">
                          <SButtonHistory
                            idProcedure={item.DataBeanProperties.IDProcedureImp}
                            type={2}
                          />
                        </div>
                        <ThemeProvider theme={inputsTheme}>
                          <Tooltip title="Auditar">
                            <Button
                              variant="contained"
                              className="box-s mr-1 mt-2 mb-2"
                              color="secondary"
                              onClick={() => {
                                setShowAsignar(true);
                                setIdProcedure(
                                  item.DataBeanProperties.IDProcedureImp
                                );
                              }}
                            >
                              {<BsLayersFill />}
                            </Button>
                          </Tooltip>
                        </ThemeProvider>
                      </ButtonGroup>
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

      {showSpinner && <SSpinner show={showSpinner} />}
      {showAsignar && (
        <MModelAsignacion
          show={showAsignar}
          setShow={setShowAsignar}
          idProcedimiento={idProcedure}
        />
      )}
    </>
  );
};
