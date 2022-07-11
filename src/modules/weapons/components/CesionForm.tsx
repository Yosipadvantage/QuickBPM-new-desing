import React, { useEffect, useState } from 'react'
import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    ThemeProvider,
    Tooltip,
} from "@mui/material";
import { BsCheckCircleFill, BsHandIndexThumb } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useSelector } from "react-redux";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { RootState } from "../../../store/Store";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from "../../../utils/Toastify";
import { getSession } from "../../../utils/UseProps";
import { Col, Row } from 'react-bootstrap';
import { NoInfo } from '../../../utils/NoInfo';
import { AiOutlineClear } from 'react-icons/ai';
import { formatDate } from '../../../utils/formatDate';
import { SuscriptionService } from '../../../core/services/SuscriptionService';

interface ICesionForm {
    beanAction: any,
    setShow: Function
}

const APROBADO = 2;

const _weaponService = new WeaponsService();
const _suscripcionService = new SuscriptionService();

export const CesionForm: React.FC<ICesionForm> = (props: ICesionForm) => {

    const [render, setRender] = useState(0);
    const [spinner, setSpinner] = useState(false);
    const [seleccionado, setSeleccionado] = useState<number[]>([]);
    const [list, setList] = useState<any[]>([]);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showConfirm, setShowConfirm] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        console.log(props.beanAction.IDProcedureImp);
        solCesionRender(props.beanAction.IDProcedureImp);
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSeleccionado = (id: number): void => {
        if (seleccionado.includes(id)) {
            const resto = seleccionado.filter((item: any) => item !== id);
            setSeleccionado([...resto]);
        } else {
            setSeleccionado([...seleccionado, id]);
        }
    };

    const handleMultiSeleccion = () => {
        if (seleccionado.length > 0) {
            setSeleccionado([]);
        } else {
            const resto = list.map((rest: any) => {
                console.log(rest);
                return rest.IDSolCesion;
            });
            setSeleccionado([...resto]);
        }
    };

    /* const getMapCesion = (seleccionados: number[]) => {
        let aux: any[] = [];
        seleccionados.forEach((id: number) => {
            list.forEach((item: any) => {
                if (item.IDSolCesion === id) {
                    aux.push({
                        IDSolCesion: item.IDSolCesion
                    })
                }
            })
        })
        return aux;
    } */

    const solCesionRender = (idProcedureImp: number) => {
        setSpinner(true);
        _weaponService.solCesionRender(idProcedureImp)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                    setList(resp);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL SERVER ERROR'
                    })
                }
            })
    }

    const cesionarArmas = () => {
        console.log(seleccionado);
        let aux: any = {};
        seleccionado.forEach((idSolCesion: number) => {
            aux =
            {
                IDSolCesion: idSolCesion,
                Estado: APROBADO,
                FechaAprobacion: formatDate(new Date()),
                IDFuncionario: getSession().IDAccount,
            }
            console.log(aux);
            updateSolCesion(aux);
        })
        setSpinner(true);
        _weaponService.cesionArmas(props.beanAction.IDProcedureImp, getSession().IDAccount)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                    if (resp.DataBeanProperties.ObjectValue) {
                        if (resp.DataBeanProperties.ObjectValue.Proceso === true) {
                            setRender(1);
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: 'Ha ocurrido un error al cesionar las armas'
                            })
                        }
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Ha ocurrido un error al cesionar las armas'
                        })
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL ERROR SERVER'
                    })
                }
            })
    }

    const updateSolCesion = (bean: any) => {
        setSpinner(true);
        _weaponService.updateSolCesion(bean)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp) {
                    console.log(resp);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'INTERNAL ERROR SERVER'
                    })
                }
            })
    }

    /* const cederArmas = () => {
        setSpinner(true);
        let map = getMapCesion(seleccionado);
        _weaponService.agregaraArmaImpresionRevalidacion(getSession().IDAccount, props.beanAction ? props.beanAction.IDProcedureImp : -1, map)
            .subscribe((resp) => {
                setSpinner(false);
                if (resp.DataBeanProperties.ObjectValue) {
                    console.log();
                    setRender(1);
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: resp.DataBeanProperties.ErrorMessage
                    })
                }
            })
    } */

    const cederArmasConfirm = (data: boolean) => {
        if (data) {
            cesionarArmas();
        }
    }

    const responseProcedure = async () => {
        setSpinner(true);
        await _suscripcionService
            .responseProcedureAction2(
                props.beanAction.IDAction,
                null,
                null,
                {
                    APROB_CESION: true,
                },
                false
            )
            .then((resp: any) => {
                setSpinner(false);
                if (resp.data.DataBeanProperties.ObjectValue) {
                    Toast.fire({
                        icon: "success",
                        title: "Resultado de la validacion enviada correctamente",
                    });
                    props.setShow(false);
                }
            });
    };

    const renderSwitch = (render: number) => {
        switch (render) {
            case 0: return (
                <>
                    <div className="sync__header__grid">
                        {list.length > 0 &&
                            <div className="card p-3 w-100 mb-3">
                                <Row>
                                    <Col sm={12} className="d-flex justify-content-end">
                                        <ThemeProvider theme={inputsTheme}>
                                            <Button
                                                disabled={!(seleccionado.length > 0)}
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                endIcon={<BsCheckCircleFill />}
                                                className="my-3 w-50"
                                                fullWidth
                                                onClick={() => {
                                                    setShowConfirm(true); console.log(props.beanAction);
                                                }}
                                            >
                                                APROBAR CESIÓN
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
                                            {/* <TableCell>CódPermiso/CódSeguridad</TableCell>
                                            <TableCell>Marca</TableCell>
                                            <TableCell>Serial</TableCell>
                                            <TableCell>Estado Arma de fuego</TableCell>
                                            <TableCell>Estado Traumatica</TableCell>
                                            <TableCell>Fecha de descargo</TableCell> */}
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Tipo de Cesión</TableCell>
                                            <TableCell>Arma / Serial</TableCell>
                                            <TableCell>Tipo de Permiso</TableCell>
                                            <TableCell>De/Para</TableCell>
                                            <TableCell>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="secondary"
                                                        endIcon={seleccionado.length > 0 ? <AiOutlineClear /> : <BsHandIndexThumb />}
                                                        className="my-3"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        fullWidth
                                                        onClick={handleMultiSeleccion}
                                                    >
                                                        {seleccionado.length > 0
                                                            ? "Limpiar"
                                                            : "Todos"}
                                                    </Button>
                                                </ThemeProvider>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item: any, index: number) => (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    className={
                                                        seleccionado.includes(item.IDSolCesion)
                                                            ? "seleccionado"
                                                            : ""
                                                    }
                                                    tabIndex={-1}
                                                >
                                                    <TableCell>
                                                        {item.NombreEstado}
                                                    </TableCell>
                                                    <TableCell>{item.NombreMotivo}</TableCell>
                                                    <TableCell>
                                                        <b>Arma :</b> {item.DescripcionItem} <br />
                                                        <b>Serial :</b> {item.Serial}
                                                    </TableCell>
                                                    <TableCell>{item.IDTipoPermiso == 1 ? 'PORTE' : 'TENENCIA'}</TableCell>
                                                    <TableCell>
                                                        <b>De :</b> {item.NombreDe} <br />
                                                        <b>Para :</b> {item.NombrePara}
                                                    </TableCell>
                                                    <TableCell className="d-flex flex-row justify-content-center">
                                                        <div className="d-lg-flex d-none">
                                                            <ButtonGroup>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Seleccionar">
                                                                        <Button
                                                                            variant="contained"
                                                                            className="box-s mr-1 mt-2 mb-2"
                                                                            color="secondary"
                                                                            onClick={() => {
                                                                                handleSeleccionado(item.IDSolCesion);
                                                                            }}
                                                                        >
                                                                            {<BsHandIndexThumb />}
                                                                        </Button>
                                                                    </Tooltip>
                                                                </ThemeProvider>
                                                            </ButtonGroup>
                                                        </div>
                                                        {/* {seleccionado.includes(item.IDSolCesion) &&
                                                            <div>
                                                                <TextField
                                                                    /* value={capacity} 
                                                                    type="number"
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    label="Cantidad"
                                                                    id={'cantidad' + item.IDSolCesion}
                                                                    /* onChange={(e) => setCapacity(parseInt(e.target.value) < 0 ? (parseInt(e.target.value) * -1) : parseInt(e.target.value))} 
                                                                    onChange={(e) => onChangeCantidad(item.IDSolCesion, parseInt(e.target.value))}
                                                                    InputProps={{ inputProps: { min: 1, max: item.Cantidad } }}
                                                                >
                                                                </TextField>
                                                            </div>
                                                        } */}
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
                            <h1>
                                APROBACIÓN DE {seleccionado.length} ARMA(S) PARA CESIÓN
                                REALIZADO CON ÉXITO!
                            </h1>
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
                        <h4 className="w-100 text-center">
                            <b>FECHA DE REGISTRO:</b> {formatDate(new Date()).split(" ")[0]}
                        </h4>
                        <h5 className="mt-5 w-100 text-center">
                            Aprobación terminada con éxito, siguiente paso: REVISAR EL ESTADO DE LAS ARMAS CESIONADAS
                        </h5>
                        <div className="d-flex justify-content-center mt-5">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        responseProcedure();
                                    }}
                                >
                                    CONTINUAR
                                </Button>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
            )

            default:
                break;
        }
    }

    return (
        <>
            <header className="page-header page-header-light bg-light mb-0">
            </header>
            <main>
                {renderSwitch(render)}
            </main>
            {spinner && <SSpinner show={spinner} />}
            {showConfirm &&
                <GenericConfirmAction
                    show={showConfirm}
                    setShow={setShowConfirm}
                    title="¿Desea continuar con la Aprobación de Adquisición?"
                    confirmAction={cederArmasConfirm}
                />
            }
        </>
    )
}
