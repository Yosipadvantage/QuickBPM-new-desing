import React, { useEffect, useState } from "react";
import { TypeForm } from "../model/TypeForm";
import { Modal, Row, Col } from "react-bootstrap";
import { BsJustifyRight, BsPlus, BsXSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { ThemeProvider } from "@material-ui/core";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { InputAdornment, TextField, Button, Tooltip, Checkbox } from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { DataForm } from "../model/Form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { MenuItem, SpeedDial, SpeedDialAction } from "@mui/material";
import { getBusinessProcessCatalog } from "../../../actions/AConfig";
import { ConfigService } from "../../../core/services/ConfigService";
import { SSpinner } from "../../../shared/components/SSpinner";

const _configService = new ConfigService();

interface IAddProcedure {
  getShowProcedure: Function;
  dataShowProcedure: boolean;
  dataIDOffice: number;
}

const TAddProcedure: React.FC<IAddProcedure> = (props: IAddProcedure) => {

  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  const [catSelected, setCatSelected] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [toAddList, setToAddList] = useState<number[]>([]);
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

  const characterizations = useSelector(
    (state: RootState) => state.characterization.characterizations
  );

  const list = useSelector((state: RootState) => state.business.business);

  useEffect(() => {
    dispatch(getBusinessProcessCatalog(catSelected, null, null));
    setRowsPerPage(parseInt(items));;

  }, [dispatch, catSelected, items]);

  useEffect(() => {
  }, [toAddList, list])


  const onChangeSelect = (e: any) => {
    setCatSelected(e);
  };

  const closeModal = () => {
    props.getShowProcedure(false);
  };

  const classes = useStyles();

  const addOfficeToBusinessProcess = (idBusiness: number, idOffice: number) => {
    setSpinner(true);
    _configService.addOfficeToBusinessProcess(idBusiness, idOffice).subscribe(resp => {
      setSpinner(false);
      if (resp) {
        closeModal();
        Toast.fire({
          icon: "success",
          title: "Se ha guardado con éxito!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha podido completar la acción",
        });
      }
    });
  };

  const addProcedure = () => {
    if (toAddList.length > 0) {
      toAddList.map((id: number) => {
        addOfficeToBusinessProcess(id, props.dataIDOffice);
      })
    } else {
      Toast.fire({
        icon: "warning",
        title: "Ningún trámite seleccionado"
      })
    }
  };

  /* const selectAll = () => {
    let aux: number[] = [];
    list.map((item: number) => {
      aux.push(item);
    })
    console.log(aux);
    setToAddList(aux);
  }; */

  const handleCheck = (id: number) => {
    let aux: number[] = [...toAddList];
    if (aux.indexOf(id) !== -1) {
      aux.splice(aux.indexOf(id), 1)
    } else {
      aux.push(id);
    }
    console.log(aux);
    setToAddList(aux);
  }

  return (
    <>
      <Modal
        show={props.dataShowProcedure}
        size="xl"
        onHide={closeModal}
        centered
         
      >
        <Modal.Header>
          Agregar Trámite
          <BsXSquare  className='pointer' onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <div className="px-5 mt-2">
            <div className="row">
              <div className="col-md-12">
                <label htmlFor="cbxModeloNe">Seleccione un tipo::</label>
              </div>
              <div className="col-md-10">
                <TextField
                  margin="normal"
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label=".:Seleccione un tipo:."
                  id="state"
                  onChange={(e) => onChangeSelect(e.target.value)}
                >
                  {characterizations.map((item: any) => (
                    <MenuItem value={item.IDBusinessClass}>{item.Name}</MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-md-2 justify-content-center mt-3">
                <ThemeProvider theme={inputsTheme}>
                  <Button className="w-100" variant="contained" color="success" onClick={() => { addProcedure() }}>
                    GUARDAR
                  </Button>
                </ThemeProvider>
              </div>
            </div>
            {list.length > 0 &&
              <div className="row">
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
                          <TableCell>Descripción</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {list
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any, index: number) => (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell>{item.DataBeanProperties.IDBusinessProcess}</TableCell>
                              <TableCell>{item.DataBeanProperties.Name}</TableCell>
                              <TableCell>{item.DataBeanProperties.Description}</TableCell>
                              {/* <TableCell>
                                <SpeedDial
                                  key={index}
                                  className="p-1"
                                  ariaLabel="SpeedDial basic example"
                                  direction="left"
                                  FabProps={{
                                    size: "small",
                                    style: { backgroundColor: "#503464" },
                                  }}
                                  icon={<BsPlus />}
                                  onClick={() => {
                                    addProcedure(item.DataBeanProperties.IDBusinessProcess);
                                  }}
                                />
                              </TableCell> */}
                              <TableCell>
                                <TableCell>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title={'Agregar/Quitar Trámite'} placement="right">
                                      <Checkbox
                                        name={item.DataBeanProperties.IDBusinessProcess}
                                        onClick={(e) => { handleCheck(item.DataBeanProperties.IDBusinessProcess) }}
                                        color="secondary"
                                        checked={toAddList.indexOf(item.DataBeanProperties.IDBusinessProcess) !== -1}
                                      />
                                    </Tooltip>
                                  </ThemeProvider>
                                </TableCell>
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
              </div>}
          </div>
        </Modal.Body>
      </Modal>
      {spinner &&
        <SSpinner show={spinner} />
      }
    </>
  );
};

export default TAddProcedure;
