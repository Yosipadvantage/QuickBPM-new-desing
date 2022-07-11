import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Card
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { GlobalService } from "../../../core/services/GlobalService";
import { BsPlus, BsPencilSquare, BsPersonCheckFill, BsPersonDashFill, BsPerson, BsSearch, BsListTask, BsLayoutWtf, BsCloudDownloadFill, BsFillCloudUploadFill } from "react-icons/bs";
import { NEUser } from "./NEUser";
import { Toast } from "../../../utils/Toastify";
import { Button, MenuItem, SpeedDial, SpeedDialAction, TextField, ButtonGroup, Table, ThemeProvider, InputAdornment, IconButton, Tooltip, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import { FiMoreVertical } from "react-icons/fi";
import { NEUserActivate } from "./NEUserActivate";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";
import { AdminService } from "../../../core/services/AdminService";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { User } from "../../../shared/model/User";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import { SSpinner } from "../../../shared/components/SSpinner";

interface ITUser { }

const _globalService = new GlobalService();
const _adminService = new AdminService();

export const TUser: React.FC<ITUser> = (props: ITUser) => {

  const { register, handleSubmit } = useForm();
  const [list, setList] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [formdata, setformdata] = useState<User>();
  const [show, setShow] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [showDesactivate, setShowDesactivate] = useState(false);
  const [write, setWrite] = useState(false);
  const [user, setUser] = useState<User>({
    Active: false,
    EntityName: '',
    IDAccount: 0,
    IDLn: 0,
    Name1: '',
    Name2: '',
    Nit: 0,
    RoleID: 0,
    State: 0,
    Surname1: '',
    Surname2: '',
    eMail: '',
    Age: 0,
    DocType: 0,
    Grade: null,
    PDF417Str: null,
    Password: null
  });
  const [type, setType] = useState(0);
  const [text, setText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState(false)
  const { items } = useSelector((state: RootState) => state.itemsperpage);

  const onChangeSelect = (e: any) => {
    setType(e);
    (e !== 'd') ? setWrite(true) : setWrite(false);
    setList([]);
  };

  useEffect(() => {
    getUsuariosSistema();
    setRowsPerPage(parseInt(items));
  }, [items]);

  const getAccountByNit = (nit: number) => {
    setSpinner(true);
    _globalService
      .getAccountByNit(nit)
      .subscribe(resp => {
        setSpinner(false);
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se han encontrado coincidencias"
          })
        }
        else {
          setList(resp);
          Toast.fire({
            icon: "error",
            title: "No se han encontrado coincidencias"
          })
        }
      })
  };

  const getUsuariosSistema = () => {
    setSpinner(true);
    _globalService
      .getUsuariosSistema()
      .subscribe(resp => {
        setSpinner(false);
        console.log(resp);
        if (resp.length > 0) {
          resp.forEach((element: User) => {
            element.IDAccount = element.IDACCOUNT !== undefined ? element.IDACCOUNT : 0;
            element.EntityName = element.NAME1 + " " + element.NAME2 + " " + element.SURNAME1 + " " + element.SURNAME2;
            element.Nit = element.NIT !== undefined ? element.NIT : 0;
            element.eMail = element.EMAIL !== undefined ? element.EMAIL : "";
            element.Name1 = element.NAME1 !== undefined ? (element.NAME1 !== null ? element.NAME1 : "") : "";
            element.Name2 = element.NAME2 !== undefined ? (element.NAME2 !== null ? element.NAME2 : "") : "";
            element.Surname1 = element.SURNAME1 !== undefined ? (element.SURNAME1 !== null ? element.SURNAME1 : "") : "";
            element.Surname2 = element.SURNAME2 !== undefined ? (element.SURNAME2 !== null ? element.SURNAME2 : "") : "";
            element.Tel = element.TEL !== undefined ? element.TEL : "";
            element.RoleID = element.ROLEID !== undefined ? element.ROLEID : 0;
            element.IDGrade = element.IDGRADE !== undefined ? element.IDGRADE : 0;
            element.Grade = element.GRADE !== undefined ? element.GRADE : "";
            element.Active = element.ACTIVE !== undefined ? element.ACTIVE : false;
          });
          setList(resp);
        }
        else {
          setList(resp);
          Toast.fire({
            icon: "error",
            title: "No se han encontrado coincidencias"
          })
        }
      })
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

  const getAccount = (names: any, lastNames: any) => {
    setSpinner(true);
    _globalService
      .getAccount(names, lastNames)
      .subscribe(resp => {
        console.log(resp);
        setSpinner(false);
        if (resp.length > 0) {
          setList(resp);
          Toast.fire({
            icon: "success",
            title: "Se han encontrado coincidencias"
          })
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se han encontrado coincidencias"
          })
        }
      })
  };

  const handleWrite = (e: any) => {
    setText(e);
  }

  const onSubmit = () => {
    if (type === 1) {
      getAccountByNit(parseInt(text));
    }
    if (type === 2) {
      getAccount(text, null);
    }
    if (type === 3) {
      getAccount(null, text);
    }
  };

  const formComponent = (title: string, data?: any) => {
    setTitle(title);
    if (title === "Editar") {
      setformdata(data);
    }
    viewModal();
  };

  const viewModal = () => {
    setShow(true);
  };

  const closeModal = (data: any) => {
    setShow(data);
    setShowActivate(data);
  };

  const desactivateUser = (data: boolean) => {
    if (data) {
      desactivateUserAccount(user.IDAccount);
    }
  };

  const desactivateUserAccount = async (idAccount: number) => {
    setSpinner(true);
    await _adminService
      .desactivateUserAccount(idAccount)
      .then((rps: any) => {
        if (rps.data.DataBeanProperties.ObjectValue === 3) {
          setSpinner(false);
          Toast.fire({
            icon: "success",
            title: "Usuario desactivado con éxito!"
          });
          getAccountByNit(user.Nit);
        }
        else {
          Toast.fire({
            icon: "error",
            title: "No se pudo desactivar el usuario"
          });
          getAccountByNit(user.Nit);
        }

      })
      .catch((err) => {
        console.log(err);
      })

  };

  const handleViewMode = (type: number) => {
    (type === 0) ? setViewMode(true) : setViewMode(false);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const classes = useStyles();

  return (
    <>
      <header className="page-header page-header-light bg-light mb-0">
        <div className="container-fluid">
          <div className="page-header-content pt-4 pb-10">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1>Usuarios</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="card-item-filter">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-filter">
            <div className="card-filter-items3">
              <div className="card-filter-button  ">
                <TextField
                  select
                  size="small"
                  fullWidth
                  color="secondary"
                  margin="normal"
                  label=".: Buscar por: :."
                  id="type"
                  onChange={(e) => onChangeSelect(e.target.value)}
                >
                  <MenuItem key={1} value={1}>
                    Identificación
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    Nombres
                  </MenuItem>
                  <MenuItem key={3} value={3}>
                    Apellidos
                  </MenuItem>
                </TextField>
              </div>
              <div className="card-filter-button ">
                {write &&
                  <TextField
                    size="small"
                    className={classes.field}
                    fullWidth
                    color="secondary"
                    margin="normal"
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
                }
              </div>
              <div className="card-filter-button d-flex justify-content-end">
                {(list.length > 0) &&
                  <ThemeProvider theme={inputsTheme}>
                    <ButtonGroup disableElevation variant="contained" style={{ height: 40 }}>
                      <Tooltip title="Ver lista">
                        <IconButton
                          onClick={() => handleViewMode(1)}
                          color="secondary"><BsListTask />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver mosaico">
                        <IconButton
                          onClick={() => handleViewMode(0)}
                          color="secondary"><BsLayoutWtf />
                        </IconButton>
                      </Tooltip>
                    </ButtonGroup>
                  </ThemeProvider>}
              </div>
            </div>
          </div>
        </Form>
      </div>
      <div className="px-5 mt-2">
        <div className="row">
          <div className="p-0">
            <div className="d-flex">
              <button
                className="btn btn-sm btn-outline-secondary btn-custom"
                type="button"
                onClick={() => {
                  formComponent("Crear", 0);
                }}
              >
                <BsPlus />
              </button>
            </div>
            <div className="mt-3">

            </div>
          </div>
        </div>
      </div>
      {(!viewMode)
        ? <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: "70vh" }}>
            <Table stickyHeader aria-label="sticky table" className={classes.root}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cédula/Nit</TableCell>
                  <TableCell>Nombres completo</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: User) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{item.IDAccount}</TableCell>
                      <TableCell>{item.Nit}</TableCell>
                      <TableCell>{item.EntityName}</TableCell>
                      <TableCell>{item.eMail}</TableCell>
                      <TableCell>{item.NOMBREROL}</TableCell>
                      <TableCell>
                        <SpeedDial
                          ariaLabel="SpeedDial basic example"
                          direction="left"
                          FabProps={{ size: "small", style: { backgroundColor: "#503464" } }}
                          icon={<FiMoreVertical />}
                        >
                          <SpeedDialAction
                            key={item.IDLn}
                            icon={<BsPencilSquare />}
                            tooltipTitle="Editar"
                            onClick={() => {
                              formComponent("Editar", item);
                            }}
                          />
                          {(item.Active === true || item.Active == 1 || item.Active === 1)
                            ?
                            <SpeedDialAction
                              key={item.IDAccount + 2}
                              icon={<BsPersonDashFill />}
                              tooltipTitle="Desactivar usuario"
                              onClick={() => {
                                setShowDesactivate(true);
                                setUser(item);
                              }}
                            />
                            :
                            <SpeedDialAction
                              key={item.IDAccount + 1}
                              icon={<BsPersonCheckFill />}
                              tooltipTitle="Activar usuario"
                              onClick={() => {
                                setUser(item);
                                setShowActivate(true);
                              }}
                            />
                          }
                          )
                        </SpeedDial>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.root}
            rowsPerPageOptions={[items, 10, 25, 100]}
            labelRowsPerPage="Columnas por Página"
            component="div"
            count={list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        : <div className="card-grid py-5 py-xl-4">
          {list.map(item => (
            <div className="cgt card m-2 p-4">
              <div>
                <h5>
                  {(item.Active === true || item.Active == 1)
                    ? <BsPerson color="green" />
                    : <BsPerson color="red" />
                  }
                  {" "}Usuario - {item.IDAccount}
                </h5>
                <hr />
                <div className={(item.Active === true || item.Active == 1) ? '' : 'user-disabled'}>
                  <b>Cédula/Nit:</b>
                  <br />
                  {item.Nit}
                </div>
                <div className={(item.Active === true || item.Active == 1) ? '' : 'user-disabled'}>
                  <b>Nombres:</b>
                  <br />
                  {item.Name1}{" "}
                  {item.Name2}
                </div>
                <div className={(item.Active === true || item.Active == 1) ? '' : 'user-disabled'}>
                  <b>Apellidos:</b>
                  <br />
                  {item.Surname1}{" "}
                  {item.Surname2}
                </div>
                <div className={(item.Active === true || item.Active == 1) ? '' : 'user-disabled'}>
                  <b>Correo:</b>
                  <br />
                  {item.eMail}
                </div>
                <div className="p-0 m-0">
                  <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    direction="left"
                    FabProps={{ size: "small", style: { backgroundColor: "#503464" } }}
                    icon={<FiMoreVertical />}
                  >
                    <SpeedDialAction
                      key={item.IDLn}
                      icon={<BsPencilSquare />}
                      tooltipTitle="Editar"
                      onClick={() => {
                        formComponent("Editar", item);
                      }}
                    />
                    {(item.Active === true || item.Active == 1)
                      ?
                      <SpeedDialAction
                        key={item.IDAccount + 2}
                        icon={<BsPersonDashFill />}
                        tooltipTitle="Desactivar usuario"
                        onClick={() => {
                          setUser(item);
                          setShowDesactivate(true);
                        }}
                      />
                      :
                      <SpeedDialAction
                        key={item.IDAccount + 1}
                        icon={<BsPersonCheckFill />}
                        tooltipTitle="Activar usuario"
                        onClick={() => {
                          setUser(item);
                          setShowActivate(true);
                        }}
                      />
                    }
                    )
                  </SpeedDial>
                </div>
              </div>
            </div>
          ))}
        </div>}
      {show &&
        <NEUser
          getShow={closeModal}
          dataShow={show}
          dataObj={formdata}
          dataTitle={title}
          getAccount={getAccountByNit2}
        />}
      {showActivate &&
        <NEUserActivate
          getShow={closeModal}
          dataShow={showActivate}
          user={user}
          refreshList={getAccountByNit}
        />}
      {showDesactivate && <GenericConfirmAction
        show={showDesactivate}
        setShow={setShowDesactivate}
        confirmAction={desactivateUser}
        title="¿Está seguro de desactivar el usuario?"
      />}
    </>
  );
};

