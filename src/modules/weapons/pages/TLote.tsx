import { Button, ButtonGroup, IconButton, MenuItem, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap';
import { BsArrowUp, BsFillCaretLeftFill, BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { pipeSort } from '../../../utils/pipeSort';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NELote } from '../components/NELote';
import { Ilote } from '../model/lote';
import { IProduct } from '../model/product';

const _weaponService = new WeaponsService();

export const TLote = () => {

    const [listProducts, setListProducts] = useState<IProduct[]>([]);
    const [listLote, setListLotes] = useState<Ilote[]>([]);
    const [bcSelected, setBcSelected] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [formdata, setformdata] = useState<Ilote | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [showSpinner, setShowSpinner] = useState(false);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [filtered, setFiltered] = useState(false);


    useEffect(() => {
        getProductoCatalogPorPropiedad();
        setRowsPerPage(parseInt(items));
    }, [bcSelected, items]);

    const onChangeSelect = (e: any) => {
        setBcSelected(e);
        console.log(e);
        console.log(bcSelected)
        if (e != null) {
            setFiltered(true);
            getLoteCatalogPorPropiedad(e);
        }
    };

    const getProductoCatalogPorPropiedad = () => {
        setShowSpinner(true);
        _weaponService.getProductoCatalog().subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                let aux = pipeSort([...resp], "Nombre");
                setListProducts(aux)
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });
            }
        })
    };

    const getLoteCatalogPorPropiedad = (id: number | null) => {
        setShowSpinner(true);
        if (id === null) {
            id = bcSelected
        }
        _weaponService.getLoteCatalogPorPropiedad(id).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                setListLotes(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido listar la info",
                });
            }
        })
    };

    const formBusiness = (title: string, data?: any) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        viewModal();
    };

    const viewModal = () => {
        setShow(true);
    };

    const classes = useStyles();
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deleteLote = () => {
        _weaponService.deleteLote(idDelete).subscribe((resp) => {
            if (resp) {
                getLoteCatalogPorPropiedad(bcSelected);
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
            deleteLote();
        }
    };

    const handleSetBcSelected = (p: any) => {
        console.log(p);
        if (p === null) {
            setListLotes([]);
            setBcSelected(null)
            setFiltered(false);

        }
    };

    return (
        <div className="nWhite w-80 p-3 m-3">
            <main>
                <header className="page-header page-header-light bg-light mb-0">
                    <div className="container-fluid">
                        <div className="page-header-content pt-4 pb-10">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="">
                                        Lotes
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="px-5 mt-2">
                    <div className="row">
                        <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                            <div className="row card box-s">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <div className="row">                                                
                                                <Col sm={7} className="mt-3">
                                                    <div className="d-flex">
                                                        <TextField
                                                            value={bcSelected}
                                                            size="small"
                                                            fullWidth
                                                            select
                                                            color="secondary"
                                                            label="Producto"
                                                            id="state"
                                                            onChange={(e) => onChangeSelect(e.target.value)}
                                                        >
                                                            {listProducts.map((item: IProduct) => (
                                                                <MenuItem key={item.IDProducto} value={item.IDProducto}>
                                                                    {item.Nombre}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>                                                        
                                                    </div>
                                                </Col>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {bcSelected !== null &&
                                <div className="col-md-6 d-flex justify-content-end align-items-center">
                                    <div className="form-group">
                                        <button
                                            className="btn btn-sm btn-outline-secondary btn-custom"
                                            type="button"
                                            onClick={() => {
                                                formBusiness("Crear");
                                            }}
                                        >
                                            <BsPlus />
                                        </button>
                                    </div>
                                </div>}
                            {showSpinner ? <SSpinner show={showSpinner} />
                                : listLote.length > 0 ? (
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
                                                        <TableCell>Numero Lote</TableCell>
                                                        <TableCell>Fecha Producción</TableCell>
                                                        <TableCell>Fecha Vencimiento</TableCell>
                                                        <TableCell>Acciones</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {listLote
                                                        .slice(
                                                            page * rowsPerPage,
                                                            page * rowsPerPage + rowsPerPage
                                                        )
                                                        .map((item: Ilote) => (
                                                            <TableRow hover role="checkbox" key={item.IDLote} tabIndex={-1}>
                                                                <TableCell>{item.IDLote}</TableCell>
                                                                <TableCell>{item.NumeroLote}</TableCell>
                                                                <TableCell>{item.FechaProduccion}</TableCell>
                                                                <TableCell>{item.FechaVencimiento}</TableCell>
                                                                <TableCell>
                                                                    <div className="d-lg-flex d-none">
                                                                        <ButtonGroup >
                                                                            <ThemeProvider theme={inputsTheme}>
                                                                                <Tooltip title="Editar elemento">
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        className="box-s mr-1 mt-2 mb-2"
                                                                                        color="secondary"
                                                                                        onClick={() => {
                                                                                            formBusiness("Editar", item);
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
                                                                                            setIdDelete(
                                                                                                item.IDLote
                                                                                            );
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
                                                                                icon={<BsPencilSquare />}
                                                                                tooltipTitle="Editar proceso"
                                                                                onClick={() => {
                                                                                    formBusiness("Editar", item);
                                                                                }}
                                                                            />
                                                                            <SpeedDialAction
                                                                                icon={<BsTrash />}
                                                                                tooltipTitle="Eliminar proceso"
                                                                                onClick={() => {
                                                                                    setShowDelete(true);
                                                                                    setIdDelete(
                                                                                        item.IDLote
                                                                                    );
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
                                            count={listLote.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                ) : (listLote.length === 0 && filtered) ? <NoInfo />
                                    : ""
                            }
                        </div>
                    </div>
                </div>
                {show && (
                    <NELote show={show}
                        setShow={setShow}
                        data={formdata}
                        title={title}
                        idRefresh={bcSelected}
                        refresh={getLoteCatalogPorPropiedad} />
                )}

                {showDelete &&
                    <GenericConfirmAction
                        show={showDelete}
                        setShow={setShowDelete}
                        confirmAction={deleteElement}
                        title="¿Está seguro de eliminar el elemento?"
                    />}
            </main>
        </div>
    );
};