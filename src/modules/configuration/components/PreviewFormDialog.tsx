import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TablePagination,
  Button,
  ThemeProvider,
} from "@mui/material";

import { inputsTheme, useStyles } from "../../../utils/Themes";
import { IResponseValue } from "../model/ResponseValue";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

interface previewDialog {
  open: boolean;
  setOpen: Function;
  dataObjID: number | undefined;
  openResponseValue: Function;
}

const _adminService = new AdminService();

export const PreviewFormDialog: FC<previewDialog> = (props: previewDialog) => {
  const [listResponse, setListResponse] = useState<IResponseValue[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  useEffect(() => {
    if (props.dataObjID) {
      getResponseValueForForm(props.dataObjID);
      setRowsPerPage(parseInt(items));;
    }
  }, [items]);

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

  return (
    <>
      <Dialog onClose={() => props.setOpen(false)} open={props.open}>
        <DialogTitle>
          <Row>
            <Col sm={6}>Campos del formulario</Col>
            {listResponse.length > 0 && (
              <Col sm={6} className="d-flex justify-content-end">
                <ThemeProvider theme={inputsTheme}>
                  <Button color="secondary" variant="contained" onClick={() => { props.openResponseValue(props.dataObjID); props.setOpen(false) }}>
                    EDITAR
                  </Button>
                </ThemeProvider>
              </Col>
            )}
            {listResponse.length === 0 && (
              <Col sm={6} className="d-flex justify-content-end">
                <ThemeProvider theme={inputsTheme}>
                  <Button color="secondary" variant="contained" onClick={() => { props.openResponseValue(props.dataObjID); props.setOpen(false) }}>
                    AÑADIR CAMPOS
                  </Button>
                </ThemeProvider>
              </Col>
            )}
          </Row>
        </DialogTitle>
        <div className="m-3">
          {listResponse.length > 0 ? (
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listResponse
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{item.IDResponseValue}</TableCell>
                          <TableCell>{item.Name}</TableCell>
                          <TableCell>{item.ResponseClass}</TableCell>
                          <TableCell>{item.LimitedValues}</TableCell>
                          <TableCell>
                            {item.LimitedWithValues}
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
          ) : (
            <h1 className="m-3">No exísten campos para este Formulario</h1>
          )}
        </div>
      </Dialog>
    </>
  );
};
