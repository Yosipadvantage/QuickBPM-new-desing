import { Button, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { BsXSquare } from "react-icons/bs";
import { inputsTheme } from "../../../utils/Themes";
import { Toast } from "../../../utils/Toastify";
import { ICONS } from "../components/Icon";

interface IMSelectIcon {
  show: boolean;
  setShow: Function;
  icon: number;
  setIcon: Function;
  nombreModulo: string;
}

export const MSelectIcon: React.FC<IMSelectIcon> = (props: IMSelectIcon) => {
  useEffect(() => {}, [props.icon]);

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        onHide={() => {
          props.setShow(false);
        }}
        centered
      >
        <Modal.Header>
          ICONOS
          <BsXSquare
            className="pointer"
            onClick={() => {
              props.setShow(false);
            }}
          />
        </Modal.Header>
        <Modal.Body className="m-3">
          <Row>
            <Col sm={12} className="d-flex justify-content-between">
              <div>
                <ThemeProvider theme={inputsTheme}>
                  <h5>
                    ICONO SELECCIONADO PARA: <b>{props.nombreModulo}</b>
                  </h5>
                  <IconButton color="secondary">{ICONS[props.icon]}</IconButton>
                </ThemeProvider>
              </div>
              <div className="d-flex align-items-center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    props.setShow(false);
                    Toast.fire({
                      icon: "success",
                      title: "Se guardó correctamente",
                    });
                  }}
                >
                  GUARDAR
                </Button>
              </div>
            </Col>
            <Col sm={12} className="mt-3">
              <div className="grid-icons overflow-auto">
                {ICONS.map((icon: any, index: number) => (
                  <div className="card d-flex justify-content-center align-items-center">
                    <Tooltip title="seleccionar" placement="top">
                      <ThemeProvider theme={inputsTheme}>
                        <IconButton
                          color={props.icon === index ? "secondary" : undefined}
                          onClick={() => {
                            props.setIcon(index);
                          }}
                        >
                          {icon}
                        </IconButton>
                      </ThemeProvider>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
