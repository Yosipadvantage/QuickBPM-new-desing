import { useState, useEffect } from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";

import { TreeService } from "../../../core/services/TreeService";
import {
  BsPencilSquare,
  BsTrash,
  BsCheckSquare,
  BsFillPersonLinesFill,
  BsPlus,
  BsListTask,
  BsLayoutWtf,
} from "react-icons/bs";
import NEWorkGroup from "../components/NEWorkGroup";
import { TAddUserWorkG } from "../components/TAddUserWorkG";
import { WorkGroup } from "../model/WorkGroup";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { MenuItem, SpeedDial, SpeedDialAction, Table, TextField, Button, ButtonGroup, ThemeProvider, InputAdornment, IconButton, Tooltip, TablePagination, TableCell, TableBody, TableHead, TableRow, TableContainer, Paper } from "@mui/material";
import { TBusinessRole } from "../../admin/pages/TBusinessRole";
import { AiOutlineAudit } from "react-icons/ai";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _treeService = new TreeService();

interface ITreeGroup { }

let listAux: any[] = [];

const TTreeGroup: React.FC<ITreeGroup> = () => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTAddUser, setShowTAdd] = useState(false);
  const [viewMode, setViewMode] = useState(false)

  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<WorkGroup>();
  const [IDLn, setIDLn] = useState(0);
  const [name, setName] = useState("");
  const [Id, setId] = useState(0);
  const [n, setN] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showRole, setShowRole] = useState(false);

  const [dcName, setDCName] = useState("");
  const [bossName, setBossName] = useState("");

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
    if (listAux.length > 0) {
      listAux.splice(0, listAux.length);
    }
    getTreeForFunctionalID();
    setRowsPerPage(parseInt(items));;

  }, [items]);

  const getTreeForFunctionalID = () => {
    _treeService
      .getTreeForFunctionalID()
      .subscribe((resp: any) => {
        listAux.push(
          generateData(
            0,
            resp.DataBeanProperties.ObjectValue.EnvolvedObject
              .DataBeanProperties.Name
          )
        );
        getFunctionalIDChilds(0);
      });
  };

  const getFunctionalIDChilds = (id: number) => {
    setShowSpinner(true);
    _treeService
      .getFunctionalIDChilds(id)
      .subscribe((resp: any) => {
        setList(resp.DataBeanProperties.ObjectValue);
        setShowSpinner(false);
      });
  };

  const generateData = (id: number, value: any) => {
    const data = {
      idValue: id,
      dataValue: value,
    };
    return data;
  };

  const getSelection = (id: number, name: any, state?: string) => {
    setIDLn(id);
    setName(name);
    if (state === "Editar") {
      if (id > 0) {
        if (validate(id) === true) {
          getData(id);
        }
        if (validate(id) === false) {
          listAux.push(generateData(id, name));
        }
        getFunctionalIDChilds(id);
      } else {
        getTreeForFunctionalID();
        if (validate(id) === true) {
          getData(id);
        }
      }
    }
    if (state === "Eliminar") {
      if (id > 0) {
        getFunctionalIDChilds(id);
      } else {
        getFunctionalIDChilds(0);
      }
    }
  };

  const validate = (id: number) => {
    for (let i = 0; i < listAux.length; i++) {
      if (id === listAux[i].idValue) {
        return true;
      }
    }
    return false;
  };

  const getData = (id: number) => {
    for (let i = 0; i < listAux.length; i++) {
      if (id === listAux[i].idValue) {
        listAux.splice(i, listAux.length);
      }
    }
  };

  const formTree = (title: string, data?: any) => {
    setTitle(title);
    setBossName("");
    setDCName("");
    if (title === "Editar") {
      setformdata(data.DataBeanProperties);
      setDCName(data.DataBeanProperties.DistributionChannelName);
      setBossName(data.DataBeanProperties.BossName);
    }
    viewModal();
  };

  const closeModal = (data: any) => {
    setShow(data);
  };

  const getList = () => {
    getSelection(IDLn, name, "Editar");
  };

  const viewModal = () => {
    setShow(true);
  };

  const ViewModalTAdd = () => {
    setShowTAdd(true);
  };

  const closeModalTAdd = () => {
    setShowTAdd(false);
  };
  const dataTAddUserG = (id: number) => {
    setIDLn(id);
    ViewModalTAdd();
  };
  const closeModalRole = (data: any) => {
    setShowRole(data);
  };

  const deleteFunctionalID = (
    id: number,
    name: string,
    state: string
  ) => {
    _treeService
      .deleteFunctionalID(id)
      .subscribe((resp: any) => {
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
        getSelection(IDLn, name, state);
      });
  };

  const deleteElement = (data: boolean) => {
    data ? getDelete(Id, n, "Eliminar") : getDelete(Id, n, "Eliminar");
  };

  const getDelete = (id: number, name: string, state: string) => {
    deleteFunctionalID(id, name, state);
  };

  const handleViewMode = (type: number) => {
    (type === 0) ? setViewMode(true) : setViewMode(false);
  }

  const classes = useStyles();

  return (
    <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
      <div className="row w-100">
        <div className=" col-12 mb-4">
          <Breadcrumb>
            {listAux.map((item) => (
              <Breadcrumb.Item
                key={item.idValue}
                onClick={() => {
                  getSelection(item.idValue, item.dataValue, "Editar");
                }}
              >
                {item.dataValue}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Row className="mt-3">
            <Col sm={12}>
              <button
                title="Agregar Grupo"
                className="btn btn-sm btn-outline-secondary btn-custom"
                type="button"
                onClick={() => {
                  formTree("Crear", 0);
                }}
              >
                <BsPlus />
              </button>
            </Col>
            {(list.length > 0) &&
              <Col sm={3} className="mt-2 d-flex justify-content-start">
                <ThemeProvider theme={inputsTheme}>
                  <ButtonGroup disableElevation variant="contained" style={{ height: 40 }}>
                    <Tooltip title="Ver lista">
                      <IconButton
                        onClick={() => handleViewMode(0)}
                        color="secondary"><BsListTask />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver mosaico">
                      <IconButton
                        onClick={() => handleViewMode(1)}
                        color="secondary"><BsLayoutWtf />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </ThemeProvider>
              </Col>}
          </Row>
        </div>
      </div>
      {showSpinner ?
        <SSpinner show={showSpinner} />
        : viewMode
          ? <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "70vh" }}>
              <Table stickyHeader aria-label="sticky table" className={classes.root}>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Jefe de Área</TableCell>
                    <TableCell>Correo de Notificación</TableCell>
                    <TableCell>Canal de distribución</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => (
                      <TableRow key={item.DataBeanProperties.IDLn} hover role="checkbox" tabIndex={-1}>
                        <TableCell>{item.DataBeanProperties.Code}</TableCell>
                        <TableCell>{item.DataBeanProperties.Name}</TableCell>
                        <TableCell>{item.DataBeanProperties.BossName}</TableCell>
                        <TableCell>{item.DataBeanProperties.EmailForNotifications}</TableCell>
                        <TableCell>{item.DataBeanProperties.DistributionChannelName}</TableCell>
                        <TableCell>
                          <div className="d-lg-flex d-none">
                            <ButtonGroup>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Seleccionar">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      getSelection(
                                        item.DataBeanProperties.IDLn,
                                        item.DataBeanProperties.Name,
                                        "Editar"
                                      );
                                    }}
                                  >
                                    <BsCheckSquare />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Añadir Usuario a Grupo de Trabajo">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      dataTAddUserG(item.DataBeanProperties.IDLn);
                                    }}>
                                    <BsFillPersonLinesFill />
                                  </Button>
                                </Tooltip>
                              </ThemeProvider>
                              <ThemeProvider theme={inputsTheme}>
                                <Tooltip title="Añadir Rol a Grupo de Trabajo">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="secondary"
                                    onClick={() => {
                                      setIDLn(item.DataBeanProperties.IDLn);
                                      setTitle(item.DataBeanProperties.Name);
                                      setShowRole(true);
                                    }}>
                                    <AiOutlineAudit />
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
                                      formTree("Editar", item);
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
                                      setId(item.DataBeanProperties.IDLn);
                                      setN(item.DataBeanProperties.Name);
                                      setShowDelete(true);
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
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar grupo"
                                onClick={() => {
                                  formTree("Editar", item);
                                }}
                              />
                              <SpeedDialAction
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar"
                                onClick={() => {
                                  setId(item.DataBeanProperties.IDLn);
                                  setN(item.DataBeanProperties.Name);
                                  setShowDelete(true);
                                }}
                              />
                              <SpeedDialAction
                                icon={<BsCheckSquare />}
                                tooltipTitle="Seleccionar"
                                onClick={() => {
                                  getSelection(
                                    item.DataBeanProperties.IDLn,
                                    item.DataBeanProperties.Name,
                                    "Editar"
                                  );
                                }}
                              />
                              <SpeedDialAction
                                icon={<BsFillPersonLinesFill />}
                                tooltipTitle="Añadir Usuario a Grupo de Trabajo"
                                onClick={() => {
                                  dataTAddUserG(item.DataBeanProperties.IDLn);
                                }}
                              />
                              <SpeedDialAction
                                icon={<AiOutlineAudit />}
                                tooltipTitle="Añadir Rol a Grupo de Trabajo"
                                onClick={() => {
                                  setIDLn(item.DataBeanProperties.IDLn);
                                  setTitle(item.DataBeanProperties.Name);
                                  setShowRole(true);
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
          : <div className="d-flex w-100 flex-column">
            {list.map((item: any, index) => (
              <div key={item.DataBeanProperties.IDLn} className="rounded  w-100 card m-2" >
                <div className="card-header header-card" onClick={() => {
                  getSelection(
                    item.DataBeanProperties.IDLn,
                    item.DataBeanProperties.Name,
                    "Editar"
                  );
                }}>
                  <h5 className="text-white">
                    {item.DataBeanProperties.Code} - {item.DataBeanProperties.Name}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="m-1">
                    <b>Jefe de Área: </b>
                    <br /> <span>{item.DataBeanProperties.BossName}</span>
                  </div>
                  <div className="m-1">
                    <b>Correo de Notificación: </b>
                    <br />{" "}
                    <span>{item.DataBeanProperties.EmailForNotifications}</span>
                  </div>
                  <div className="m-1">
                    <b>Canal de distribución: </b> <br />
                    <span>{item.DataBeanProperties.DistributionChannelName}</span>
                  </div>
                </div>
                <div className="d-lg-flex d-none d-flex justify-content-end mr-3 mb-3">
                  <ButtonGroup>
                    <ThemeProvider theme={inputsTheme}>
                      <Tooltip title="Seleccionar">
                        <Button
                          variant="contained"
                          className="box-s mr-1 mt-2 mb-2"
                          color="secondary"
                          onClick={() => {
                            getSelection(
                              item.DataBeanProperties.IDLn,
                              item.DataBeanProperties.Name,
                              "Editar"
                            );
                          }}
                        >
                          <BsCheckSquare />
                        </Button>
                      </Tooltip>
                    </ThemeProvider>
                    <ThemeProvider theme={inputsTheme}>
                      <Tooltip title="Añadir Usuario a Grupo de Trabajo">
                        <Button
                          variant="contained"
                          className="box-s mr-1 mt-2 mb-2"
                          color="secondary"
                          onClick={() => {
                            dataTAddUserG(item.DataBeanProperties.IDLn);
                          }}>
                          <BsFillPersonLinesFill />
                        </Button>
                      </Tooltip>
                    </ThemeProvider>
                    <ThemeProvider theme={inputsTheme}>
                      <Tooltip title="Añadir Rol a Grupo de Trabajo">
                        <Button
                          variant="contained"
                          className="box-s mr-1 mt-2 mb-2"
                          color="secondary"
                          onClick={() => {
                            setIDLn(item.DataBeanProperties.IDLn);
                            setTitle(item.DataBeanProperties.Name);
                            setShowRole(true);
                          }}>
                          <AiOutlineAudit />
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
                            formTree("Editar", item);
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
                            setId(item.DataBeanProperties.IDLn);
                            setN(item.DataBeanProperties.Name);
                            setShowDelete(true);
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
                      icon={<BsPencilSquare />}
                      tooltipTitle="Editar grupo"
                      onClick={() => {
                        formTree("Editar", item);
                      }}
                    />
                    <SpeedDialAction
                      icon={<BsTrash />}
                      tooltipTitle="Eliminar"
                      onClick={() => {
                        setId(item.DataBeanProperties.IDLn);
                        setN(item.DataBeanProperties.Name);
                        setShowDelete(true);
                      }}
                    />
                    <SpeedDialAction
                      icon={<BsCheckSquare />}
                      tooltipTitle="Seleccionar"
                      onClick={() => {
                        getSelection(
                          item.DataBeanProperties.IDLn,
                          item.DataBeanProperties.Name,
                          "Editar"
                        );
                      }}
                    />
                    <SpeedDialAction
                      icon={<BsFillPersonLinesFill />}
                      tooltipTitle="Añadir Usuario a Grupo de Trabajo"
                      onClick={() => {
                        dataTAddUserG(item.DataBeanProperties.IDLn);
                      }}
                    />
                    <SpeedDialAction
                      icon={<AiOutlineAudit />}
                      tooltipTitle="Añadir Rol a Grupo de Trabajo"
                      onClick={() => {
                        setIDLn(item.DataBeanProperties.IDLn);
                        setTitle(item.DataBeanProperties.Name);
                        setShowRole(true);
                      }}
                    />
                    )
                  </SpeedDial>
                </div>
              </div>
            ))}
          </div>
      }
      {showTAddUser ? (
        <TAddUserWorkG
          idLn={IDLn}
          dataShow={showTAddUser}
          getShow={closeModalTAdd}
        />
      ) : (
        ""
      )}
      {show ? (
        <NEWorkGroup
          getShow={closeModal}
          getIDLn={getList}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          dataId={IDLn}
          dcName={dcName}
          setDCName={setDCName}
          bossName={bossName}
          setBossName={setBossName}
        />
      ) : (
        ""
      )}
      <GenericConfirmAction
        show={showDelete}
        setShow={setShowDelete}
        confirmAction={deleteElement}
        title="¿Está seguro de eliminar el elemento?"
      />
      {showRole ? (
        <TBusinessRole
          dataShow={showRole}
          getShow={closeModalRole}
          idLn={IDLn}
          nameGrupo={title}
        />
      ) : ''}
    </div>
  );
};

export default TTreeGroup;
