import { Button, Checkbox, Dialog, DialogProps, DialogTitle, FormControlLabel, MenuItem, TextareaAutosize, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';

import { inputsTheme, useStyles } from '../../../utils/Themes';
import { AdminService } from "../../../core/services/AdminService";
import { IResponseValue } from '../model/ResponseValue';
import { Toast } from "../../../utils/Toastify";
import { useForm } from "react-hook-form";
import { BsPlus, BsXSquare } from 'react-icons/bs';

interface JsonPrototype {
    showDialog: boolean
    setShowDialog: Function
    responseJsonSelected: string
    setResponseJsonSelected: Function
    IDForm: number | null
    IDJsonService: number | null
}

const _adminService = new AdminService();

export const JsonPrototypeDialog: React.FC<JsonPrototype> = (props: JsonPrototype) => {
    console.log(props.responseJsonSelected);
    console.log(JSON.parse(props.responseJsonSelected));
    const [sizeDialog, setSizeDialog] = useState<"lg" | "sm" | "xl">('lg');
    const [sizeTextArea, setSizeTextArea] = useState('100');
    const [listVariablesResp, setlistVariablesResp] = useState<any[]>([])
    const [copiaJson, setCopiaJson] = useState<any>();
    const [subCopia, setSubCopia] = useState<any>();
    const [id, setId] = useState<any>();
    const [auxData, setAuxData] = useState<any>({});

    useEffect(() => {
        setSubCopia(JSON.parse(props.responseJsonSelected));
        setCopiaJson(JSON.stringify(JSON.parse(props.responseJsonSelected), undefined, 2));
        props.IDForm ? setId(props.IDForm) : setId(props.IDJsonService);
    }, []);

    useEffect(() => {
        if (copiaJson) {
            handlePreview();
        }
    }, [auxData]);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
        getValues,
    } = useForm();

    const getResponseValueForForm = (idForm: number) => {
        _adminService.getResponseValueForForm(idForm).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setlistVariablesResp(resp);

            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    }

    const getResponseValueForJsonService = (idJsonService: number) => {
        _adminService.getResponseValueForJson(idJsonService).subscribe((resp) => {
            console.log(resp);
            if (resp) {
                setlistVariablesResp(resp);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        });
    }

    const copyClipboard = () => {
        let content = document.getElementById("2d6ef242")?.innerHTML;
        console.log(content);
        if (content) {
            navigator.clipboard.writeText(content).then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Texto Copiado!"
                })
            })
                .catch(() => {
                    Toast.fire({
                        icon: "error",
                        title: "Error al copiar el texto"
                    })
                })
        }
    }

    const handleType = (id: number) => {
        if (props.IDForm) {
            getResponseValueForForm(id);
        }
        else {
            getResponseValueForJsonService(id);
        }
    }

    const enviar = (data: any, e: any) => {
        e.preventDefault();
        if (props.IDForm != null) {
            data.IDForm = props.IDForm;
        } else {
            data.IDJsonService = props.IDJsonService;
        }
        subCopia.ArgumentList[3] = data;
        subCopia.ArgumentList[4] = true;
        console.log(data);
        _adminService.responseValue_responseProcedureAction(JSON.stringify(subCopia)).subscribe((resp: any) => {
            if (resp.DataBeanProperties.ObjectValue) {
                if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.IsValidAnswer) {
                    Toast.fire({
                        icon: "success",
                        title: resp.DataBeanProperties.ObjectValue.DataBeanProperties.TestResult,
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: resp.DataBeanProperties.ObjectValue.DataBeanProperties.TestResult,
                    });
                }
            }
        })
    }

    const handleChangeFormValue = (valueName: string, value: any) => {
        setAuxData({ ...auxData, [valueName]: value })
    }

    const handlePreview = () => {
        const auxJson = JSON.parse(copiaJson);
        console.log(auxJson);
        auxJson.ArgumentList[3] = auxData;
        console.log(auxJson);
        setCopiaJson(JSON.stringify(auxJson, undefined, 2));
    }

    const classes = useStyles();

    return (
        <>
            <Modal size={sizeDialog} show={props.showDialog}  centered onHide={()=>{props.setShowDialog(false)}} >
                <Modal.Header>
                    Prototipo Json
                    <BsXSquare  className='pointer' onClick={() => { props.setShowDialog(false); props.setResponseJsonSelected("") }} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Button className="ml-3" variant="contained" color="primary" onClick={copyClipboard}>
                                COPIAR JSON
                            </Button>
                        </Col>
                        <Col sm={6} className="d-flex justify-content-end">
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="mr-3" variant="contained" color="secondary" onClick={() => (
                                    handleType(id), setSizeDialog('xl'), setSizeTextArea('50'))}>INICIAR TESTEO</Button>
                            </ThemeProvider>
                        </Col>
                    </Row>
                    <div className="w-100 d-flex">
                        <ThemeProvider theme={inputsTheme}>
                            <TextareaAutosize
                                className={`w-${sizeTextArea} m-3 p-2`}
                                color="secondary"
                                id="2d6ef242"
                                placeholder=""
                                style={{ maxHeight: 500 }}
                                value={copiaJson}
                            ></TextareaAutosize>
                        </ThemeProvider>
                        {listVariablesResp.length > 0 &&
                            <Row className='d-flex flex-column w-50 m-0 p-3'>
                                <form onSubmit={handleSubmit(enviar)}>
                                    <h5>Llene los campos</h5> {
                                        listVariablesResp.map((item: any) => (
                                            item.LimitedWithValues === true ?
                                                <div className="w-100 m-1">
                                                    <TextField
                                                        className="mt-3"
                                                        size="small"
                                                        select
                                                        fullWidth
                                                        color="secondary"
                                                        label={item.Name}
                                                        {...register(`${item.Name}`)}
                                                        onChange={(e) => { handleChangeFormValue(item.Name, e.target.value); handlePreview() }}
                                                    >
                                                        {JSON.parse(item.LimitedValues).map((item: any) => (
                                                            <MenuItem value={item}>
                                                                {item}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </div>
                                                :
                                                (item.ResponseClass === "Number") ?
                                                    <div className="w-100 m-1">
                                                        <TextField
                                                            type="number"
                                                            className="mt-3"
                                                            size="small"
                                                            fullWidth
                                                            color="secondary"
                                                            label={item.Name}
                                                            {...register(`${item.Name}`)}
                                                            onChange={(e) => { handleChangeFormValue(item.Name, e.target.value); handlePreview() }}
                                                        >
                                                        </TextField>
                                                    </div>
                                                    :
                                                    (item.ResponseClass === "Boolean") ?
                                                        <div className="w-100 m-1">
                                                            <TextField
                                                                className="mt-3"
                                                                size="small"
                                                                select
                                                                fullWidth
                                                                color="secondary"
                                                                label={item.Name}
                                                                {...register(`${item.Name}`)}
                                                                onChange={(e) => { handleChangeFormValue(item.Name, e.target.value); handlePreview() }}
                                                            >
                                                                <MenuItem value="true">
                                                                    true
                                                                </MenuItem>
                                                                <MenuItem value="false">
                                                                    false
                                                                </MenuItem>
                                                            </TextField>
                                                        </div>
                                                        : (item.ResponseClass === "String") ?
                                                            <div className="w-100 m-1" >
                                                                <TextField
                                                                    type="text"
                                                                    className="mt-3"
                                                                    size="small"
                                                                    fullWidth
                                                                    color="secondary"
                                                                    label={item.Name}
                                                                    {...register(`${item.Name}`)}
                                                                    onChange={(e) => { handleChangeFormValue(item.Name, e.target.value); handlePreview() }}
                                                                >
                                                                </TextField>
                                                            </div>
                                                            :
                                                            <div className="w-100 m-1">
                                                                <Row>
                                                                    <Col sm={4}>
                                                                        <TextField
                                                                            type="number"
                                                                            placeholder="YYYY"
                                                                            className="mt-3"
                                                                            size="small"
                                                                            fullWidth
                                                                            color="secondary"
                                                                            label={item.Name}
                                                                            inputProps={{ maxLength: 4 }}
                                                                            {...register(`${item.Name}`)}
                                                                            onChange={(e) => handleChangeFormValue(item.Name, e.target.value)}
                                                                        >
                                                                        </TextField>
                                                                    </Col>
                                                                    -
                                                                    <Col sm={4}>
                                                                        <TextField
                                                                            type="number"
                                                                            placeholder="MM"
                                                                            className="mt-3"
                                                                            size="small"
                                                                            fullWidth
                                                                            color="secondary"
                                                                            label={item.Name}
                                                                            inputProps={{ maxLength: 2 }}
                                                                            {...register(`${item.Name}`)}
                                                                            onChange={(e) => handleChangeFormValue(item.Name, e.target.value)}
                                                                        >
                                                                        </TextField>
                                                                    </Col>
                                                                    -
                                                                    <Col sm={4}>
                                                                        <TextField
                                                                            type="number"
                                                                            placeholder="DD"
                                                                            className="mt-3"
                                                                            size="small"
                                                                            fullWidth
                                                                            color="secondary"
                                                                            label={item.Name}
                                                                            inputProps={{ maxLength: 2 }}
                                                                            {...register(`${item.Name}`)}
                                                                            onChange={(e) => handleChangeFormValue(item.Name, e.target.value)}
                                                                        >
                                                                        </TextField>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                        ))
                                    }
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button
                                            className='mt-3'
                                            variant="contained"
                                            color="secondary"
                                            type='submit'
                                        >
                                            PROBAR
                                        </Button>
                                    </ThemeProvider>
                                </form>
                            </Row>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="modal-element">
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="error"
                            onClick={() => { props.setShowDialog(false); props.setResponseJsonSelected("") }}
                        >
                            CERRAR
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>            
        </>
    )
}
