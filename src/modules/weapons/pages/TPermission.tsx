import { Button, ButtonGroup, IconButton, InputAdornment, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsFillCollectionFill, BsFillCreditCard2FrontFill, BsFillFileEarmarkRichtextFill, BsPencilSquare, BsSearch, BsTrash } from 'react-icons/bs'
import { FiMoreVertical } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { WeaponsService } from '../../../core/services/WeaponsService'
import { SSpinner } from '../../../shared/components/SSpinner'
import { RootState } from '../../../store/Store'
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction'
import { NoInfo } from '../../../utils/NoInfo'
import { inputsTheme, useStyles } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { MPermissionsData } from '../components/MPermissionsData'
import { IPermission } from '../model/permission.interface'

interface ITPermission { }

const _weaponService = new WeaponsService();

export const TPermission: React.FC<ITPermission> = (props: ITPermission) => {

    const [showDelete, setShowDelete] = useState(false);
    const [show, setShow] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [id, setId] = useState<number | null>(0);
    const [identification, setIdentification] = useState<number | null>(null);
    const [listPermissions, setListPermissions] = useState<IPermission[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [showSpinner, setShowSpinner] = useState(true);
    const { items } = useSelector((state: RootState) => state.itemsperpage);
    const [data, setData] = useState<any>();

    useEffect(() => {
        setRowsPerPage(parseInt(items));;
        getPermisoCatalogPorPropiedad();
    }, [items])

    const getPermisoCatalogPorPropiedad = () => {
        setShowSpinner(true);
        _weaponService.getPermisoCatalogPorPropiedad().subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                console.log(resp);
                setListPermissions(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getPermissionByIdentification = (id: number | null) => {
        setShowSpinner(true);
        _weaponService.getPermissionByIdentification(id).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                if (resp.length > 0) {
                    setListPermissions(resp);
                    Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias",
                    });
                } else {
                    setListPermissions(resp);
                    Toast.fire({
                        icon: "warning",
                        title: "No se han encontrado coincidencias ",
                    });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción.",
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

    const deletePermission = () => {
        _weaponService.deletePermission(idDelete).subscribe((resp) => {
            if (resp) {
                getPermisoCatalogPorPropiedad();
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
            deletePermission();
        }
    };

    const onSearch = (e: any, type: number) => {
        e.preventDefault();
        if (type === 1) {
            getPermissionByIdentification(identification);
        }
        else {
            getPermissionByIdentification(null);
            setId(null);
        }
    };

    const handleShowData = (data: any, id: number) => {
        console.log(data);
        let aux: any = data;
        aux.NombreTipo = data.TipoPermiso !== null ? data.NombreTipo : 'ESPECIAL';
        aux.TipoPermiso = data.TipoPermiso !== null ? data.TipoPermiso : 3;
        let dataPermision: any = JSON.parse(data.Data);
        dataPermision.NombreTipo = aux.NombreTipo;
        dataPermision.TipoPermiso = aux.TipoPermiso;
        dataPermision.DocType = aux.DocType ? aux.DocType : 1;
        setData(dataPermision);
        setId(id);
        setShow(true);
    };

    const classes = useStyles();

    const closeModal = () => {
        setShow(false);
    };

    return (
        <div className="d-flex nWhite w-80 p-3 m-3 flex-wrap justify-content-center p-2">
            <div className="row w-100">
                <div className="col-xxl-4 col-12 col-xxl-12 mb-4">
                    <div className="pull-title-top m-3">
                        <div className="row">
                            <div className="col-8">
                                <h1>Permisos Generados</h1>
                            </div>
                            <div className="col-4 card">
                                <form>
                                    <div className="row">
                                        <div className="col-8">
                                            <TextField
                                                value={identification}
                                                type="number"
                                                className="mb-3"
                                                size="small"
                                                fullWidth
                                                color="secondary"
                                                margin="normal"
                                                label="Buscar por Identificación"
                                                id="write"
                                                onChange={(e) => { setIdentification(parseInt(e.target.value)) }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton type="submit" onClick={(e) => onSearch(e, 1)}>
                                                                <BsSearch />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <ThemeProvider theme={inputsTheme}>
                                                <Button className="mt-3" variant="contained" color="secondary" onClick={(e) => onSearch(e, 0)} >
                                                    MOSTRAR TODO
                                                </Button>
                                            </ThemeProvider>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        {showSpinner ?
                            <SSpinner
                                show={showSpinner}
                            />
                            : listPermissions.length > 0 ?
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID Permiso</TableCell>
                                                    <TableCell>Tipo Permiso</TableCell>
                                                    <TableCell>Código Fijo</TableCell>
                                                    <TableCell>Código Aleatorio</TableCell>
                                                    <TableCell>Identificación</TableCell>
                                                    <TableCell>Fecha de Vencimiento</TableCell>
                                                    <TableCell>Hashval</TableCell>
                                                    <TableCell>Datos del Permiso</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listPermissions
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: any) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDPermiso}</TableCell>
                                                            <TableCell>{item.TipoPermiso !== null ? item.NombreTipo : 'ESPECIAL'}</TableCell>
                                                            <TableCell>{item.CodeA}</TableCell>
                                                            <TableCell>{item.CodeB}</TableCell>
                                                            <TableCell>{item.Identificacion}</TableCell>
                                                            <TableCell>{item.FechaVencimiento}</TableCell>
                                                            <TableCell>{item.Hashval}</TableCell>
                                                            <TableCell >
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title="Ver datos del permiso" placement="left">
                                                                        <IconButton
                                                                            color="secondary"
                                                                            onClick={() => (handleShowData(item, item.IDPermiso))}
                                                                        ><BsFillCreditCard2FrontFill />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </ThemeProvider>
                                                            </TableCell>
                                                            {/* <TableCell>
                                                                <div className="d-lg-flex d-none">
                                                                    <ButtonGroup>
                                                                        <ThemeProvider theme={inputsTheme}>
                                                                            <Tooltip title="Eliminar elemento">
                                                                                <Button
                                                                                    variant="contained"
                                                                                    className="box-s mr-1 mt-2 mb-2"
                                                                                    color="error"
                                                                                    onClick={() => {
                                                                                        setShowDelete(true);
                                                                                        setIdDelete(item.IDPermiso);
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
                                                                            key={item.IDPermiso + 7}
                                                                            icon={<BsTrash />}
                                                                            tooltipTitle="Eliminar elemento"
                                                                            onClick={() => {
                                                                                setShowDelete(true);
                                                                                setIdDelete(item.IDPermiso);
                                                                            }}
                                                                        />
                                                                        )
                                                                    </SpeedDial>
                                                                </div>
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
                                        count={listPermissions.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                                : listPermissions.length === 0 && <div className="mt-15"><NoInfo /></div>
                        }
                    </div>
                </div>
            </div>
            {show &&
                <MPermissionsData
                    setShow={closeModal}
                    show={show}
                    data={data}
                    idPermiso={id}
                    refresh={getPermisoCatalogPorPropiedad}
                />}
            {showDelete && (
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"¿Está seguro de eliminar el elemento?"}
                />
            )}
        </div>
    )
}
