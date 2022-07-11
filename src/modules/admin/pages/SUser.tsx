import { Button, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Accordion, Card, Col, Row, useAccordionToggle } from "react-bootstrap";
import { MenuItem, TextField } from "@mui/material";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { User } from "../../../shared/model/User";
import { inputsTheme } from "../../../utils/Themes";
import {
  BsLockFill,
  BsShieldLockFill,
  BsUnlockFill,
  BsUpload,
} from "react-icons/bs";
import { AuthService } from "../../../core/services/AuthService";
import { MChangePassword } from "../components/MChangePassword";
import { getSession } from "../../../utils/UseProps";
import { env } from "../../../env";
import { GlobalService } from '../../../core/services/GlobalService';
import { IPersonPhotoData } from '../../citizenData/model/PersonPhotoData';
import { height } from "@mui/system";

interface ISUser { }

const _authService = new AuthService();

export const SUser: React.FC<ISUser> = (props: ISUser) => {
  const [user, setUser] = useState<User>({
    Active: false,
    EntityName: "",
    IDAccount: 0,
    IDLn: 0,
    Name1: "",
    Name2: "",
    Nit: 0,
    RoleID: 0,
    State: 0,
    Surname1: "",
    Surname2: "",
    eMail: "",
    Age: 0,
    DocType: 0,
    Grade: null,
    PDF417Str: null,
    Password: null,
    Photo: {
      Media: "",
      MediaContext: "",
    },
  });

  const FACE = 6;

  const [permission, setPermission] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [personPhotos, setPersonPhotos] = useState<string[]>([])

  const _globalService = new GlobalService();
  useEffect(() => {
    let u: any = getSession();
    setUser(u);
    getPersonPhotoDataByAccount(u.IDAccount)
  }, []);
  const getMedia = (doc: any) => {
    // const infoMedia={
    //     Media:doc.media,
    //     MeediaContext:doc.
    // }
  };
  const getPersonPhotoDataByAccount = (idAccount: number) => {
    let aux: string[] = [];
    _globalService
      .getPersonPhotoDataCatalog(idAccount)
      .subscribe(resp => {
        if (resp.length > 0) {
          resp.map((data: IPersonPhotoData) => {
            if (data.SideType === FACE) {
              aux[data.ViewType] = data.URL;
            }
          })
          console.log(aux)
          setPersonPhotos(aux);
        }
      })
  };
  function CustomToggle({ children, eventKey }: any) {
    const decoratedOnClick = useAccordionToggle(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <ThemeProvider theme={inputsTheme}>
        <Button
          variant="contained"
          color="secondary"
          onClick={decoratedOnClick}
        >
          {children}
          {<BsShieldLockFill className="ml-3" />}
        </Button>
      </ThemeProvider>
    );
  }

  return (
    <>
      <div className="card w-80 p-3 m-5">
        <Row>
          <Col sm={12} className="mt-15 container">
            <div className="container rounded bg-white mt-5">
              <div className="row">
                <div className="col-md-4 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-3">
                    <span className="font-weight-bold my-3">
                      FOTO DEL USUARIO
                    </span>
                    <div className="d-flex justify-content-center flex-column align-items-center">
                      <img
                        className="rounded-circle-bordered hover-image"
                        src={
                          !personPhotos[0]
                            ? process.env.PUBLIC_URL + "/assets/img_avatar.png"
                            : personPhotos[0]
                        }
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: 'cover'
                        }}
                        alt="Profile Img"
                      />
                      <div className="mt-3">
                        <span className="font-weight-bold mt-2">
                          {user.EntityName}
                        </span>
                        <br />

                        <span className="text-black-50">{user.Nit}</span>
                        <br />
                        <span className="text-black-50">{user.eMail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/**
                 *  inicio formulario informacion del usuario
                 */}
                <div className="col-md-8">
                  <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-right">Información del Usuario</h4>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <TextField
                          value={user.Name1}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="Primer Nombre"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          value={user.Name2}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="Segundo Nombre"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <TextField
                          value={user.Surname1}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="Primer Apellido"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          value={user.Surname2}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="Segundo Apellido"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <TextField
                          value={user.Nit}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="No. Identificación"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                      <div className="col-md-6">
                        <TextField
                          value={user.eMail}
                          size="small"
                          color="secondary"
                          id="Name1"
                          label="E-mail"
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <Col sm={12}>
                        <Accordion>
                          <div className="ml-n3">
                            <Card.Header className="b-white">
                              <CustomToggle eventKey="permission">
                                SEGURIDAD
                              </CustomToggle>
                            </Card.Header>
                          </div>
                          <Accordion.Collapse eventKey="permission">
                            <Card.Body>
                              <Row>
                                <Col sm={6}>
                                  <TextField
                                    type="password"
                                    value={"64#$%$#568$#%#$%54500"}
                                    size="small"
                                    color="secondary"
                                    id="Name1"
                                    label="Contraseña"
                                    fullWidth
                                    variant="outlined"
                                  />
                                </Col>
                                <Col sm={6}>
                                  <ThemeProvider theme={inputsTheme}>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      className=""
                                      onClick={() => setShowPassword(true)}
                                    >
                                      CAMBIAR CONTRASEÑA
                                      {permission ? (
                                        <BsUnlockFill className="ml-3" />
                                      ) : (
                                        <BsLockFill className="ml-3" />
                                      )}
                                    </Button>
                                  </ThemeProvider>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Accordion>
                      </Col>
                    </div>
                    <div className="mt-5 text-right">
                      <ThemeProvider theme={inputsTheme}>
                        <Button variant="contained" color="secondary">
                          GUARDAR
                        </Button>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row></Row>
      </div>
      <MChangePassword
        show={showPassword}
        setShow={setShowPassword}
        user={user}
        type={1}
      />
      <SLoadDocument
        show={showLoad}
        setShow={setShowLoad}
        title={"Cargar Imagen"}
        type={1}
        getMedia={getMedia}
        accept={["image/*"]}
      />
    </>
  );
};
