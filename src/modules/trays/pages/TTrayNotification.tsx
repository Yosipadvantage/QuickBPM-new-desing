import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ConfigService } from "../../../core/services/ConfigService";
import {
    Paper,
    SpeedDial,
    SpeedDialAction,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TablePagination,
    Tooltip,
    IconButton,
    ButtonGroup,
    Button,
    ThemeProvider,
} from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { BsArrowUp, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { pipeSort } from "../../../utils/pipeSort";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { NotificationK } from "../../configuration/model/Notification";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { NENotification } from "../../configuration/components/NENotification";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
interface INotification { }


export const TTrayNotification: React.FC<INotification> = () => {

    const [idDelete, setIdDelete] = useState(0);
    const [listNotification, setListNotification] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [showSpinner, setShowSpinner] = useState(true);
    const [show, setShow] = useState(false);
    const [formdata, setformdata] = useState<NotificationK>();
    const [title, setTitle] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const _configService = new ConfigService();
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getListNotifications();
    }, [items]);

    const getListNotifications = () => {
        setShowSpinner(true);
        _configService.getNotificationCatalog().subscribe((res) => {
            setShowSpinner(false);
            if (res) {
                console.log(res)
                setListNotification(res);
                console.log({ 'repsuesta catalog': listNotification })
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const ordenar = (listArray: any, columna: string) => {
        let aux = pipeSort([...listArray], columna);
        setListNotification(aux);
    };

    const closeModal = (data: boolean) => {
        setShow(data);
        getListNotifications();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const formComponent = (title: string, data?: NotificationK) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        setShow(true);
    };
    const deleteElement = (data: boolean) => {
        if (data) {
            deleteCharacterization(idDelete);
        }
    };
    const deleteCharacterization = (id: number) => {
        _configService.deleteCharacterization(id).subscribe((resp: any) => {
            if (resp) {
                Toast.fire({
                    icon: "success",
                    title: "Se elimino el elemento",
                });
                getListNotifications();
            }
        });
    };

    const classes = useStyles();


    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top">
                        <h1>Notificaciones</h1>
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
                            <Table
                                stickyHeader
                                aria-label="sticky table"
                                className={classes.root}
                            >
                                <TableHead>
                                    <TableRow sx={{ height: "3rem" }}>
                                        <TableCell>
                                            <div className="thDirection">
                                                ID
                                                <Tooltip className="ml-2" title="Ordenar">
                                                    <IconButton
                                                        aria-label="Ordenar"
                                                        size="small"
                                                        onClick={() => {
                                                            ordenar(
                                                                listNotification,
                                                                "IDCharacterization"
                                                            );
                                                        }}
                                                    >
                                                        <BsArrowUp />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            Nombre
                                            <Tooltip className="ml-2" title="Ordenar">
                                                <IconButton
                                                    aria-label="Ordenar"
                                                    size="small"
                                                    onClick={() => {
                                                        ordenar(listNotification, "Name");
                                                    }}
                                                >
                                                    <BsArrowUp />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>Descripción </TableCell>

                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listNotification
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item: NotificationK) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                key={item.IDNOTIFICA}
                                                tabIndex={-1}
                                            >
                                                <TableCell>{item.IDNOTIFICA}</TableCell>
                                                <TableCell>{item.DESCRIPCION}</TableCell>
                                                <TableCell>{item.TEXTONOTIFICA}</TableCell>

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
                                                                        }}
                                                                    >
                                                                        <BsPencilSquare />
                                                                    </Button>
                                                                </Tooltip>
                                                            </ThemeProvider>
                                                            <ThemeProvider theme={inputsTheme}>
                                                                <Tooltip title="Eliminar elemento">
                                                                    <Button
                                                                        variant="contained"
                                                                        className="box-s mr-3 mt-2 mb-2"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            setShowDelete(true);
                                                                            setIdDelete(item.IDNOTIFICA);
                                                                        }}
                                                                    >
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
                                                                key={item.IDNOTIFICA + 6}
                                                                sx={{ color: "secondary" }}
                                                                icon={<BsPencilSquare />}
                                                                tooltipTitle="Editar"
                                                                onClick={() => {
                                                                    formComponent("Editar", item);
                                                                }}
                                                            />
                                                            <SpeedDialAction
                                                                key={item.IDNOTIFICA + 1}
                                                                icon={<BsTrash />}
                                                                tooltipTitle="Eliminar proceso"
                                                                onClick={() => {
                                                                    setShowDelete(true);
                                                                    setIdDelete(item.IDNOTIFICA);
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
                            count={listNotification.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>
            {showSpinner && <SSpinner show={showSpinner} />}
            {show && (
                <NENotification
                    getShow={closeModal}
                    dataShow={show}
                    dataObj={formdata}
                    dataTitle={title}
                />
            )}
            <GenericConfirmAction
                show={showDelete}
                setShow={setShowDelete}
                confirmAction={deleteElement}
                title="¿Está seguro de eliminar el elemento?"
            />
        </div>
    )
}

