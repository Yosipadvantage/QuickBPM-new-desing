import { Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsCheck2Circle, BsHandIndexThumb, BsXSquare } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { SuscriptionService } from '../../../core/services/SuscriptionService';
import { WeaponsService } from '../../../core/services/WeaponsService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { RootState } from '../../../store/Store';
import { formatDate } from '../../../utils/formatDate';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { getSession } from '../../../utils/UseProps';

interface IAsignSerial {
    beanAction: any,
    setShow: Function
}

const _weaponService = new WeaponsService();
const _suscripcionService = new SuscriptionService();

const APROBADO = 2;

export const AsignSerialForm: React.FC<IAsignSerial> = (props: IAsignSerial) => {

    const [showAsignacion, setShowAsignacion] = useState(false);
    const [seleccionado, setSeleccionado] = useState<any>([]);
    const [list, setList] = useState<any>([]);
    const [spinner, setSpinner] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [render, setRender] = useState(0);
    const [listSeriales, setListCantidades] = useState<any[]>([]);
    const [termino, setTermino] = useState(false);
    const [falta, setFalta] = useState(0);
    /**
     * *seccion funciones tabla
     */
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [capacity, setCapacity] = useState(0);
    const [serial, setSerial] = useState('');
    const [solProductSelect, setSolProductSelect] = useState<any>({});

    useEffect(() => {
        console.log(props.beanAction);
        solProductoRenderEstado(props.beanAction.IDProcedureImp);
        setRowsPerPage(parseInt(items));
    }, [items])

    const solProductoRenderEstado = (idProcedureImp: number) => {
        setSpinner(true);
        _weaponService.solProductoRenderEstado(idProcedureImp, APROBADO).subscribe(resp => {
            setSpinner(false);
            if (resp) {
                console.log(resp);
                setList(resp);
                let aux: number = 0;
                resp.forEach((element: any) => {
                    aux += element.Cantidad - element.CantidadAsig;
                });
                console.log(aux);
                setFalta(aux);
                if (aux === 0) {
                    setTermino(true);
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const classes = useStyles();

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const responseProcedure = async () => {
        setSpinner(true);
        await _suscripcionService
            .responseProcedureAction2(
                props.beanAction.IDAction,
                null,
                null,
                {
                    "ASIGNACION": true
                },
                false
            )
            .then((resp: any) => {
                setSpinner(false)
                if (resp.data.DataBeanProperties.ObjectValue) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Resultado de la validacion enviada correctamente'
                    });
                    props.setShow(false);
                }
            });
    };

    /* const onChangeSerial = (idSolProduct: number, serial: string, capacidad: number) => {
        console.log(idSolProduct, serial);
        let aux = [...listSeriales];
        let yaExiste = false;
        console.log(aux);
        if (listSeriales.length > 0) {
            listSeriales.forEach((element: any, index: number) => {
                if (element.IDSolProducto === idSolProduct) {
                    element = {
                        IDSolProducto: element.IDSolProducto,
                        Serial: serial,
                        Capacidad: capacidad
                    }
                    aux[index] = element;
                    yaExiste = true;
                }
            });
            if (!yaExiste) {
                aux.push({
                    IDSolProducto: idSolProduct,
                    Serial: serial,
                    Capacidad: capacidad
                })
            }
        } else {
            aux.push({
                IDSolProducto: idSolProduct,
                Serial: serial,
                Capacidad: capacidad
            })
        }
        console.log('RESULTADO', aux);
        setListCantidades(aux);
    } */

    const renderSwitch = (render: number) => {
        switch (render) {
            case 0: return (
                <>
                    <div className="sync__header__grid">
                        {list.length > 0 &&
                            <div className="card p-3 w-100 mb-3">
                                <Row>
                                    <Col sm={6} className="d-flex justify-content-start align-items-center">
                                        <div>
                                            <h5><b>Asignación de serial y capacidad de armas solicitadas</b></h5>
                                            <div><h5><b>Restantes:</b></h5> <h4>{falta}</h4></div>

                                        </div>
                                    </Col>
                                    <Col sm={6} className="d-flex justify-content-end">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button
                                                disabled={!(falta === 0)}
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                endIcon={<BsCheck2Circle />}
                                                className="my-3 w-50"
                                                fullWidth
                                                onClick={() => {
                                                    setRender(1);
                                                }}
                                            >
                                                TERMINAR ASIGNACIÓN
                                            </Button>
                                        </ThemeProvider>
                                    </Col>
                                </Row>
                            </div>
                        }
                    </div>
                    {list.length > 0 ?
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ height: "70vh" }}>
                                <Table
                                    stickyHeader
                                    aria-label="sticky table"
                                    className={classes.root}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tipo Producto</TableCell>
                                            <TableCell>ID Producto</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Cantidad Aprobada.</TableCell>
                                            <TableCell>Cant. Asignada</TableCell>
                                            <TableCell>Por Asignar</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item: any, index: number) => (
                                                <TableRow hover role="checkbox" tabIndex={-1}>
                                                    <TableCell>
                                                        {item.DescripcionProducto}
                                                    </TableCell>
                                                    <TableCell>{item.NombreTipoUso}</TableCell>
                                                    <TableCell>
                                                        {item.NombreEstado}
                                                    </TableCell>
                                                    <TableCell>{item.Cantidad}</TableCell>
                                                    <TableCell>{item.CantidadAsig}</TableCell>
                                                    <TableCell>{item.Cantidad - item.CantidadAsig}</TableCell>
                                                    {/* <TableCell>
                                                        <TextField
                                                            /* value={capacity} 
                                                            type="number"
                                                            size="small"
                                                            fullWidth
                                                            color="secondary"
                                                            label="Capacidad de carga (cartuchos) *"
                                                            id={'cantidad' + item.IDSolProducto}
                                                            /* onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))}
                                                            onChange={(e) => onChangeSerial(item.IDSolProducto, e.target.value)}
                                                            InputProps={{ inputProps: { min: 1, max: item.Cantidad } }}
                                                        >
                                                        </TextField>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            /* value={capacity} 
                                                            type="number"
                                                            size="small"
                                                            fullWidth
                                                            color="secondary"
                                                            label="Capacidad de carga (cartuchos) *"
                                                            id={'capacidad' + item.IDSolProducto}
                                                            /* onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))}
                                                            onChange={(e) => onChangeSerial(item.IDSolProducto, e.target.value)}
                                                            InputProps={{ inputProps: { min: 1, max: item.Cantidad } }}
                                                        >
                                                        </TextField>
                                                    </TableCell> */}
                                                    <TableCell className="d-flex flex-row justify-content-center">
                                                        <div className="d-lg-flex d-none">
                                                            <ButtonGroup>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Asiginar">
                                                                        <Button
                                                                            disabled={(item.Cantidad - item.CantidadAsig) <= 0}
                                                                            variant="contained"
                                                                            className="box-s mr-1 mt-2 mb-2"
                                                                            color="secondary"
                                                                            onClick={() => {
                                                                                setSolProductSelect(item);
                                                                                setShowAsignacion(true);
                                                                            }}
                                                                        >
                                                                            {<BsHandIndexThumb />}
                                                                        </Button>
                                                                    </Tooltip>
                                                                </ThemeProvider>
                                                            </ButtonGroup>
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
                </>
            )
            case 1: return (
                <div>
                    <div>
                        <div className="d-flex justify-content-center mt-3">
                            <h1>ASIGNACI[ON DE SERIALES Y CAPACIDADES] REALIZADO CON ÉXITO!</h1>
                        </div>
                        <svg
                            className="checkmark"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="checkmark__circle"
                                cx="26"
                                cy="26"
                                r="25"
                                fill="none"
                            />
                            <path
                                className="checkmark__check"
                                fill="none"
                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            />
                        </svg>
                        <h4 className="w-100 text-center"><b>FECHA DE REGISTRO:</b> {formatDate(new Date()).split(' ')[0]}</h4>
                        <h5 className="mt-5 w-100 text-center">
                            Asignación terminada con éxito, porfavor revise bandeja de impresión.
                        </h5>
                        <div className="d-flex justify-content-center mt-5">
                            <ThemeProvider theme={inputsTheme}>
                                <Button variant="contained" color="secondary"
                                    onClick={() => { responseProcedure() }}
                                >
                                    CONTINUAR
                                </Button>
                            </ThemeProvider>
                        </div>
                    </div>
                </div >
            )
            default:
                break;
        }
    }

    const updateSolProducto = (bean: any) => {
        let aux: any = bean;
        aux.CantidadAsig = aux.CantidadAsig + 1;
        setSpinner(true);
        _weaponService.updateSolProducto(bean).subscribe((resp) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                console.log(resp);
                Toast.fire({
                    icon: 'success',
                    title: 'Se ha guardad con éxito!'
                })
                solProductoRenderEstado(props.beanAction.IDProcedureImp);
                setSerial('');
                setCapacity(0);
                setShowAsignacion(false);
                /* if () {

                } */
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'INTERNAL SERVER ERROR'
                })
            }
        })
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        setSpinner(true);
        _weaponService.cargueAsignacionArmasFuegoTramite(
            props.beanAction.IDAction,
            getSession().IDAccount,
            solProductSelect.IDProducto,
            solProductSelect.IDTipoUso,
            serial,
            capacity
        )
            .subscribe((resp) => {
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue) {
                    if (resp.DataBeanProperties.ObjectValue.INSERT === true) {
                        updateSolProducto(solProductSelect);
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: resp.DataBeanProperties.ObjectValue.MSG
                        })
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL SERVER ERROR'
                    })
                }
            })
    }



    return (
        <>
            <header className="page-header page-header-light bg-light mb-0">
            </header>
            <main>
                {renderSwitch(render)}
            </main>
            {spinner && <SSpinner show={spinner} />}
            {/* {showConfirm &&
                <GenericConfirmAction
                    show={showConfirm}
                    setShow={setShowConfirm}
                    title="¿Desea continuar con la Aprobación de Adquisición?"
                    confirmAction={aprobarArmasConfirm}
                />
            } */}
            {showAsignacion &&
                <Modal show={showAsignacion}   size="lg" centered  onHide={() => setShowAsignacion(false)}>
                    <Modal.Header>
                        Asignación de Serial y Capacidad
                        <BsXSquare className='pointer' onClick={() => setShowAsignacion(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <form >
                            <Row className="p-4">
                                <Col sm={12}>
                                    Para : {solProductSelect.DescripcionProducto}
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <TextField
                                        value={serial}
                                        size="small"
                                        id="capacity"
                                        label="Serial *"
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        onChange={(e) => setSerial(e.target.value)}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <TextField
                                        value={capacity}
                                        type="number"
                                        size="small"
                                        id="capacity"
                                        label="Capacidad (cartuchos) *"
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        onChange={(e) => setCapacity(parseInt(e.target.value))}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color='secondary'
                                            className='w-100'
                                            onClick={(e) => onSubmit(e)}
                                        >
                                            ASIGNAR
                                        </Button>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        </form>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}
