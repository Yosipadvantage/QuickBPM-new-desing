import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import {
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { BsArrowLeftCircle, BsSearch } from "react-icons/bs";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { Toast } from "../../../utils/Toastify";
import { TTramites } from "../components/TTramites";
import { TPermisos } from "../components/TPermisos";
import { TItemsCiudadano } from "../components/TItemCiudadano";
import { height } from "@mui/system";
import { GlobalService } from "../../../core/services/GlobalService";
import { FileService } from "../../../core/services/FileService";
import { TMulta } from "../components/TMulta";
import { SCardBasicData } from "../components/SCardBasicData";
import { User } from "../../../shared/model/User";

interface IBasicData { }

const _globalService = new GlobalService();
const _fileService = new FileService();
const TBasicData: React.FC<IBasicData> = () => {
  const [spinner, setSpinner] = useState(false);
  const [personPhoto, setPersonPhoto] = useState<string>("");
  const [cases, setCases] = useState(0);
  const [showUser, setShowUser] = useState(false);
  const [user, setUser] = useState<User>();
  const [nameUser, setNameUser] = useState<string>("");

  useEffect(() => { }, []);

  const closeSearch = (data: any) => {
    setShowUser(data);
  };

  const getItem = (data: any) => {
    console.log(data);
    setUser(data);
    setNameUser(data.EntityName);
  };

  const onNext = () => {
    if (nameUser === "") {
      Toast.fire({
        icon: "warning",
        title: "No hay una persona seleccionada",
      });
    } else {
      setCases(1);
    }
  };

  console.log("datos usuario", user);
  const renderSwitch = () => {
    switch (cases) {
      case 0:
        return (
          <div className="container d-flex justify-content-center mt-15">
            <form>
              <Row className="card box-s m-3 d-block">
                <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                  <h1>CONSULTAR USUARIO</h1>
                </Col>
                <Col sm={12} className="mt-3 mb-3">
                  <TextField
                    size="small"
                    value={nameUser}
                    label=".:Usuario:. *"
                    fullWidth
                    color="secondary"
                    id="distributionChanel"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowUser(true)}>
                            <BsSearch />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onClick={() => setShowUser(true)}
                  />
                </Col>
                <Col sm={12} className="mb-3 d-flex justify-content-center">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className=" mt-3 w-100"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        onNext();
                      }}
                    >
                      SIGUIENTE
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
            </form>
          </div>
        );
      case 1:
        return (
          <div className="container">
            <div className="card-data">
              <Row>
                <Col sm={12} className="mb-3">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setUser(undefined);
                        setCases(0);
                      }}
                    >
                      <BsArrowLeftCircle className="mr-2" />
                      ATRAS
                    </Button>
                  </ThemeProvider>
                </Col>
              </Row>
              <SCardBasicData
                idAccount={user?.IDAccount}
                setSpinner={setSpinner}
              />
              <div className="card-table-data">
                <Tab.Container id="left-tabs-example" defaultActiveKey="1">
                  <Row>
                    <Col sm={12}>
                      <Nav variant="pills">
                        <Nav.Item>
                          <Nav.Link eventKey="1">Armas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="2">Multas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="3">Permisos</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="4">Autorizados</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="5">Trámites</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="6">Novedades</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content>
                        <Tab.Pane eventKey="1">
                          <TItemsCiudadano idAccount={user?.IDAccount} proCD={false} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="2">
                          <TMulta idAccount={user?.IDAccount} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="3">
                          <TPermisos nit={user?.Nit} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="4">
                          {/* FALTA VISTA DE AUTORIZADOS */}
                        </Tab.Pane>
                        <Tab.Pane eventKey="5">
                          <TTramites idAcount={user?.IDAccount} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="6">
                          {/* <TTramites idAcount={user?.IDAccount} /> */}
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="nWhite w-80 p-3 m-3">
        {renderSwitch()}

        {showUser && (
          <SSearchPerson
            getShow={closeSearch}
            getPerson={getItem}
            dataShow={showUser}
            create={false}
          />
        )}
      </div>
    </>
  );
};

export default TBasicData;
