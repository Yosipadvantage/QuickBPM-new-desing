import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsXSquare, BsJustifyRight } from "react-icons/bs";
import { AdminService } from "../../../core/services/AdminService";
import { Toast } from "../../../utils/Toastify";
import { InputAdornment, TextField } from "@mui/material";
import { IBusinessRole } from "../model/BusinessRole";


interface INERoleBusiness {
    getShow: Function;
    dataShow: boolean;
    refreshList: Function;
    dataObj: IBusinessRole | undefined;
    dataTitle: string;
    idLN: number;
}

const _adminService = new AdminService();

export const NERoleBusiness: React.FC<INERoleBusiness> = (props: INERoleBusiness) => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();
    const closeModal = () => {
        clearErrors("entity");
        props.getShow(false);
    };

    const getValue = (dataTitle: string) => {
        if (dataTitle === "Editar") {
            setValue("entity", props.dataObj);
        }
        else {
            setValue("entity", {
                Name: "",
                Description: "",
                State: 0,
                IDLnFunctionalID: props.idLN,
                IDBusinessRole: null
            });
        }
    };
    getValue(props.dataTitle);

    const updateBusinessRole = (bean: IBusinessRole) => {
        _adminService.updateBusinessRole(bean).subscribe((resp) => {
            props.refreshList();
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
        })
    }

    const onSubmit = (data: any, e: any) => {
        e.preventDefault();
        updateBusinessRole(data.entity);
        closeModal();
    };


    return (<>
        <Modal show={props.dataShow}  centered  onHide={closeModal}>
            <Modal.Header>
                {props.dataTitle + " Rol"}
                <BsXSquare  className='pointer' onClick={closeModal} />
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            <TextField
                                color="secondary"
                                id="outlined-required"
                                label="Nombre *"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <BsJustifyRight />
                                        </InputAdornment>
                                    )
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
                    <Button variant="danger" onClick={closeModal}>
                        CANCELAR
                    </Button>
                    <Button type="submit" variant="success">
                        GUARDAR
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>

    </>)

}