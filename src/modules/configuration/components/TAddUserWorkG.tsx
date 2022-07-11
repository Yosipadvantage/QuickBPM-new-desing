import { useEffect, useState } from "react";

import { ConfigService } from "../../../core/services/ConfigService";
import { Modal, Row, Col } from "react-bootstrap";
import { BsFillPersonXFill, BsPersonPlusFill, BsPatchCheck, BsTrash, BsXSquare } from "react-icons/bs";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { SpeedDial, SpeedDialAction, ThemeProvider, Button, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, MenuItem,Autocomplete } from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Office } from "../model/Office";
import { Toast } from "../../../utils/Toastify";
import { MemberWorkGroup } from "../model/MemberWorkGroup";
import { SSpinner } from "../../../shared/components/SSpinner";
import { TEWorkGroupRole } from "../../admin/components/TEWorkGroupRole";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { pipeSort } from "../../../utils/pipeSort";

const _configService = new ConfigService();

interface IAddUserWorkG {
    idLn: number;
    dataShow: boolean;
    getShow: Function;
}

export const TAddUserWorkG: React.FC<IAddUserWorkG> = (props: IAddUserWorkG) => {

    const [listUsers, setListUsers] = useState<MemberWorkGroup[]>([]);
    const [show, setShow2] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [bean, setBean] = useState<any>({});
    const [showAddRole, setShowAddRole] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [listOffice, setOficce] = useState<Office[]>([]);
    const [idOffice, setIdOffice] = useState<number>(-1);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        /* setIdOffice(-1); */
        getListOffice();
        setRowsPerPage(parseInt(items));;

    }, [items])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const closeModal = () => {
        props.getShow(false);
    };

    const getUsersWorkG = (id: number, office: number) => {
        setShowSpinner(true);
        _configService
            .getWorkGroupMemberCatalog(id, office)
            .subscribe(resp => {
                setShowSpinner(false);
                if (resp) {
                    console.log(resp);
                    setListUsers(resp);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            });
    };

    const inactive = (data: any, idOffice: number) => {
        _configService
            .removeWorkGroupMember(data.IDLnFunctionalID, data.IDAccount, idOffice)
            .subscribe((resp) => {
                if (resp) {
                    getUsersWorkG(props.idLn, idOffice)
                    Toast.fire({
                        icon: "success",
                        title: "Se ha guardado con éxito",
                    });
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    };

    /* const getListOffice = () => {
        setShowSpinner(true);
        _configService.getOfficeCatalog().subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                setOficce(resp);
                console.log(resp)
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }; */
    const getListOffice = () => {
        let aux: any = [];
        let auxSorted: any = [];
        setShowSpinner(true);
        _configService.getOfficeCatalog().subscribe((res) => {
            setShowSpinner(false);
            if (res) {
                console.log(res)
                setOficce(res);
                 res.map((item: any) =>
                    aux.push({
                        label: item.Name,
                        id: item.IDOffice
                    }))
                auxSorted = pipeSort([...aux], 'label');
                setOficce(auxSorted); 
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    };

    const activeUser = (IdLn: number, IdAccount: number, idOffice: number) => {
        _configService
            .addWorkGroupMember(IdLn, IdAccount, idOffice)
            .subscribe((resp) => {
                console.log(resp);
                if (resp) {
                    getUsersWorkG(props.idLn, idOffice);
                    setShow2(false);
                    Toast.fire({
                        icon: "success",
                        title: "Se ha guardado con éxito!",
                    });
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
    }

    const closeSearch = (data: any) => {
        setShow2(data);
    };

    const getItem = (data: any) => {
        if (exists(data)) {
            Toast.fire({
                icon: "error",
                title: "Este usuario ya existe en el grupo de trabajo"
            })
        } else {
            activeUser(props.idLn, data.IDAccount, idOffice);
        }

    };

    const statusShowRole = (status: boolean) => {
        setShowAddRole(status);
    };

    const exists = (data: any) => {
        let exist: boolean = false;
        if (listUsers.length > 0) {
            for (let i = 0; i < listUsers.length; i++) {
                let user: any = listUsers[i];
                if (user.IDAccount === data.IDAccount) {
                    exist = true;
                    break;
                }
            }
        }
        return exist;
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            inactive(bean, idOffice)
        }
    };
    const onChangeComponent = (data: any) => {
        /* console.log(data?.id); */
        if(data?.id == undefined){
            setListUsers([]);
            setIdOffice(-1)
        }else{
            /* console.log(data?.id); */
            setIdOffice(data?.id)
            getUsersWorkG(props.idLn, data?.id);
        }
        
    }
    /* const onChangeComponent = (data: number) => {
        console.log(data);
        setIdOffice(data)
        getUsersWorkG(props.idLn, data);
    } */

    const classes = useStyles();

    return (
        <Modal size="xl" show={props.dataShow}   centered onHide={closeModal} >
            <Modal.Header>
                Añadir Usuario a Grupo de Trabajo - { }
                <BsXSquare className='pointer' onClick={closeModal} />
            </Modal.Header>
            <Modal.Body>
                <Row className="mt-3">
                    <Col sm={6} className="d-flex justify-content-start">
                        {/* <TextField
                            size="small"
                            select
                            fullWidth
                            color="secondary"
                            label=".:Seccional:."
                            id="state"
                            onChange={(e) => onChangeComponent(parseInt(e.target.value))}
                        >
                            {listOffice.map((item: any) => (
                                <MenuItem value={item.IDOffice}>
                                    {item.Name}
                                </MenuItem>
                            ))}
                        </TextField> */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            disablePortal
                            id="forms"
                            options={listOffice}
                            onChange={(e, value: any) => onChangeComponent(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    label=".:Seccional:."
                                    id="state"
                                />)}
                        />
                        
                    </Col>
                    <Col sm={6} className="d-flex justify-content-end">
                        <ThemeProvider theme={inputsTheme}>
                            {(idOffice !== -1) &&
                                <Button size="small" variant="contained" color="secondary" onClick={() => closeSearch(true)} endIcon={<BsPersonPlusFill />}>
                                    AÑADIR USUARIO
                                </Button>}
                        </ThemeProvider>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={12}>
                        {(listUsers.length > 0) ?
                            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ height: "70vh" }}>
                                    <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Cédula</TableCell>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Grupo de trabajo</TableCell>
                                                <TableCell>Roles</TableCell>
                                                <TableCell>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                listUsers
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((item: any) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                                            <TableCell>{item.IDWorkGroupMember}</TableCell>
                                                            <TableCell>{item.AccountID}</TableCell>
                                                            <TableCell>{item.AccountName}</TableCell>
                                                            <TableCell>{item.FunctionalIDName}</TableCell>
                                                            <TableCell>{item.BusinessRoleName}</TableCell>
                                                            <TableCell>
                                                                <SpeedDial
                                                                    ariaLabel="SpeedDial basic example"
                                                                    direction="left"
                                                                    FabProps={{ size: "small", style: { backgroundColor: "#503464" } }}
                                                                    icon={<FiMoreVertical />}
                                                                >
                                                                    <SpeedDialAction
                                                                        key={item.IDWorkGroupMember}
                                                                        icon={<BsFillPersonXFill />}
                                                                        tooltipTitle="Remover usuario del grupo de trabajo"
                                                                        onClick={() => {
                                                                            setBean(item);
                                                                            setShowDelete(true);
                                                                        }}
                                                                    />
                                                                    )
                                                                    <SpeedDialAction
                                                                        key={item.IDWorkGroupMember}
                                                                        icon={<BsPatchCheck />}
                                                                        tooltipTitle="Añadir roles a Usuario"
                                                                        onClick={() => {
                                                                            setBean(item);
                                                                            statusShowRole(true);
                                                                        }}
                                                                    />
                                                                    )
                                                                </SpeedDial>
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
                                    count={listUsers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            : (idOffice === -1)
                                ? ""
                                : <h1>No hay usuarios en esta Seccional</h1>}
                    </Col>
                </Row>
            </Modal.Body>

            {showAddRole && <TEWorkGroupRole
                idWorkGroupMember={bean.IDWorkGroupMember}
                nombre={bean.AccountName}
                idLn={bean.IDLnFunctionalID}
                setShow={statusShowRole}
                show={showAddRole}
            />}

            <SSearchPerson getShow={closeSearch} getPerson={getItem} dataShow={show} />
            {showDelete && <GenericConfirmAction
                show={showDelete}
                setShow={setShowDelete}
                confirmAction={deleteElement}
                title="¿Está seguro de remover el usuario?"
            />}
            {showSpinner &&
                <div className="spinner d-flex justify-content-center">
                    <SSpinner show={showSpinner} />
                </div>
            }
        </Modal>


    )
}