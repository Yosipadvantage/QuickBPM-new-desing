import { ButtonGroup, Button, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IndumilOffice } from '../model/AlmacenIndumil';
import { SSpinner } from '../../../shared/components/SSpinner'
import { NEIndumilOffice } from '../components/NEIndumilOffice';
import { ReaderTypeDialog } from '../../citizenData/components/ReaderTypeDialog';

interface IIndumilOffices { }

const _weaponService = new WeaponsService();

export const TIndumilOffices: React.FC<IIndumilOffices> = (props: IIndumilOffices) => {

    const [list, setList] = useState<IndumilOffice[]>([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showNE, setShowNE] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [titleNE, setTitleNE] = useState("");
    const [itemSelected, setItemSelected] = useState<IndumilOffice>({
        Nombre: "",
        Direccion: "",
        Telefono: 0
    });
    const [idDelete, setIdDelete] = useState(0);

    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        getIndumilOffices();
    }, [])

    const getIndumilOffices = () => {
        setShowSpinner(true);
        _weaponService.getIndumilOffices().subscribe(resp => {
            if (resp) {
                setList(resp);
                setShowSpinner(false);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const deleteIndumilOffice = () => {
        _weaponService
            .deleteIndumilOffice(idDelete)
            .subscribe(rps => {
                console.log(rps);
                if (rps) {
                    setShowSpinner(false);
                    getIndumilOffices();
                    Toast.fire({
                        icon: "success",
                        title: "Se ha eliminado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            })
    };

    const formComponent = (title: string, data?: IndumilOffice) => {
        setTitleNE(title);
        if (title === "Editar") {
            setItemSelected(data
                ? data
                : {
                    Nombre: "",
                    Direccion: "",
                    Telefono: 0
                });
        }
        setShowNE(true);
    };

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteIndumilOffice();
        }
    };

    const classes = useStyles();

    return (
        <>
            <div className="nWhite w-80 p-3 m-3">
                <main>
                    <header className="page-header page-header-light bg-light mb-0">
                        <div className="container-fluid">
                            <div className="page-header-content pt-4 pb-10">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 >
                                            Almacenes INDUMIL
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="px-5 mt-2">
                        <div className="row">
                            <div className="col-xxl-4 col-12 col-xxl-12">
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
                            </div>
                            {showSpinner
                                ? <SSpinner show={showSpinner} />
                                : <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Nombre</TableCell>
                                                    <TableCell>Dirección</TableCell>
                                                    <TableCell>Teléfono</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: IndumilOffice, index: number) => (
                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                        <TableCell>{item.IDAlmaIndumil}</TableCell>
                                                        <TableCell>{item.Nombre}</TableCell>
                                                        <TableCell>{item.Direccion}</TableCell>
                                                        <TableCell>{item.Telefono}</TableCell>
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
                                                                                className="box-s mr-3 mt-2 mb-2"
                                                                                color="error"
                                                                                onClick={() => {
                                                                                    setShowDelete(true);
                                                                                    setIdDelete(item.IDAlmaIndumil ? item.IDAlmaIndumil : -1);
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
                                                                    /* onClick={() => {
                                                                        setShowDelete(true);
                                                                        setIdDelete(item.IDFormClass);
                                                                    }} */
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
                            }
                            {showNE &&
                                <NEIndumilOffice
                                    show={showNE}
                                    setShow={setShowNE}
                                    dataTitle={titleNE}
                                    data={itemSelected}
                                    refresh={getIndumilOffices}
                                />}
                            {showDelete && <GenericConfirmAction
                                show={showDelete}
                                setShow={setShowDelete}
                                confirmAction={deleteElement}
                                title={"¿Está seguro de eliminar el elemento?"}
                            />}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
