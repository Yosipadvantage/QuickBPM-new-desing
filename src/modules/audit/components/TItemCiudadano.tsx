import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import { BsXSquare } from 'react-icons/bs';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from "../../../utils/Toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";
import { DataItemCiudadano } from "../../weapons/model/item-ciudadano.interface";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { getSession } from "../../../utils/UseProps";
import { User } from "../../../shared/model/User";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, ThemeProvider, Tooltip } from "@mui/material";
import { GiPistolGun, GiClick } from "react-icons/gi";
import { TItemCiudadano } from "../../weapons/model/TItemCiudadano.interface"
interface ITWeapon {
    proCD: boolean,
    setItem?: Function,
    idAccount: number
}

const _weaponService = new WeaponsService();

export const TItemsCiudadano: React.FC<ITWeapon> = (props: ITWeapon) => {

    const [spinner, setSpinner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [records, setRecords] = useState<DataItemCiudadano[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [detailWeapons, setDetailWeapons] = useState<any>({})
    const [calibres, setCalibres] = useState<any>();
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [list, setList] = useState<any>([]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setRowsPerPage(parseInt(items));
        getItemsPorCiudadano();
        getList([6]);
    }, [items, props.idAccount])

    const getList = (lista: number[]) => {
        setSpinner(true);
        _weaponService.getListasPorCodigo(lista).subscribe((resp: any) => {
            setSpinner(false);
            if (resp.DataBeanProperties.ObjectValue) {
                setCalibres(resp.DataBeanProperties.ObjectValue[0]);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const getRenderCalibre = (cod: number) => {
        let m = ''
        calibres?.Lista.map((item: any) => {
            if (item.Codigo == (cod + '')) {
                m = item.Valor
            }
        })
        return m;
    };

    const getItemsPorCiudadano = () => {
        setSpinner(true);
        _weaponService.getItemsPorCiudadano(props.idAccount, null, null).subscribe(resp => {
            setSpinner(false);
            if (resp.length > 0) {
                setList(resp);
                resp.forEach((item: DataItemCiudadano) => {
                    if (item.Propiedades) {
                        let obj;
                        obj = JSON.parse(item.Propiedades);
                        console.log(obj, item);
                        if (item.NombreProducto == "TRAUMATICA") {
                            item.ItemEstado = obj.EstadoTraumatica.nombreEstado;
                        } else {
                            item.ItemEstado = "NO APLICA";
                        }
                    } else {
                        item.ItemEstado = "NO APLICA";
                    }
                });
                setRecords(resp);
            }
        });
    };

    console.log('lista de armas desde la tabla', list)

    const classes = useStyles();


    return (
        <>
            {list.length > 0 ?
                <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 2 }}>
                    <TableContainer sx={{ height: "70vh" }}>
                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>CódPermiso/CódSeguridad</TableCell>
                                    <TableCell>Marca</TableCell>
                                    <TableCell>Serial</TableCell>
                                    <TableCell>Estado Arma de fuego</TableCell>
                                    <TableCell>Estado Traumatica</TableCell>
                                    <TableCell>Fecha de descargo</TableCell>
                                    <TableCell>Detalles Arma</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: any) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.CodigoPermiso}/{item.CodigoSeguridad}</TableCell>
                                            <TableCell>{item.NombreProducto}</TableCell>
                                            <TableCell>{item.Serial}</TableCell>
                                            <TableCell>{item.NombreProducto == 'TRAUMATICA' ? 'NO APLICA' : item.NombreEstado}</TableCell>
                                            <TableCell>{item.ItemEstado}</TableCell>
                                            <TableCell>{item.FechaDocumentoSalida}</TableCell>
                                            <TableCell>
                                                <ThemeProvider theme={inputsTheme}>
                                                    <Tooltip title="Detalles del Arma" placement="left">
                                                        <IconButton color="secondary" onClick={() => { setShowModal(true); setDetailWeapons(JSON.parse(item.Propiedades)) }}>
                                                            <GiPistolGun />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ThemeProvider>
                                                {props.proCD &&
                                                    <ThemeProvider theme={inputsTheme}>
                                                        <Tooltip title="Seleccioanr Arma" placement="right">
                                                            <IconButton color="secondary" onClick={() => {
                                                                props.setItem !== undefined &&
                                                                    props.setItem(item)
                                                            }}>
                                                                <GiClick />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ThemeProvider>
                                                }
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
                        count={records.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                :
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <h1>Este usuario no tiene Armas asignadas</h1>
                </div>
            }
            {spinner && <SSpinner show={spinner} />}
            {
                showModal &&
                <Modal show={showModal}  centered onHide={() => { setShowModal(false) }}>
                    <Modal.Header>
                        Detalles del Arma
                        <BsXSquare className='pointer' onClick={() => { setShowModal(false) }} />
                    </Modal.Header>

                    <Modal.Body>
                        <h5>Calibre: {detailWeapons.DataArma.Fire ? getRenderCalibre(parseInt(detailWeapons.DataArma.Calibre ? detailWeapons.DataArma.Calibre : '0')) : detailWeapons.DataArma.Calibre}</h5>
                        <h5>Capacidad: {detailWeapons.DataArma.Capacidad} (Cartuchos)</h5>
                        <h5>tipo de Arma: {detailWeapons.DataArma.Descripcion}</h5>
                        <h5>Modelo: {detailWeapons.DataArma.Modelo}</h5>
                        <h5>Serial: {detailWeapons.DataArma.Serial}</h5>
                        <h5>TipoUso: {detailWeapons.DataArma.TipoUso}</h5>
                    </Modal.Body>

                </Modal>
            }
        </>
    );







};
