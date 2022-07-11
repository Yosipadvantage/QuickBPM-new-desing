import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

import { Col, Form, Modal, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/core";
import { FaTimes } from "react-icons/fa";
import { BsFillFileCheckFill, BsSearch, BsXSquare } from "react-icons/bs";
import { SuscriptionService } from "../../core/services/SuscriptionService";
import { Toast } from "../../utils/Toastify";
import { inputsTheme } from "../../utils/Themes";
import { SSpinner } from "./SSpinner";
import { MdSend } from "react-icons/md";
import { FileService } from "../../core/services/FileService";
/* export default function SLoadDocument({ getShowM, getMedia, title, dataShowM, beanAction, type }: any) { */

interface ILoadDocument {
  setShow: Function;
  accept?: string[];
  getMedia?: Function;
  title: string;
  show: boolean;
  beanAction?: any;
  type: number;
}

const _files = new FileService();

export const SLoadDocument: React.FC<ILoadDocument> = (
  props: ILoadDocument
) => {
  const _suscripcionService = new SuscriptionService();
  const [document, setDocument] = useState<any>();
  const [prevDoc, setUrl] = useState<any>();
  const [listAccept, setAccept] = useState("");
  const [txtDescripcion, setDescription] = useState("");
  const [statusLoad, setStatusLoad] = useState(false)

  const closeModal = () => {
    props.setShow(false);
  };
  const Input = styled("input")({
    display: "none",
  });
  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    fileList
      ? subirDoc(fileList[0])
      : console.log("No se ha cargado ningun documento");
  };

  useEffect(() => {
    if (props.accept) {
      setAccept(props.accept.toString());

    } else {
      setAccept(".pdf, image/*");
    }
    if (props.beanAction && props.type === 1) {
      if (props.beanAction.Media) {
        props.beanAction.TypeName = getFileExtension(props.beanAction.Media);
      }
      setDocument(props.beanAction);
      console.log(props.beanAction.Url);
      setUrl(props.beanAction.Url);
    }
  }, [props.beanAction, props.type]);

  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const subirDoc = async (documento: File) => {
    setStatusLoad(true);
    await _suscripcionService
      .postFile(documento)
      .then((resp: any) => {
        setStatusLoad(false);
        console.log('URL DEL ARCHIVO',resp);

        if (resp.data.DataBeanProperties.ObjectValue) {
          setDocument(
            resp.data.DataBeanProperties.ObjectValue.DataBeanProperties
          );
          // Se cambio setUrl respuesta URL por creacion de la UrL utilizando FileService
          setUrl(
            _files.getUrlFile(
              resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.MediaContext,
              resp.data.DataBeanProperties.ObjectValue.DataBeanProperties.Media
            )
          );

          if (props.type === 3) {
            closeModal();
          }
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };
  const aprobarDoc = () => {
    // _suscripcionService
    //   .responseProcedureAction(props.beanAction.IDAction, txtDescripcion, true).subscribe((resp: any) => {
    //     if (resp.DataBeanProperties.ObjectValue) {
    //       closeModal();
    //     } else {
    //       Toast.fire({
    //         icon: "error",
    //         title: "No se ha podido completar la accion",
    //       });
    //     }
    //   })

    if (props.getMedia) {
      props.getMedia(
        // resp.data.DataBeanProperties.ObjectValue.DataBeanProperties
        document
      );
    }
    closeModal();
  };

  const reenviarDoc = async () => {
    await _suscripcionService
      .reprocessProcedureAction(
        props.beanAction.IDAction,
        document.Media,
        document.MediaContext,
        txtDescripcion
      )
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          closeModal();
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      });
  };

  const devolverDoc = async () => {
    await _suscripcionService
      .declineResponseProcedureAction(props.beanAction.IDAction, txtDescripcion)
      .then((resp: any) => {
        if (resp.data.DataBeanProperties.ObjectValue) {
          closeModal();
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha podido completar la accion",
          });
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Modal show={props.show}   centered  onHide={closeModal}>
        <Modal.Header>
          <b>Cargar Documento: </b>
          {props.title}
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body className="px-5">
          <Row className="mt-3">
            <label htmlFor="contained-button-file">
              <Input
                accept={listAccept}
                id="contained-button-file"
                multiple={false}
                type="file"
                onChange={(e) => handleImageChange(e)}
              />
              <Button variant="contained" component="span">
                Buscar <BsSearch className="ml-1"></BsSearch>
              </Button>
            </label>
          </Row>
          {document ? (
            <Row>
              {document.TypeName === "png" ||
                document.TypeName === "jpg" ||
                document.TypeName === "mp4" ||
                document.TypeName === "jpeg" ? (
                <div className="w-100">
                  <img src={prevDoc} className="w-100" alt="Documento cargado" />
                  <a className="w-100" href={prevDoc}>
                    {document.Name}
                  </a>
                </div>
              ) : (
                ""
              )}
              {document.TypeName === "pdf" ? (
                <div className="w-100">
                  <div>
                    <img
                      src={process.env.PUBLIC_URL + "/assets/icon-pdf.png"}
                      alt="pdf file"
                      className="w-25"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="w-100">
                <a className="w-100" href={prevDoc}>
                  {document.Name}
                </a>
              </div>

            </Row>
          ) : (
            ""
          )}
          {props.type === 1 && prevDoc ? (
            <div>
              <Row>
                {/* <Col sm={12} className="p-0">
                  <Form.Label>Descripción</Form.Label>
                  <textarea
                    key="txaDescripcion"
                    className="form-control w-100"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Col> */}
                <Button variant="contained" className="mt-3" onClick={() => aprobarDoc()} endIcon={<MdSend />}>
                  Cerrar y enviar
                </Button>
                {/* <Col className="mt-2" sm={12} md={6}>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => devolverDoc()}
                  >
                    Devolver Trámite
                  </button>
                </Col> */}
              </Row>
            </div>
          ) : (
            ""
          )}
          {props.type === 2 && prevDoc != null ? (
            <div>
              <Row>
                <Col sm={12} className="p-0">
                  <Form.Label>Descripción</Form.Label>
                  <textarea
                    key="txaDescripcion"
                    className="form-control w-100"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Col>
                <Col className="mt-2 p-0" sm={12}>
                  <button
                    className="btn btn-outline-success w-100 "
                    onClick={() => reenviarDoc()}
                  >
                    Reenviar Documento
                  </button>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
          {props.type === 3 && prevDoc != null ? (
            <div>
              <Row>
                <Col className="mt-3 p-0" sm={12}>
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="mr-2 w-100"
                      variant="contained"
                      color="secondary"
                      endIcon={<BsFillFileCheckFill />}
                      onClick={closeModal}
                    >
                      Adjuntar
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
      <SSpinner show={statusLoad} />

    </>

  );
};
