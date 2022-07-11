import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import {
  MenuItem,
  Paper,
  SpeedDial,
  SpeedDialAction,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TextField,
  TableRow,
  TableBody,
  TablePagination,
  Tooltip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  ButtonGroup,
  Button,
  ThemeProvider,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { BsArrowUp, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { CharacterizationK } from "../model/Characterization";
import { NECharacterization } from "../components/NECharacterization";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { pipeSort } from "../../../utils/pipeSort";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";

const _configService = new ConfigService();

interface ICharacterization { }

export const T_Characterization: React.FC<ICharacterization> = () => {
  const [idDelete, setIdDelete] = useState(0);
  const [listCharacterization, setListCharacterization] = useState<
    CharacterizationK[]
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<CharacterizationK>();
  const [title, setTitle] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const { items } = useSelector((state: RootState) => state.itemsperpage);

  useEffect(() => {
    setRowsPerPage(parseInt(items));
    getListCharacterization();
  }, [items]);

  const getListCharacterization = () => {
    setShowSpinner(true);
    _configService.getCharacterizationCatalog().subscribe((res) => {
      setShowSpinner(false);
      if (res) {
        setListCharacterization(res);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const ordenar = (listArray: any, columna: string) => {
    let aux = pipeSort([...listArray], columna);
    setListCharacterization(aux);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
    getListCharacterization();
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

  const formComponent = (title: string, data?: CharacterizationK) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    setShow(true);
  };
  const deleteElement = (data: boolean) => {
    if (data) {
      deleteCharacterization(idDelete);
    }
  };
  const deleteCharacterization = (id: number) => {
    _configService.deleteCharacterization(id).subscribe((resp: any) => {
      if (resp) {
        Toast.fire({
          icon: "success",
          title: "Se elimino el elemento",
        });
        getListCharacterization();
      }
    });
  };

  const classes = useStyles();

  return (
    <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
      <div className="row w-100">
        <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
          <div className="pull-title-top">
            <h1>Caraterizaciones</h1>
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
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.root}
              >
                <TableHead>
                  <TableRow sx={{ height: "3rem" }}>
                    <TableCell>
                      <div className="thDirection">
                        ID
                        <Tooltip className="ml-2" title="Ordenar">
                          <IconButton
                            aria-label="Ordenar"
                            size="small"
                            onClick={() => {
                              ordenar(
                                listCharacterization,
                                "IDCharacterization"
                              );
                            }}
                          >
                            <BsArrowUp />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>

                    <TableCell>
                      Nombre
                      <Tooltip className="ml-2" title="Ordenar">
                        <IconButton
                          aria-label="Ordenar"
                          size="small"
                          onClick={() => {
                            ordenar(listCharacterization, "Name");
                          }}
                        >
                          <BsArrowUp />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell>Descripción </TableCell>
                    <TableCell>
                      <div className="thDirection">
                        Tipo de Cliente
                        <Tooltip className="ml-2" title="Ordenar">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                              ordenar(listCharacterization, "CustomerTypeName");
                            }}
                          >
                            <BsArrowUp />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listCharacterization
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: CharacterizationK) => (
                      <TableRow
                        hover
                        role="checkbox"
                        key={item.IDCharacterization}
                        tabIndex={-1}
                      >
                        <TableCell>{item.IDCharacterization}</TableCell>
                        <TableCell>{item.Name}</TableCell>
                        <TableCell>{item.Description}</TableCell>
                        <TableCell>{item.CustomerTypeName}</TableCell>
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
                                    className="box-s mr-3 mt-2 mb-2"
                                    color="error"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(item.IDCharacterization);
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
                                key={item.IDCharacterization + 6}
                                sx={{ color: "secondary" }}
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              <SpeedDialAction
                                key={item.IDCharacterization + 1}
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar proceso"
                                onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(item.IDCharacterization);
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
              count={listCharacterization.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
      {showSpinner && <SSpinner show={showSpinner} />}
      {show && (
        <NECharacterization
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
        />
      )}
      <GenericConfirmAction
        show={showDelete}
        setShow={setShowDelete}
        confirmAction={deleteElement}
        title="¿Está seguro de eliminar el elemento?"
      />
    </div>
  );
};
export default T_Characterization;
