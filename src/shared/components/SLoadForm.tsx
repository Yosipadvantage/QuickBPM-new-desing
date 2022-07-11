import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { BsXSquare } from "react-icons/bs";
import { Toast } from "../../utils/Toastify";
import { SuscriptionService } from "../../core/services/SuscriptionService";
import { AdminService } from "../../core/services/AdminService";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Table,
} from "@mui/material";
import { NEMeet } from "../../modules/agenda/components/NEMeet";
import { BioValidationForm } from "../../modules/citizenData/components/BioValidationForm";
import { TFireWeapon } from "../../modules/weapons/pages/TFireWeapon";
import { AprobationForm } from "../../modules/weapons/components/AprobaionForm";
import { AsignSerialForm } from "../../modules/weapons/components/AsignSerialForm";
import { CesionForm } from "../../modules/weapons/components/CesionForm";
import { RevalidationForm } from "../../modules/weapons/components/RevalidationForm";
import { TWeapon } from "../../modules/weapons/pages/TWeapon";

interface ISLoadForm {
  beanSelected?: any;
  beanAction: any;
  getShowForm: Function;
  status: boolean;
  title: string;
  type: number;
  IDProcedureIMP: number | undefined;
}
const _suscriptionService = new SuscriptionService();
const _adminService = new AdminService();

export const SLoadForm: React.FC<ISLoadForm> = (props: ISLoadForm) => {

  const reactive: string[] = ["APROB", "ASINGSERIAL", "APROBREVA", "APROBCESION"];

  const [htmlForm, setHtmlForm] = useState("");
  const [form, setForm] = useState<any>();
  const [keys, setKeyObject] = useState<string[]>();
  const [values, setValuesObject] = useState<string[]>();

  const closeModal = () => {
    props.getShowForm(false);
  };
  useEffect(() => {
    getForm();
  }, []);

  const getForm = () => {
    console.log(props.beanAction.IDForm);
    if (props.type === 1) {
      _adminService.getForm(props.beanAction.IDForm).subscribe((res: any) => {
        if (res.DataBeanProperties.ObjectValue) {
          console.log(res.DataBeanProperties.ObjectValue);
          let beanForm = res.DataBeanProperties.ObjectValue;
          setHtmlForm(
            _adminService.getUrl(
              beanForm.DataBeanProperties.IDForm,
              props.beanAction.IDAction
            )
          );
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido cargar el formulario",
          });
        }
      });
    } else if (props.type === 2) {
      setKeyObject(Object.keys(JSON.parse(props.beanAction.ResponseJsonValue)));
      setValuesObject(
        Object.values(JSON.parse(props.beanAction.ResponseJsonValue))
      );
    } else {
      Toast.fire({
        icon: "error",
        title: "No se ha podido cargar el formulario",
      });
    }
  };

  const switchRender = (codeForm: string) => {
    switch (codeForm) {
      case "FG-3":
        return (
          <div className="container">
            <NEMeet
              IDProcedureIMP={props.IDProcedureIMP}
              IDAgenda={undefined}
              type={0}
              IDAction={props.beanAction.IDAction}
            />
          </div>
        );
      case "FG-209":
        return (
          <div>
            {/* {setReactive(true)} */}
            {/* SOLICITUD DE MARCAJE */}
            {/* <NEMeet IDProcedureIMP={props.IDProcedureIMP} IDAgenda={undefined} type={0} /> */}
            {<TWeapon beanAction={props.beanAction} setShow={props.getShowForm} type={'SOLICITUD DE MARCAJE'} />}
          </div>
        );
      case "APROBREVA":
        return (
          <div>
            <RevalidationForm
              beanAction={props.beanAction}
              setShow={props.getShowForm}
            />
          </div>
        );
      case "APROB":
        return (
          <div>
            <AprobationForm
              beanAction={props.beanAction}
              setShow={props.getShowForm}
            />
          </div>
        );
      case "ASINGSERIAL":
        return (
          <div>
            {/* ASGINACION DE SERIAL A ARMAS APROBADAS */}
            <AsignSerialForm
              beanAction={props.beanAction}
              setShow={props.getShowForm}
            />
          </div>
        );
      case "APROBCESION":
        return (
          <div>
            <CesionForm
              beanAction={props.beanAction}
              setShow={props.getShowForm}
            />
          </div>
        );
      case "AAR01":
        return (
          <div className="d-flex justify-content-center">
            {/* SOLICITUD DE AQUISICION */}
            <TFireWeapon
              beanAction={props.beanAction}
              setShow={props.getShowForm}
            />
          </div>
        );
      case "VB":
        return (
          <div>
            {/* VALIDACION BIOMÉTRICA */}
            {/* <NEMeet IDProcedureIMP={props.IDProcedureIMP} IDAgenda={undefined} type={0} IDAction={props.beanAction.IDAction}/> */}
            <BioValidationForm
              beanAction={props.beanSelected}
              setShow={props.getShowForm}
              idAction={props.beanAction.IDAction}
            />
          </div>
        );
      default:
        return (
          <div className="modal-custom-iframe">
            {htmlForm !== "" && (
              <iframe src={htmlForm} frameBorder={0}></iframe>
            )}
          </div>
        );
    }
  };

  return (
    <Modal
      show={props.status}
      centered
      size="xl"
      dialogClassName="modal-custom d-flex justify-content-center"

    >
      <Modal.Header>
        {props.title}
        {reactive.find((item) => item === props.beanAction.FormCode) ===
          undefined && <BsXSquare className="pointer" onClick={closeModal} />}
      </Modal.Header>
      <Modal.Body>
        {props.type === 1 ? (
          <>
            <b>Nombre: </b> <p>{props.beanAction.Name}</p>
            {switchRender(props.beanAction.FormCode)}
          </>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableRow>
                  <TableCell>Campos</TableCell>
                  <TableCell>Valores</TableCell>
                </TableRow>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {keys?.map((item) => (
                        <TableRow>{item}</TableRow>
                      ))}
                    </TableCell>
                    <TableCell>
                      {values?.map((item) => (
                        <TableRow>{item}</TableRow>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Modal.Body>
      {/* {
                props.type === 1 &&
                <Button onClick={(e) => aprobar()}>Enviar</Button>
            } */}
    </Modal>

  );
};
export default SLoadForm;
