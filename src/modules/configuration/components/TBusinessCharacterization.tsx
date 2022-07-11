import { MenuItem, TextField, ThemeProvider, Button, Table, FormGroup, FormControlLabel, Checkbox, TablePagination, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, SpeedDial, SpeedDialAction, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsFileEarmarkPersonFill, BsPencilSquare, BsTrashFill, BsXSquare } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { ConfigService } from '../../../core/services/ConfigService';
import { NoInfo } from '../../../utils/NoInfo';
import { inputsTheme, useStyles } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IBusinessCharacterization } from '../model/BusinessCharacterization';
import { CharacterizationK } from '../model/Characterization';
import { ICustomerType } from '../model/CustomerType';
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { SSpinner } from '../../../shared/components/SSpinner';

const _configService = new ConfigService();

interface IBusinessChracterization {
    name: string;
    show: boolean;
    setShow: Function;
    idBusinessProcess: number;
}

export const TBusinessCharacterization: React.FC<IBusinessChracterization> = (props: IBusinessChracterization) => {

    const [listCharacterization, setListCharacterization] = useState<CharacterizationK[]>([]);
    const [charChecks, setCharChecks] = useState<IBusinessCharacterization[]>([]);
    const [listCustomerType, setListCustomerType] = useState<ICustomerType[]>([]);
    const [selectedCharats, setSelectedCharats] = useState<number[]>([]);
    const [ctSelected, setCtSelected] = useState<number | null>(null);
    const [btn, setBtn] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getCustomerTypeCatalog();
        getListCharacterization();
        getBusinessCharacterizationCatalog(props.idBusinessProcess);
    }, [ctSelected])

    const getBusinessCharacterizationCatalog = (id: number) => {
        _configService
            .getBusinessCharacterizationCatalog(id)
            .subscribe(res => {
                if (res) {
                    console.log(res);
                    setCharChecks(res);
                } else {

                }
            })
    }

    const addBusinessCharacterization = (id: number) => {
        _configService.addBusinessCharacterization(props.idBusinessProcess, id).subscribe((
            resp => {
                console.log(resp);
                if (resp) {
                    Toast.fire({
                        icon: "success",
                        title: "Se ha guardado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
                getBusinessCharacterizationCatalog(props.idBusinessProcess);
            }
        ))
    }

    const getCustomerTypeCatalog = () => {
        _configService.getCustomerTypeCatalog().subscribe(res => {
            if (res) {
                setListCustomerType(res);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }

    const getCustomerTypeName = () => {
        let ctn = null;
        for (let i = 0; i < listCustomerType.length; i++) {
            ctn = listCustomerType[i];
            if (ctn.IDCustomerType === ctSelected) {
                break;
            }
        }
        return (ctn) ? ctn.Name : "Error";
    }

    const getListCharacterization = () => {
        setSpinner(true);
        _configService.getCharacterizationCatalog()
            .subscribe(res => {
                setSpinner(false);
                if (res) {
                    setListCharacterization(res.filter((item: any) => (item.CustomerTypeName === getCustomerTypeName())));
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            })
    }

    const closeModal = () => {
        props.setShow(false);
    }

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedCharats(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteBusinessCharacterization(idDelete);
        }
    };

    const deleteBusinessCharacterization = async (id: number) => {
        await _configService
            .deleteBusinessCharacterization(id)
            .subscribe((resp: any) => {
                if (resp) {
                    getCustomerTypeCatalog();
                    Toast.fire({
                        icon: "success",
                        title: "Se ha eliminado con éxito!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha podido completar la acción",
                    });
                }
                getBusinessCharacterizationCatalog(props.idBusinessProcess);
            })
    };

    const handleAdd = () => {
        selectedCharats.map(item => {
            console.log(item);
            addBusinessCharacterization(item);
        })
        setCtSelected(null);
        setSelectedCharats([]);
        setBtn(false);
    }

    return (
        <>
            <Modal
                show={props.show}
                modal 
                centered
                onHide={closeModal}
                 >
                <Modal.Header>
                    Caracterizaciones para: -- {props.name} --
                    <BsXSquare className="pointer" onClick={closeModal} />
                </Modal.Header>
                <Modal.Body className="h-50">
                    <Row>
                        <Col sm={12} className="mt-2 mb-3 ">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { setBtn(true) }}
                                >
                                    AGREGAR CARACTERIZACIÓN
                                </Button>
                            </ThemeProvider>
                        </Col>
                        {btn &&
                            <Col sm={12} className="mt-3">
                                <TextField
                                    value={ctSelected}
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label=".:Tipo de Cliente:."
                                    id="state"
                                    onChange={(e) => { setCtSelected(parseInt(e.target.value)); }}
                                >
                                    {listCustomerType.map((item: any) => (
                                        <MenuItem key={item.IDCustomerType} value={item.IDCustomerType}>
                                            {item.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>}
                        {(ctSelected != null && btn) &&
                            <Col sm={12} className="mt-3 mb-3">
                                <label>Puede selecionar varias opciones</label>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    color="secondary"
                                    label=".:Caracterizaciones a agregar:."
                                    id="state"
                                    SelectProps={{
                                        multiple: true,
                                        value: selectedCharats,
                                    }}
                                    onChange={handleChange}
                                >
                                    {listCharacterization.map((item: any) => (
                                        <MenuItem key={item.IDCharacterization} value={item.IDCharacterization}>
                                            {item.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>}
                        <Col sm={12} className="d-flex justify-content-center mt-3 mb-3">
                            {spinner ? <SSpinner show={spinner} /> :
                                charChecks.length > 0
                                    ? <div className="overflow-auto d-flex justify-content-center flex-column">
                                        {charChecks.map((item: IBusinessCharacterization) => (
                                            <div className="cgt-char card m-2 d-flex flex-row">
                                                <div className="mt-2 mr-5">
                                                    <b className="ml-2 p-2 d-flex justify-content">{item.CharacterizationName}</b>
                                                </div>
                                                <div className="col sm-3 d-flex justify-content-end">
                                                    <Tooltip title="Quitar" placement="right">
                                                        <IconButton
                                                            onClick={() => { setIdDelete(item.IDBusinessCharacterization); setShowDelete(true); }}
                                                        >
                                                            <BsTrashFill />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    : <h2 className="mt-5 mb-5">No hay caracterizaciones asignadas</h2>
                            }
                        </Col>
                        <Col sm={9} className="d-flex justify-content-end mt-3">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    color="secondary"
                                    variant="contained"
                                    endIcon={<BsFileEarmarkPersonFill />}
                                    onClick={() => {
                                        console.log(selectedCharats);
                                        handleAdd();
                                    }}
                                >
                                    AGREGAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={3} className="mt-3 ml-n2">
                            <ThemeProvider theme={inputsTheme}>
                                <Button
                                    className="w-100"
                                    color="success"
                                    variant="contained"
                                    onClick={() => {
                                        props.setShow(false);
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                    </Row >
                </Modal.Body >
            </Modal >
            {showDelete &&
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title="¿Está seguro de eliminar el elemento?"
                />}
        </>
    )
}
