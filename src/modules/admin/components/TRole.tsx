import React, { useEffect, useState } from "react";
import {
  Paper,
  SpeedDial,
  SpeedDialAction,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TablePagination,
  ButtonGroup,
  ThemeProvider,
  Tooltip,
  Button,
} from "@mui/material";
import {
  BsFillMenuButtonWideFill,
  BsPencilSquare,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";

import { AdminService } from "../../../core/services/AdminService";
import { IApplicationTypeRole } from "../model/Applicationtype";
import { NERole } from "./NERole";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { AdminRolesModules } from "./AdminRolesModules";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

interface IRole {}

const _adminService = new AdminService();

export const TRole: React.FC<IRole> = (props: IRole) => {
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<IApplicationTypeRole>();
  const [show, setShow] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [roleSeleted, setRoleSeleted] = useState("");
  const [idRole, setIdRole] = useState(0);
  const [listRole, setListRole] = useState<IApplicationTypeRole[]>([]);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  useEffect(() => {
    getRoleCatalog();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getRoleCatalog = () => {
    _adminService.getRoleCatalog().subscribe((resp) => {
      setListRole(resp);
    });
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

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    setShow(true);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteRole();
    }
  };

  const deleteRole = () => {
    setShowSpinner(true);
    _adminService.deleteRole(idDelete).subscribe((res) => {
      Toast.fire({
        icon: "success",
        title: "Se ha eliminado con éxito!",
      });
      setShowSpinner(false);
      getRoleCatalog();
    });
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getRoleCatalog();
  };

  const classes = useStyles();

  return (
    <>
      <div className="pull-title-top">
        <h1>Administrador de Roles</h1>
      </div>
      <div className="px-5 mt-2">
        <div className="row">
          <div className="col-xxl-4 col-12 col-xxl-12">
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
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "70vh" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.root}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listRole
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{item.IDRole}</TableCell>
                        <TableCell>{item.Name}</TableCell>
                        <TableCell>{item.Description}</TableCell>
                        <TableCell>{item.State}</TableCell>
                        <TableCell>
                          <div className="d-lg-flex d-none">
                            <ButtonGroup>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Administrar Módulos">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      setShowAdmin(true);
                                      setIdRole(item.IDRole);
                                      setRoleSeleted(item.Name);
                                    }}
                                  >
                                    <BsFillMenuButtonWideFill />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Editar elemento">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      formComponent("Editar", item);
                                    }}
                                  >
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
                                      setIdDelete(item.IDRole);
                                    }}
                                  >
                                    <BsTrash />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                            </ButtonGroup>
                          </div>
                          <div className="d-block d-lg-none">
                            <SpeedDial
                              className=""
                              ariaLabel="SpeedDial basic example"
                              direction="left"
                              FabProps={{
                                size: "small",
                                style: { backgroundColor: "#503464" },
                              }}
                              icon={<FiMoreVertical />}
                            >
                              <SpeedDialAction
                                key={item.IDRole}
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar elemento"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              <SpeedDialAction
                                key={item.IDRole + 1}
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar elemento"
                                onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(item.IDRole);
                                }}
                              />
                              <SpeedDialAction
                                key={item.IDRole + 2}
                                icon={<BsFillMenuButtonWideFill />}
                                tooltipTitle="Administrar Módulos"
                                onClick={() => {
                                  setShowAdmin(true);
                                  setIdRole(item.IDRole);
                                  setRoleSeleted(item.Name);
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
              count={listRole.length}
              labelRowsPerPage="Columnas por Página"
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
      {showSpinner && (
        <div className="spinner d-flex justify-content-center">
          <SSpinner show={showSpinner} />
        </div>
      )}
      {show && (
        <NERole
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          refreshList={getRoleCatalog}
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
      {showAdmin && (
        <AdminRolesModules
          show={showAdmin}
          setShow={setShowAdmin}
          idRole={idRole}
          role={roleSeleted}
        />
      )}
    </>
  );
};
