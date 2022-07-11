import { Paper, SpeedDial, SpeedDialAction, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, ButtonGroup, ThemeProvider, Tooltip, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";

import { AdminService } from "../../../core/services/AdminService";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeModule } from "../model/Applicationtype";
import { NEModules } from "../components/NEModules";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { ICONS } from '../components/Icon'
import { RootState } from "../../../store/Store";
import { useSelector } from "react-redux";

interface IAdminModules {
  getShowSpinner: Function;
  listModules: IApplicationTypeModule[];
  refresh: Function;
}

const _adminService = new AdminService();

export const TAdminModules: React.FC<IAdminModules> = (props: IAdminModules) => {
  const [listModules, setListModules] = useState<IApplicationTypeModule[]>([]);
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<IApplicationTypeModule>();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  useEffect(() => {
    setRowsPerPage(parseInt(items));
  }, [items])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setListModules(props.listModules);
  }, [props.listModules]);

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    props.refresh();
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      _adminService.deleteApplicationType(idDelete).subscribe((res: any) => {
        props.refresh();
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
      });
    }
  };

  const classes = useStyles();

  return (
    <>
      <div className="pull-title-top mt-3 ml-3">
        <h1>Administrador de Módulos</h1>
      </div>
      <div className="row  w-100 justify-content-end">
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
                <TableCell>Propósito</TableCell>
                <TableCell>Icono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listModules
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any) => (
                  <TableRow hover key={item.IDApplicationType} role="checkbox" tabIndex={-1}>
                    <TableCell>{item.IDApplicationType}</TableCell>
                    <TableCell>{item.Name}</TableCell>
                    <TableCell>{item.Purpose}</TableCell>
                    <TableCell>
                      <IconButton>
                        {ICONS[item.Type]}
                      </IconButton>
                    </TableCell>
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
                          <ThemeProvider theme={inputsTheme}>
                            <Tooltip title="Eliminar elemento">
                              <Button
                                variant="contained"
                                className="box-s mr-1 mt-2 mb-2"
                                color="error"
                                onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(item.IDApplicationType);
                                }}>
                                <BsTrash />
                              </Button>
                            </Tooltip>
                          </ThemeProvider>
                        </ButtonGroup>
                      </div>
                      <div className="d-block d-lg-none">
                        <SpeedDial
                          ariaLabel="SpeedDial basic example"
                          direction="left"
                          FabProps={{
                            size: "small",
                            style: { backgroundColor: "#503464" },
                          }}
                          icon={<FiMoreVertical />}
                        >
                          <SpeedDialAction
                            key={item.IDApplicationType}
                            icon={<BsPencilSquare />}
                            tooltipTitle="Editar elemento"
                            onClick={() => {
                              formComponent("Editar", item);
                            }}
                          />
                          <SpeedDialAction
                            key={item.IDApplicationType + 1}
                            icon={<BsTrash />}
                            tooltipTitle="Eliminar elemento"
                            onClick={() => {
                              setShowDelete(true);
                              setIdDelete(item.IDApplicationType);
                            }}
                          />
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
          component="div"
          labelRowsPerPage="Columnas por Página"
          count={listModules.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {show && (
        <NEModules
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
    </>
  );
};
