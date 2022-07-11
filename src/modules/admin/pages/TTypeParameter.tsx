import React, { useEffect } from "react";
import { useState } from "react";
import { AdminService } from "../../../core/services/AdminService";
import { FiMoreVertical } from "react-icons/fi";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { ListParameter } from "../model/ListParameter";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { Paper, TableContainer, TablePagination, Table, TableHead, TableRow, TableCell, TableBody, ButtonGroup, ThemeProvider, Tooltip, Button } from "@mui/material";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { NETypeParameter } from "../components/NETypeParameter";

const _adminService = new AdminService();

interface ITypeParameter {
  list: ListParameter[];
  refreshList: Function;
  codeList: number[];
}

const TTypeParameter: React.FC<ITypeParameter> = (props: ITypeParameter) => {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<ListParameter>();
  const [idDelete, setIdDelete] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);


  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
      console.log(formdata);
    }
    viewModal();
  };

  useEffect(() => {

    setRowsPerPage(parseInt(items));
  }, [items]);


  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: any) => {
    setShow(data);
  };

  const deleteTipoLista = () => {
    setShowSpinner(true);
    _adminService
      .deleteTipoLista(idDelete)
      .subscribe(res => {
        setShowSpinner(false);
        if (res) {
          Toast.fire({
            icon: "success",
            title: "Se ha eliminado con éxito!",
          });
          props.refreshList();
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción.",
          });
        }
      })
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteTipoLista();
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const classes = useStyles();

  return (
    <>
      <div className="pull-title-top mt-5 ml-2">
        <h1>Tipo Parámetros</h1>
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
                      formComponent("Crear", 0);
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
                  <TableRow sx={{ height: "3rem" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any, index: number) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell >{item.IDTipoLista}</TableCell>
                        <TableCell >{item.Codigo}</TableCell>
                        <TableCell >{item.Nombre}</TableCell>
                        <TableCell >{item.Descripcion !== null && item.Descripcion !== ""
                          ? item.Descripcion
                          : "NA"}</TableCell>
                        <TableCell >
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
                              {/* <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Eliminar elemento">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="error"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(
                                        item.IDTipoLista
                                      );
                                    }}>
                                    <BsTrash />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider> */}
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
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar elemento"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              {/* <SpeedDialAction
                                key={index + 1}
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar elemento"
                                onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(
                                    item.IDTipoLista
                                  );
                                }}
                              /> */}
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
              count={props.list.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Columnas por Página"
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          {showSpinner && (
            <div className="spinner d-flex justify-content-center">
              <SSpinner show={showSpinner} />
            </div>
          )}
          {show && (
            <NETypeParameter
              getShow={closeModal}
              dataShow={show}
              dataObj={formdata}
              dataTitle={title}
              refreshList={props.refreshList}
              codeList={props.codeList}
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
      </div>
    </>
  );
};

export default TTypeParameter;
