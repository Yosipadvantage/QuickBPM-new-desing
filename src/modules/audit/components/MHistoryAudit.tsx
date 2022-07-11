import { Button, IconButton, TextField, ThemeProvider, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BsPaperclip, BsSymmetryHorizontal, BsXSquare } from 'react-icons/bs'
import { FileService } from '../../../core/services/FileService'
import { WeaponsService } from '../../../core/services/WeaponsService'
import { SLoadDocument } from '../../../shared/components/SLoadDocument'
import { SSpinner } from '../../../shared/components/SSpinner'
import { GenericConfirmAction } from '../../../utils/GenericConfirmAction'
import { pipeSort } from '../../../utils/pipeSort'
import { inputsTheme } from '../../../utils/Themes'
import { Toast } from '../../../utils/Toastify'
import { getSession } from '../../../utils/UseProps'

interface IHistoryAudit {
    show: boolean,
    setShow: Function
    idAuditoria: number
}

const _weaponService = new WeaponsService();
const _fileService = new FileService();

export const MHistoryAudit: React.FC<IHistoryAudit> = (props: IHistoryAudit) => {

    const [spinner, setSpinner] = useState(false);
    const [listHistoric, setListHistoric] = useState<any[]>([]);
    const [comentario, setComentario] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [loadDoc, setLoadDoc] = useState(false);
    const [idLogueado, setIdLogueado] = useState(-1);
    const [bean, setBean] = useState<any>();
    const [doc, setDoc] = useState<any>({ Media: '', MediaContext: '' });

    useEffect(() => {
        setIdLogueado(getSession().IDAccount);
        getAuditoriaHistoricoRender();
    }, [])

    const getAuditoriaHistoricoRender = () => {
        let aux: any[] = [];
        setSpinner(true);
        _weaponService.getAuditoriaHistoricoRender(props.idAuditoria)
            .subscribe((resp) => {
                setSpinner(false);
                console.log(resp);
                if (resp) {
                    if (resp.length > 0) {
                        resp.sort((a: any, b: any) => a.DataBeanProperties.IDAuditoriaHistorico - b.DataBeanProperties.IDAuditoriaHistorico);
                        resp.forEach((element: any) => {
                            if (element.DataBeanProperties.Evidencia !== null) {
                                element.DataBeanProperties.File = JSON.parse(element.DataBeanProperties.Evidencia);
                            } else {
                                element.DataBeanProperties.File = doc;
                            }
                        });
                        aux = pipeSort([...resp], 'DataBeanProperties.IDAuditoriaHistorico')
                        setListHistoric(aux);
                    } else {
                        setListHistoric([]);
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'ERROR INTERNO DEL SERVIDOR'
                    })
                }
            })
    }

    const updateAuditoriaHistoricoRender = (bean: any) => {
        setSpinner(true);
        _weaponService.updateAuditoriaHistoricoRender(bean)
            .subscribe((resp) => {
                setSpinner(false);
                console.log(resp);
                if (resp) {
                    setComentario('');
                    setDoc({ Media: '', MediaContext: '' });
                    getAuditoriaHistoricoRender();
                    Toast.fire({
                        icon: 'success',
                        title: 'Comentario añadido a la secuencia'
                    })
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'ERROR INTERNO DEL SERVIDOR'
                    })
                }
            })
    }

    const onSend = () => {
        if (comentario.length > 0) {
            setBean({
                Mensaje: comentario,
                Evidencia: JSON.stringify({ Media: doc.Media, MediaContext: doc.MediaContext }),
                IDAuditoria: props.idAuditoria,
                IDAccount: idLogueado,
                Estado: 1
            });
            setConfirm(true);
        } else {
            Toast.fire({
                icon: 'warning',
                title: 'Debe añadir un comentario'
            })
        }
    }

    const sendMessage = (data: boolean) => {
        if (data) {
            updateAuditoriaHistoricoRender(bean);
        }
    };

    const getMedia = (doc: any) => {
        console.log(doc);
        setDoc(doc);
    };

    return (
        <>
            <Modal show={props.show}  centered size="xl">
                <Modal.Header>
                    COMENTARIOS AUDITORÍA
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Row className="m-3 card p-3">
                            <Col sm={12} className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    <ThemeProvider theme={inputsTheme}>
                                        <Button variant="contained" color="secondary"
                                            onClick={() => { setLoadDoc(true) }}
                                        >
                                            <BsPaperclip />
                                            ADJUNTAR EVIDENCIA
                                        </Button>
                                    </ThemeProvider>
                                    {doc !== undefined && <small className=' ml-3 d-flex align-items-center '><a href={_fileService.getUrlFile(doc.MediaContext, doc.Media)}>{doc.Name}</a></small>}
                                </div>
                                <ThemeProvider theme={inputsTheme}>
                                    <Tooltip title='Enviar'>
                                        <IconButton color="secondary" onClick={() => { onSend() }}>
                                            <BsSymmetryHorizontal />
                                        </IconButton>
                                    </Tooltip>
                                </ThemeProvider>
                            </Col>
                            <Col sm={12} className="mt-3 mb-3">
                                <TextField
                                    value={comentario}
                                    color="secondary"
                                    id="Entrada"
                                    label="Nuevo comentario"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    onChange={(e) => setComentario(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="m-3 card p-3 mh-70 overflow-auto">
                            {(listHistoric.length === 0)
                                ?
                                <Col sm={12} className="mt-3 d-flex justify-content-center">
                                    <h1>Aún no hay comentarios para este caso</h1>
                                </Col>
                                :
                                <Col sm={12} className="container">

                                    {listHistoric.map((item: any) => (
                                        <Row className={item.DataBeanProperties.IDAccount === idLogueado ? "mt-3 d-flex justify-content-end" : "mt-3 d-flex justify-content-start"}>
                                            <Col sm={8}>
                                                <div className={item.DataBeanProperties.IDAccount === idLogueado ? "p-3 card back-my-message" : "p-3 card"}>
                                                    <div className={item.DataBeanProperties.IDAccount === idLogueado ? "text-right" : ''}>
                                                        {item.DataBeanProperties.File.MediaContext !== '' &&
                                                            <div>
                                                                <small> <b>Adjunto:</b> </small> <a href={_fileService.getUrlFile(item.DataBeanProperties.File.MediaContext, item.DataBeanProperties.File.Media)}>Descargar Evidencia</a>
                                                            </div>
                                                        }
                                                    </div>
                                                    <small> <b>Comentario:</b> </small> <small className="text-justify">{item.DataBeanProperties.Mensaje}</small>
                                                    <div className={item.DataBeanProperties.IDAccount === idLogueado ? "mt-3 text-right" : 'mt-3'}>
                                                        <small> <b>{item.DataBeanProperties.NombreAccount}</b> </small>, <small>{item.DataBeanProperties.Since}</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                                    }
                                </Col>
                            }
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
            {spinner && <SSpinner show={spinner} />}
            {confirm &&
                <GenericConfirmAction
                    show={confirm}
                    setShow={setConfirm}
                    confirmAction={sendMessage}
                    title='¿Enviar comentario?'
                />
            }
            {loadDoc &&
                <SLoadDocument setShow={setLoadDoc} type={1} show={loadDoc} title={'Cargar Evidencia'} getMedia={getMedia} beanAction={null} />
            }
        </>
    )
}
