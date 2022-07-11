import { Button, ButtonGroup, MenuItem, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsListStars, BsPencilSquare, BsPlus, BsTrash, BsXSquare } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { NETypesProduct } from '../components/NETypesProduct';
import { ITypeProduct } from '../model/typeProduct';

const _weaponService = new WeaponsService();


export const TTypeProduct = () => {
    const [showSpinner, setShowSpinner] = useState(false);
    const [show, setShow] = useState(false);
    const [titleNE, setTitleNE] = useState("")
    const [itemSelected, setItemSelected] = useState<ITypeProduct | null>(null);
    const [showNE, setShowNE] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [listTypeProducts, setListTypeProducts] = useState<ITypeProduct[]>([]);
    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [atributes, setAtributes] = useState(
        {
            REFMOD: { label: 'REF/MOD', check: false },
            CALIBRE: { label: 'CALIBRE', check: false },
            CAPACIDAD: { label: 'CAPACIDAD', check: false },
            USO: { label: 'USO', check: false }
        }
    )

    useEffect(() => {
        setRowsPerPage(parseInt(items));;
        getAllTypes();
    }, [items])

    const getAllTypes = () => {
        setShowSpinner(true);
        _weaponService.getTipoProducto().subscribe((resp) => {
            if (resp) {
                console.log(resp);
                setShowSpinner(false);
                setListTypeProducts(resp);
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

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const formComponent = (title: string, data?: ITypeProduct) => {
        setTitleNE(title);
        if (title === "Editar") {
            setItemSelected(data
                ? data
                : null)
        }
        setShowNE(true);
    };
    const deleteElement = (data: boolean) => {
        if (data) {
            deleteTypeProduct();
        }
    };

    const deleteTypeProduct = () => {
        _weaponService
            .deleteTipoProducto(idDelete)
            .subscribe(rps => {
                console.log(rps);
                if (rps) {
                    setShowSpinner(false);
                    getAllTypes();
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

    const classes = useStyles();

    return (
        <div className="nWhite w-80 p-3 m-3">
            <main>
                <header className="page-header page-header-light bg-light mb-0">
                    <div className="container-fluid">
                        <div className="page-header-content pt-4 pb-10">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 >
                                        Tipo de producto
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="row card box-s m-3">
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className="form-group">
                                <div className="row">
                                    <Col sm={4}>
                                        <TextField
                                            className="mt-3"
                                            /* value={productKind} */
                                            size="small"
                                            fullWidth
                                            select
                                            color="secondary"
                                            label="Clase Producto *"
                                            id="ProductKind"
                                        /* onChange={(e) => { setProductKind(parseInt(e.target.value)) }} */
                                        >
                                            {/* {listProductKind.map((item: IProductKind) => (
                                                    <MenuItem key={item.IDClaseProducto} value={item.IDClaseProducto}>
                                                        {item.Nombre}
                                                    </MenuItem>
                                                ))} */}
                                        </TextField>
                                    </Col>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                        {showSpinner ? <SSpinner show={showSpinner} /> : listTypeProducts.length > 0 ?
                            (
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
                                                {listTypeProducts
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: ITypeProduct, index: number) => (
                                                        <TableRow hover role="checkbox" key={item.IDTipoProducto} tabIndex={-1}>
                                                            <TableCell>{item.IDTipoProducto}</TableCell>
                                                            <TableCell>{item.Nombre}</TableCell>
                                                            <TableCell>{item.Descripcion}</TableCell>
                                                            <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup      >
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Administrar campos">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="secondary"
                                                                                    onClick={() => { setShow(true) }}>
                                                                                    <BsListStars />
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
                                                                                    className="box-s mr-3 mt-2 mb-2"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setShowDelete(true);
                                                                                        setIdDelete(item.IDTipoProducto ? item.IDTipoProducto : -1);
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
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(item.IDTipoProducto ? item.IDTipoProducto : -1);
                                                                            }}
                                                                        />
                                                                    </SpeedDial>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        className={classes.root}
                                        rowsPerPageOptions={[items, 10, 25, 100]}
                                        labelRowsPerPage="Columnas por Página"
                                        component="div"
                                        count={listTypeProducts.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            )
                            : (listTypeProducts.length === 0 ? <NoInfo></NoInfo> : "")}
                        <div>
                            {showNE &&
                                <NETypesProduct data={itemSelected} refresh={getAllTypes} show={showNE} dataTitle={titleNE} setShow={setShowNE} />
                            }
                            {showDelete && <GenericConfirmAction
                                show={showDelete}
                                setShow={setShowDelete}
                                confirmAction={deleteElement}
                                title={"¿Está seguro de eliminar el elemento?"}
                            />}
                        </div>
                    </div>
                </div>
            </main >
            {
                <Modal show={show}   centered  onHide={() => setShow(false)}>
                    <Modal.Header>
                        Administrar Campos Tipo Producto
                        <BsXSquare  className='pointer' onClick={() => setShow(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <b>Campo obligatorio *</b>
                        <Row>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="modal-element">
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="error"
                                onClick={() => setShow(false)}
                            >
                                CANCELAR
                            </Button>
                        </div>
                        <div className="modal-element">
                            <Button
                                className={classes.button}
                                type="submit"
                                variant="contained"
                                color="success"
                            >
                                GUARDAR
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            }
        </div >
    )
}
