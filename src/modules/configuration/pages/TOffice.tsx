import React from "react";
import { useState, useEffect } from "react";
import { IconButton, InputAdornment, MenuItem, Paper, SpeedDial, SpeedDialAction, Stepper, TableContainer, TableHead, TextField, Table, TableRow, TableCell, TableBody, TablePagination, Tooltip, ButtonGroup, ThemeProvider, Button } from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

import { ConfigService } from "../../../core/services/ConfigService";
import { Office } from "../model/Office";
import { Toast } from "../../../utils/Toastify";
import { BsArrowUp, BsPencilSquare, BsPlus, BsTrash } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { NEOffice } from "../components/NEOffice";
import TTramitsByOffice from "../components/TTramitsByOffice";
import { pipeSort } from "../../../utils/pipeSort";
import { SSpinner } from "../../../shared/components/SSpinner";
import { NoInfo } from "../../../utils/NoInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";

const _configService = new ConfigService();

interface IOffice { }

const TOficce: React.FC<IOffice> = () => {

    const [show, setShow] = useState(false);
    const [listOffice, setOficce] = useState<Office[]>([]);
    const [showSpinner, setShowSpinner] = useState(true);
    const [title, setTitle] = useState("");
    const [formdata, setformdata] = useState<Office>();
    const [showModalTramits, setShowModalTramits] = useState(false);
    const [id, setIdOffice] = useState(0);
    const [name, setNameOffice] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getListOffice();
    }, [items]);

    const getListOffice = () => {
        setShowSpinner(true);
        _configService.getOfficeCatalog().subscribe((resp) => {
            console.log(resp);
            setShowSpinner(false);
            if (resp) {
                setOficce(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const deleteOffice = () => {
        setShowSpinner(true);
        _configService.deleteOffice(idDelete).subscribe((resp) => {
            if (resp) {
                setShowSpinner(false);
                getListOffice();
                Toast.fire({
                    icon: "success",
                    title: "Se ha eliminado con éxito",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const formComponent = (title: string, data?: Office) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        setShow(true);
    };
    const closeModal = (data: boolean) => {
        setShow(data);
        getListOffice();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const ordenar = (listArray: any, columna: string) => {
        let aux = pipeSort([...listArray], columna);
        setOficce(aux);
    };

    const classes = useStyles();

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteOffice();
        }
    };

    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top">
                        <h1>Seccionales</h1>
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
                    {showSpinner ?
                        <SSpinner
                            show={showSpinner}
                        />
                        : listOffice.length > 0 ?
                            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID
                                                    <Tooltip className="ml-2" title="Ordenar">
                                                        <IconButton aria-label="delete" size="small" onClick={() => { ordenar(listOffice, 'IDOffice') }}>
                                                            <BsArrowUp />
                                                        </IconButton>
                                                    </Tooltip> </TableCell>
                                                <TableCell>Código</TableCell>
                                                <TableCell>Nombre <Tooltip className="ml-2" title="Ordenar">
                                                    <IconButton aria-label="delete" size="small" onClick={() => { ordenar(listOffice, 'Name') }}>
                                                        <BsArrowUp />
                                                    </IconButton>
                                                </Tooltip></TableCell>
                                                <TableCell>Ciudad</TableCell>
                                                <TableCell>Descripción</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listOffice
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((item: Office) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.IDOffice}</TableCell>
                                                        <TableCell>{item.Code}</TableCell>
                                                        <TableCell>{item.Name}</TableCell>
                                                        <TableCell>{item.SiteIDName}</TableCell>
                                                        <TableCell>{item.Description}</TableCell>
                                                        <TableCell>
                                                            <div className="d-lg-flex d-none">
                                                                <ButtonGroup>
                                                                    <ThemeProvider theme={inputsTheme}>
                                                                        <Tooltip title="Ver Trámites">
                                                                            <Button
                                                                                variant="contained"
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="secondary"
                                                                                onClick={() => {
                                                                                    setShowModalTramits(true);
                                                                                    setIdOffice(item.IDOffice);
                                                                                    setNameOffice(item.Name);
                                                                                }}
                                                                            >
                                                                                <HiOutlineOfficeBuilding />
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </ThemeProvider>
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
                                                                                className="box-s mr-1 mt-2 mb-2"
                                                                                color="error"
                                                                                onClick={() => {
                                                                                    setShowDelete(true);
                                                                                    setIdDelete(item.IDOffice)
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
                                                                        key={item.IDOffice + 6}
                                                                        sx={{ color: "secondary" }}
                                                                        icon={<BsPencilSquare />}
                                                                        tooltipTitle="Editar"
                                                                        onClick={() => {
                                                                            formComponent("Editar", item);
                                                                        }}
                                                                    />
                                                                    <SpeedDialAction
                                                                        key={item.IDOffice + 7}
                                                                        icon={<BsTrash />}
                                                                        tooltipTitle="Eliminar seccional"
                                                                        onClick={() => {
                                                                            setShowDelete(true);
                                                                            setIdDelete(item.IDOffice)
                                                                        }}
                                                                    />
                                                                    <SpeedDialAction
                                                                        key={item.IDOffice + 8}
                                                                        icon={<HiOutlineOfficeBuilding />}
                                                                        tooltipTitle="Ver Trámites"
                                                                        onClick={() => {
                                                                            setShowModalTramits(true);
                                                                            setIdOffice(item.IDOffice);
                                                                            setNameOffice(item.Name);
                                                                        }}
                                                                    />
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
                                    count={listOffice.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            : listOffice.length === 0 && <NoInfo />}
                </div>
            </div>
            {show && (
                <NEOffice
                    getShow={closeModal}
                    dataShow={show}
                    dataObj={formdata}
                    dataTitle={title}
                />
            )}
            {showModalTramits && (
                <TTramitsByOffice
                    dataShow={showModalTramits}
                    setShow={setShowModalTramits}
                    id={id}
                    name={name}
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
    );

}
export default TOficce;
