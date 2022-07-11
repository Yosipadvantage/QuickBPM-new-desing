import { Paper, SpeedDial, SpeedDialAction, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, ThemeProvider, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsPersonPlusFill, BsTrash, BsXSquare } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";


import { AdminService } from "../../../core/services/AdminService";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { Toast } from "../../../utils/Toastify";
import { inputsTheme, useStyles } from "../../../utils/Themes";

import { IBusinessRole } from "../model/BusinessRole";
import { Col, Modal } from "react-bootstrap";
import { NERoleBusiness } from "../components/NEBusinessRole";
import { SSpinner } from "../../../shared/components/SSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";


interface ITBusinessRole {
    dataShow: boolean;
    getShow: Function;
    nameGrupo: string
    idLn: number
}
const _adminService = new AdminService();
export const TBusinessRole: React.FC<ITBusinessRole> = (props: ITBusinessRole) => {


    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [showModalNE, setShowModalNE] = useState(false);
    const [title, setTitle] = useState("")
    const [beanBusinessRole, setBeanBusinessRole] = useState<IBusinessRole>();
    const [showDelete, setShowDelete] = useState(false);
    const [listBusiness, setListBusiness] = useState<IBusinessRole[]>([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const { items } = useSelector((state: RootState) => state.itemsperpage);

    useEffect(() => {
        getBusinessRole();
        setRowsPerPage(parseInt(items));;

    }, [items]);
    const setShow = () => {
        props.getShow(false);
    }
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getBusinessRole = () => {
        setShowSpinner(true);
        setListBusiness([]);
        _adminService.getBusinessRoleCatalog(props.idLn).subscribe(
            (resp) => {
                if (resp) {
                    setListBusiness(resp)
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
                setShowSpinner(false);
            }
        );
    }
    const formComponent = (title: string, obj?: IBusinessRole) => {
        setTitle(title);
        if (title === "Editar") {
            setBeanBusinessRole(obj);
        }
        stateModal(true);
    }


    const stateModal = (data: boolean) => {
        setShowModalNE(data)
    }
    const deleteElement = (data: boolean) => {
        if (data) {
            _adminService.deleteBusinessRole(beanBusinessRole?.IDBusinessRole).subscribe((resp: any) => {
                if (resp) {
                    Toast.fire({
                        icon: "success",
                        title: "Se ha eliminado con éxito!",
                    });
                    getBusinessRole();
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
            })
        }
    };

    const classes = useStyles();


    return (
        <> <Modal show={props.dataShow} size="xl" centered onHide={setShow}>
            <Modal.Header>
                Lista de roles para grupo de trabajo {props.nameGrupo}
                <BsXSquare  className='pointer' onClick={setShow} />
            </Modal.Header>

            <Modal.Body>
                <Col sm={12} className="d-flex mb-1 justify-content-end">
                    <ThemeProvider theme={inputsTheme}>
                        <Button size="small" variant="contained" color="secondary" onClick={() => stateModal(true)} endIcon={<BsPersonPlusFill />}>
                            AÑADIR ROL
                        </Button>
                    </ThemeProvider>
                </Col>
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
                                {listBusiness
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item: IBusinessRole) => (
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>{item.IDBusinessRole}</TableCell>
                                            <TableCell>{item.Name}</TableCell>
                                            <TableCell>{item.Description}</TableCell>
                                            <TableCell>
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
                                                        key={item.IDBusinessRole}
                                                        icon={<BsPencilSquare />}
                                                        tooltipTitle="Editar módulo"
                                                        onClick={() => {
                                                            formComponent("Editar", item);
                                                        }}
                                                    />
                                                    <SpeedDialAction
                                                        key={item.IDBusinessRole + 1}
                                                        icon={<BsTrash />}
                                                        tooltipTitle="Eliminar módulo"
                                                        onClick={() => {
                                                            setShowDelete(true);
                                                            setBeanBusinessRole(item);
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
                        count={listBusiness.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Modal.Body>
        </Modal>

            {showModalNE && (
                <NERoleBusiness
                    dataObj={beanBusinessRole}
                    dataShow={showModalNE}
                    dataTitle={title}
                    idLN={props.idLn}
                    getShow={stateModal}
                    refreshList={getBusinessRole}
                />
            )}
            {showDelete && <GenericConfirmAction
                show={showDelete}
                setShow={setShowDelete}
                confirmAction={deleteElement}
                title="¿Está seguro de remover el usuario?"
            />}
            {showSpinner && (<SSpinner show={showSpinner} />)}
        </>)
}