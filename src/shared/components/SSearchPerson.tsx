import { Modal, Row, Col, Form, ListGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Toast, ToastCenter } from "../../utils/Toastify";
import { GlobalService } from "../../core/services/GlobalService";
import { BsFillPersonPlusFill, BsPlus, BsSearch, BsXSquare } from "react-icons/bs";
import { User } from "../model/User";
import { IconButton, InputAdornment, MenuItem, Button, TextField, ThemeProvider } from "@mui/material";
import { inputsTheme, useStyles } from "../../utils/Themes";
import { NEUser } from "../../modules/admin/components/NEUser";
import { MCreateCitizen } from "../../modules/citizenData/components/MCreateCitizen";
import { SSpinner } from "./SSpinner";

const _globalService = new GlobalService();

interface ISSearchPerson {
  getShow: Function,
  getPerson: Function,
  dataShow: boolean,
  create?: boolean
}

const SSearchPerson: React.FC<ISSearchPerson> = (props: ISSearchPerson) => {

  const { handleSubmit, setValue } = useForm();
  const [type, setType] = useState<number>(0);
  const [list, setList] = useState<User[]>([]);
  const [text, setText] = useState("");
  const [render, setRender] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [create, setCreate] = useState(true);

  useEffect(() => {
    if (props.create !== undefined) {
      setCreate(props.create);
    }
  }, [props.create])

  const onCloseNew = (data: boolean, id: number) => {
    setShow(data);
    if (id !== undefined) { getAccountByNit(id) };
  }

  const closeModal = () => {
    setList([]);
    setValue("entity", {
      Type: "",
      Name: ""
    });
    props.getShow(false);
  };

  const onChangeSelect = (e: number) => {
    console.log(e);

    if (e === 1) {
      setShow(true);
    } else if (e === 2) {
      setShow2(true);
    }
  };

  const getAccountByNit = (nit: any) => {
    setSpinner(true);
    _globalService.getAccountByNit(nit)
      .subscribe((resp: any) => {
        setSpinner(false);
        console.log(nit, resp);
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se ha encontrado coincidencias",
          });
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha encontrado coincidencias",
          });
        }
      });
  };

  const getAccount = (name: any, lastName: any) => {
    setSpinner(true);
    _globalService.getAccount(name, lastName)
      .subscribe(resp => {
        setSpinner(false);
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se ha encontrado coincidencias",
          });
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se ha encontrado coincidencias",
          });
        }
      })
  }

  const sincronizarUsuario = (nit: number) => {
    setSpinner(true);
    _globalService.sincronizarUsuario(nit)
      .subscribe(resp => {
        console.log(resp);
        if (resp.DataBeanProperties.ObjectValue.validacion) {
          getAccountByNit(nit);
        } else {
          setSpinner(false);
          ToastCenter.fire({
            icon: 'error',
            title: `${resp.DataBeanProperties.ObjectValue.msg}`
          });
        }
      })
  }

  const onSubmit = () => {
    if (type === 1) {
      sincronizarUsuario(parseInt(text));
    }
    if (type === 2) {
      getAccount(text, null);
    }
    if (type === 3) {
      getAccount(null, text);
    }
  };

  const handleWrite = (e: any) => {
    setText(e);
  };

  const getUser = (data: any) => {
    props.getPerson(data);
    closeModal();
  };

  const getAccountByNit2 = (nit: number) => {
    setSpinner(true);
    _globalService
      .getAccountByNit(nit)
      .subscribe(resp => {
        setSpinner(false);
        if (resp.length > 0) {
          setList(resp);
        }
        else {
          setList(resp);
        }
      })
  };

  const classes = useStyles();

  return (
    <>
      <Modal show={props.dataShow}   centered onHide={closeModal} >
        <Modal.Header>
          Buscar
          <BsXSquare className="pointer" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mt-3">
              {create &&
                <Col sm={12} className="mb-3 d-flex justify-content">
                  <ThemeProvider theme={inputsTheme}>
                    <Button
                      className="mr-2 w-100"
                      variant="contained"
                      color="secondary"
                      endIcon={<BsFillPersonPlusFill
                      />}
                      onClick={() => {
                        setRender(true);
                      }}
                    >CREAR USUARIO
                    </Button>
                  </ThemeProvider>
                </Col>}
              {render &&
                <Col sm={12} className="mt-3 mb-3">
                  <TextField
                    size="small"
                    select
                    fullWidth
                    color="secondary"
                    label="Seleccione tipo de usuario a crear"
                    id="type"
                    onChange={(e) => onChangeSelect(parseInt(e.target.value))}
                  >
                    <MenuItem key={1} value={1}>
                      Funcionario
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      Ciudadano
                    </MenuItem>
                  </TextField>
                </Col>
              }
              <Col sm={6} className="mt-3 d-flex justify-content-end align-items-center">
                <TextField
                  size="small"
                  select
                  fullWidth
                  color="secondary"
                  label=".: Buscar por: :."
                  id="type"
                  onChange={(e) => setType(parseInt(e.target.value))}
                >
                  <MenuItem key={1} value={1}>
                    Identificación - Nit
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    Nombres
                  </MenuItem>
                  <MenuItem key={3} value={3}>
                    Apellidos
                  </MenuItem>
                </TextField>
              </Col>
              <Col sm={6} className="mt-3 d-flex justify-content-end align-items-end">
                <TextField
                  size="small"
                  className={classes.field}
                  fullWidth
                  color="secondary"
                  label="Escrbir"
                  id="write"
                  onChange={(e) => handleWrite(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" onClick={onSubmit}>
                          <BsSearch />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Col>
            </Row>
          </Form>
          <div className=" mt-3 mh-person overflow-auto">
            <Row className="mt-3">
              <Col sm={12}>
                <ListGroup>
                  {list.map(item =>
                    <ListGroup.Item key={item.IDAccount}>
                      <div>
                        <IconButton
                          color="secondary"
                          onClick={() => getUser(item)}
                        >
                          <BsPlus />
                        </IconButton>
                        {item.IDAccount} - {item.Surname2 !== null ? item.Surname2 : ''} {item.Surname1 !== null ? item.Surname1 : ''} {' '}
                        {item.Name1 !== null ? item.Name1 : ''} {item.Name2 !== null ? item.Name2 : ''}
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      {show &&
        <NEUser
          getShow={onCloseNew}
          dataShow={show}
          dataTitle={"Crear"}
          getAccount={getAccountByNit}
        />
      }
      {show2 &&
        <MCreateCitizen dataTitle={'Crear'} show={show2} setShow={setShow2} getAccount={getAccountByNit2} />
      }
      {spinner && <SSpinner show={spinner} />}
    </>
  );
}

export default SSearchPerson;
