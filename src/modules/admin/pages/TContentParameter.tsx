import React from "react";
import { useState } from "react";
import { AdminService } from "../../../core/services/AdminService";
import { FiMoreVertical } from "react-icons/fi";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { ListParameter } from "../model/ListParameter";
import { Toast } from "../../../utils/Toastify";
import { Col, Row } from "react-bootstrap";
import NEContentParameter from "../components/NEContentParameter";
import { MenuItem, Paper, TableContainer, TextField, Table, TablePagination, TableHead, TableRow, TableCell, TableBody, ButtonGroup, ThemeProvider, Tooltip, Button } from "@mui/material";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";

const _adminService = new AdminService();

interface ITContentParameter {
  list: ListParameter[];
}

const TContentParameter: React.FC<ITContentParameter> = (props: ITContentParameter) => {

  const [listType, setListType] = useState<ListParameter[]>([]);
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [formdata, setformdata] = useState<ListParameter>();
  const [type, setType] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [id, setId] = useState(0);
  const [btn, setBtn] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [codeList, setCodeList] = useState<number[]>([]);

  const getListaParametrosOrdenado = (id: number) => {
    setShowSpinner(true);
    let aux: any = [];
    _adminService.getListaParametrosOrdenado(id)
      .subscribe((resp) => {
        setShowSpinner(false);
        resp.map((item: ListParameter) => {
          aux.push(item.CodigoP);
        })
        setCodeList(aux);
        setListType(resp);
      });
  };

  useEffect(() => {
    setRowsPerPage(parseInt(items));;
  }, [items]);


  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    console.log(data);
    if (title === "Editar") {
      setformdata(data);
      console.log(formdata);
    }
    viewModal();
  };

  const viewModal = () => {
    setShow(true);
  };

  const onChangeComponent = (e: any, id?: any) => {
    console.log(e);
    setType(e);
    setBtn(true);
    setId(e);
    getListaParametrosOrdenado(e);
  };

  const closeModal = (data: any) => {
    setShow(data);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteListaParametros = () => {
    setShowSpinner(true);
    _adminService
      .deleteListaParametros(idDelete)
      .subscribe(res => {
        setShowSpinner(false);
        if (res) {
          Toast.fire({
            icon: "success",
            title: "Se ha eliminado con éxito!",
          });
          getListaParametrosOrdenado(id);
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
      deleteListaParametros();
    }
  };

  const classes = useStyles();

  return (
    <>
      <div className="pull-title-top mt-3 ml-3">
        <h1>Contenido Parámetros</h1>
      </div>
      <div className="col-xxl-4 col-12 col-xxl-12">
        <div className="row justify-content-end">
          <div className="col-md-6 d-flex justify-content-end mr-5">
            <div className="form-group">
              {btn &&
                <button
                  className="btn btn-sm btn-outline-secondary btn-custom"
                  type="button"
                  onClick={() => {
                    formComponent("Crear");
                  }}
                >
                  <BsPlus />
                </button>}
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col sm={6}>
          <TextField
            size="small"
            select
            fullWidth
            color="secondary"
            label=".:Seleccione un parámetro:."
            id="state"
            onChange={(e) => onChangeComponent(e.target.value)}
          >
            {props.list.map((item) => (
              <MenuItem value={item.IDTipoLista}>{item.Nombre}</MenuItem>
            ))}
          </TextField>
        </Col>
      </Row>
      {(listType.length > 0) ?
        <div className="mt-3">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "70vh" }}>
              <Table stickyHeader aria-label="sticky table" className={classes.root}>
                <TableHead>
                  <TableRow sx={{ height: "3rem" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listType
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any, index: number) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell >{item.IDListaParametros}</TableCell>
                        <TableCell >{item.CodigoP !== null && item.CodigoP !== ""
                          ? item.CodigoP
                          : "NA"}</TableCell>
                        <TableCell >{item.Valor}</TableCell>
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
                              <ThemeProvider theme={inputsTheme}>
                                {/* <Tooltip title="Eliminar elemento">
                                  <Button
                                    variant="contained"
                                    className="box-s mr-1 mt-2 mb-2"
                                    color="error"
                                    onClick={() => {
                                      setShowDelete(true);
                                      setIdDelete(item.IDListaParametros);
                                    }}>
                                    <BsTrash />
                                  </Button>
                                </Tooltip> */}
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
                                icon={<BsPencilSquare />}
                                tooltipTitle="Editar elemento"
                                onClick={() => {
                                  formComponent("Editar", item);
                                }}
                              />
                              {/* <SpeedDialAction
                                key={index + 1}
                                icon={<BsTrash />}
                                tooltipTitle="Eliminar"
                                onClick={() => {
                                  setShowDelete(true);
                                  setIdDelete(item.IDListaParametros);
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
              labelRowsPerPage="Columnas por Página"
              component="div"
              count={props.list.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        :
        <div className="mt-3">
          <h1>
            "No hay datos para mostrar :("
          </h1>
        </div>
      }
      {showSpinner && (
        <SSpinner
          show={showSpinner}
        />
      )}
      {show && (
        <NEContentParameter
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          IDTipoLista={type}
          refreshList={getListaParametrosOrdenado}
          id={id}
          codeList={codeList}
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
    </>
  );
};

export default TContentParameter;
