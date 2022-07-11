import { Button, Checkbox, Tooltip, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsXSquare } from 'react-icons/bs'
import { useSelector } from 'react-redux'


import { AdminService } from '../../../core/services/AdminService'
import { SSpinner } from '../../../shared/components/SSpinner'
import { RootState } from '../../../store/Store'
import { inputsTheme, useStyles } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { IApplicationTypeMenu, IApplicationTypeModule } from '../model/Applicationtype'

interface IAdminRolesModules {
    show: boolean
    setShow: Function
    idRole: number
    role: string
}

const _adminService = new AdminService();

export const AdminRolesModules: React.FC<IAdminRolesModules> = (props: IAdminRolesModules) => {

    const [idSelected, setIdSelected] = useState(0);
    const [listModules, setListModules] = useState<IApplicationTypeModule[]>([]);
    const [listMenus, setListMenus] = useState<IApplicationTypeMenu[]>([]);
    const [showSpinner, setShowSpinner] = useState(true);
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
        getApplicationTypeCatalog();
        setRowsPerPage(parseInt(items));;
    }, [idSelected, items])

    const getApplicationTypeCatalog = () => {
        setShowSpinner(true);
        _adminService.getApplicationTypeCatalog().subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setShowSpinner(false);
                setListModules(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const getApplicationIDAtLevel = (id: number) => {
        setShowSpinner(true);
        _adminService
            .getRolPermisoPorMenu(id, props.idRole)
            .subscribe(resp => {
                if (resp) {
                    console.log(resp);
                    setShowSpinner(false);
                    setListMenus(resp);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            })
    };/*  */

    const addCheckRelation = (idRole: number, idLn: number) => {
        setShowSpinner(true);
        _adminService.addBusinessLogicToRole(idRole, idLn).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setShowSpinner(false);
                getApplicationIDAtLevel(idSelected);
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado exitosamente!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const deleteCheckRelation = (idRole: number, idLn: number) => {
        setShowSpinner(true);
        _adminService.deleteBusinessLogicToRole(idRole, idLn).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setShowSpinner(false);
                getApplicationIDAtLevel(idSelected);
                Toast.fire({
                    icon: "success",
                    title: "Se ha guardado exitosamente!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    };

    const handleSelectorChange = (e: any) => {
        setIdSelected(parseInt(e.target.value));
        getApplicationIDAtLevel(parseInt(e.target.value))
    }

    const handleCheck = (visible: boolean, idLn: number) => {
        if (visible ? true : false) {
            deleteCheckRelation(props.idRole, idLn);
        } else {
            addCheckRelation(props.idRole, idLn);
        }
    }

    const classes = useStyles();

    return (
        <>
            <Modal size='lg' show={props.show} onHide={()=>props.setShow(false)}  centered >
                <Modal.Header>
                    Administrar Módulos para el Rol: {props.role}
                    <BsXSquare  className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} className="mt-3">
                            <TextField
                                select
                                size="small"
                                fullWidth
                                color="secondary"
                                margin="normal"
                                label="Seleccione un Módulo"
                                id="type"
                                onChange={(e) => { handleSelectorChange(e) }}
                            >
                                {listModules.map((module: any) => (
                                    <MenuItem key={module.IDApplicationType} value={module.IDApplicationType}>
                                        {module.Name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Col>
                        <Col sm={12}>
                            {listMenus.length > 0 &&
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ height: "70vh" }}>
                                        <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Código</TableCell>
                                                    <TableCell>Nombre</TableCell>
                                                    <TableCell>URL</TableCell>
                                                    <TableCell>Estado</TableCell>
                                                    <TableCell>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listMenus
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: any) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDLn}</TableCell>
                                                            <TableCell>{item.Code}</TableCell>
                                                            <TableCell>{item.Name}</TableCell>
                                                            <TableCell>{item.URL}</TableCell>
                                                            <TableCell>{item.isActive}</TableCell>
                                                            <TableCell>
                                                                <ThemeProvider theme={inputsTheme}>
                                                                    <Tooltip title={item.isActive ? "Ocultar Menú" : "Mostrar Menú"} >
                                                                        <Checkbox
                                                                            name={item.IDLn}
                                                                            onClick={(e) => { handleCheck(item.isActive, item.IDLn); }}
                                                                            color="secondary"
                                                                            checked={item.isActive ? true : false}
                                                                        />
                                                                    </Tooltip>
                                                                    <p>{item.isActive ? "VISIBLE" : "OCULTO"}</p>
                                                                </ThemeProvider>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        className={classes.root}
                                        rowsPerPageOptions={[items, 10, 25, 100]}
                                        component="div"
                                        count={listModules.length}
                                        labelRowsPerPage="Columnas por Página"
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <ThemeProvider theme={inputsTheme}>
                        <Button color="error" variant="contained" onClick={() => props.setShow(false)}>
                            CERRAR
                        </Button>
                    </ThemeProvider>
                </Modal.Footer>
            </Modal>
            {showSpinner && (<SSpinner show={showSpinner} />)}
        </>
    )
}
