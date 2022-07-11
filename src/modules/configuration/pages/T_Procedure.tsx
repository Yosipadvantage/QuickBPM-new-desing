import { useEffect, useState } from "react";
import {
  BsCloudArrowDownFill,
  BsFillBookmarkFill,
  BsFillFileEarmarkCodeFill,
  BsPencilSquare,
  BsPersonLinesFill,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Paper,
  Table,
  SpeedDial,
  SpeedDialAction,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Autocomplete,
  Tooltip,
  IconButton,
  ButtonGroup,
  ThemeProvider,
  Button,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";

import { procedureDeleteOk } from "../../../actions/AConfig";
import { ConfigService } from "../../../core/services/ConfigService";
import { NEProcedure } from "../components/NEProcedure";
import TGenericProcedure from "../components/TGenericProcedure";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Col, Row } from "react-bootstrap";
import { Characterization } from "../model/Characterization";
import { NoInfo } from "../../../utils/NoInfo";
import { pipeSort } from "../../../utils/pipeSort";
import TConditionalStatement from "./TConditionalStatement";
import MConditional from "../components/MConditional";
import { SSpinner } from "../../../shared/components/SSpinner";
import { TServiceFormsTest } from "../components/TService_FormsTest";
import { RootState } from "../../../store/Store";

const _configService = new ConfigService();

interface IProcedure { }

