import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import { ButtonGroup, IconButton, Stepper, ThemeProvider, Tooltip } from "@mui/material";
import { SuscriptionService } from '../../../core/services/SuscriptionService'
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { SLoadDocument } from '../../../shared/components/SLoadDocument';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Toast } from '../../../utils/Toastify';
import { FaEye, FaFileUpload, FaUpload, FaWpforms } from 'react-icons/fa';
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { Col, Row } from 'react-bootstrap';
import { BsLayoutWtf, BsListTask } from 'react-icons/bs';
import SLoadForm from '../../../shared/components/SLoadForm';
import { SSpinner } from '../../../shared/components/SSpinner';
import { getSession } from '../../../utils/UseProps';


const _suscripcionService = new SuscriptionService();
interface ITrayMyProcedures { }
export const TTrayMyProcedures: React.FC<ITrayMyProcedures> = () => {

    const [listProcedureImp, setListProcedureImp] = useState([]);
    const [beanProcedureImp, setBeanProcedure] = useState<any>();
    const [listDocuments, setDocuments] = useState([]);
    const [titleDoc, setTitleDoc] = useState('');
    const [beanAction, setBeanAct] = useState<any>();
    const steps = ['Selección del trámite', 'Carga de Documentación'];
    const estadoDoc = ["Pendiente por subir", "En verificacion", "Devuelto", "verificado"];
    const [activeStep, setActiveStep] = React.useState(0);
    const [viewMode, setViewMode] = useState(true)
    const [showM, setShowM] = useState(false);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const handleViewMode = (type: number) => {
        (type === 0) ? setViewMode(true) : setViewMode(false);
    }
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    useEffect(() => {
        listarMisProcedimientos();
    }, []);
    const llamarUsuario = () => {
        if (getSession()) {
            return `${getSession().Name1} ${getSession().Surname1} - ${getSession().Nit} `;
        } else {
            return '';
        }
    }
    const totalSteps = () => {
        return steps.length;
    };
    const openForm = (statusForm: boolean) => {
        setShowModalForm(statusForm);

        if (statusForm === false) {
            getProcedureActionByAccount(beanProcedureImp.IDProcedureImp, parseInt(getSession().IDAccount));
        }
    }
    const completedSteps = () => {
        return Object.keys(completed).length;
    };
    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };
    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };
    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ?
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const listarMisProcedimientos = async () => {
        setShowSpinner(true);
        await _suscripcionService.getProcedureImpForInput(parseInt(getSession().IDAccount)).then((resp: any) => {
            setShowSpinner(false);
            if (resp.data.DataBeanProperties.ObjectValue) {
                setListProcedureImp(resp.data.DataBeanProperties.ObjectValue);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'No se ha podido completar la accion',
                })
            }
        }).catch(e => console.error(e)
        )
    };

    const seleccionar = (bean: any) => {
        setBeanProcedure(bean);
        getProcedureActionByAccount(bean.IDProcedureImp, parseInt(getSession().IDAccount));
        handleComplete();
    };

    const openMedia = (titulo: string) => {
        setShowM(true);
        setTitleDoc(titulo);
    };

    const getProcedureActionByAccount = async (idProcedure: number, idAccount: number) => {
        await _suscripcionService.getProcedureActionByAccount(idAccount, idProcedure)
            .then((resp: any) => {
                console.log(resp);
                if (resp.data.DataBeanProperties.ObjectValue) {
                    setDocuments(resp.data.DataBeanProperties.ObjectValue);
                    if (resp.data.DataBeanProperties.ObjectValue.length === 0) {
                        handleComplete();
                    }
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se ha podido completar la accion',
                    })
                }
            }).catch((e) => {
                console.error(e);
            })
    };

    const closeSearchM = (data: any) => {
        setShowM(data);
        getProcedureActionByAccount(beanProcedureImp.IDProcedureImp, parseInt(getSession().IDAccount));
    };

    const getItemM = async (data: any) => {
        console.log(data);
        await _suscripcionService.
            responseProcedureAction2(
                beanAction.IDAction,
                null,
                null,
                {
                    "Media": data.Media,
                    "MediaContext": data.MediaContext
                },
                false
            )
            .then((resp: any) => {
                if (resp.data.DataBeanProperties.ObjectValue) {
                    getProcedureActionByAccount(beanProcedureImp.IDProcedureImp, parseInt(getSession().IDAccount));
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'No se ha podido completar la accion',
                    })
                }
            }).catch(e => console.error(e));
    };

    const renderSwitch = (param: number) => {
        switch (param) {
            case 0: return <div className="w-100 d-flex h-100 flex-wrap justify-content-xl-start justify-content-sm-center">
                {(listProcedureImp.length > 0) ?
                    <div>
                        <Col sm={3} className="mt-2 d-flex justify-content-start">
                            <ThemeProvider theme={inputsTheme}>
                                <ButtonGroup disableElevation variant="contained" style={{ height: 40 }}>
                                    <Tooltip title="Ver lista">
                                        <IconButton
                                            className="box-s"
                                            onClick={() => handleViewMode(0)}
                                            color="secondary"><BsListTask />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Ver mosaico">
                                        <IconButton
                                            className="box-s"
                                            onClick={() => handleViewMode(1)}
                                            color="secondary"><BsLayoutWtf />
                                        </IconButton>
                                    </Tooltip>
                                </ButtonGroup>
                            </ThemeProvider>
                        </Col>
                        <div className='w-100 mt-1'>
                            <div className='d-flex flex-row justify-content-start flex-wrap'>
                                {listProcedureImp.map((item: any, index: number) => (
                                    (!viewMode ?
                                        <div className="cgt card m-2 pt-3 pr-3 pl-3 " >
                                            <div>
                                                <div className='m-0 mb-1 row w-100 d-flex flex-row flex-wrap'>
                                                    <div className='m-0 w-75'>
                                                        <h2>{item.DataBeanProperties.Name}</h2>
                                                    </div>
                                                    <div className='m-0 w-25 d-flex flex-row justify-content-end align-items-start'>
                                                        <Tooltip title="Cargar Documentos">
                                                            <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => seleccionar(item.DataBeanProperties)}>
                                                                <FaEye />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div>
                                                    <small>Etapa: </small>
                                                    <p className='mb-1'>{item.DataBeanProperties.ProcedureName}</p>
                                                </div>
                                                <div>
                                                    <small>Inicio : </small>
                                                    <p className='mb-1'>{item.DataBeanProperties.Since}</p>
                                                </div>
                                                <div>
                                                    <small>Descripción:</small>
                                                    <p className='mb-1'>{item.DataBeanProperties.Description}</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                            <Col sm={10} className='p-0'>
                                                <h2>{item.DataBeanProperties.Name}</h2>
                                                <div className='d-flex flex-wrap flex-row'>
                                                    <div className='m-2'>
                                                        <small>Inicio : </small>
                                                        {item.DataBeanProperties.Since}
                                                    </div>
                                                    <div className='m-2'>
                                                        <small>Etapa: </small>
                                                        {item.DataBeanProperties.ProcedureName}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                                <Tooltip title="Cargar Documentos">
                                                    <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => seleccionar(item.DataBeanProperties)}>
                                                        <FaEye />
                                                    </IconButton>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                    : (
                        <div className="w-100 d-flex justify-content-center">
                            <h1 className="text-muted h-100">No hay trámites vigentes :(</h1>
                        </div>
                    )
                }
            </div >
            case 1: return <div>
                <Col sm={3} className="mt-2 d-flex justify-content-start">
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
                </Col>
                <div className="w-100 mt-1">
                    <div className='d-flex flex-row justify-content-start flex-wrap'>
                        {
                            listDocuments.map((item: any, index: number) => (
                                (!viewMode ?
                                    <div className='cgt card m-2 p-3 ' >
                                        <div>
                                            <div className='m-0 mb-1 row w-100 d-flex flex-row flex-wrap'>
                                                <div className='m-0 w-75'>
                                                    <h2>{item.DataBeanProperties.ProcedureActionName}</h2>
                                                </div>
                                                <div className='m-0 w-25 d-flex flex-row justify-content-end align-items-start'>
                                                    {item.DataBeanProperties.DocumentType == 2 &&
                                                        <Tooltip title="Cargar Documento">
                                                            <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => { openMedia(item.DataBeanProperties.Name); setBeanAct(item.DataBeanProperties) }}>
                                                                <FaFileUpload />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {item.DataBeanProperties.DocumentType == 6 &&
                                                        <Tooltip title="Cargar Formulario">
                                                            <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => {
                                                                openForm(true);
                                                                setTitleDoc(item.DataBeanProperties.Name);
                                                                openMedia(item.DataBeanProperties.Name); setBeanAct(item.DataBeanProperties)
                                                            }}>
                                                                <FaWpforms />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <small>Estado:</small>
                                                <p className='mb-1'>{estadoDoc[item.DataBeanProperties.State]}</p>
                                            </div>
                                            <div>
                                                <small>Acción:</small>
                                                <p className='mb-1'> {item.DataBeanProperties.DocumentTypeName}</p>
                                            </div>
                                            <div>
                                                <small>Descripción:</small>
                                                <p className='mb-1'> {item.DataBeanProperties.Description} </p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                                        <Col sm={10} className='p-0'>
                                            <h2>{item.DataBeanProperties.ProcedureActionName}</h2>
                                            <div className='d-flex flex-wrap flex-row'>
                                                <div className='m-2'>
                                                    <small>Estado: </small>
                                                    {estadoDoc[item.DataBeanProperties.State]}
                                                </div>
                                                <div className='m-2'>
                                                    <small>Acción: </small>
                                                    {item.DataBeanProperties.DocumentTypeName}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                            {item.DataBeanProperties.DocumentType == 2 &&
                                                <Tooltip title="Cargar Documento">
                                                    <IconButton className={classes.root} aria-label="ver" color="secondary" onClick={() => { openMedia(item.DataBeanProperties.Name); setBeanAct(item.DataBeanProperties) }}>
                                                        <FaFileUpload />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {item.DataBeanProperties.DocumentType == 6 &&
                                                <Tooltip title="Cargar Formulario">
                                                    <IconButton className={classes.root} aria-label="ver" color="secondary" onClick={() => {
                                                        openForm(true);
                                                        setTitleDoc(item.DataBeanProperties.Name);
                                                        setBeanAct(item.DataBeanProperties)
                                                    }}>
                                                        <FaWpforms />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </Col>
                                    </Row>)
                            ))}
                    </div>
                    {showM ? (<SLoadDocument setShow={closeSearchM} type={1} title={titleDoc} getMedia={getItemM} show={showM} beanAction={beanAction} />) : ('')}
                    {showModalForm && (<SLoadForm type={1} beanAction={beanAction} getShowForm={openForm} status={showModalForm} title={titleDoc} IDProcedureIMP={beanProcedureImp.IDProcedureImp} />
                    )}
                </div>
            </div>
            default: return <div>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h5 className="w-100 text-center">Muchas Gracias!, Ya quedo gestionado el proceso. Para seguir con otro proceso click <b onClick={() => { handleReset(); listarMisProcedimientos(); }}> <u> AQUI</u></b></h5>
            </div>;
        }
    }

    const classes = useStyles();
    return (
        <>
            <div className="nWhite p-3 m-3 w-100">
                <Box sx={{ width: '100%' }}>
                    <h2>Trámites para {llamarUsuario()}</h2>
                    <Stepper activeStep={activeStep} className={classes.root}
                    >
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]} disabled={completed[index]} >
                                <StepButton className="line-out" color="inherit" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div className="mt-3 d-flex justify-content-end">
                        {activeStep > 0 &&
                            <Button
                                startIcon={<MdKeyboardArrowLeft />}
                                disabled={activeStep === 0}
                                style={{ backgroundColor: '#553F73', color: '#FFFFFF' }}
                                onClick={() => handleBack()}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                        }
                    </div>
                </Box>
                <div>
                    {allStepsCompleted() ? (
                        <React.Fragment>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="mt-4 pt-4 "> <b> Paso actual</b>: {steps[activeStep]}</div>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                            </Box>
                        </React.Fragment>
                    )}
                </div>
                <Box sx={{ width: '100%' }}>
                    <div>
                        {renderSwitch(activeStep)}
                    </div>
                </Box>
            </div>
            {showSpinner &&
                <SSpinner show={showSpinner} />
            }
        </>
    )

}
