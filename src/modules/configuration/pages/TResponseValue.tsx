import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsPencilSquare, BsPlus, BsTrash, BsXSquare } from "react-icons/bs";
import { AdminService } from "../../../core/services/AdminService";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { IResponseValue } from "../model/ResponseValue";
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
import NEResponseValue from "../components/NEResponseValue";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

const _adminService = new AdminService();

interface ITResponseValue {
  getShow: Function;
  dataShow: boolean;
  dataObjID: number;
  dataTitle: string;
  selector: number;
  refresh: Function
}

const TResponseValue: React.FC<ITResponseValue> = (props: ITResponseValue) => {
  const [listResponse, setListResponse] = useState<IResponseValue[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showNE, setShowNE] = useState(false);
  const [formNE, setformNE] = useState<IResponseValue>();
  const [titleNE, setTitleNE] = useState("");
  const { items } = useSelector((state: RootState) => state.itemsperpage);

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
    console.log(props.dataObjID);
    getResponseValueForForm(props.dataObjID);
    setRowsPerPage(parseInt(items));;

  }, [showNE, items]);

  const getResponseValueForForm = (id: number) => {
    _adminService.getResponseValueForForm(id).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        setListResponse(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const closeModal = () => {
    props.refresh(props.selector);
    props.getShow(false);
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
    console.log(props.dataObjID);
    console.log(data);
    setShowNE(data);
  };

  const deleteComponent = (id: number) => {
    console.log(id);
    _adminService.deleteResponseValue(id).subscribe((resp: any) => {
      console.log(resp);
      getResponseValueForForm(props.dataObjID);
    });
  }

  return (
    <Modal show={props.dataShow}   size="lg" centered onHide={closeModal} >
      <Modal.Header>
        {props.dataTitle} Variables de Respuesta
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
                      <TableCell>ResponseClass</TableCell>
                      <TableCell>LimitedValues</TableCell>
                      <TableCell>LimitedWithValues</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listResponse
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{item.IDResponseValue}</TableCell>
                          <TableCell>{item.Name}</TableCell>
                          <TableCell>{item.ResponseClass}</TableCell>
                          <TableCell>{item.LimitedValues}</TableCell>
                          <TableCell>{item.LimitedWithValues}</TableCell>
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
                                key={index}
                                sx={{ color: "secondary" }}
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar Variables de Respuesta"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              <SpeedDialAction
                                key={index + 1}
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar"
                                onClick={() => {
                                  /* setShowDelete(true); */
                                  deleteComponent(item.IDResponseValue);
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
                count={listResponse.length}
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
        <NEResponseValue
          getShowNE={closeNE}
          dataShowNE={showNE}
          dataObjNe={formNE}
          dataTitleNE={titleNE}
          refresh={getResponseValueForForm}
          IDForm={props.dataObjID}
          IDJsonService={null}
          dataTitleResponse={"Formulario"}
        />
      )}
    </Modal>
  );
};

export default TResponseValue;
