import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { BsPencilSquare, BsPlus, BsTrash, BsXSquare } from "react-icons/bs";
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
import { IResponseValueJson } from "../model/ResponseValueJson";
import { NoInfo } from "../../../utils/NoInfo";
import NEResponseValue from "../components/NEResponseValue";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";


const _adminService = new AdminService();

interface ITResponseValueJson {
    getShow: Function;
    dataShow: boolean;
    IDJsonService: number;
    titulo: string;
    selector: number;
    refresh: Function
}

const TResponseValueJson: React.FC<ITResponseValueJson> = (props: ITResponseValueJson) => {
    const [listResponseValue, setListResponseValue] = useState<IResponseValueJson[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [statusModal, setStatusModal] = useState(false);
    const [formulario, setFormulario] = useState<IResponseValueJson>();
    const [title, setTitle] = useState("");
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
        props.getShow(false);
        props.refresh(props.selector);
    };

    const formComponent = (title: string, item?: any) => {
        setTitle(title);
        if (title === "Editar") {
            setFormulario(item);
        }
        setStatus(true);
    };
    const deleteItem = (id: number) => {
        console.log(id);
        _adminService.deleteResponseValue(id).subscribe((resp: any) => {
            console.log(resp);
            getResponseValueForJson();
        });
    }

    const setStatus = (status: boolean) => {
        setStatusModal(status);
    };

    const getResponseValueForJson = () => {
        _adminService.getResponseValueForJson(props.IDJsonService).subscribe(resp => {
            if (resp) {
                setListResponseValue(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido cargar la información",
                });
            }
        });
    }
    useEffect(() => {
        setRowsPerPage(parseInt(items));;
        getResponseValueForJson();
    }, [items]);

    const classes = useStyles();


    return (
        <Modal show={props.dataShow}   size="lg" centered onHide={closeModal} >
            <Modal.Header>
                {props.titulo} Variables de Respuesta
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
                        {listResponseValue.length === 0 ? (
                            <NoInfo />
                        ) : (

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
                                            {listResponseValue
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                )
                                                .map((item: IResponseValueJson, index: number) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.IDJsonService}</TableCell>
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
                                                                        deleteItem(item.IDResponseValue);
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
                                    count={listResponseValue.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        )}

                    </Col>
                </Row>
            </Modal.Body>
            {statusModal && (
                <NEResponseValue
                    getShowNE={setStatusModal}
                    dataShowNE={statusModal}
                    dataObjNe={formulario}
                    dataTitleNE={title}
                    refresh={getResponseValueForJson}
                    IDJsonService={props.IDJsonService}
                    IDForm={null}
                    dataTitleResponse={"Servicio"}
                />
            )}
        </Modal>
    )
};
export default TResponseValueJson;


