import { FC, SetStateAction, useState } from "react";
import {
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { Col, Nav, Row, Tab, Modal } from "react-bootstrap";
import { BsXSquare, BsSearch } from "react-icons/bs";
import { Dispatch } from "redux";
import { inputsTheme } from "../../../utils/Themes";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { User } from "../../../shared/model/User";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { styled } from "@mui/material/styles";
import { width } from "@mui/system";
import { getSession } from "../../../utils/UseProps";
import { ConfigService } from "../../../core/services/ConfigService";
import { GiSeaTurtle } from "react-icons/gi";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  show: boolean;
  setShow: any;
  idProcedimiento: any;
}
const _configService = new ConfigService();

export const MModelAsignacion: FC<Props> = ({
  show,
  setShow,
  idProcedimiento,
}) => {
  const [showUser, setShowUser] = useState<boolean>(false);
  const [nameUser, setNameUser] = useState<string>("");
  const [user, setUser] = useState<any>({});
  const [showLoadDoc, setShowLoadDoc] = useState(false);
  const [bean, setBean] = useState({});
  const [evidencia, setEvidencia] = useState<any>({});
  const [obsText, setObsText] = useState("");
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const getItem = (data: any) => {
    console.log("objeto usuario", data);
    setUser(data);
    setNameUser(data.EntityName);
  };
  const closeSearch = (data: any) => {
    setShowUser(data);
  };
  const getMedia = (data: any) => {
    console.log("informacion de la data subida", data);
    const aux = {
      Media: data.Media,
      MediaContext: data.MediaContext,
    };
    setEvidencia(aux);
  };

  const updateAuditoriaRender = (
    bean: any,
    descripcion: string,
    evidencia: string
  ) => {
    /**
     * TODO: AGREGAR SPINNER
     */
    _configService
      .updateAuditoriaRender(bean, descripcion, evidencia)
      .subscribe((resp: any) => {
        if (resp) {
          console.log("respuesta del servidor auditoria", resp);
        }
      });
  };
  const genAuditoria = () => {
    const bean = {
      IDAuditor: getSession().IDAccount,
      Estado: 1,
      FechaActualizacion: formatDate(new Date()),
      IDProcedureImp: idProcedimiento,
      IDFuncionario: user.IDAccount,
    };
    console.log(bean, obsText, evidencia, JSON.stringify(evidencia));
    if (obsText !== "") {
      setErrorMessage(null);
      updateAuditoriaRender(bean, obsText, JSON.stringify(evidencia));
    } else {
      setErrorMessage("La Descripcion Es Obligatoria ");
    }
  };

  return (
    <>
      <Modal size="lg" show={show}  centered onHide={() => setShow(false)}>
        <Modal.Header>
          <div className="title-modal">Asignar Auditoria</div>
          <BsXSquare className="pointer" onClick={() => setShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <form>
            <Row className="card box-s m-3 d-block">
              <Col sm={12} className="mt-3 mb-3">
                <TextField
                  size="small"
                  value={nameUser}
                  label=".:Asignar funcionario:."
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

              <Col sm={12} className="mt-3 mb-3">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className=" mt-3 w-100"
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowLoadDoc(true)}
                  >
                    Subir Evidencia
                  </Button>
                </ThemeProvider>
              </Col>

              <Col sm={12} className="mt-3 mb-3">
                <TextField
                  size="small"
                  color="secondary"
                  id="Observaciones"
                  placeholder="Escriba aqui las observaciones de la auditoría."
                  label="Observaciones"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  inputProps={{
                    maxLength: 535,
                  }}
                  onChange={(e) => {
                    setObsText(e.target.value);
                  }}
                />
              </Col>

              <Col sm={12} className="mb-3 d-flex justify-content-center">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className=" mt-3 w-100"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      genAuditoria();
                    }}
                  >
                    Generar
                  </Button>
                </ThemeProvider>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>
      {showUser && (
        <SSearchPerson
          getShow={closeSearch}
          getPerson={getItem}
          dataShow={showUser}
          create={false}
        />
      )}
      <SLoadDocument
        show={showLoadDoc}
        setShow={setShowLoadDoc}
        title={"cargue de evidencia"}
        type={1}
        getMedia={getMedia}
      />
    </>
  );
};
