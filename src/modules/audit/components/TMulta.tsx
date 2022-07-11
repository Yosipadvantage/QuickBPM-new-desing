import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { DataItemCiudadano } from "../../weapons/model/item-ciudadano.interface";
import { WeaponsService } from "../../../core/services/WeaponsService";

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

interface ITWeapon {
  idAccount: number;
}

const _weaponService = new WeaponsService();

export const TMulta: React.FC<ITWeapon> = ({ idAccount }) => {
  const [spinner, setSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<DataItemCiudadano[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { items } = useSelector((state: RootState) => state.itemsperpage);
  const [list, setList] = useState<any>([]);

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
    setRowsPerPage(parseInt(items));
    setList([
      {
        campo1: "Campo1",
        campo2: "Campo2",
        campo3: "Campo3",
        campo4: "Campo4",
        campo5: "Campo5",
        campo6: "Campo1",
      },
    ]);
  }, [items]);

  useEffect(() => {
    multasDatosBasicos();
  }, []);

  const multasDatosBasicos = () => {
    setSpinner(true);
    _weaponService.multasDatosBasicos(idAccount).subscribe((res) => {
      setSpinner(false);
      if (res) {
        if (res.length > 0) {
          setList(res.map((item: any) => item.DataBeanProperties));
          Toast.fire({
            icon: "success",
            title: "Se cargo los datos correctamente",
          });
        } else {
          setSpinner(false);
          Toast.fire({
            icon: "error",
            title: "Error al cargar los datos ",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Error al cargar los datos ",
        });
      }
    });
  };

  const classes = useStyles();

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 2 }}>
        <TableContainer sx={{ height: "70vh" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className={classes.root}
          >
            <TableHead>
              <TableRow>
                <TableCell>Arma</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Código de permiso</TableCell>
                <TableCell>Código de seguridad</TableCell>
                <TableCell>Estado Multa</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Fecha Cierre</TableCell>
                <TableCell>Fecha de vencimiento</TableCell>
                <TableCell>Observaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>{item.ARMA}</TableCell>
                    <TableCell>{item.SERIAL}</TableCell>
                    <TableCell>{item.CODIGOPERMISO}</TableCell>
                    <TableCell>{item.CODIGOSEGURIDAD}</TableCell>
                    <TableCell>{item.ESTADOMULTA}</TableCell>
                    <TableCell>{item.VALOR}</TableCell>
                    <TableCell>{item.FECHACIERRE}</TableCell>
                    <TableCell>{item.FECHAVENCIMIENTO}</TableCell>
                    <TableCell>{item.OBSERVACION}</TableCell>
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
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {spinner && <SSpinner show={spinner} />}
      {showModal && (
        <Modal show={showModal}  centered onHide={()=>setShowModal(false)} >
          <Modal.Header>
            Detalles del Arma
            <BsXSquare
              className="pointer"
              onClick={() => {
                setShowModal(false);
              }}
            />
          </Modal.Header>

          <Modal.Body>
            <h4>TEXTO EJEMPLO</h4>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
