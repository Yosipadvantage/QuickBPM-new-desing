import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Autocomplete, IconButton, TextField, Tooltip } from '@mui/material';
import { ThemeProvider } from '@mui/private-theming';
import React, { useEffect, useState } from 'react'
import {  Row, Col } from "react-bootstrap";
import { ConfigService } from '../../../core/services/ConfigService';
import { pipeSort } from '../../../utils/pipeSort';
import { Toast } from '../../../utils/Toastify';
import { Office } from '../../configuration/model/Office';
import { IAgendaSeccional } from '../model/AgendaSeccional';
import { inputsTheme } from '../../../utils/Themes';
import { BiSpreadsheet } from 'react-icons/bi'
import { SSpinner } from '../../../shared/components/SSpinner';
import { formatDate } from '../../../utils/formatDate';

interface INEMeet {
    IDProcedureIMP: number | undefined;
    IDAgenda: number | undefined;
    type: number;
    IDAction?: number
    setShow?: Function;
}

const _configService = new ConfigService();

export const NEMeet: React.FC<INEMeet> = (props: INEMeet) => {

    const [officeSelected, setofficeSelected] = useState(-1);
    const [showSpinner, setShowSpinner] = useState(false);
    const [busy, setBusy] = useState<any[]>([]);
    const [listAgenda, setListAgenda] = useState<any[]>([]);
    const [listOffice, setListOffice] = useState<any[]>([]);
    const [seccional, setSeccional] = useState("");
    const [fecha, setFecha] = useState("");
    const [dateInit, setDateInit] = useState<Date | null>(null);
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        console.log(props.IDAgenda);
        getListOffice();
    }, [])

    useEffect(() => {
        getListAgenda(fecha);
    }, [officeSelected]);

    const getListAgenda = (fecha: string) => {
        setShowSpinner(true);
        let aux: number[] = [];
        _configService.getAgendaSeccional(officeSelected, fecha).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                resp.map((item: IAgendaSeccional) => {
                    aux.push(item.Hora)
                })
                setBusy(aux);
                setListAgenda(resp);
            }
            else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }
    const getListOffice = () => {
        setShowSpinner(true);
        let aux: any = [];
        let auxSorted: any = [];
        _configService.getOfficeCatalog(null).subscribe((resp) => {
            setShowSpinner(false);
            if (resp) {
                resp.map((item: Office) =>
                    aux.push({
                        label: item.Name,
                        id: item.IDOffice,
                    }));
                auxSorted = pipeSort([...aux], "label");
                setListOffice(auxSorted);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha cargado la información",
                });
            }
        })
    }


    const recortarFecha = (fecha: Date) => {
        const fecha2 = fecha.toString();
        return fecha2.slice(0, 10);
    }

    const seleccionar = (bean: IAgendaSeccional) => {
        setShowSpinner(true);
        _configService.asignarCita(bean.IDAgendaSeccional, { "IDProcedureImp": props.IDProcedureIMP, "Observacion": "", "IDAction": props.IDAction }).subscribe(
            (resp: any) => {
                setShowSpinner(false);
                if (resp.DataBeanProperties.ObjectValue) {
                    getListAgenda(fecha);
                    Toast.fire({
                        icon: "success",
                        title: resp.DataBeanProperties.ObjectValue.message,
                    });
                }
            })
    };

    const reProgramar = (idAgendaSeccional: number) => {
        setShowSpinner(true);
        if (props.IDAgenda) {
            _configService.reprogramarCita(props.IDAgenda, idAgendaSeccional)
                .subscribe(
                    (resp: any) => {
                        setShowSpinner(false);
                        if (resp.DataBeanProperties.ObjectValue) {
                            getListAgenda(fecha);
                            props.setShow !== undefined && props.setShow();
                            Toast.fire({
                                icon: "success",
                                title: resp.DataBeanProperties.ObjectValue.message,
                            });
                        }
                    })
        } else {
            setShowSpinner(false);
            Toast.fire({
                icon: "error",
                title: 'IDAgenda NULL',
            });
        }
    };


    return (
        <>
            {showSpinner && <SSpinner show={showSpinner} />}
            <div className="card w-100 p-2 mb-3 box-s">
                <Row className="mb-1 d-flex">
                    <Col sm={12} className=" d-flex justify-content-center mt-3 mb-3">
                        <Autocomplete
                            onChange={(e: any, value: any) => { setofficeSelected(value ? value.id : 0); setSeccional(value ? value.label : ''); }}
                            fullWidth
                            size="small"
                            disablePortal
                            id="seccionales"
                            options={listOffice}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    key={params.id}
                                    label="Seleccione una secccional"
                                    fullWidth
                                    color="secondary"
                                />
                            )}
                        />
                    </Col>
                    {officeSelected !== -1 &&
                        <Col sm={12} className="mt-3 mb-3">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    disablePast
                                    label="Seleccione una fecha "
                                    value={dateInit}
                                    onChange={(e) => {
                                        setDateInit(e);
                                        setFecha(formatDate(e));
                                        getListAgenda(formatDate(e));
                                        setBtn(true);
                                    }}
                                    renderInput={(props) => <TextField size="small" fullWidth color="secondary" {...props} />}
                                />
                            </LocalizationProvider>
                        </Col>}
                </Row>
                {listAgenda.length > 0
                    ? listAgenda.map((item: IAgendaSeccional) => (
                        <Row className='w-100 card p-2 m-1 flex-wrap flex-row p-3 cgt-list'>
                            <Col sm={10} className='p-0'>
                                <div className='d-flex flex-wrap flex-row'>
                                    <div className='m-2'>
                                        <small>Fecha : </small>
                                        {recortarFecha(item.FechaDia)}
                                    </div>
                                    <div className='m-2'>
                                        <small>Número de citas disponibles en esta franja: </small>
                                        {item.Cantidad}
                                    </div>
                                    <div className='m-2'>
                                        <small>Franja: </small>
                                        {item.Hora}:00 hrs - {item.Hora + 1}:00 hrs
                                    </div>
                                </div>
                            </Col>
                            {props.type === 1 &&
                                <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Re-programar Cita">
                                            <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => reProgramar(item.IDAgendaSeccional)}>
                                                <BiSpreadsheet />
                                            </IconButton>
                                        </Tooltip>
                                    </ThemeProvider>
                                </Col>}
                            {props.type === 0 &&
                                <Col sm={2} className='d-flex flex-wrap flex-row align-items-center'>
                                    <ThemeProvider theme={inputsTheme}>
                                        <Tooltip title="Agendar Cita">
                                            <IconButton className="box-s" aria-label="ver" color="secondary" onClick={() => seleccionar(item)}>
                                                <BiSpreadsheet />
                                            </IconButton>
                                        </Tooltip>
                                    </ThemeProvider>
                                </Col>}
                        </Row>
                    ))
                    : (seccional !== '' && dateInit !== null) ? <h2 className="m-3 text-center">No hay citas disponibles para esta fecha</h2> : ""
                }
            </div>
        </>

    )

}
