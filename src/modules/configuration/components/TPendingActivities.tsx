import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { SSpinner } from "../../../shared/components/SSpinner";
import { ConfigService } from "../../../core/services/ConfigService";
import { RootState } from "../../../store/Store";
import { useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { BsXSquare } from "react-icons/bs";

interface ITPendingActivities {
  dataShow: boolean;
  setShow: Function;
  id: number;
}

const _configService = new ConfigService();

const TPendingActivities: React.FC<ITPendingActivities> = (
  props: ITPendingActivities
) => {
  const [listRequested, setListRequested] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
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
    getPendingProcedureActionForProcedureImp();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getPendingProcedureActionForProcedureImp = async () => {
    setShowSpinner(true);
    await _configService
      .getPendingProcedureActionForProcedureImp(props.id)
      .then((rps: any) => {
        setShowSpinner(false);
        if (rps.data.DataBeanProperties.ObjectValue) {
          setListRequested(rps.data.DataBeanProperties.ObjectValue);
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la acción",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setShowSpinner(false);
      });
  };

  const closeModal = () => {
    props.setShow(false);
  };

  const classes = useStyles();

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
          Actividades pendientes
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ height: "70vh" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.root}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Cédula</TableCell>
                    <TableCell>Etapa</TableCell>
                    <TableCell>Área</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listRequested
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>
                          {item.DataBeanProperties.AccountName}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.ProcedureActionName}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.FunctionalIDName}
                        </TableCell>
                        <TableCell>
                          {item.DataBeanProperties.StateName}
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
              count={listRequested.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Modal.Body>
      </Modal>
      {showSpinner && (
        <div className="spinner d-flex justify-content-center">
          <SSpinner show={showSpinner} />
        </div>
      )}
    </>
  );
};

export default TPendingActivities;
