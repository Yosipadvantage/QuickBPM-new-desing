import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsPencilSquare, BsPlus, BsSignpostSplitFill, BsTrash, BsXSquare } from "react-icons/bs";
import { AdminService } from "../../../core/services/AdminService";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import {
  Paper,
  SpeedDial,
  SpeedDialAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ThemeProvider,
  Button
} from "@mui/material";


import { FiMoreVertical } from "react-icons/fi";
import { Toast } from "../../../utils/Toastify";
import { IConditionStatement } from "../model/ConditionStatement";
import NEConditionStatement from "../components/NEConditionalStatement";
import { ConditionalRow } from "../components/ConditionalRow";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { RootState } from "../../../store/Store";
import { useSelector } from "react-redux";

const _adminService = new AdminService();

/* refresh: Function */

interface ITConditionalStatement {
  getShowCS: Function;
  dataShowCS: boolean;
  dataObjIDProcedure: any;
  refresh: Function;
  refreshId: number
  idBusinessProcess: number
}

const TConditionalStatement: React.FC<ITConditionalStatement> = (props: ITConditionalStatement) => {
  const [listConditionStatement, setListConditionStatement] = useState<IConditionStatement[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showNE, setShowNE] = useState(false);
  const [formNE, setformNE] = useState<IConditionStatement>();
  const [titleNE, setTitleNE] = useState("");
  const [idFlow, setIdFlow] = useState(0);
  const [idDelete, setIdDelete] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
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

  useEffect(() => {
    console.log(props.dataObjIDProcedure);
    getConditionStatementCatalog(props.dataObjIDProcedure);
    setRowsPerPage(parseInt(items));;

  }, [showNE, items]);

  const getConditionStatementCatalog = (id: number) => {
    _adminService.getConditionStatementCatalog(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListConditionStatement(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const closeModal = () => {
    props.getShowCS(false);
    props.refresh(props.refreshId);
  };

  const classes = useStyles();

  const formComponent = (title: string, item?: any) => {
    setTitleNE(title);
    if (title === "Editar") {
      setformNE(item);
    }
    viewModalNE();
  };

  const viewModalNE = () => {
    setShowNE(true);
  };

  const closeNE = (data: any) => {
    setShowNE(data);
  };

  const deleteComponent = () => {
    _adminService.deleteConditionStatement(idDelete).subscribe((resp: any) => {
      console.log(resp);
      getConditionStatementCatalog(props.dataObjIDProcedure);
    });
  }

  const deleteElement = (data: boolean) => {
    if (data) {
      deleteComponent();
    }
  };

  const handleShowIndex = (id: number) => {
    console.log('log de referencia');
    setShowIndex(true);
    setIdFlow(id);
  };

  return (
    <Modal show={props.dataShowCS}   size="lg" centered onHide={closeModal} >
      <Modal.Header>
        Agregar Control de Flujo a Procedimientos
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="p-4">
          <Col sm={12}>
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
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ height: "80vh" }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  className={classes.root}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Evaluación de Condición</TableCell>
                      <TableCell>Procedimiento</TableCell>
                      <TableCell>Orden de ejecución</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listConditionStatement
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{item.IDConditionStatement}</TableCell>
                          <TableCell>{item.ConditionStatement}</TableCell>
                          <TableCell>{item.ProcedureName}</TableCell>
                          <TableCell>{item.ConditionalRow}</TableCell>
                          <TableCell>
                            <SpeedDial
                              className="p-1"
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
                                tooltipTitle="Editar Control de Flujo"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              {permiso === 'true' &&

                                <SpeedDialAction
                                  key={index + 1}
                                  icon={<BsTrash />}
                                  tooltipTitle="Eliminar"
                                  onClick={() => {
                                    setIdDelete(item.IDConditionStatement);
                                    setShowDelete(true);
                                  }}
                                />
                              }                              <SpeedDialAction
                                key={index + 2}
                                icon={<BsSignpostSplitFill />}
                                tooltipTitle="Cambiar orden de flujo"
                                onClick={() => {
                                  handleShowIndex(item.IDConditionStatement);
                                }}
                              />
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
                count={listConditionStatement.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Col>
        </Row>
      </Modal.Body>
      {showNE && (
        <NEConditionStatement
          getShowNE={closeNE}
          dataShowNE={showNE}
          dataObjNe={formNE}
          dataTitleNE={titleNE}
          dataIDProcedure={props.dataObjIDProcedure}
          dataIDBusinessProcess={props.idBusinessProcess}
        />
      )}
      {showIndex && (
        <ConditionalRow
          show={showIndex}
          setShow={setShowIndex}
          id={idFlow}
          idObj={props.dataObjIDProcedure}
          refresh={getConditionStatementCatalog}
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
    </Modal>
  );
};

export default TConditionalStatement;
