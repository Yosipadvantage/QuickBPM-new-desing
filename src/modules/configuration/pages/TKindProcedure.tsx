import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store/Store";
import NEKindProcedure from "../components/NEKindProcedure";
import { ConfigService } from "../../../core/services/ConfigService";
import { characterizationDeleteOk } from "../../../actions/AConfig";
import { FiMoreVertical } from "react-icons/fi";
import { BsGearFill, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { Characterization } from "../model/Characterization";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { Toast } from "../../../utils/Toastify";

import {
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ThemeProvider,
  Tooltip,
} from "@mui/material";

import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Dropdown, DropdownButton, SplitButton } from "react-bootstrap";

const _configService = new ConfigService();

interface IKindProcedure { }

const TKindProcedure: React.FC<IKindProcedure> = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<Characterization>();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
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

  const characterizations = useSelector(
    (state: RootState) => state.characterization.characterizations
  );

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    viewModal();
  };
  useEffect(() => {
    setRowsPerPage(parseInt(items));;
  }, [items]);

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: any) => {
    setShow(data);
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteBusinessClass();
    }
  };

  const deleteBusinessClass = () => {
    _configService
      .deleteBusinessClass(idDelete)
      .subscribe((resp: any) => {
        console.log(idDelete);
        dispatch(characterizationDeleteOk(idDelete));
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
      });
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
                    <h1>
                      Clase de Trámite
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
                      {characterizations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell sx={{ padding: 3 }}>{item.IDBusinessClass}</TableCell>
                          <TableCell sx={{ padding: 0 }}>{item.Name}</TableCell>
                          <TableCell sx={{ padding: 0 }}>{item.Description}</TableCell>
                          <TableCell sx={{ padding: 0 }}>
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
                                        setIdDelete(item.IDBusinessClass);
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
                                    setIdDelete(item.IDBusinessClass);
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
                  count={characterizations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              {show &&
                <NEKindProcedure
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
};

export default TKindProcedure;
