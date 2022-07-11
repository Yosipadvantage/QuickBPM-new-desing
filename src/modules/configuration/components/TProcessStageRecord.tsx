import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, TablePagination } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import { BsCheckCircleFill, BsXCircleFill, BsXSquare } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux';

import { SSpinner } from '../../../shared/components/SSpinner'
import { ConfigService } from '../../../core/services/ConfigService';
import { RootState } from '../../../store/Store';
import { useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';

interface ITProcessStageRecord {
    dataShow: boolean,
    setShow: Function,
    id: number
}

const _configService = new ConfigService();

const TProcessStageRecord: React.FC<ITProcessStageRecord> = (props: ITProcessStageRecord) => {

    const [listRequested, setListRequested] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
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
        getStageCatalog()
        setRowsPerPage(parseInt(items));;
    }, [items])

    const getStageCatalog = async () => {
        setShowSpinner(true);
        await _configService
            .getStageCatalog(props.id)
            .then((rps: any) => {
                setShowSpinner(false);
                if (rps.data.DataBeanProperties.ObjectValue) {
                    rps.data.DataBeanProperties.ObjectValue.sort((a: any, b: any) => a.DataBeanProperties.IDStage - b.DataBeanProperties.IDStage);
                    setListRequested(rps.data.DataBeanProperties.ObjectValue);
                }
                else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción"
                    })
                }
            })
            .catch((e) => {
                console.log(e);
                setShowSpinner(false);
            })
    }

    const closeModal = () => {
        props.setShow(false);
    }

    const classes = useStyles();

    return (
        <>
            <Modal size="xl" show={props.dataShow} modal  centered onHide={closeModal} >
                <Modal.Header>
                    Historial de etapas del proceso
                    <BsXSquare className="pointer" onClick={closeModal} />
                </Modal.Header>
                <Modal.Body>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "70vh" }}>
                            <Table stickyHeader aria-label="sticky table" className={classes.root}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Etapa</TableCell>
                                        <TableCell>Nombre de etapa</TableCell>
                                        <TableCell>Inicio de etapa</TableCell>
                                        <TableCell>Salida de etapa</TableCell>
                                        <TableCell>¿Es condicional?</TableCell>
                                        <TableCell>¿Es etapa actual?</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listRequested
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item: any, index: number) => (
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                <TableCell>{item.DataBeanProperties.IDStage}</TableCell>
                                                <TableCell>{item.DataBeanProperties.ProcedureName}</TableCell>
                                                <TableCell>{item.DataBeanProperties.Since}</TableCell>
                                                <TableCell>{item.DataBeanProperties.ResponseValue}</TableCell>
                                                <TableCell>
                                                    {(item.DataBeanProperties.IsConditional === true)
                                                        ? <BsCheckCircleFill />
                                                        : <BsXCircleFill />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {(item.DataBeanProperties.IsActualStage === true)
                                                        ? <BsCheckCircleFill />
                                                        : <BsXCircleFill />
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
                            count={listRequested.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Modal.Body>
            </Modal>
            {showSpinner &&
                <div className="spinner d-flex justify-content-center">
                    <SSpinner show={showSpinner} />
                </div>
            }
        </>
    )
}

export default TProcessStageRecord
