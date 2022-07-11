import { MenuItem, TextField, ThemeProvider, Button, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsFileEarmarkPersonFill, BsTrashFill, BsXSquare } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';


import { ConfigService } from '../../../core/services/ConfigService';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';
import { IBusinessCharacterization } from '../model/BusinessCharacterization';
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { IDocumentCharacterization } from '../model/DocumentCharacterization';


const _configService = new ConfigService();

interface DChracterization {
    name: string;
    show: boolean;
    setShow: Function;
    dataTitle: string;
    idDocument: number;
    idProcedure: number;
    // type: number;
    listCharacterization: IBusinessCharacterization[];
    refresh: Function;
}

export const TDocumentCharacterization: React.FC<DChracterization> = (props: DChracterization) => {

    const [charChecks, setCharChecks] = useState<IDocumentCharacterization[]>([]);
    const [auxSelected, setAuxSelected] = useState<number[]>([]);
    const [btn, setBtn] = useState(false);
    const [idDelete, setIdDelete] = useState(0);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        console.log(props.idProcedure);

        getDocumentCharacterizationCatalog(props.idDocument);
    }, [])


    const getDocumentCharacterizationCatalog = (id: number) => {
        _configService
            .getDocumentCharacterizationCatalog(id)
            .subscribe(res => {
                if (res) {
                    console.log(id);
                    console.log(res);
                    setCharChecks(res);
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "No se ha cargado la información",
                    });
                }
            })
    }

    const addDocumentCharacterization = (id: number) => {
        _configService.addDocumentCharacterization(props.idDocument, id).subscribe((
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
                getDocumentCharacterizationCatalog(props.idDocument);
            }
        ))
    }

    const closeModal = () => {
        // props.refresh(props.idDocument, props.type)
        props.refresh(props.idDocument)

        props.setShow(false);
    }

    const handleChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setAuxSelected(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteDocumentCharacterization(idDelete);
        }
        if (charChecks.length === 0) {
            setAuxSelected([]);
        }
    };

    const deleteDocumentCharacterization = async (id: number) => {
        await _configService
            .deleteDocumentCharacterization(id)
            .subscribe((resp: any) => {
                if (resp) {
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
            })
        getDocumentCharacterizationCatalog(props.idDocument);
    };

    const handleAdd = () => {
        auxSelected.map((item) => {
            addDocumentCharacterization(item);
        })
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
                    Asignar Caracterizaciones a Documento
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
                                        value: auxSelected,
                                    }}
                                    onChange={handleChange}
                                >
                                    {props.listCharacterization.map((item: any) => (
                                        <MenuItem key={item.IDCharacterization} value={item.IDCharacterization}>
                                            {item.CharacterizationName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Col>}
                        <Col sm={12} className="d-flex justify-content-center mt-3 mb-3">
                            {charChecks.length > 0
                                ? <div className="overflow-auto d-flex justify-content-center flex-column">
                                    {charChecks.map((item: any) => (
                                        <div className="cgt-char card m-2 d-flex flex-row">
                                            <div className="mt-2 mr-5">
                                                <b className="ml-2 p-2 d-flex justify-content">{item.CharacterizationName}</b>
                                            </div>
                                            <div className="col sm-3 d-flex justify-content-end">
                                                <Tooltip title="Quitar" placement="right">
                                                    <IconButton
                                                        onClick={() => {
                                                            setIdDelete(item.IDDocumentCharacterization);
                                                            setShowDelete(true);
                                                        }}
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
                                        handleAdd();
                                        // props.refresh(props.idDocument, props.type)
                                        props.refresh(props.idProcedure)

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
