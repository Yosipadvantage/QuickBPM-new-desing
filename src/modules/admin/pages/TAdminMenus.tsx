import { SpeedDial, SpeedDialAction, MenuItem, ThemeProvider, TextField, TablePagination, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, ButtonGroup, Tooltip, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { AdminService } from "../../../core/services/AdminService";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import {
  IApplicationTypeMenu,
  IApplicationTypeModule,
} from "../model/Applicationtype";
import { NEMenus } from "../components/NEMenus";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

interface IAdminMenus {
  getShowSpinner: Function;
  listModules: IApplicationTypeModule[]
}

const _adminService = new AdminService();

export const TAdminMenus: React.FC<IAdminMenus> = (props: IAdminMenus) => {
  const [listMenus, setListMenus] = useState<IApplicationTypeMenu[]>([]);
  const [listModules, setListModules] = useState<IApplicationTypeModule[]>([]);
  const [isSelected, setisSelected] = useState(false);
  const [idSelected, setIdSelected] = useState(0);

  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<IApplicationTypeMenu>();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(-1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setListModules(props.listModules);
    setRowsPerPage(parseInt(items));;

  }, [props.listModules, items]);

  const handleChangeSelect = (e: any) => {
    setIdSelected(e);
    e === "d" ? setisSelected(false) : setisSelected(true);
    getApplicationIDAtLevel(e);
  };

  const getApplicationIDAtLevel = (id: number) => {
    props.getShowSpinner(true);
    _adminService
      .getApplicationIDAtLevel(id)
      .subscribe(resp => {
        if (resp) {
          setListMenus(resp);
          props.getShowSpinner(false);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la información",
          });
        }
      })
  };

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteApplycationID();
    }
  };

  const deleteApplycationID = () => {
    _adminService
      .deleteApplicationID(idDelete)
      .subscribe(res => {
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
        getApplicationIDAtLevel(idSelected);
      })
  };

  const classes = useStyles();

  return (
    <>
      <div className="pull-title-top mt-3 ml-2">
        <h1>Administrador de Menús</h1>
      </div>
      <div className="w-100">
        <Row>
          <div className="card w-100 ml-2">
            <Col sm={6} className="w-100">
              <TextField
                className="mb-3"
                size="small"
                select
                fullWidth
                color="secondary"
                margin="normal"
                label=".:Seleccione un módulo:."
                id="state"
                onChange={(e) => {
                  handleChangeSelect(e.target.value);
                }}
              >
                {listModules.map(item => (
                  <MenuItem
                    key={item.IDApplicationType} value={item.IDApplicationType}>
                    {item.Name}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
          </div>
          {isSelected && (
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
          )}
          {isSelected &&
            <Col sm={12}>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ height: "70vh" }}>
                  <Table stickyHeader aria-label="sticky table" className={classes.root}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Código</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listMenus
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item: any) => (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>{item.IDLn}</TableCell>
                            <TableCell>{item.Code}</TableCell>
                            <TableCell>{item.Name}</TableCell>
                            <TableCell>{item.URL}</TableCell>
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
                                          setIdDelete(item.IDLn);
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
                                    key={item.IDLn}
                                    icon={<BsPencilSquare />}
                                    tooltipTitle="Editar módulo"
                                    onClick={() => {
                                      formComponent("Editar", item);
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={item.IDLn + 1}
                                    icon={<BsTrash />}
                                    tooltipTitle="Eliminar módulo"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(item.IDLn);
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
                  labelRowsPerPage="Columnas por Página"
                  component="div"
                  count={listMenus.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Col>}
        </Row>
      </div>
      {show && (
        <NEMenus
          closeModal={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          idSelected={idSelected}
          getApplicationDACatalog={getApplicationIDAtLevel}
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
