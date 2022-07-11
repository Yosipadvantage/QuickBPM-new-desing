import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { AdminService } from "../../../core/services/AdminService";
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
import { BsXSquare } from "react-icons/bs";
import { useStyles } from "../../../utils/Themes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";

/* refresh: Function; */
interface IMConditional {
  getShowMConditonal: Function;
  dataShowMConditonal: boolean;
  dataList: any[];
}

const MConditional: React.FC<IMConditional> = (props: IMConditional) => {
  console.log(props.dataList);


  /* const [list, setList] = useState<any[]>([]);
  setList(props.dataList); */
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
    setRowsPerPage(parseInt(items));;
  }, [items]);

  const closeModal = () => {
    props.getShowMConditonal(false);
    /* props.refresh(); */
  };

  const classes = useStyles();

  return (
    <Modal
      show={props.dataShowMConditonal}
      size="lg"
      centered
      onHide={closeModal}
    >
      <Modal.Header>
        Control de Flujo
        <BsXSquare  className='pointer' onClick={closeModal} />
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
                  <TableCell>Flujo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.dataList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: any, index: number) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{item}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.root}
            rowsPerPageOptions={[items, 10, 25, 100]}
            component="div"
            count={props.dataList.length}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage="Columnas por Página"
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Modal.Body>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          
        </Modal.Body>
      </form> */}
    </Modal>
  );
};

export default MConditional;
