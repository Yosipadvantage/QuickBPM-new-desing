import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import {
  ThemeProvider,
  Paper,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  TablePagination,
} from "@mui/material";
import { Tooltip } from "@material-ui/core";
import { FiMoreVertical } from "react-icons/fi";
import {
  BsArrowUp,
  BsPencilSquare,
  BsPlus,
  BsTrash,
  BsSearch,
} from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { ICustomerType } from "../../configuration/model/CustomerType";
import { NEListCinar } from "../../configuration/components/NEListCinar";
import { pipeSort } from "../../../utils/pipeSort";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { MFilterCINAR } from "../components/MFilterCINAR";
import { formatDate } from "../../../utils/formatDate";

const _weaponService = new WeaponsService();

export const T_CinarList: any = () => {
  const [listCinar, setListCinar] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<ICustomerType>();
  const [title, setTitle] = useState("");
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [bean, setBean] = useState<any>(null);


  /**
   * TODO:CAMBIAR LA FECHA QUEMADA POR FECHA DEL DIA
   */
  /**
   * *Fecha actual
   */
  const initialState = {
    IDAccount: null,
    FechaInicial: null,
    FechaFinal: null,
  };

  useEffect(() => {
    setRowsPerPage(parseInt(items));
    let fecha = new Date();
    consultarRegistrosCINAR(null, fecha, fecha);
  }, [items]);

  const consultarRegistrosCINAR = (idAccount: any, fechaInicial: any, fechaFinal: any) => {
    setShowSpinner(true);
    _weaponService.filterCinar(initialState).subscribe((res) => {
      setShowSpinner(false);
      if (res) {
        console.log("respuesta carga inicial", res);
        setListCinar(res);
      } else {
        console.log('sin respuesta', res)
        setListCinar(res)
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };
  /**
   * *funcion filtro de fechas
   */
  const closeModal = (show: any, obj: any) => {
    if (obj) {
      console.log('funcionario', obj)
      consultarRegistrosCINAR(obj.IDAccount, obj.FechaInicial, obj.FechaFinal)
    }
    setShow(show);
    //getCustomerTypeCatalog();
  };

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
    <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
      <div className="row w-100">
        <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
          <div className="pull-title-top">
            <h1>Histórico Cinar</h1>
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<BsSearch />}
                className="my-3"
                fullWidth
                onClick={() => {
                  setShow(true);
                }}
              >
                Buscar
              </Button>
            </ThemeProvider>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "80vh" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.root}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Institución</TableCell>
                    <TableCell>Dpto/Mpio</TableCell>
                    <TableCell>Grado/Solicitante</TableCell>
                    <TableCell>Medio</TableCell>
                    <TableCell>Arma/Serial</TableCell>
                    <TableCell>Atendido por:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listCinar
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any, index: number) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{item.IDATENCIONCINAR}</TableCell>
                        <TableCell>{item.NombreFuerza}</TableCell>
                        <TableCell>{item.DEPARTAMENTO}<br />{item.CIUDAD}</TableCell>
                        <TableCell>
                          {item.IDENTIFICACION}
                          <br />
                          {item.NombreGrado}-{item.NOMBRESAPELLIDOS}
                        </TableCell>
                        <TableCell>{item.MEDIO}</TableCell>
                        <TableCell>{JSON.parse(item.DATAARMA).Descripcion}/{JSON.parse(item.DATAARMA).Serial}</TableCell>
                        <TableCell>{item.NombreFuncionario}</TableCell>
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
              count={listCinar.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
      {showSpinner && <SSpinner show={showSpinner} />}
      {/* {show && (
        <NEListCinar
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
        />
      )} */}
      <MFilterCINAR
        dataShowMFilterCINAR={show}
        getShowMFilterCINAR={closeModal}
      // setInfo={setBean}
      />
    </div>
  );
};
