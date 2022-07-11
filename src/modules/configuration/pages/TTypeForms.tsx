import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Button, SpeedDial, SpeedDialAction, ThemeProvider } from "@mui/material";

import {
  ButtonGroup,
  Tooltip,
  IconButton,
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
import NETypeForms from "../components/NETypeForms";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _adminService = new AdminService();

interface ITTypeForms { }

const TTypeForms: React.FC<ITTypeForms> = () => {

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<TypeForm>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [list, setList] = useState<TypeForm[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

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
    getFormClassCatalog(); setRowsPerPage(parseInt(items));;
  }, [items]);

  const getFormClassCatalog = () => {
    setShowSpinner(true);
    _adminService.getFormClassCatalog().subscribe(resp => {
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

  const deleteFormClass = () => {
    _adminService
      .deleteFormClass(idDelete)
      .subscribe(rps => {
        console.log(rps);
        if (rps) {
          setShowSpinner(false);
          getFormClassCatalog();
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
    getFormClassCatalog();
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteFormClass();
    }
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
                      Tipo de Formularios
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
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
                  <Table stickyHeader aria-label="sticky table" className={classes.root}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: TypeForm, index: number) => (
                        <TableRow hover key={item.IDFormClass} role="checkbox" tabIndex={-1}>
                          <TableCell>{item.IDFormClass}</TableCell>
                          <TableCell>{item.Name}</TableCell>
                          <TableCell>{item.Description}</TableCell>
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
                                      className="box-s mr-3 mt-2 mb-2"
                                      color="error"
                                      onClick={() => {
                                        setShowDelete(true);
                                        setIdDelete(item.IDFormClass);
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
                                  tooltipTitle="Editar grupo"
                                  onClick={() => {
                                    formComponent("Editar", item);
                                  }}
                                />
                                <SpeedDialAction
                                  key={index + 1}
                                  icon={<BsTrash />}
                                  tooltipTitle="Eliminar"
                                  onClick={() => {
                                    setShowDelete(true);
                                    setIdDelete(item.IDFormClass);
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
              {show &&
                <NETypeForms
                  getShow={closeModal}
                  dataShow={show}
                  dataObj={formdata}
                  dataTitle={title}
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

export default TTypeForms;
