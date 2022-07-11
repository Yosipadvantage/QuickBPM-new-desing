import React, { useEffect, useState } from "react";
import {
  BsFillBookmarkFill,
  BsFillFileEarmarkRichtextFill,
  BsPencilSquare,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
  ThemeProvider,
  Tooltip,
} from "@mui/material";

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
import { TypeForm } from "../model/TypeForm";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { FiMoreVertical } from "react-icons/fi";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import NEForms from "../components/NEForms";
import { DataForm } from "../model/Form";
import { TextField } from "@mui/material";
import { NoInfo } from "../../../utils/NoInfo";
import TResponseValue from "./TResponseValue";
import { JsonPrototypeDialog } from "../components/JsonPrototypeDialog";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _adminService = new AdminService();

interface ITForms {}

const TForms: React.FC<ITForms> = () => {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showResponseValue, setShowResponseValue] = useState(false);
  const [formdata, setformdata] = useState<DataForm>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [list, setList] = useState<DataForm[]>([]);
  const [listTypeForm, setListTypeForm] = useState<TypeForm[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [selector, setSelector] = useState(-1);
  const [IDForm, setIDForm] = useState(-1);
  const [responseJsonSelected, setResponseJsonSelected] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

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
    viewModal();
  };

  const openResponseValue = (data: any) => {
    console.log(data);
    setIDForm(data);
    setShowResponseValue(true);
  };

  useEffect(() => {
    getFormClassCatalog();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getFormCatalog = (id: number) => {
    setShowSpinner(true);
    _adminService.getFormCatalog(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
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

  const getFormClassCatalog = () => {
    setShowSpinner(true);
    _adminService.getFormClassCatalog().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListTypeForm(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const deleteForm = () => {
    _adminService.deleteForm(idDelete).subscribe((rps) => {
      console.log(rps);
      if (rps) {
        console.log(selector);
        setShowSpinner(false);
        getFormCatalog(selector);
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getFormCatalog(selector);
  };

  const closeModalResponse = (data: boolean) => {
    setShowResponseValue(data);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteForm();
    }
  };

  const handleShowJson = (json: string) => {
    setResponseJsonSelected(json);
    setShowDialog(true);
  };

  const classes = useStyles();

  const onChangeComponent = (e: any) => {
    console.log(e);
    setSelector(e);
    getFormCatalog(e);
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <main>
          <header className="page-header page-header-light bg-light mb-0">
            <div className="container-fluid">
              <div className="page-header-content pt-4 pb-10">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4">
                    <h1>Formularios</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-5 mt-2">
            <div className="card box-s">
              <div className="col-md-6 mb-2">
                <TextField
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label=".:Seleccione un tipo:."
                  id="state"
                  onChange={(e) => onChangeComponent(e.target.value)}
                >
                  {listTypeForm.map((item) => (
                    <MenuItem value={item.IDFormClass}>{item.Name}</MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-xxl-4 col-12 col-xxl-12">
                <div className="row justify-content-end">
                  <div className="col-md-6 d-flex justify-content-end mr-5">
                    <div className="form-group">
                      {selector !== -1 && (
                        <button
                          className="btn btn-sm btn-outline-secondary btn-custom"
                          type="button"
                          onClick={() => {
                            formComponent("Crear");
                          }}
                        >
                          <BsPlus />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                          <TableCell>ID</TableCell>
                          <TableCell>Codigo</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Url del Formulario</TableCell>
                          <TableCell>Prototipo Json</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any, index: number) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell>{item.IDForm}</TableCell>
                              <TableCell>{item.Code}</TableCell>
                              <TableCell>{item.Name}</TableCell>
                              <TableCell>{item.Description}</TableCell>
                              <TableCell>{item.FormURLComponent}</TableCell>
                              <TableCell>
                                <ThemeProvider theme={inputsTheme}>
                                  <IconButton
                                    color="secondary"
                                    onClick={() => (
                                      handleShowJson(item.ResponseJsonValue),
                                      setIDForm(item.IDForm)
                                    )}
                                  >
                                    <BsFillFileEarmarkRichtextFill />
                                  </IconButton>
                                </ThemeProvider>
                              </TableCell>
                              <TableCell>
                                <div className="d-lg-flex d-none">
                                  <ButtonGroup>
                                    <ThemeProvider theme={inputsTheme}>
                                      <Tooltip title="Variables de respuesta">
                                        <Button
                                          variant="contained"
                                          className="box-s mr-1 mt-2 mb-2"
                                          color="secondary"
                                          onClick={() => {
                                            openResponseValue(item.IDForm);
                                          }}
                                        >
                                          <BsFillBookmarkFill />
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
                                          className="box-s mr-3 mt-2 mb-2"
                                          color="error"
                                          onClick={() => {
                                            setShowDelete(true);
                                            setIdDelete(item.IDForm);
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
                                    ariaLabel="SpeedDial basic example"
                                    direction="left"
                                    FabProps={{
                                      size: "small",
                                      style: { backgroundColor: "#503464" },
                                    }}
                                    icon={<FiMoreVertical />}
                                  >
                                    <SpeedDialAction
                                      key={index}
                                      sx={{ color: "secondary" }}
                                      icon={<BsFillBookmarkFill />}
                                      tooltipTitle="Variables de respuesta"
                                      onClick={() => {
                                        openResponseValue(item.IDForm);
                                      }}
                                    />
                                    <SpeedDialAction
                                      key={index + 1}
                                      sx={{ color: "secondary" }}
                                      icon={<BsPencilSquare />}
                                      tooltipTitle="Editar Formulario"
                                      onClick={() => {
                                        formComponent("Editar", item);
                                      }}
                                    />
                                    <SpeedDialAction
                                      key={index + 2}
                                      icon={<BsTrash />}
                                      tooltipTitle="Eliminar"
                                      onClick={() => {
                                        setShowDelete(true);
                                        setIdDelete(item.IDForm);
                                      }}
                                    />
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
              ) : list.length === 0 && selector !== -1 ? (
                <NoInfo />
              ) : (
                ""
              )}
              {show && (
                <NEForms
                  getShow={closeModal}
                  dataShow={show}
                  dataObj={formdata}
                  dataTitle={title}
                  dataType={selector}
                  openResponseValue={openResponseValue}
                />
              )}
              {showResponseValue && (
                <TResponseValue
                  getShow={closeModalResponse}
                  dataShow={showResponseValue}
                  dataObjID={IDForm}
                  dataTitle={title}
                  selector={selector}
                  refresh={getFormCatalog}
                />
              )}
              {showDelete && (
                <GenericConfirmAction
                  show={showDelete}
                  setShow={setShowDelete}
                  confirmAction={deleteElement}
                  title={"¿Está seguro de eliminar el elemento?"}
                />
              )}
              {showDialog && (
                <JsonPrototypeDialog
                  showDialog={showDialog}
                  setShowDialog={setShowDialog}
                  responseJsonSelected={responseJsonSelected}
                  setResponseJsonSelected={setResponseJsonSelected}
                  IDForm={IDForm}
                  IDJsonService={null}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TForms;
