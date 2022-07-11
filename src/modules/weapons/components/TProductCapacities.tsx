import { Button, ButtonGroup, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsPencilSquare, BsPlus, BsTrash, BsXSquare } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { ICapCarga } from '../model/capCarga';
import { IProduct } from '../model/product';
import { NECapCarga } from './NECapCarga';

interface ITProductCapacities {
    show: boolean,
    setShow: Function,
    data: IProduct | null
}

const _weaponService = new WeaponsService();

export const TProductCapacities: React.FC<ITProductCapacities> = (props: ITProductCapacities) => {


    const [listCapacities, setListCapacities] = useState<any[]>([]);


    const [spinner, setSpinner] = useState(false);
    const [item, setItem] = useState<ICapCarga>();
    const [title, setTitle] = useState('');
    const [show, setShow] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        if (props.data) {
            getCapCargaCatalog(props.data.IDPRODUCTO);
        }
    }, [props.data])

    const getCapCargaCatalog = (idProducto: number) => {
        setSpinner(true);
        _weaponService.getgetCapCargaCatalogPorIDProducto(idProducto).subscribe((resp) => {
            if (resp) {
                setSpinner(false);
                setListCapacities(resp);
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

    const formComponent = (title: string, item?: ICapCarga) => {
        setTitle(title);
        if (title === "Editar") {
            setItem(item);
        }
        setShow(true);
    };

    const deleteCapCarga = () => {
        _weaponService.deleteCapCarga(idDelete).subscribe((resp) => {
            if (resp) {
                if (props.data) {
                    getCapCargaCatalog(props.data.IDPRODUCTO);
                }
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

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteCapCarga();
        }
    };

    const classes = useStyles();

    return (
        <>
            <Modal show={props.show}   size="lg" centered onHide={() => props.setShow(false)} >
                <Modal.Header>
                    Capacidades para el Arma:
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row className="p-4">
                        <Col sm={12}>
                            <div>
                                <h4>{props.data?.Descripcion}</h4>
                            </div>
                        </Col>
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
                            {listCapacities.length === 0 ? (
                                <div className="mt-3">
                                    <h2>NO HAY CAPACIDADES ASIGNADAS A ESTA ARMA</h2>
                                </div>
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
                                                    <TableCell>Capacidad</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listCapacities
                                                    .slice(
                                                        page * rowsPerPage,
                                                        page * rowsPerPage + rowsPerPage
                                                    )
                                                    .map((item: ICapCarga, index: number) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDCapCarga}</TableCell>
                                                            <TableCell>{item.IDCapacidades}</TableCell>
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
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setShowDelete(true);
                                                                                        setIdDelete(item.IDCapCarga)
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
                                                                            key={item.IDProducto + 6}
                                                                            sx={{ color: "secondary" }}
                                                                            icon={<BsPencilSquare />}
                                                                            tooltipTitle="Editar"
                                                                            onClick={() => {
                                                                                formComponent("Editar", item);
                                                                            }}
                                                                        />
                                                                        <SpeedDialAction
                                                                            key={item.IDProducto + 7}
                                                                            icon={<BsTrash />}
                                                                            tooltipTitle="Eliminar seccional"
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(item.IDCapCarga)
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
                                        count={listCapacities.length}
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
            </Modal>
            <SSpinner show={spinner} />
            <NECapCarga title={title} show={show} setShow={setShow} item={item} idProducto={props.data ? props.data.IDPRODUCTO : 0} refresh={getCapCargaCatalog} />
            <GenericConfirmAction
                show={showDelete}
                setShow={setShowDelete}
                confirmAction={deleteElement}
                title={"¿Está seguro de eliminar el elemento?"}
            />
        </>
    )
}
