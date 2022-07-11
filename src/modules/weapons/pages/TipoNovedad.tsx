import { Button, ButtonGroup, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NETipoNovedad } from '../components/NETipoNovedad';

interface ITipoNovedad { }

const _weaponService = new WeaponsService();

export const TipoNovedad: React.FC<ITipoNovedad> = (props: ITipoNovedad) => {

    const [title, setTitle] = useState('');
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [idDelete, setIdDelete] = useState(-1);
    const [spinner, setSpinner] = useState(false);
    const [list, setList] = useState<any[]>([]);
    const [dataForm, setDataForm] = useState<any>({});
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
        getTipoNovedadRender();
    }, [])

    const getTipoNovedadRender = () => {
        setSpinner(true);
        _weaponService.getTipoNovedadRender()
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    setList(resp);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL ERROR SERVER'
                    })
                }
            })
    }

    const deleteTipoNovedad = () => {
        setSpinner(true);
        _weaponService.deleteTipoNovedad(idDelete)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                    getTipoNovedadRender();
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL ERROR SERVER'
                    })
                }
            })
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteTipoNovedad();
        }
    }

    const classes = useStyles();

    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top">
                        <h1 className="pointer" onClick={() => getTipoNovedadRender()}>Tipo de Novedad</h1>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-md-6 d-flex justify-content-end mr-5">
                            <div className="form-group">
                                <button
                                    className="btn btn-sm btn-outline-secondary btn-custom"
                                    type="button"
                                    onClick={() => {
                                        setTitle('Crear');
                                        setShow(true);
                                    }}
                                >
                                    <BsPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                    {list.length > 0 ?
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ height: "70vh" }}>
                                <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Categoria</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item: any, index: number) => (
                                                <TableRow hover role="checkbox" tabIndex={-1}>
                                                    <TableCell>{item.IDTipoNovedad}</TableCell>
                                                    <TableCell>{item.NombreTipo}</TableCell>
                                                    <TableCell>{item.NombreCategoria}</TableCell>
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
                                                                                setDataForm(item);
                                                                                setTitle('Editar');
                                                                                setShow(true);
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
                                                                                setShowConfirm(true);
                                                                                setIdDelete(item.IDTipoNovedad);
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
                                                                    key={item.IDTipoNovedad + 1}
                                                                    sx={{ color: "secondary" }}
                                                                    icon={<BsPencilSquare />}
                                                                    tooltipTitle="Editar elemento"
                                                                    onClick={() => {
                                                                        setDataForm(item);
                                                                        setTitle('Editar');
                                                                        setShow(true);
                                                                    }}
                                                                />
                                                                )
                                                                <SpeedDialAction
                                                                    key={item.IDTipoNovedad}
                                                                    icon={<BsTrash />}
                                                                    tooltipTitle="Eliminar elemento"
                                                                    onClick={() => {
                                                                        setShowConfirm(true);
                                                                        setIdDelete(item.IDTipoNovedad);
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
                                count={list.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                        : <NoInfo />
                    }
                </div>
            </div>
            {spinner &&
                <SSpinner show={spinner} />
            }
            {show && (
                <NETipoNovedad
                    show={show}
                    setShow={setShow}
                    formData={dataForm}
                    title={title}
                    refresh={getTipoNovedadRender}
                />
            )}
            {showConfirm &&
                <GenericConfirmAction
                    show={showConfirm}
                    setShow={setShowConfirm}
                    confirmAction={deleteElement}
                    title="¿Desea eliminar el elmento?"
                />
            }
        </div>
    )
}
