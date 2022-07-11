import {
  Paper,
  TableBody,
  TableCell,
  SpeedDial,
  SpeedDialAction,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TablePagination,
  Button,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
  BsCheckCircleFill,
  BsTrash,
  BsXCircleFill,
  BsPlus,
  BsFillFileEarmarkCheckFill,
  BsXSquare,
} from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";

import { SSpinner } from '../../../shared/components/SSpinner'
import { ConfigService } from "../../../core/services/ConfigService";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { OfficeBusinessProcess } from "../model/OfficeBusinessProcess";
import TAddProcedure from "./TAddProcedure";

interface ITTramitsByOffice {
  dataShow: boolean;
  setShow: Function;
  id: number;
  name: string;
}

const _configService = new ConfigService();

const TTramitsByOffice: React.FC<ITTramitsByOffice> = (
  props: ITTramitsByOffice
) => {
  const [listTramitsByOffice, SetListTramits] = useState<
    OfficeBusinessProcess[]
  >([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(false);
  const [idDeleteBussines, setIdDelete] = useState(0);
  const [idDeleteOfice, setIdDelete2] = useState(0);
  const [showProcedure, setShowProcedure] = useState(false);
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

  const closeModal = () => {
    props.setShow(false);
  };

  useEffect(() => {
    setRowsPerPage(parseInt(items));;
    console.log("Use Effect");

    getOfficeBusinessProcessCatalog(props.id);
  }, [items]);

  const getOfficeBusinessProcessCatalog = (id: number) => {
    _configService.getOfficeBusinessProcessCatalog(id).subscribe((res) => {
      console.log(res);
      if (res) {
        SetListTramits(res);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const classes = useStyles();
  const deleteElement = () => {
    _configService
      .removeOfficeToBusinessOffice(idDeleteBussines, idDeleteOfice)
      .subscribe((resp: any) => {
        if (resp.DataBeanProperties.ObjectValue) {
          getOfficeBusinessProcessCatalog(props.id);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha completado la acción",
          });
        }
      });
  };

  const closeModalProcedure = (data: any) => {
    console.log(data);
    console.log(props.id);
    getOfficeBusinessProcessCatalog(props.id);
    setShowProcedure(data);
  };

  return (
    <>
      <Modal
        size="xl"
        show={props.dataShow}
        modal 
        centered
        onHide={closeModal}
      >
        <Modal.Header>
          Lista de trámites por sucursal {props.name}
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-3 p-2">
            <Col sm={12}>
              <div className="d-flex">
                <div className="ml-auto mb-2">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      color="secondary"
                      variant="contained"
                      endIcon={<BsFillFileEarmarkCheckFill />}
                      onClick={() => {
                        setShowProcedure(true);
                      }}
                    >
                      AGREGAR TRÁMITE
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
                        <TableCell>ID </TableCell>
                        <TableCell>Tramite</TableCell>
                        <TableCell>Fecha de Carga</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listTramitsByOffice
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item: OfficeBusinessProcess, index: number) => (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell>
                              {item.IDOfficeBusinessProcess}
                            </TableCell>
                            <TableCell>{item.BusinessProcessName}</TableCell>
                            <TableCell>{item.Since}</TableCell>
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
                                  key={index + 1}
                                  icon={<BsTrash />}
                                  tooltipTitle="Remover"
                                  onClick={() => {
                                    setShowDelete(true);
                                    setIdDelete(item.IDBusinessProcess);
                                    setIdDelete2(item.IDOffice);
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
                  count={listTramitsByOffice.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {showProcedure && (
                  <TAddProcedure
                    dataShowProcedure={showProcedure}
                    dataIDOffice={props.id}
                    getShowProcedure={closeModalProcedure}
                  />
                )}
                {showDelete && (
                  <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title="¿Está seguro de remover el trámite?"
                  />
                )}
              </Paper>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TTramitsByOffice;
