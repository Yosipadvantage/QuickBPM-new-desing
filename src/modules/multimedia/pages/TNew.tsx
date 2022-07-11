import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Button, ButtonGroup, MenuItem, SpeedDial, SpeedDialAction, TextField, ThemeProvider, Tooltip } from "@mui/material";

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
import { New } from "../model/New";
import NENew from "../components/NENew";
import { ListParameter } from "../../admin/model/ListParameter";
import { FileService } from "../../../core/services/FileService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _adminService = new AdminService();
const _files = new FileService();

interface ITNew { }

const TNew: React.FC<ITNew> = () => {

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<New>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [list, setList] = useState<New[]>([]);
  const [listParameter, setListParameter] = useState<ListParameter[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [selector, setSelector] = useState(-1);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    setRowsPerPage(parseInt(items));;
    getListaParametrosOrdenado(2);
  }, [items]);

  const getNoticiaCatalogPorPropiedad = (id: number) => {
    console.log(id);
    setShowSpinner(true);
    _adminService.getNoticiaCatalogPorPropiedad(id).subscribe(resp => {
      console.log(resp);
      if (resp) {
        for (let index = 0; index < resp.length; index++) {
          resp[index].myLink = _files.getUrlFile(resp[index].Context, resp[index].MediaContext);
        }
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

  const getListaParametrosOrdenado = (id: number) => {
    setShowSpinner(true);
    _adminService.getListaParametrosOrdenado(id).subscribe(resp => {
      console.log(resp);
      if (resp) {
        setListParameter(resp);
        setShowSpinner(false);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const deleteNoticia = () => {
    _adminService
      .deleteNoticia(idDelete)
      .subscribe(rps => {
        console.log(rps);
        if (rps) {
          setShowSpinner(false);
          getNoticiaCatalogPorPropiedad(selector);
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
      })
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getNoticiaCatalogPorPropiedad(selector);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteNoticia();
    }
  };

  const onChangeComponent = (e: any) => {
    console.log(e);
    setSelector(e);
    getNoticiaCatalogPorPropiedad(e);
  };

  const classes = useStyles();


  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <main>
          <header className="page-header page-header-light bg-light mb-0">
            <div className="container-fluid">
              <div className="page-header-content pt-4 pb-10">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4">
                    <h1 >
                      Noticia
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-5 mt-2">
            <div className="row card">
              <div className="col-md-12 box-s">
                <TextField
                  className="mb-3"
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label="Seleccione una visualización"
                  id="state"
                  onChange={(e) =>
                    onChangeComponent(e.target.value)
                  }
                >
                  {listParameter.map((item: ListParameter) => (
                    <MenuItem value={item.IDListaParametros}>
                      {item.Valor}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
          <div className="px-5 mt-2">
            <div className="row">
              <div className="col-xxl-4 col-12 col-xxl-12">
                <div className="row justify-content-end">
                  <div className="col-md-6 d-flex justify-content-end mr-5">
                    <div className="form-group">
                      {(selector !== -1) && <button
                        className="btn btn-sm btn-outline-secondary btn-custom"
                        type="button"
                        onClick={() => {
                          formComponent("Crear");
                        }}
                      >
                        <BsPlus />
                      </button>}
                    </div>
                  </div>
                </div>
              </div>
              {selector !== -1 &&
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer sx={{ height: "70vh" }}>
                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Autor</TableCell>
                          <TableCell>Título</TableCell>
                          <TableCell>Noticia</TableCell>
                          <TableCell>Archivo</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: New, index: number) => (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>{item.IDNoticia}</TableCell>
                            <TableCell>{item.Autor}</TableCell>
                            <TableCell>{item.Titulo}</TableCell>
                            <TableCell>{item.CuerpoNoticia}</TableCell>
                            <TableCell>
                              <a href={_files.getUrlFile(item.Context, item.MediaContext)} target="_blank">{item.MediaContext}</a>
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
                                          setIdDelete(item.IDNoticia);
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
                                    key={index}
                                    sx={{ color: "secondary" }}
                                    icon={<BsPencilSquare />}
                                    tooltipTitle="Editar elemento"
                                    onClick={() => {
                                      formComponent("Editar", item);
                                    }}
                                  />
                                  <SpeedDialAction
                                    key={index + 1}
                                    icon={<BsTrash />}
                                    tooltipTitle="Eliminar elemento"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(item.IDNoticia);
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
                </Paper>}
              {show &&
                <NENew
                  getShow={closeModal}
                  dataShow={show}
                  dataObj={formdata}
                  dataTitle={title}
                  dataType={selector}
                />}
              {showDelete && <GenericConfirmAction
                show={showDelete}
                setShow={setShowDelete}
                confirmAction={deleteElement}
                title={"¿Está seguro de eliminar el elemento?"}
              />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default TNew;
