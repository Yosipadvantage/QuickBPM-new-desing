import React from "react";
import { ConfigService } from "../../../core/services/ConfigService";
import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
  BsXSquare,
  BsPlus,
  BsPencilSquare,
  BsTrash,
  BsFillFileEarmarkPersonFill,
  BsFillXCircleFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import NEGenericProcedure from "./NEGenericProcedure";
import { FiMoreVertical } from "react-icons/fi";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { Toast } from "../../../utils/Toastify";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import {
  Paper,
  Table,
  TableBody,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  ThemeProvider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { TDocumentCharacterization } from "./TDocumentCharacterization";
import { IBusinessCharacterization } from "../model/BusinessCharacterization";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _configService = new ConfigService();

interface IGenericProcedure {
  getShowGeneric: Function;
  dataShowGeneric: boolean;
  dataIdGeneric: any;
  // dataInterface: any;
  dataId: number;
}

const TGenericProcedure: React.FC<IGenericProcedure> = (
  props: IGenericProcedure
) => {
  const [listGeneric, setListGeneric] = useState([]);
  const [listCharacterization, setListCharacterization] = useState<
    IBusinessCharacterization[]
  >([]);
  const [showNE, setShowNE] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState("");
  const [titleNE, setTitleNE] = useState("");
  const [formNE, setformNE] = useState({});
  const [idDelete, setIdDelete] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [idDocument, setIdDocument] = useState(-1);
  const [openDiag, setOpenDiag] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [typeDocument, setTypeDocument] = useState([]);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const { permiso } = useSelector((state: RootState) => state.permiso);

  // const typeDocument = ["", "", "Documento / Anexo", "Formulario ", "Servicio"];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getProcedureDocumentList();
    setTitle("Documentos requeridos");

    getProcedureDocumentCatalog(props.dataIdGeneric);
    getBusinessCharacterizationCatalog(props.dataId);
    setRowsPerPage(parseInt(items));
  }, [props.dataIdGeneric, items]);

  const getProcedureDocumentList = () => {
    _configService.getProcedureDocumentList().subscribe((res: any) => {
      if (res.DataBeanProperties.ObjectValue) {
        setTypeDocument(res.DataBeanProperties.ObjectValue);
      }
    });
  };

  const getProcedureDocumentCatalog = async (id: number) => {
    setShowSpinner(true);
    await _configService
      .getProcedureDocumentCatalog(id)
      .then((resp: any) => {
        setShowSpinner(false);
        if (resp.data.DataBeanProperties.ObjectValue) {
          setListGeneric(resp.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido cargar la información",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteProcedureDocument = async (id: number) => {
    await _configService
      .deleteProcedureDocument(id)
      .then((resp: any) => {
        Toast.fire({
          icon: "success",
          title: "Se ha eliminado con éxito!",
        });
        getProcedureDocumentCatalog(props.dataIdGeneric);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteProcedureDocument(idDelete);
    }
  };

  const getBusinessCharacterizationCatalog = (id: number) => {
    _configService.getBusinessCharacterizationCatalog(id).subscribe((res) => {
      if (res) {
        console.log(res);
        setListCharacterization(res);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  // Modal T
  const closeModalGeneric = () => {
    props.getShowGeneric(false);
  };

  // Modal Ne
  const closeNE = () => {
    getProcedureDocumentCatalog(props.dataIdGeneric);
    setShowNE(false);
  };

  const formComponent = (title: string, item?: any) => {
    setTitleNE(title);
    if (title === "Editar") {
      setformNE(item.DataBeanProperties);
      setIdDocument(item.DataBeanProperties.IDDocument);
    }
    viewModalNE();
  };

  const getProcedureDocumentCatalogRefresh = () => {
    getProcedureDocumentCatalog(props.dataIdGeneric);
  };

  const viewModalNE = () => {
    setShowNE(true);
  };

  const classes = useStyles();

  return (
    <>
      <Modal
        show={props.dataShowGeneric}
         onHide={closeModalGeneric}
        size="xl"
        centered
         
      >
        <Modal.Header>
          {title}
          <BsXSquare  className='pointer' onClick={closeModalGeneric} />
        </Modal.Header>
        <Modal.Body>
          <Row className="p-4">
            <Col sm={12}>
              {!showSpinner && (
                <div className="d-flex">
                  <div className="ml-auto mb-2">
                    <ThemeProvider theme={inputsTheme}>
                      <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<BsPlus />}
                        onClick={() => {
                          formComponent("Crear");
                        }}
                      >
                        CREAR
                      </Button>
                    </ThemeProvider>
                  </div>
                </div>
              )}
              {showSpinner ? (
                <div className="mb-10">
                  <CircularProgress
                    size={50}
                    sx={{
                      color: "#503464",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                </div>
              ) : listGeneric.length > 0 ? (
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
                          <TableCell>Nombre</TableCell>
                          <TableCell>Documento / Formulario</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listGeneric
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any, i: number) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell>
                                {item.DataBeanProperties.IDDocument}
                              </TableCell>
                              <TableCell
                                style={{
                                  paddingRight: 20,
                                  width: "30%",
                                  textAlign: "justify",
                                }}
                              >
                                <b>Nombre:</b> {item.DataBeanProperties.Name}
                                <div className="mt-3">
                                  <b>Descripción:</b>{" "}
                                  {item.DataBeanProperties.Description}
                                </div>
                              </TableCell>

                              <TableCell
                                style={{
                                  textAlign: "justify",
                                }}
                              >
                                <b>Tipo:</b>{" "}
                                {item.DataBeanProperties.DocumentTypeName}
                                <div className="mt-1">
                                  {item.DataBeanProperties.FormName}
                                </div>
                                <Row>
                                  <Col sm={7}>
                                    <b>
                                      ¿Aplicar todas las caracterizaciones?:{" "}
                                    </b>
                                    {item.DataBeanProperties.ApplyForAllChar ===
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
                                  </Col>
                                  <Col sm={5}>
                                    <b>¿Es opcional?: </b>
                                    {item.DataBeanProperties.IsOptional ===
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
                                  </Col>
                                </Row>
                                <Row>
                                  <Col sm={4}>
                                    <b>Tiempo de validez: </b>
                                    {item.DataBeanProperties.ValidityType}
                                  </Col>
                                  <Col sm={4}>
                                    <b>Tiempo por defecto: </b>
                                    {item.DataBeanProperties.DefeatTime}
                                  </Col>
                                </Row>
                                <div className="mt-3">
                                  <b>Caracterizaciones: </b>
                                  {
                                    item.DataBeanProperties
                                      .CharacterizationListNames
                                  }
                                </div>
                              </TableCell>
                              <TableCell>
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
                                      formComponent("Editar", item);
                                    }}
                                  />
                                  {permiso === "true" && (
                                    <SpeedDialAction
                                      icon={<BsTrash />}
                                      tooltipTitle="Eliminar"
                                      onClick={() => {
                                        setIdDelete(
                                          item.DataBeanProperties.IDDocument
                                        );
                                        setShowDelete(true);
                                      }}
                                    />
                                  )}
                                  <SpeedDialAction
                                    icon={<BsFillFileEarmarkPersonFill />}
                                    tooltipTitle="Ver/Asignar caracterizaciones"
                                    onClick={() => {
                                      setOpenDiag(true);
                                      setIdDocument(
                                        item.DataBeanProperties.IDDocument
                                      );
                                    }}
                                  />
                                  )
                                </SpeedDial>
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
                    count={listGeneric.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              ) : (
                <h1>Aún no hay documentos o formularios asociados</h1>
              )}
            </Col>
          </Row>
        </Modal.Body>
        {showNE && (
          <NEGenericProcedure
            getShowNE={closeNE}
            dataShowNE={showNE}
            dataObjNe={formNE}
            dataTitleNE={titleNE}
            dataTitlenNEGeneric={title}
            dataIDProcedure={props.dataIdGeneric}
            businessId={props.dataId}
            idDocument={idDocument}
            listTypesDocument={typeDocument}
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
        {openDiag && (
          <TDocumentCharacterization
            name={""}
            show={openDiag}
            setShow={setOpenDiag}
            dataTitle={titleNE}
            idProcedure={props.dataIdGeneric}
            idDocument={idDocument}
            listCharacterization={listCharacterization}
            refresh={getProcedureDocumentCatalogRefresh}
          />
        )}
      </Modal>
      {showSpinner && (
        <div className="spinner d-flex justify-content-center">
          <SSpinner show={showSpinner} />
        </div>
      )}
    </>
  );
};

export default TGenericProcedure;
