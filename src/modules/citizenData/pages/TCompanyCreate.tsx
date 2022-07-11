import { ButtonGroup, IconButton, InputAdornment, MenuItem, Paper, SpeedDial, SpeedDialAction, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BsLayoutWtf, BsListTask, BsPencilSquare, BsPerson, BsPersonDashFill, BsPlus, BsSearch } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { AdminService } from '../../../core/services/AdminService';
import { GlobalService } from '../../../core/services/GlobalService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { User } from '../../../shared/model/User';
import { RootState } from '../../../store/Store';
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { MCreateCompany } from '../components/MCreateCompany';

interface ITCompanyCreate { }

const _globalService = new GlobalService();
const _adminService = new AdminService();

export const TCompanyCreate: React.FC<ITCompanyCreate> = (props: ITCompanyCreate) => {

    const { handleSubmit } = useForm();
    const [list, setList] = useState<User[]>([]);
    const [title, setTitle] = useState("");
    const [formdata, setformdata] = useState<User>();
    const [show, setShow] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [showDesactivate, setShowDesactivate] = useState(false);
    const [write, setWrite] = useState(false);
    const [user, setUser] = useState<User>({
        Active: false,
        EntityName: '',
        IDAccount: 0,
        IDLn: 0,
        Name1: '',
        Name2: '',
        Nit: 0,
        RoleID: 0,
        State: 0,
        Surname1: '',
        Surname2: '',
        eMail: '',
        Age: 0,
        DocType: 0,
        Grade: null,
        PDF417Str: null,
        Password: null
    });
    const [type, setType] = useState(0);
    const [text, setText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [viewMode, setViewMode] = useState(false)
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    const onChangeSelect = (e: any) => {
        setType(e);
        (e !== 'd') ? setWrite(true) : setWrite(false);
        setList([]);
    };

    useEffect(() => {
        setRowsPerPage(parseInt(items));;
    }, [items]);

    const getAccountByNit = (nit: number) => {
        setSpinner(true);
        _globalService
            .getAccountByNit(nit)
            .subscribe(resp => {
                setSpinner(false);
                if (resp.length > 0) {
                    setList(resp);
                    Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias"
                    })
                }
                else {
                    setList(resp);
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias"
                    })
                }
            })
    };

    const getAccount = (names: any, lastNames: any) => {
        setSpinner(true);
        _globalService
            .getAccount(names, lastNames)
            .subscribe(resp => {
                setSpinner(false);
                if (resp.length > 0) {
                    setList(resp);
                    Toast.fire({
                        icon: "success",
                        title: "Se han encontrado coincidencias"
                    })
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se han encontrado coincidencias"
                    })
                }
            })
    };

    const handleWrite = (e: any) => {
        setText(e);
    }

    const onSubmit = () => {
        if (type === 1) {
            getAccountByNit(parseInt(text));
        }
        if (type === 2) {
            getAccount(text, null);
        }
        if (type === 3) {
            getAccount(null, text);
        }
    };

    const formComponent = (title: string, data?: any) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        viewModal();
    };

    const viewModal = () => {
        setShow(true);
    };

    const desactivateUser = (data: boolean) => {
        if (data) {
            desactivateUserAccount(user.IDAccount);
        }
    };

    const desactivateUserAccount = async (idAccount: number) => {
        setSpinner(true);
        await _adminService
            .desactivateUserAccount(idAccount)
            .then((rps: any) => {
                if (rps.data.DataBeanProperties.ObjectValue === 3) {
                    setSpinner(false);
                    Toast.fire({
                        icon: "success",
                        title: "Usuario desactivado con éxito!"
                    });
                    getAccountByNit(user.Nit);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se pudo desactivar el usuario"
                    });
                    getAccountByNit(user.Nit);
                }

            })
            .catch((err) => {
                console.log(err);
            })

    };

    const handleViewMode = (type: number) => {
        (type === 0) ? setViewMode(true) : setViewMode(false);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getAccountByNit2 = (nit: number) => {
        setSpinner(true);
        _globalService
            .getAccountByNit(nit)
            .subscribe(resp => {
                setSpinner(false);
                if (resp.length > 0) {
                    setList(resp);
                }
                else {
                    setList(resp);
                }
            })
    };

    const classes = useStyles();

    return (
        <>
            <div className="nWhite p-3 m-3 w-100">
                <main>
                    <header className="page-header page-header-light bg-light mb-0">
                        <div className="container-fluid">
                            <div className="page-header-content pt-4 pb-10">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 className="">
                                            EMPRESAS
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <Card className="box-s">
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row className="w-100">
                                    <Col sm={3} className="d-flex justify-content-end align-items-end">
                                        <TextField
                                            select
                                            size="small"
                                            fullWidth
                                            color="secondary"
                                            margin="normal"
                                            label=".: Buscar por: :."
                                            id="type"
                                            onChange={(e) => onChangeSelect(e.target.value)}
                                        >
                                            <MenuItem key={1} value={1}>
                                                NIT
                                            </MenuItem>
                                            <MenuItem key={2} value={2}>
                                                Nombre
                                            </MenuItem>
                                        </TextField>
                                    </Col>
                                    <Col sm={3} className="d-flex justify-content-end align-items-end">
                                        {write &&
                                            <TextField
                                                size="small"
                                                className={classes.field}
                                                fullWidth
                                                color="secondary"
                                                margin="normal"
                                                label="Escrbir"
                                                id="write"
                                                onChange={(e) => handleWrite(e.target.value)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton type="submit" onClick={onSubmit}>
                                                                <BsSearch />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        }
                                    </Col>
                                    {(list.length > 0) &&
                                        <Col sm={6} className="mt-2 d-flex justify-content-end">
                                            <ThemeProvider theme={inputsTheme}>
                                                <ButtonGroup disableElevation variant="contained" style={{ height: 40 }}>
                                                    <Tooltip title="Ver lista">
                                                        <IconButton
                                                            onClick={() => handleViewMode(0)}
                                                            color="secondary"><BsListTask />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Ver mosaico">
                                                        <IconButton
                                                            onClick={() => handleViewMode(1)}
                                                            color="secondary"><BsLayoutWtf />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ButtonGroup>
                                            </ThemeProvider>
                                        </Col>}
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="px-5 mt-2">
                        <div className="row">
                            <div className="p-0">
                                <div className="d-flex">
                                    <button
                                        className="btn btn-sm btn-outline-secondary btn-custom"
                                        type="button"
                                        onClick={() => {
                                            formComponent("Crear", 0);
                                        }}
                                    >
                                        <BsPlus />
                                    </button>
                                </div>
                                <div className="mt-3">
                                    {(viewMode)
                                        ? <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                            <TableContainer sx={{ height: "70vh" }}>
                                                <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ID</TableCell>
                                                            <TableCell>Cédula/Nit</TableCell>
                                                            <TableCell>Nombres completo</TableCell>
                                                            <TableCell>Correo</TableCell>
                                                            {/* <TableCell>Acciones</TableCell> */}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {list
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((item: User) => (
                                                                <TableRow hover role="checkbox" tabIndex={-1}>
                                                                    <TableCell>{item.IDAccount}</TableCell>
                                                                    <TableCell>{item.Nit}</TableCell>
                                                                    <TableCell>{item.EntityName}</TableCell>
                                                                    <TableCell>{item.eMail}</TableCell>
                                                                    {/* <TableCell>
                                                                        <SpeedDial
                                                                            ariaLabel="SpeedDial basic example"
                                                                            direction="left"
                                                                            FabProps={{ size: "small", style: { backgroundColor: "#503464" } }}
                                                                            icon={<FiMoreVertical />}
                                                                        >
                                                                            <SpeedDialAction
                                                                                key={item.IDLn}
                                                                                icon={<BsPencilSquare />}
                                                                                tooltipTitle="Editar"
                                                                                onClick={() => {
                                                                                    formComponent("Editar", item);
                                                                                }}
                                                                            />
                                                                            {(item.Active === true) &&
                                                                                <SpeedDialAction
                                                                                    key={item.IDAccount + 2}
                                                                                    icon={<BsPersonDashFill />}
                                                                                    tooltipTitle="Desactivar usuario"
                                                                                    onClick={() => {
                                                                                        setShowDesactivate(true);
                                                                                        setUser(item);
                                                                                    }}
                                                                                />
                                                                            }
                                                                            )
                                                                        </SpeedDial>
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
                                                count={list.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </Paper>
                                        : <div className="card-grid py-5 py-xl-4">
                                            {list.map(item => (
                                                <div className="cgt card m-2 p-4">
                                                    <div>
                                                        <h5>
                                                            {(item.Active === true)
                                                                ? <BsPerson color="green" />
                                                                : <BsPerson color="red" />
                                                            }
                                                            {" "}Usuario - {item.IDAccount}
                                                        </h5>
                                                        <hr />
                                                        <div className={(item.Active === true) ? '' : 'user-disabled'}>
                                                            <b>Cédula/Nit:</b>
                                                            <br />
                                                            {item.Nit}
                                                        </div>
                                                        <div className={(item.Active === true) ? '' : 'user-disabled'}>
                                                            <b>Nombres:</b>
                                                            <br />
                                                            {item.Name1}{" "}
                                                            {item.Name2}
                                                        </div>
                                                        <div className={(item.Active === true) ? '' : 'user-disabled'}>
                                                            <b>Apellidos:</b>
                                                            <br />
                                                            {item.Surname1}{" "}
                                                            {item.Surname2}
                                                        </div>
                                                        <div className={(item.Active === true) ? '' : 'user-disabled'}>
                                                            <b>Correo:</b>
                                                            <br />
                                                            {item.eMail}
                                                        </div>
                                                        {/* <div className="p-0 m-0">
                                                            <SpeedDial
                                                                ariaLabel="SpeedDial basic example"
                                                                direction="left"
                                                                FabProps={{ size: "small", style: { backgroundColor: "#503464" } }}
                                                                icon={<FiMoreVertical />}
                                                            >
                                                                <SpeedDialAction
                                                                    key={item.IDLn}
                                                                    icon={<BsPencilSquare />}
                                                                    tooltipTitle="Editar"
                                                                    onClick={() => {
                                                                        formComponent("Editar", item);
                                                                    }}
                                                                />
                                                                {(item.Active === true) &&
                                                                    <SpeedDialAction
                                                                        key={item.IDAccount + 2}
                                                                        icon={<BsPersonDashFill />}
                                                                        tooltipTitle="Desactivar usuario"
                                                                        onClick={() => {
                                                                            setUser(item);
                                                                            setShowDesactivate(true);
                                                                        }}
                                                                    />
                                                                }
                                                                )
                                                            </SpeedDial>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>}
                                    {show &&
                                        <MCreateCompany dataTitle={title} show={show} setShow={setShow} getAccount={getAccountByNit2} dataObj={formdata} />
                                    }
                                    {/* {show &&
                                    <NEUser
                                        getShow={closeModal}
                                        dataShow={show}
                                        dataObj={formdata}
                                        dataTitle={title}
                                    />}
                                {showActivate &&
                                    <NEUserActivate
                                        getShow={closeModal}
                                        dataShow={showActivate}
                                        user={user}
                                        refreshList={getAccountByNit}
                                    />} */}
                                    {showDesactivate && <GenericConfirmAction
                                        show={showDesactivate}
                                        setShow={setShowDesactivate}
                                        confirmAction={desactivateUser}
                                        title="¿Está seguro de desactivar el usuario?"
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {spinner && <SSpinner show={spinner} />}
        </>
    )
}
