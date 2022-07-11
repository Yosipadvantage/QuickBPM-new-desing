import { BsTextRight, BsXSquare } from "react-icons/bs";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast } from "../../../utils/Toastify";
import { Button, InputAdornment, TextField } from "@mui/material";
import { CharacterizationK } from "../model/Characterization";
import { ICustomerType } from "../model/CustomerType";

const _configService = new ConfigService();


interface INECustomerType {
    getShow: Function,
    dataShow: boolean,
    dataObj: any,
    dataTitle: string,
}

export const NECustomerType: React.FC<INECustomerType> = (props: INECustomerType) => {


    const {
        register,
        formState: { errors },
        clearErrors,
        setValue,
        handleSubmit
    } = useForm();

    const updateCustomerType = (bean: ICustomerType) => {
        _configService.updateCustomerType(bean).subscribe((res) => {
            if (res) {
                props.getShow(false);
                clearErrors("entity");
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
        })
    }
    const getValue = (dataTitle: string) => {
        if (dataTitle === "Crear") {
            setValue("entity", {
                Name: "",
                Description: "",
                IDCustomerType: null,
            });
        } else if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
        }
    };
    getValue(props.dataTitle);
    const setShow = () => {
        clearErrors("entity");
        props.getShow(false);
    };
    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        data.entity.State = 0;
        updateCustomerType(data.entity);
    };

    return (
        <>
            <Modal show={props.dataShow}  centered onHide={setShow}>
                <Modal.Header>
                    {props.dataTitle} Tipo de Cliente
                    <BsXSquare  className='pointer' onClick={setShow} />
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    color="secondary"
                                    id="outlined-required"
                                    label="Nombre *"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <BsTextRight />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...register("entity.Name", { required: true })}
                                />
                                <span className="text-danger">
                                    {errors.entity
                                        ? errors.entity.Name?.type === "required" &&
                                        "El campo Nombre es obligatorio."
                                        : ""}
                                </span>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <TextField
                                    color="secondary"
                                    id="outlined-required"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    {...register("entity.Description")}
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Footer>
                            <div className="modal-element">
                                <Button variant="contained" color="error" onClick={setShow}>CANCELAR</Button>
                            </div>
                            <div className="modal-element">
                                <Button type="submit" variant="contained" color="success">GUARDAR</Button>
                            </div>
                        </Modal.Footer>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}