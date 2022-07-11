import {
  TablePagination,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  ButtonGroup,
  ThemeProvider,
  Tooltip,
  Button,
  Paper,
  TableHead,
} from "@mui/material";
import { BsHandIndexThumb, BsSearch } from "react-icons/bs";
import { useStyles, inputsTheme } from "../../../utils/Themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { MFilterCINAR } from "../components/MFilterCINAR";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { Toast } from "../../../utils/Toastify";
import { NoInfo } from "../../../utils/NoInfo";

export const TTableCall = () => {

  const _WeaponService = new WeaponsService();
  const [list, setList] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bean, setBean] = useState<any>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  /**
   * *estructura de la tabla
   */

  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /**
   * *fin estructura de la data
   */
  const classes = useStyles();

  /**
   * *accion respuesta al cambio de estado del
   */
  useEffect(() => {
    const fecha = new Date();
    console.log(
      fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate()
    );
    consultarCallCenter(null, fecha, fecha);
  }, []);

  const consultarCallCenter = (
    idAccount: any,
    fechaInicial: any,
    fechaFinal: any
  ) => {
    setShowSpinner(true);
    _WeaponService
      .consultarCallCenter(idAccount, fechaInicial, fechaFinal)
      .subscribe((resp) => {
        setShowSpinner(false);
        if (resp.length > 0) {
          const aux = resp;
          console.log("Respuesta del servidor", resp);
          setList(aux);
        } else {
          console.log("sin resultados de busqueda", resp);
          setList(resp);
          Toast.fire({
            icon: "error",
            title: "No hay datos por mostrar ",
          });
        }
      });
  };

  const closeModal = (show: any, obj: any) => {
    if (obj) {
      console.log('funcionario', obj)
      consultarCallCenter(obj.IDAccount, obj.FechaInicial, obj.FechaFinal);
    }
    setShowModal(show);
  };

  console.log("datos en la lista", list);

  return (
    <div className="nWhite p-3 m-3 w-80">
      <div className="mt-3">
        <h2>Historial de Tickets Call Center</h2>
        <ThemeProvider theme={inputsTheme}>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              endIcon={<BsSearch />}
              className="my-3"
              style={{ width: "250px" }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Buscar
            </Button>
          </div>
        </ThemeProvider>
      </div>
      {list.length > 0 ?
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: "70vh" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className={classes.root}
            >
              <TableHead>
                <TableRow>
                  <TableCell># Radicado</TableCell>
                  <TableCell>Grado</TableCell>
                  <TableCell>Funcionario</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Obeservaciones</TableCell>
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
                      key={item.IDCALLCENTER}
                    >
                      <TableCell>
                        {item.DataBeanProperties.IDCALLCENTER}
                      </TableCell>
                      <TableCell>{item.DataBeanProperties.Grado}</TableCell>
                      <TableCell>
                        {item.DataBeanProperties.NombreFuncionario}
                      </TableCell>
                      <TableCell>
                        {item.DataBeanProperties.NombreMotivo}
                      </TableCell>
                      <TableCell>{item.DataBeanProperties.OBSERVACION}</TableCell>
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
        : <NoInfo />
      }
      <MFilterCINAR
        dataShowMFilterCINAR={showModal}
        getShowMFilterCINAR={closeModal}
      />
      {showSpinner && <SSpinner show={showSpinner} />}
    </div>
  );
};
