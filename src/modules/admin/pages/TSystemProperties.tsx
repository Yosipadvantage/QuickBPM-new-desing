import { SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ButtonGroup,
  ThemeProvider,
  Tooltip,
  Button
} from "@mui/material";


import { AdminService } from "../../../core/services/AdminService";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { NESystemProperties } from "../components/NESystemProperties";
import { SystemProperty } from "../model/SystemPropertie";
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { SSpinner } from "../../../shared/components/SSpinner";
import { ConfigService } from "../../../core/services/ConfigService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
// import { VariablesSystem } from "../../../utils/VariablesSystem";

interface ISystemProperties { }

const _adminService = new AdminService();
const _configService = new ConfigService();
// const _variablesService = new VariablesSystem();

export const TSystemProperties: React.FC<ISystemProperties> = () => {
  const [list, setList] = useState<SystemProperty[]>([]);
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<SystemProperty>();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState<any>(10);
  const [page, setPage] = useState(0);


  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const { permiso } = useSelector((state: RootState) => state.permiso);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getSystemPropertyList();
    setRowsPerPage(parseInt(items));;
  }, [items]);


  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getSystemPropertyList();
  };

  const getSystemPropertyList = () => {
    setShowSpinner(true);
    _adminService.getSystemPropertyList().subscribe((res) => {
      console.log(res);
      if (res) {
        setList(res);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteSystemProperty();
      getSystemPropertyList();
    }
  };

  const deleteSystemProperty = () => {
    _adminService.deleteSystemProperty(idDelete).subscribe((res) => {
      if (res.DataBeanProperties.ObjectValue) {
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
      }
      else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const classes = useStyles();

  return (
    <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
      <div className="row w-100">
        <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
          <div className="pull-title-top mt-3 ml-3">
            <h1>Propiedades del sistema</h1>
          </div>
          <div className="row justify-content-end">
            <div className="col-md-6 d-flex justify-content-end mr-5">
              <div className="form-group">
                <button
                  className="btn btn-sm btn-outline-secondary btn-custom"
                  type="button"
                  onClick={() => {
                    formComponent("Crear");
                  }}
                >
                  <BsPlus />
                </button>
              </div>
            </div>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "70vh" }}>
              <Table stickyHeader aria-label="sticky table" className={classes.root}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>AppName</TableCell>
                    <TableCell>SystemValue</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{item.IDSystemProperty}</TableCell>
                        <TableCell>{item.Name}</TableCell>
                        <TableCell>{item.Description}</TableCell>
                        <TableCell>{item.AppName}</TableCell>
                        <TableCell>{item.SystemValue}</TableCell>
                        <TableCell>
                          <div className="d-lg-flex d-none">
                            <ButtonGroup>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Editar elemento">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      formComponent("Editar", item);
                                    }}>
                                    <BsPencilSquare />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                              {permiso === 'true' &&
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Eliminar elemento">
                                    <Button
                                      variant="contained"
                                      className="box-s mr-1 mt-2 mb-2"
                                      color="error"
                                      onClick={() => {
                                        setShowDelete(true);
                                        setIdDelete(
                                          item.IDSystemProperty
                                        );
                                      }}>
                                      <BsTrash />
                                    </Button>
                                  </Tooltip>
                                </ThemeProvider>}
                            </ButtonGroup>
                          </div>
                          <div className="d-block d-lg-none">
                            <SpeedDial
                              ariaLabel="SpeedDial basic example"
                              direction="left"
                              FabProps={{
                                size: "small",
                                style: { backgroundColor: "#503464", }
                              }}
                              icon={<FiMoreVertical />}
                            >
                              <SpeedDialAction
                                key={item.IDSystemProperty}
                                sx={{ color: "secondary" }}
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              {permiso === 'true' &&
                                <SpeedDialAction
                                  key={item.IDSystemProperty + 1}
                                  icon={<BsTrash />}
                                  tooltipTitle="Eliminar"
                                  onClick={() => {
                                    setShowDelete(true);
                                    setIdDelete(item.IDSystemProperty);
                                  }}
                                />
                              }
                              )
                            </SpeedDial>
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
        </div>
      </div>
      {showSpinner && (<SSpinner show={showSpinner} />)}
      {show && (
        <NESystemProperties
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
        />
      )}
      {showDelete && (
        <GenericConfirmAction
          show={showDelete}
          setShow={setShowDelete}
          confirmAction={deleteElement}
          title="¿Está seguro de eliminar el elemento?"
        />
      )}
    </div>
  );
};
