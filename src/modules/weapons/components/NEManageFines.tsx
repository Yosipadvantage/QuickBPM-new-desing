import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Button, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getSession } from "../../../utils/UseProps";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";


const _configService = new ConfigService();


interface INECustomerType {
    setShow: Function,
    show: boolean,
    multa: any
    refresh: Function
    dataFiltro: any
}

export const NEManageFines: React.FC<INECustomerType> = (props: INECustomerType) => {

    const [value, setValues] = useState({ nombre1: "", nombre2: "", fecha_v: "", valor_multa: "", dias_mora: 0 });
    const [spinner, setSpinner] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        liquidarMulta();
        console.log(getSession().IDAccount)
    }, []);

    const liquidarMulta = () => {
        setSpinner(true);
        _configService.liquidarMulta(props.multa.IDMULTA)
            .subscribe((res) => {
                setSpinner(false);
                console.log(res);
                if (res.length > 0) {
                    setValues({ nombre1: props.multa.SURNAME1, nombre2: props.multa.SURNAME2, fecha_v: res[0].FechaVencimiento, valor_multa: res[0].ValorMulta, dias_mora: res[0].DiasMora })
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'ERROR INTERNO DEL SERVIDOR'
                    })
                }
            })
    }

    const deleteElement = (data: boolean) => {
        if (data) {
            pagarMulta(props.multa.IDMULTA)
        }
    }

    const pagarMulta = (IDMulta: number) => {
        setSpinner(true);
        const DATA = {
            "Valor": value.valor_multa,
            "IDFuncionario": getSession().IDAccount,
            "NumeroPago": "53533"
        }
        _configService.pagarMulta(IDMulta, DATA).subscribe((res) => {
            setSpinner(false);
            if (res) {
                console.log("RESPUESTA DEL SERVIDOR", res)
                props.refresh(props.dataFiltro.state, props.dataFiltro.fechaInicial, props.dataFiltro.fechaFinal)
                props.setShow(false);
                Toast.fire({
                    icon: "success",
                    title: "Se realizo el pago de la multa!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha podido completar la acción",
                });

            }
        })
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    return (
        <>
            <Modal show={props.show}   centered  onHide={() => props.setShow(false)}>
                <Modal.Header>
                    Liquidar Multa
                    <BsXSquare className='pointer' onClick={() => props.setShow(false)} />
                </Modal.Header>
                <form onSubmit={(e) => { onSubmit(e) }}>
                    <Modal.Body>
                        <Row>

                            <Col sm={12} className="mt-3">
                                <h3>Nombre:  {value.nombre1} {value.nombre2}</h3>
                            </Col>


                            <Col sm={12} className="mt-3">
                                <h3>Valor de Multa:  {value.valor_multa}</h3>
                            </Col>

                            <Col sm={12} className="mt-3">
                                <h3>Dias Mora:  {value.dias_mora}</h3>
                            </Col>


                            <Col sm={12} className="mt-3">
                                <h3>Fecha de Vencimineto:  {value.fecha_v}</h3>
                            </Col>



                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Footer>
                            <div className="modal-element">
                                <Button variant="contained" color="error" onClick={() => props.setShow(false)}>CANCELAR</Button>
                            </div>
                            <div className="modal-element">
                                <Button type="submit" variant="contained" color="success">Pagar</Button>
                            </div>
                        </Modal.Footer>
                    </Modal.Footer>
                </form>
            </Modal>
            {spinner && <SSpinner show={spinner} />}
            {showConfirm &&
                <GenericConfirmAction
                    show={showConfirm}
                    setShow={setShowConfirm}
                    confirmAction={deleteElement}
                    title="¿Está seguro de eliminar el elemento?"
                />
            }
        </>
    )
}