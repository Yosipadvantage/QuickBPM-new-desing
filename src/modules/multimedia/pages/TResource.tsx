import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
  Button,
  ButtonGroup,
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
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { FiMoreVertical } from "react-icons/fi";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { TextField } from "@mui/material";
import { Resource } from "../model/Resource";
import { CategoryResource } from "../model/CategoryResource";
import NEResource from "../components/NEResource";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { NoInfo } from "../../../utils/NoInfo";
import { FileService } from "../../../core/services/FileService";
import { SSpinner } from "../../../shared/components/SSpinner";

const _adminService = new AdminService();
const _fileService = new FileService();

interface ITResource { }

const TResource: React.FC<ITResource> = () => {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<Resource>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [list, setList] = useState<Resource[]>([]);
  const [listCategoryResource, setListCategoryResource] = useState<
    CategoryResource[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [selector, setSelector] = useState(-1);
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
    console.log(data);
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    viewModal();
  };

  useEffect(() => {
    getCategoriaRecursoCatalogPorPropiedad();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getRecursosCatalogPorPropiedad = (id: number) => {
    setShowSpinner(true);
    _adminService.getRecursosCatalogPorPropiedad(id).subscribe((resp) => {
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

  const getCategoriaRecursoCatalogPorPropiedad = () => {
    setShowSpinner(true);
    _adminService.getCategoriaRecursoCatalogPorPropiedad().subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListCategoryResource(resp);
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
    _adminService.deleteRecursos(idDelete).subscribe((rps) => {
      console.log(rps);
      if (rps) {
        console.log(selector);
        setShowSpinner(false);
        getRecursosCatalogPorPropiedad(selector);
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
    getRecursosCatalogPorPropiedad(selector);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteForm();
    }
  };

  const classes = useStyles();

  const onChangeComponent = (e: any) => {
    console.log(e);
    setSelector(e);
    getRecursosCatalogPorPropiedad(e);
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
                    <h1>Recursos</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-5 mt-2">
            <div className="row card box-s">
              <div className="col-6">
                <TextField
                  className="mt-3 mb-3"
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label=".:Seleccione una categoría:."
                  id="state"
                  onChange={(e) => onChangeComponent(e.target.value)}
                >
                  {listCategoryResource.map((item: CategoryResource) => (
                    <MenuItem value={item.IDCategoriaRecurso}>
                      {item.Nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="row">
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
              {list.length > 0 ? (
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ height: "70vh" }}>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className={classes.root}
                    >
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>ID</TableCell> */}
                          <TableCell>Nombre</TableCell>
                          <TableCell>Archivo</TableCell>
                          <TableCell>Tipo Media</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: Resource, index: number) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              {/* <TableCell>{item.IDRecursos}</TableCell> */}
                              <TableCell>{item.Nombre}</TableCell>
                              <TableCell>
                                <a href={_fileService.getUrlFile(item.Context, item.MediaContext)} target="_blank">
                                  {item.MediaContext}
                                </a>
                              </TableCell>
                              <TableCell>{item.IDTipoMedia}</TableCell>
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
                                            setIdDelete(item.IDRecursos);
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
                                      icon={<BsPencilSquare />}
                                      tooltipTitle="Editar Recurso"
                                      onClick={() => {
                                        formComponent("Editar", item);
                                      }}
                                    />
                                    <SpeedDialAction
                                      key={index + 1}
                                      icon={<BsTrash />}
                                      tooltipTitle="Eliminar Recurso"
                                      onClick={() => {
                                        setShowDelete(true);
                                        setIdDelete(item.IDRecursos);
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
              ) : selector !== -1 ? (
                <div className="mt-10 ml-20 d-flex justify-content-center">
                  {" "}
                  <NoInfo />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </main>
      </div>
      {show && (
        <NEResource
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          dataType={selector}
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
      {showSpinner &&
        <SSpinner show={showSpinner} />
      }
    </>
  );
};

export default TResource;
