import React, { useEffect, useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { BsBookmarkFill, BsFillFileEarmarkRichtextFill, BsXSquare } from 'react-icons/bs';


import { SSpinner } from '../../../shared/components/SSpinner';
import { DataForm } from '../model/Form';
import { useStyles } from '../../../utils/Themes';
import { NoInfo } from '../../../utils/NoInfo';
import { JsonService } from '../model/JsonService';
import { AdminService } from '../../../core/services/AdminService';
import { Toast } from "../../../utils/Toastify";
import TResponseValueJson from '../pages/TResponseValueJson';
import TResponseValue from '../pages/TResponseValue';
import { JsonPrototypeDialog } from './JsonPrototypeDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/Store';

interface ITService_FormsTest {
    show: boolean
    setShow: Function
    idBusinessProcess: number;
    type: number
}

const _adminService = new AdminService();

export const TServiceFormsTest: React.FC<ITService_FormsTest> = (props: ITService_FormsTest) => {

    const [showSpinner, setShowSpinner] = useState(true);
    const [listForms, setListForms] = useState<DataForm[]>([]);
    const [listService, setListServices] = useState<JsonService[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [idForm, setIdForm] = useState(-1);
    const [idService, setIdService] = useState(-1);
    const [responseJsonSelected, setResponseJsonSelected] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [showResponseValue, setShowResponseValue] = useState(false);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        if (props.type === 0) {
            getFormCatalog(props.idBusinessProcess)
        }
        else {
            getJsonServiceCatalog(props.idBusinessProcess)
        }
        setRowsPerPage(parseInt(items));;
    }, [items]);

    const getFormCatalog = (id: number) => {
        setShowSpinner(true);
        _adminService.getFormCatalogByBusinessProcess(id).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setListForms(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getJsonServiceCatalog = (id: number) => {
        setShowSpinner(true);
        _adminService.getJsonServiceCatalogByBusinessProcess(id).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setListServices(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
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

    const classes = useStyles();

    const handleShowJson = (json: string) => {
        setResponseJsonSelected(json);
        setShowDialog(true);
    }

    return (
        <>
            <Modal
                show={props.show}
                onHide={() => props.setShow(false)} 
                size="xl"
                centered
                 
            >
                <Modal.Header>
                    {props.type === 0 ? "Formularios Json" : "Servicios Json"}
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                {props.type === 0
                    ? <Modal.Body>
                        {showSpinner ?
                            <SSpinner show={showSpinner} />
                            : (listForms.length > 0) ?
                                (<Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                                                    <TableCell>Descripción</TableCell>
                                                    <TableCell>Url del Formulario</TableCell>
                                                    <TableCell>Prototipo Json</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listForms
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((item: any) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDForm}</TableCell>
                                                            <TableCell>{item.Name}</TableCell>
                                                            <TableCell>{item.Description}</TableCell>
                                                            <TableCell>{item.FormURLComponent}</TableCell>
                                                            <TableCell >
                                                                <IconButton
                                                                    onClick={() => (handleShowJson(item.ResponseJsonValue), setIdForm(item.IDForm))}
                                                                ><BsFillFileEarmarkRichtextFill />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title="Variables de respuesta">
                                                                    <IconButton
                                                                        onClick={() => { setIdForm(item.IDForm); setShowResponseValue(true) }}
                                                                    ><BsBookmarkFill />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                            {/* <TableCell>
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
                                                                    icon={<BsFillBookmarkFill />}
                                                                    tooltipTitle="Variables de respuesta"
                                                                    onClick={() => {
                                                                        openResponseValue(item.IDForm);
                                                                    }}
                                                                />
                                                                <SpeedDialAction
                                                                    key={index + 1}
                                                                    sx={{ color: "secondary" }}
                                                                    icon={<BsPencilSquare />}
                                                                    tooltipTitle="Editar Formulario"
                                                                    onClick={() => {
                                                                        formComponent("Editar", item);
                                                                    }}
                                                                />
                                                                <SpeedDialAction
                                                                    key={index + 2}
                                                                    icon={<BsTrash />}
                                                                    tooltipTitle="Eliminar"
                                                                    onClick={() => {
                                                                        setShowDelete(true);
                                                                        setIdDelete(item.IDForm);
                                                                    }}
                                                                />
                                                            </SpeedDial>
                                                        </TableCell> */}
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        className={classes.root}
                                        labelRowsPerPage="Columnas por Página"
                                        rowsPerPageOptions={[items, 10, 25, 100]}
                                        component="div"
                                        count={listForms.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>)
                                : (listForms.length === 0) ? <h1 className="mt-3 mb-3 d-flex justify-content-center">No hay fomularios asociados a este trámite, en ninguno de sus procedimientos</h1> : ""
                        }
                    </Modal.Body>
                    : <Modal.Body>
                        {showSpinner ?
                            <SSpinner show={showSpinner} />
                            : (listService.length > 0) ?
                                (<Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                                                    <TableCell>Descripción</TableCell>
                                                    <TableCell>Url del Servicio </TableCell>
                                                    <TableCell>Prototipo Json</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listService
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((item: JsonService) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDJsonService}</TableCell>
                                                            <TableCell>{item.Name}</TableCell>
                                                            <TableCell>{item.Description}</TableCell>
                                                            <TableCell>{item.URLService}</TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    onClick={() => (handleShowJson(item.ResponseJsonValue), setIdService(item.IDJsonService))}
                                                                ><BsFillFileEarmarkRichtextFill />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title="Variables de respuesta">
                                                                    <IconButton
                                                                        onClick={() => { setIdForm(item.IDJsonService); setShowResponseValue(true) }}
                                                                    ><BsBookmarkFill />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                            {/* <TableCell>
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
                                                                        icon={<BsFillBookmarkFill />}
                                                                        tooltipTitle="Variables de respuesta"
                                                                        onClick={() => {
                                                                            openResponseValue(item.IDJsonService);
                                                                        }}
                                                                    />
                                                                    <SpeedDialAction
                                                                        key={index}
                                                                        sx={{ color: "secondary" }}
                                                                        icon={<BsPencilSquare />}
                                                                        tooltipTitle="Editar grupo"
                                                                        onClick={() => {
                                                                            formComponent("Editar", item);
                                                                        }}
                                                                    />
                                                                    <SpeedDialAction
                                                                        key={index + 1}
                                                                        icon={<BsTrash />}
                                                                        tooltipTitle="Eliminar"
                                                                        onClick={() => {
                                                                            setShowDelete(true);
                                                                            setIdServiceJson(item.IDJsonService);
                                                                        }}
                                                                    />
                                                                </SpeedDial>
                                                            </TableCell> */}
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
                                        count={listService.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>) : (listService.length === 0)
                                    ? <h1 className="mt-3 mb-3 d-flex justify-content-center">No hay servicios asociados a este trámite, en ninguno de sus procedimientos</h1>
                                    : ""
                        }
                    </Modal.Body>
                }
            </Modal>
            {showResponseValue ? (
                props.type === 0 ?
                    <TResponseValue
                        getShow={setShowResponseValue}
                        dataShow={showResponseValue}
                        dataObjID={idForm}
                        dataTitle={"Formularios"}
                        selector={props.idBusinessProcess}
                        refresh={getFormCatalog}
                    />
                    : <TResponseValueJson
                        getShow={setShowResponseValue}
                        dataShow={showResponseValue}
                        IDJsonService={idService}
                        titulo={"Servicios"}
                        selector={props.idBusinessProcess}
                        refresh={getJsonServiceCatalog}
                    />
            ) : ""}
            {showDialog &&
                <JsonPrototypeDialog
                    showDialog={showDialog}
                    setShowDialog={setShowDialog}
                    responseJsonSelected={responseJsonSelected}
                    setResponseJsonSelected={setResponseJsonSelected}
                    IDJsonService={props.type === 0 ? null : idService}
                    IDForm={props.type === 0 ? idForm : null}
                />}
        </>
    )
};
