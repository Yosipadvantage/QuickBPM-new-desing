import { Paper, TableHead, TableBody, TableCell, TableContainer, TableRow, Table, ButtonGroup, ThemeProvider, Tooltip, Button, SpeedDial, SpeedDialAction, TablePagination } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs'
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NEProductKind } from '../components/NEProductKind';
import { IProductKind } from '../model/ProductKind';

interface ITProductKind {

}

const _weaponService = new WeaponsService();

export const TProductKind: React.FC<ITProductKind> = (props: ITProductKind) => {

    const [spinner, setSpinner] = useState(false);
    const [listProductKind, setListProductKind] = useState<ITProductKind[]>([]);
    const [title, setTitle] = useState('');
    const [data, setData] = useState<IProductKind | null>(null);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(-1);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getProductKindCatalog();
    }, [])

    const formComponent = (title: string, data: IProductKind | null) => {
        setTitle(title);
        if (title === "Editar") {
            setData(data);
        }
        setShow(true);
    };

    const getProductKindCatalog = () => {
        setSpinner(true);
        _weaponService.getClaseProductoCatalogLike().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setSpinner(false);
                setListProductKind(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const deleteProductKind = () => {
        _weaponService.deleteClaseProducto(idDelete).subscribe((resp) => {
            if (resp) {
                getProductKindCatalog();
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
            deleteProductKind();
        }
    };

    const classes = useStyles();

    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top">
                        <h1 className="m-3 mt-5">Clases de Producto</h1>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-md-6 d-flex justify-content-end mr-5">
                            <div className="form-group">
                                <button
                                    className="btn btn-sm btn-outline-secondary btn-custom"
                                    type="button"
                                    onClick={() => {
                                        formComponent("Crear", null);
                                    }}
                                >
                                    <BsPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                    {listProductKind.length > 0 ?
                        <div className="mt-3">
                            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Descripción</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listProductKind
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((item: any) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.IDClaseProducto}</TableCell>
                                                        <TableCell>{item.Nombre}</TableCell>
                                                        <TableCell>{item.Descripcion}</TableCell>
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
                                                                                    setIdDelete(item.IDClaseProducto)
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
                                                                        key={item.IDClaseProducto + 6}
                                                                        sx={{ color: "secondary" }}
                                                                        icon={<BsPencilSquare />}
                                                                        tooltipTitle="Editar"
                                                                        onClick={() => {
                                                                            formComponent("Editar", item);
                                                                        }}
                                                                    />
                                                                    <SpeedDialAction
                                                                        key={item.IDClaseProducto + 7}
                                                                        icon={<BsTrash />}
                                                                        tooltipTitle="Eliminar seccional"
                                                                        onClick={() => {
                                                                            setShowDelete(true);
                                                                            setIdDelete(item.IDClaseProducto)
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
                                    count={listProductKind.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>


                        : listProductKind.length === 0 && <NoInfo />}
                </div>
            </div>
            <SSpinner show={spinner} />
            {
                show &&
                <NEProductKind
                    show={show}
                    setShow={setShow}
                    data={data}
                    title={title}
                    refresh={getProductKindCatalog}
                />
            }
            {showDelete && (
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"¿Está seguro de eliminar el elemento?"}
                />
            )}
            {/* {show && (
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
             */}
        </div>
    )
}