export const T_Procedure: React.FC<IProcedure> = () => {
  const dispatch = useDispatch();
  const [catSelected, setcatSelected] = useState(-1);
  const [show, setShow] = useState(false);
  const [showGeneric, setShowGeneric] = useState(false);
  const [title, setTitle] = useState("");
  const [formProcedure, setFormProcedure] = useState({});
  const [idProcedure, setIDProcedure] = useState({});
  const [proSelected, setProSelected] = useState(-1);
  const [typeSF, setTypeSF] = useState(-1);
  const [btn, setBtn] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [listStates, setListStates] = useState([]);
  const [listBP, setListBP] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [listBusinessClass, setBusinessClass] = useState<Characterization[]>([]);
  const [listProcedure, setListProcedure] = useState([]);
  const [listBusinessProcess, setListBusinessProcess] = useState([]);
  const [wgName, setWgName] = useState("");
  const [validName, setValidName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSF, setShowSF] = useState(false);
  const [showConditionalStatement, setShowConditionalStatement] = useState(false);
  const [showConditionalList, setShowConditionalList] = useState(false);
  const [listConditionalList, setConditioanlList] = useState([]);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const { permiso } = useSelector((state: RootState) => state.permiso);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const setLists = () => {
    getProcedureStates();
    getBusinessStates();
  };

  const getProcedureStates = async () => {
    await _configService
      .getProcedureStateCatalog(proSelected)
      .then((rps: any) => {
        setListStates(rps.data.DataBeanProperties.ObjectValue);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getBusinessStates = async () => {
    await _configService
      .getBusinessStateCatalog(proSelected)
      .then((rps: any) => {
        setListBP(rps.data.DataBeanProperties.ObjectValue);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const formBusiness = (title: string, data?: any) => {
    setLists();
    setTitle(title);
    setWgName("");
    setValidName("");
    if (title === "Editar") {
      setFormProcedure(data.DataBeanProperties);
      setWgName(data.FunctionalIDOwnerName);
      setValidName(data.FunctionalIDValidateName);
    }
    viewModal();
  };

  const getType = (data: any) => {
    setIDProcedure(data.DataBeanProperties.IDProcedure);
    setShowGeneric(true);
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: any) => {
    setShow(data);
  };

  const closeModalGeneric = (data: any) => {
    setShowGeneric(data);
  };

  const getBusinessClassCatalog = () => {
    _configService.getBusinessClassCatalog().subscribe((res) => {
      if (res) {
        setBusinessClass(res);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido cargar la información",
        });
      }
    });
  };

  useEffect(() => {
    getBusinessClassCatalog();
    setRowsPerPage(parseInt(items));;

  }, [items]);

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteProcedure();
    }
  };

  const deleteProcedure = async () => {
    await _configService
      .deleteProcedure(idDelete)
      .then((resp: any) => {
        console.log(resp);
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
        dispatch(procedureDeleteOk(idDelete));
        getProcedureList(proSelected);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getBusinessProcessCatalog = async (
    idBusinessClass: number | null,
    idCustomerType: number | null,
    idCharacterization: number | null
  ) => {
    let aux: any = [];
    let auxSorted: any = [];
    setShowSpinner(true);
    await _configService
      .getBusinessProcessCatalog(
        idBusinessClass,
        idCustomerType,
        idCharacterization
      )
      .then((resp: any) => {
        setShowSpinner(false);
        resp.data.DataBeanProperties.ObjectValue.map((item: any) =>
          aux.push({
            label: item.DataBeanProperties.Name,
            id: item.DataBeanProperties.IDBusinessProcess,
          }));
        auxSorted = pipeSort([...aux], "label");
        setListBusinessProcess(auxSorted);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onChangeSelect_BusinessClass = (e: any, id?: any) => {
    setcatSelected(e);
    setListProcedure([]);
    getBusinessProcessCatalog(e, null, null);
  };

  const onChangeSelect_Process = (value: any) => {
    return value === null
      ? null
      : (getProcedureList(value.id), setProSelected(value.id), setBtn(true));
  };

  const getProcedureList = (id: number) => {
    setListProcedure([]);
    setShowSpinner(true);
    _configService.getProcedureList2(id).subscribe((resp: any) => {
      console.log(resp);
      setShowSpinner(false);
      if (resp.DataBeanProperties.ObjectValue) {
        if (resp.DataBeanProperties.ObjectValue.length > 0) {
          setListProcedure(resp.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "info",
            title: "No exíste información.",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const openConditionalStatement = (data: any) => {
    setIDProcedure(data.DataBeanProperties.IDProcedure);
    setShowConditionalStatement(true);
  };

  const closeModalCS = (data: any) => {
    setShowConditionalStatement(data);
  };

  const handleConditionalList = (data: any) => {
    console.log(data);
    setConditioanlList(data);
    setShowConditionalList(true);
  };

  const closeConditionalList = (data: any) => {
    setShowConditionalList(data);
  };

  const classes = useStyles();

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        <main>
          <header className="page-header page-header-light bg-light mb-0">
            <div className="container-fluid">
              <div className="page-header-content pt-4 pb-10">
                <div className="row">
                  <div className="col-auto mt-4">
                    <h1>Procedimientos</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="px-5  mt-2">
            <div className="card p-2 mb-3 box-s">
              <Row className="mb-1 d-flex">
                <Col sm={12} className="mt-3 ml-2">
                  <h5>Filtrar por:</h5>
                </Col>
                <Col sm={5} className="ml-2 d-flex justify-content-center">
                  <TextField
                    margin="normal"
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label=".:Clase de trámite:."
                    id="state"
                    onChange={(e) =>
                      onChangeSelect_BusinessClass(e.target.value)
                    }
                  >
                    {listBusinessClass.map((item: any) => (
                      <MenuItem value={item.IDBusinessClass}>
                        {item.Name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Col>
                {catSelected !== -1 && (
                  <Col sm={6} className="mt-3 mr-2 d-flex justify-content-end">
                    <Autocomplete
                      onChange={(e, value) => onChangeSelect_Process(value)}
                      fullWidth
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      options={listBusinessProcess}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label=".:Trámite:."
                          fullWidth
                          color="secondary"
                        />
                      )}
                    />
                    {btn && (
                      <button
                        className="btn btn-sm btn-outline-secondary btn-custom"
                        type="button"
                        onClick={() => {
                          formBusiness("Crear");
                        }}
                      >
                        <BsPlus />
                      </button>
                    )}
                  </Col>
                )}
              </Row>
              {btn && <Row className="d-flex justify-content-end">
                <Col sm={12} className="d-flex justify-content-end">
                  <Tooltip title="Ver Servicios">
                    <IconButton className="mr-3" onClick={() => { setTypeSF(1); setShowSF(true); }}>
                      <BsCloudArrowDownFill />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Formularios">
                    <IconButton className="mr-2" onClick={() => { setTypeSF(0); setShowSF(true); }}>
                      <BsFillFileEarmarkCodeFill />
                    </IconButton>
                  </Tooltip>
                </Col>
              </Row>}
            </div>
            {showSpinner
              ? <div>
                <SSpinner
                  show={showSpinner}
                />
              </div>
              : listProcedure.length > 0 ? (
                <Paper sx={{ width: "100%", overflow: "auto" }}>
                  <TableContainer sx={{ height: "70vh" }}>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className={classes.root}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Actividad</TableCell>
                          {/* <TableCell>Estado</TableCell> */}
                          {/* <TableCell>Grupo de trabajo</TableCell> */}
                          {/* <TableCell>Seccional</TableCell> */}
                          <TableCell>Control de Flujo</TableCell>
                          {/* <TableCell>Role Responsable</TableCell> */}
                          {/* <TableCell>Validar Requisitos</TableCell>
                          <TableCell>Utiliza canal de distribución</TableCell>
                          <TableCell>Limitar a Oficina Radicadora</TableCell> */}
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listProcedure
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell>
                                {item.DataBeanProperties.IDProcedure}
                              </TableCell>
                              <TableCell
                                style={{
                                  paddingRight: 20,
                                  width: "30%",
                                  textAlign: "justify",
                                }}
                              >
                                <b>Paso: </b>
                                ({item.DataBeanProperties.IDProcedure})
                                -
                                {item.DataBeanProperties.Name}
                                <div className="mt-3">
                                  <b>Descripción:</b>{" "}
                                  {item.DataBeanProperties.Description}
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  width: "25%",
                                  textAlign: "justify",
                                }}
                              >
                                <div className="mt-3">
                                  <b>Actividad:</b>{" "}
                                  {item.DataBeanProperties.ActivityTypeName}
                                </div>
                                <div className="mt-3">
                                  <b>Grupo:</b>{" "}
                                  {item.DataBeanProperties.FunctionalIDValidateName}
                                </div>
                                <div className="mt-3">
                                  <b>Role:</b>{" "}
                                  {item.DataBeanProperties.BusinessRoleName}
                                </div>
                              </TableCell>
                              {/* <TableCell>
                                {item.DataBeanProperties.State}
                              </TableCell> */}
                              {/* <TableCell>
                                {item.DataBeanProperties.FunctionalIDValidateName}
                              </TableCell> */}
                              {/* <TableCell>
                                {item.DataBeanProperties.OfficeName}
                              </TableCell> */}
                              <TableCell
                                style={{
                                  width: "50%",
                                  textAlign: "justify",
                                }}
                              >
                                <ul>
                                  {item.DataBeanProperties.ConditionList.map((item2: any) =>
                                    <li>
                                      {item2}
                                    </li>
                                  )}
                                </ul>
                              </TableCell>
                              {/* <TableCell>
                                {item.DataBeanProperties.ValidateDocuments ===
                                  true ? (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="success">
                                      <BsFillCheckCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                ) : (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="error">
                                      <BsFillXCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.DataBeanProperties
                                  .UseDistributionChannel === true ? (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="success">
                                      <BsFillCheckCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                ) : (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="error">
                                      <BsFillXCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.DataBeanProperties.LimitByOffice ===
                                  true ? (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="success">
                                      <BsFillCheckCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                ) : (
                                  <ThemeProvider theme={inputsTheme}>
                                    <IconButton color="error">
                                      <BsFillXCircleFill />
                                    </IconButton>
                                  </ThemeProvider>
                                )}
                              </TableCell> */}
                              <TableCell>
                                <div className="d-lg-flex d-none">
                                  <ButtonGroup>
                                    <ThemeProvider theme={inputsTheme}>
                                      <Tooltip title="Agregar Control de Flujo a Procedimientos">
                                        <Button
                                          variant="contained"
                                          className="box-s mr-1 mt-2 mb-2"
                                          color="secondary"
                                          onClick={() => {
                                            openConditionalStatement(item);
                                          }}
                                        >
                                          <BsFillBookmarkFill />
                                        </Button>
                                      </Tooltip>
                                    </ThemeProvider>
                                    <ThemeProvider theme={inputsTheme}>
                                      <Tooltip title="Documentos requeridos">
                                        <Button
                                          variant="contained"
                                          className="box-s mr-1 mt-2 mb-2"
                                          color="secondary"
                                          onClick={() => {
                                            getType(item);
                                          }}>
                                          <BsPersonLinesFill />
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
                                            formBusiness("Editar", item);
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
                                            setIdDelete(
                                              item.DataBeanProperties.IDProcedure
                                            );
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
                                      key={item.DataBeanProperties.IDProcedure}
                                      icon={<BsPencilSquare />}
                                      tooltipTitle="Editar procedimiento"
                                      onClick={() => {
                                        formBusiness("Editar", item);
                                      }}
                                    />
                                    {permiso === 'true' &&
                                      <SpeedDialAction
                                        key={item.DataBeanProperties.IDProcedure + 1}
                                        icon={<BsTrash />}
                                        tooltipTitle="Eliminar procedimiento"
                                        onClick={() => {
                                          setShowDelete(true);
                                          setIdDelete(
                                            item.DataBeanProperties.IDProcedure
                                          );
                                        }}
                                      />
                                    }<SpeedDialAction
                                      key={item.DataBeanProperties.IDProcedure + 2}
                                      icon={<BsPersonLinesFill />}
                                      tooltipTitle="Documentos requeridos"
                                      onClick={() => {
                                        getType(item);
                                      }}
                                    />
                                    <SpeedDialAction
                                      key={item.DataBeanProperties.IDProcedure + 3}
                                      sx={{ color: "secondary" }}
                                      icon={<BsFillBookmarkFill />}
                                      tooltipTitle="Agregar Control de Flujo a Procedimientos"
                                      onClick={() => {
                                        openConditionalStatement(item);
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
                    count={listProcedure.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              ) : listProcedure.length === 0 && proSelected !== -1 ? (
                <NoInfo />
              ) : (
                ""
              )}
          </div>
        </main>
      </div>
      {show && (
        <NEProcedure
          getShow={closeModal}
          dataShow={show}
          beanProcedure={formProcedure}
          dataTitle={title}
          dataId={proSelected}
          listState={listStates}
          listBP={listBP}
          refresh={getProcedureList}
          wgName={wgName}
          setWgName={setWgName}
          validName={validName}
          setValidName={setValidName}
        />
      )}
      {showGeneric && (
        <TGenericProcedure
          getShowGeneric={closeModalGeneric}
          dataShowGeneric={showGeneric}
          dataIdGeneric={idProcedure}
          dataId={proSelected}
        />
      )}
      {showConditionalStatement && (
        <TConditionalStatement
          getShowCS={closeModalCS}
          dataShowCS={showConditionalStatement}
          dataObjIDProcedure={idProcedure}
          refresh={getProcedureList}
          refreshId={proSelected}
          idBusinessProcess={proSelected}
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
      {showConditionalList && (
        <MConditional
          getShowMConditonal={closeConditionalList}
          dataShowMConditonal={showConditionalList}
          dataList={listConditionalList}
        />
      )}
      {showSF && (
        <TServiceFormsTest
          show={showSF}
          setShow={setShowSF}
          idBusinessProcess={proSelected}
          type={typeSF}
        />
      )}
    </>
  );
};