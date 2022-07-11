import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NEBusinessProcess from "../components/NEBusinessProcess";
import { RootState } from "../../../store/Store";
import { businessDeleteOk } from "../../../actions/AConfig";
import { ConfigService } from "../../../core/services/ConfigService";
import {
  ButtonGroup,
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
  ThemeProvider,
  IconButton,
  Tooltip,
  SelectChangeEvent,
  Select,
  Button,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import {
  BsArrowUp,
  BsFillFileEarmarkPersonFill,
  BsPencilSquare,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { MdOutlineCleaningServices } from "react-icons/md";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Col } from "react-bootstrap";
import { CharacterizationK } from "../model/Characterization";
import { NoInfo } from "../../../utils/NoInfo";
import { TBusinessCharacterization } from "../components/TBusinessCharacterization";
import { pipeSort } from "../../../utils/pipeSort";
import { SSpinner } from "../../../shared/components/SSpinner";

const _configService = new ConfigService();

interface IDBusinessProcess {}

export const T_BusinesProcess: React.FC<IDBusinessProcess> = () => {
  const dispatch = useDispatch();
  const [bcSelected, setBcSelected] = useState<number | null>(null);
  const [id, setId] = useState<number>(-1);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [listCharacterization, setListCharacterization] = useState<
    CharacterizationK[]
  >([]);
  const [list, setList] = useState<any>([]);
  const [name, setName] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [showChar, setShowChar] = useState(false);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const formBusiness = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    viewModal();
  };

  const businessClasses = useSelector(
    (state: RootState) => state.characterization.characterizations
  );

  const getListCharacterization = () => {
    _configService.getCharacterizationCatalog().subscribe((res) => {
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

  const getBusinessProcessCatalog = async (
    idBusinessClass: number | null,
    idCustomerType: number | null,
    idCharacterization: number | null
  ) => {
    setShowSpinner(true);
    await _configService
      .getBusinessProcessCatalog(
        idBusinessClass,
        idCustomerType,
        idCharacterization
      )
      .then((resp: any) => {
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          let auxiliar: any[] = [];
          resp.data.DataBeanProperties.ObjectValue.map((item: any) => {
            auxiliar.push(item.DataBeanProperties);
          });
          ordenar(auxiliar, "Name");

          // ordenar(auxiliar, 'Name');
        }
        if (resp.data.DataBeanProperties.ObjectValue.length === 0) {
          Toast.fire({
            icon: "info",
            title: "No existe información",
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Se han cargado los datos",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFiltter = () => {
    if (bcSelected != null) {
      getBusinessProcessCatalog(bcSelected, null, null);
      setFiltered(true);
    }
  };

  useEffect(() => {
    getListCharacterization();
    setRowsPerPage(parseInt(items));
    handleFiltter();
  }, [bcSelected, items]);

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteBusinessProcess(idDelete);
    }
  };

  const deleteBusinessProcess = async (id: number) => {
    await _configService
      .deleteBusinessProcess(id)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ErrorMessage) {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción",
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Se ha eliminado con éxito!",
          });
        }
        dispatch(businessDeleteOk(id));
        handleFiltter();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getBClassName = () => {
    let bc = null;
    for (let i = 0; i < businessClasses.length; i++) {
      bc = businessClasses[i];
      if (bc.IDBusinessClass === bcSelected) {
        break;
      }
    }
    return bc ? bc.Name : "Error";
  };
  const ordenar = (listArray: any, columna: string) => {
    let aux = pipeSort([...listArray], columna);
    setList(aux);
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: boolean) => {
    setShow(data);
  };

  const onChangeSelect = (e: any, type: number) => {
    if (type === 1) {
      setBcSelected(e);
      /* handleFiltter() */
    }
  };

  const classes = useStyles();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="nWhite w-80 p-3 m-3">
      <main>
        <header className="page-header page-header-light bg-light mb-0">
          <div className="container-fluid">
            <div className="page-header-content pt-4 pb-10">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto mt-4">
                  <h1 className="">Trámites</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="px-5 mt-2">
          <div className="row">
            <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
              <div className="row card box-s">
                <div className="col-md-12">
                  <div className="form-group">
                    <div className="form-group">
                      <div className="row">
                        <Col sm={6} className="mt-3">
                          <h5>Filtrar por:</h5>
                        </Col>
                        <Col sm={7} className="mt-3 mb-3">
                          <div className="d-flex">
                            <TextField
                              value={bcSelected}
                              size="small"
                              fullWidth
                              select
                              color="secondary"
                              label=".:Clase de trámite:."
                              id="state"
                              onChange={(e) =>
                                onChangeSelect(e.target.value, 1)
                              }
                            >
                              {businessClasses.map((item: any) => (
                                <MenuItem
                                  key={item.IDBusinessClass}
                                  value={item.IDBusinessClass}
                                >
                                  {item.Name}
                                </MenuItem>
                              ))}
                            </TextField>
                            <ThemeProvider theme={inputsTheme}>
                              <Tooltip title="Limpiar campo">
                                <IconButton
                                  color="secondary"
                                  onClick={() => setBcSelected(null)}
                                >
                                  <MdOutlineCleaningServices />
                                </IconButton>
                              </Tooltip>
                            </ThemeProvider>
                          </div>
                        </Col>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-end align-items-center">
                <div className="form-group">
                  <button
                    className="btn btn-sm btn-outline-secondary btn-custom"
                    type="button"
                    onClick={() => {
                      formBusiness("Crear");
                    }}
                  >
                    <BsPlus />
                  </button>
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
                          <TableCell>
                            <div className="thDirection">
                              ID
                              <Tooltip className="ml-2" title="Ordenar">
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => {
                                    ordenar(list, "IDBusinessProcess");
                                  }}
                                >
                                  <BsArrowUp />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="thDirection">
                              Código
                              <Tooltip className="ml-2" title="Ordenar">
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => {
                                    ordenar(list, "Code");
                                  }}
                                >
                                  <BsArrowUp />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="thDirection">
                              Nombre
                              <Tooltip className="ml-2" title="Ordenar">
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => {
                                    ordenar(list, "Name");
                                  }}
                                >
                                  <BsArrowUp />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Precio</TableCell>
                          <TableCell>Caracterizaciones</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any) => (
                            <TableRow
                              hover
                              role="checkbox"
                              key={item.IDBusinessProcess}
                              tabIndex={-1}
                            >
                              <TableCell>{item.IDBusinessProcess}</TableCell>
                              <TableCell>{item.Code}</TableCell>
                              <TableCell>{item.Name}</TableCell>
                              <TableCell>{item.Description}</TableCell>
                              <TableCell>{item.BusinessValue}</TableCell>
                              <TableCell>
                                <ThemeProvider theme={inputsTheme}>
                                  <Tooltip title="Ver/Asignar caracterizaciones">
                                    <IconButton
                                      color="secondary"
                                      className="ml-4"
                                      onClick={() => {
                                        setShowChar(true);
                                        setName(item.Name);
                                        setId(item.IDBusinessProcess);
                                      }}
                                    >
                                      <BsFillFileEarmarkPersonFill />
                                    </IconButton>
                                  </Tooltip>
                                </ThemeProvider>
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
                                            formBusiness("Editar", item);
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
                                            setIdDelete(item.IDBusinessProcess);
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
                                      key={item.IDBusinessProcess}
                                      icon={<BsPencilSquare />}
                                      tooltipTitle="Editar proceso"
                                      onClick={() => {
                                        formBusiness("Editar", item);
                                      }}
                                    />
                                    <SpeedDialAction
                                      key={item.IDBusinessProcess + 1}
                                      icon={<BsTrash />}
                                      tooltipTitle="Eliminar proceso"
                                      onClick={() => {
                                        setShowDelete(true);
                                        setIdDelete(item.IDBusinessProcess);
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
                    count={list.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              ) : list.length === 0 && filtered ? (
                <NoInfo />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {show && (
          <NEBusinessProcess
            getShow={closeModal}
            dataShow={show}
            dataObj={formdata}
            dataTitle={title}
            businessClassID={bcSelected}
            businessClassName={getBClassName()}
            listCharacterization={listCharacterization}
            filtter={handleFiltter}
          />
        )}
        {showChar && (
          <TBusinessCharacterization
            name={name}
            show={showChar}
            setShow={setShowChar}
            idBusinessProcess={id}
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
      </main>
    </div>
  );
};
