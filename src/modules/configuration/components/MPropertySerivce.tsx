import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

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
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { BsGearWide, BsPencilSquare, BsXSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { Toast } from "../../../utils/Toastify";
import { AdminService } from "../../../core/services/AdminService";
import { JsonProperty } from "../model/json-property.interface";
import { Button, ButtonGroup, IconButton, MenuItem, SpeedDial, SpeedDialAction, ThemeProvider, Tooltip } from "@mui/material";
import MConfigureDataSource from "../components/ConfigureDataSource";

/**
 * Servicios
 */
const _adminService = new AdminService();

interface IMPropertySerivce {
    getShowMPropertySerivce: Function;
    dataShowMPropertySerivce: boolean;
    idJsonService: number;
    /* dataList: any[]; */
}

const MPropertySerivce: React.FC<IMPropertySerivce> = (props: IMPropertySerivce) => {

    const [formData, setFormData] = useState<JsonProperty>();
    const [list, setList] = useState<JsonProperty[]>([]);
    const [showConfigure, setShowConfigure] = useState(false);
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
        setRowsPerPage(parseInt(items));
        getJsonPropertyCatalog(props.idJsonService);
    }, [items]);

    const getJsonPropertyCatalog = (id: number) => {
        /* setShowSpinner(true); */
        _adminService.getJsonPropertyCatalog(id).subscribe(resp => {
            console.log(resp);
            if (resp) {
                setList(resp);
                /* setShowSpinner(false); */
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const closeModal = () => {
        props.getShowMPropertySerivce(false);
        /* props.refresh(); */
    };

    const closeConfigureDataSource = (data: any) => {
        setShowConfigure(data);
        getJsonPropertyCatalog(props.idJsonService);
    }

    const classes = useStyles();

    return (
        <Modal
            show={props.dataShowMPropertySerivce}
            onHide={closeModal}
            size="xl"
            centered
            
        >
            <Modal.Header>
                Propiedades del Servicio de Invocación
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
                                    <TableCell>ID de la propiedad</TableCell>
                                    <TableCell>Ruta de la variable en el servicio json</TableCell>
                                    <TableCell>Indice en la lista</TableCell>
                                    <TableCell>Tipo de Objeto</TableCell>
                                    <TableCell>Tipo de Fuente de Dato</TableCell>
                                    <TableCell>Valor de la Propiedad</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: JsonProperty, index: number) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.IDJsonProperty}</TableCell>
                                            <TableCell>{item.PropertyPath}</TableCell>
                                            <TableCell>{item.PropertyIndex}</TableCell>
                                            <TableCell>{item.DataBeanClass}</TableCell>
                                            <TableCell>{item.TypeName}</TableCell>
                                            <TableCell>{item.PropertyValue}</TableCell>
                                            <TableCell>
                                                <ButtonGroup>
                                                    <ThemeProvider theme={inputsTheme}>
                                                        <Tooltip title="Validar Propiedades del servicio de invocación">
                                                            <Button
                                                                variant="contained"
                                                                className="box-s mr-1 mt-2 mb-2"
                                                                color="secondary"
                                                                onClick={() => {
                                                                    setShowConfigure(true);
                                                                    setFormData(item);
                                                                }}
                                                            >
                                                                <BsPencilSquare />
                                                            </Button>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className={classes.root}
                        rowsPerPageOptions={[items, 10, 25, 100]}
                        component="div"
                        count={list.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Columnas por Página"
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Modal.Body>
            {showConfigure && (
                <MConfigureDataSource
                    getShowMConfigureDataSource={closeConfigureDataSource}
                    dataShowMConfigureDataSource={showConfigure}
                    objPropertyService={formData}
                />
            )}
        </Modal>
    );
}

export default MPropertySerivce;