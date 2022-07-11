import { Button, Dialog, DialogTitle, MenuItem, TextField, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import { BsArrowDownCircleFill, BsFillFileEarmarkZipFill, BsXSquare } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { getBioReader } from '../../../actions/Auth';
import { RootState } from '../../../store/Store';
import { inputsTheme } from '../../../utils/Themes';
import { Toast } from '../../../utils/Toastify';

interface IReaderTypeDialog {
    show: boolean;
    setShow: Function;
}

export const ReaderTypeDialog: React.FC<IReaderTypeDialog> = (props: IReaderTypeDialog) => {

    const dispatch = useDispatch();
    const { readerType } = useSelector((state: RootState) => state.auth);

    const [reader, setReader] = useState(readerType);
    const [other, setOther] = useState('');

    const onChangeComponent = (value: string) => {
        setReader(value);
    }

    const onSave = () => {
        if (reader !== 'other') {
            localStorage.setItem('readerType', reader);
            dispatch(getBioReader(reader));
            props.setShow(false);
            Toast.fire({
                icon: 'success',
                title: 'Se ha guardado con éxito'
            })
        }
        else {
            localStorage.setItem('readerType', other);
            dispatch(getBioReader(other));
            props.setShow(false);
            Toast.fire({
                icon: 'success',
                title: 'Se ha guardado con éxito'
            })
        }
    }

    return (
        <>
            <Modal show={props.show} centered onHide={()=>props.setShow(false)} >
                <Modal.Header>
                    Configuración toma de datos Biométricos
                    <BsXSquare  className='pointer' onClick={() => {
                        props.setShow(false);
                    }} />
                </Modal.Header>
                <Modal.Body>
                    <Row className="container">
                        <Col sm={12}>
                            <TextField
                                className="mt-3"
                                value={reader}
                                margin="normal"
                                size="small"
                                select
                                fullWidth
                                color="secondary"
                                label=".:Seleccione un tipo:."
                                id="state"
                                onChange={(e) =>
                                    onChangeComponent(e.target.value)
                                }
                            >

                                <MenuItem value={'zkteco'}>
                                    ZKTECO
                                </MenuItem>
                                <MenuItem value={'reader'}>
                                    READER
                                </MenuItem>
                                <MenuItem value={'other'}>
                                    OTRO
                                </MenuItem>

                            </TextField>
                        </Col>
                        {reader === 'other' &&
                            <Col sm={12}>
                                <TextField
                                    value={other}
                                    className="mt-2"
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                    color="secondary"
                                    label="Nombre estático del lector"
                                    id="state"
                                    onChange={(e) =>
                                        setOther(e.target.value)
                                    }
                                ></TextField>
                            </Col>
                        }
                        <Col sm={12}>
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="w-100 mt-2 mb-5" variant="contained" color="success" onClick={() => onSave()}>
                                    GUARDAR
                                </Button>
                            </ThemeProvider>
                        </Col>
                        <Col sm={12} className="border-top">
                            <ThemeProvider theme={inputsTheme}>
                                <Button className="w-100 mt-3" variant="contained" color="secondary"
                                    href={process.env.PUBLIC_URL + "/assets/dccae_biodata.7z"}
                                >
                                    <BsArrowDownCircleFill className="mr-3" />
                                    Descargar instalador
                                    <BsFillFileEarmarkZipFill className="ml-3" />
                                </Button>
                            </ThemeProvider>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}
