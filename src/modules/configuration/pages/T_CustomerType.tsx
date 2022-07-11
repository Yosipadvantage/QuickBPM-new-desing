import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import { MenuItem, ThemeProvider, Paper, SpeedDial, SpeedDialAction, TableCell, TableContainer, Table, TableHead, TextField, TableRow, TableBody, TablePagination, IconButton, Button, Menu, ListItemIcon, ListItemText, ButtonGroup } from "@mui/material";
import { Tooltip } from "@material-ui/core";
import { FiMoreVertical } from "react-icons/fi";
import { BsArrowUp, BsGearFill, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { ICustomerType } from "../model/CustomerType";
import { NECustomerType } from "../components/NECustomerType";
import { pipeSort } from "../../../utils/pipeSort";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";

const _configService = new ConfigService();

/* interface ICustomerType { } */

export const T_CustomerType: React.FC<ICustomerType> = () => {

    const [listCustomerType, setListCustomerType] = useState<ICustomerType[]>([])
    const [showSpinner, setShowSpinner] = useState(true);
    const [show, setShow] = useState(false);
    const [formdata, setformdata] = useState<ICustomerType>();
    const [title, setTitle] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        setRowsPerPage(parseInt(items));;
        getCustomerTypeCatalog();
    }, [items]);

    const getCustomerTypeCatalog = () => {
        setShowSpinner(true);
        _configService.getCustomerTypeCatalog().subscribe(res => {
            setShowSpinner(false);
            if (res) {
                console.log(res);
                setListCustomerType(res);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }
    const closeModal = (data: boolean) => {
        setShow(data);
        getCustomerTypeCatalog();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const formComponent = (title: string, data?: ICustomerType) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        setShow(true);
    };

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteCustomer();
        }
    }

    const deleteCustomer = () => {
        _configService.deleteCustomerType(idDelete).subscribe((resp: any) => {
            if (resp) {
                getCustomerTypeCatalog();
                Toast.fire({
                    icon: "success",
                    title: "Se ha eliminado con éxito!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        });
    }

    const ordenar = (listArray: any, columna: string) => {
        let aux = pipeSort([...listArray], columna);
        setListCustomerType(aux);
    }

    const classes = useStyles();

    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top">
                        <h1>Tipo de Cliente</h1>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-md-6 d-flex justify-content-end mr-5">
                            <div className="form-group">
                                <button
                                    className="btn btn-sm btn-outline-secondary btn-custom"
                                    type="button"
                                    onClick={() => {
                                        formComponent("Crear");
                                    }}
                                >
                                    <BsPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "70vh" }}>
                            <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            ID
                                            <Tooltip className="ml-2" title="Ordenar">
                                                <IconButton aria-label="delete" size="small" onClick={() => { ordenar(listCustomerType, 'IDCustomerType') }}>
                                                    <BsArrowUp />
                                                </IconButton>
                                            </Tooltip>  </TableCell>
                                        <TableCell>
                                            Nombre
                                            <Tooltip className="ml-2" title="Ordenar">
                                                <IconButton aria-label="delete" size="small" onClick={() => { ordenar(listCustomerType, 'Name') }}>
                                                    <BsArrowUp />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            Descripción
                                            <Tooltip className="ml-2" title="Ordenar">
                                                <IconButton aria-label="delete" size="small" onClick={() => { ordenar(listCustomerType, 'Description') }}>
                                                    <BsArrowUp />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listCustomerType
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item: ICustomerType, index: number) => (
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                <TableCell>{item.IDCustomerType}</TableCell>
                                                <TableCell>{item.Name}</TableCell>
                                                <TableCell>{item.Description}</TableCell>
                                                <TableCell>
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
                                                                <Tooltip title="Eliminar elemento">
                                                                    <Button
                                                                        variant="contained"
                                                                        className="box-s mt-2 mb-2"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            setShowDelete(true);
                                                                            setIdDelete(item.IDCustomerType);
                                                                        }}>
                                                                        <BsTrash />
                                                                    </Button>
                                                                </Tooltip>
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
                                                                key={item.IDCustomerType + 1}
                                                                sx={{ color: "secondary" }}
                                                                icon={<BsPencilSquare />}
                                                                tooltipTitle="Editar"
                                                                onClick={() => {
                                                                    formComponent("Editar", item);
                                                                }}
                                                            />
                                                            )
                                                            <SpeedDialAction
                                                                key={
                                                                    item.IDCustomerType
                                                                }
                                                                icon={<BsTrash />}
                                                                tooltipTitle="Eliminar Tipo Cliente"
                                                                onClick={() => {
                                                                    setShowDelete(true);
                                                                    setIdDelete(
                                                                        item.IDCustomerType
                                                                    );
                                                                }}
                                                            />
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
                            count={listCustomerType.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
            {show && (
                <NECustomerType
                    getShow={closeModal}
                    dataShow={show}
                    dataObj={formdata}
                    dataTitle={title}
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
        </div>
    )
}
export default T_CustomerType;
