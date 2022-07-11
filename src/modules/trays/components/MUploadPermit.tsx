import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import {
  Button,
  ButtonGroup,
  MenuItem,
  ThemeProvider,
  Autocomplete,
  Tooltip,
  TextField,
} from "@mui/material";

import {
  BsArrowRepeat,
  BsCloudDownloadFill,
  BsFillCloudUploadFill,
  BsFillPlusCircleFill,
  BsSearch,
  BsXSquare,
} from "react-icons/bs";
import { ConfigService } from "../../../core/services/ConfigService";
import { Toast, ToastCenter } from "../../../utils/Toastify";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import { pipeSort } from "../../../utils/pipeSort";
import { FileService } from "../../../core/services/FileService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { SLoadDocument } from "../../../shared/components/SLoadDocument";
import { Office } from "../../configuration/model/Office";
import { WeaponsService } from "../../../core/services/WeaponsService";
import { getSession } from "../../../utils/UseProps";
import { formatDate } from "../../../utils/formatDate";

/**
 * Servicios
 */
const _configService = new ConfigService();
const _weaponService = new WeaponsService();
const _fileService = new FileService();

interface IMUploadPermit {
  getShowMUploadPermit: Function;
  dataShowMUploadPermit: boolean;
  /* dataList: any[]; */
}

const MUploadPermit: React.FC<IMUploadPermit> = (props: IMUploadPermit) => {
  const [showLoad, setShowLoad] = useState(false);
  const [file, setFile] = useState<any>({});
  const [dateInit, setDateInit] = useState<Date | null>(null);
  const [dateInitError, setDateInitError] = useState<boolean>(false);
  const [showL, setShowL] = useState(false);
  const [officeSelected, setofficeSelected] = useState(-1);
  const [listOffice, setListOffice] = useState<any[]>([]);
  const [tipoPermiso, setTipoPermiso] = useState(0);
  const [prevDoc, setUrl] = useState<any>();
  const [spinner, setSpinner] = useState(false);
  const [listEstado, setListEstado] = useState([
    { id: 1, nombre: "PERMISO PARA PORTE" },
    { id: 2, nombre: "PERMISO PARA TENENCIA" },
    { id: 3, nombre: "PERMISO ESPECIAL" },
  ]);

  useEffect(() => {
    getListOffice(getSession().IDAccount);
  }, []);

  const getListOffice = (idAccount: number) => {
    setSpinner(true);
    let aux: any = [];
    let auxSorted: any = [];
    _configService.getOfficeCatalog().subscribe((resp) => {
      setSpinner(false);
      console.log(resp);
      if (resp) {
        resp.map((item: Office) =>
          aux.push({
            label: item.Name,
            id: item.IDOffice,
          })
        );
        auxSorted = pipeSort([...aux], "label");
        setListOffice(auxSorted);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  const cargarInventarioHojaPermisos = (
    idFuncionario: number,
    idOffice: number,
    idTipoPermiso: number,
    fechaRegistro: string,
    mediaContext: string,
    media: string
  ) => {
    setSpinner(true);
    _weaponService
      .cargarInventarioHojaPermisos(
        idFuncionario,
        idOffice,
        idTipoPermiso,
        fechaRegistro,
        mediaContext,
        media
      )
      .subscribe((resp) => {
        setSpinner(false);
        console.log(resp);
        if (resp.DataBeanProperties.ObjectValue) {
          const obj = {
            view: false,
            idOffice: idOffice,
            state: 4,
          };
          props.getShowMUploadPermit(obj);
          ToastCenter.fire({
            icon: "success",
            title:
              `Se han cargado ${resp.DataBeanProperties.ObjectValue.registros} registros` +
              `No se cargaron ${resp.DataBeanProperties.ObjectValue.errores} registros`,
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "No se ha cargado la información",
          });
        }
      });
  };

  /**
   * Metodo que permite enviar el media y context
   * @param doc
   */
  const getMedia = (doc: any) => {
    if (doc) {
      /* setMedia(doc.Media);
            setContex(doc.MediaContext);
            setBeanDoc(doc); */
      setUrl(_fileService.getUrlFile(doc.MediaContext, doc.Media));
      setFile(doc);
      setShowL(true);
      console.log(doc);
      console.log(0, doc.MediaContext, doc.Media);
      Toast.fire({
        icon: "success",
        title: "Docuemento seleccionado",
      });
    }
  };

  const closeModal = () => {
    props.getShowMUploadPermit(false);
    /* props.refresh(); */
  };

  const handleSubmit = () => {
    if (officeSelected) {
      if (dateInit) {
        if (tipoPermiso) {
          console.log(
            getSession().IDAccount,
            officeSelected,
            tipoPermiso,
            formatDate(dateInit),
            file.MediaContext,
            file.Media
          );
          cargarInventarioHojaPermisos(
            getSession().IDAccount,
            officeSelected,
            tipoPermiso,
            formatDate(dateInit),
            file.MediaContext,
            file.Media
          );
        } else {
          Toast.fire({
            icon: "error",
            title: "Debe seleccionar un estado.",
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Debe seleccionar una fecha de entrada.",
        });
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Debe seleccionar una oficina.",
      });
    }
  };

  return (
    <Modal
      show={props.dataShowMUploadPermit}
      onHide={closeModal}
      size="lg"
      centered
    >
      <Modal.Header>
        CARGAR PERMISOS PARA SECCIONAL
        <BsXSquare className="pointer" onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="container">
          <Col sm={12} className="mt-2">
            <Autocomplete
              onChange={(e: any, value: any) => {
                setofficeSelected(value ? value.id : 0);
              }}
              fullWidth
              size="small"
              disablePortal
              id="seccionales"
              options={listOffice}
              renderInput={(params) => (
                <TextField
                  {...params}
                  key={params.id}
                  label="Seleccione una secccional"
                  fullWidth
                  color="secondary"
                />
              )}
            />
          </Col>
          <Col sm={12} className="mt-3">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                label="Fecha Entrada: "
                value={dateInit}
                onChange={(e) => {
                  setDateInit(e);
                  e !== null ? setDateInitError(false) : setDateInitError(true);
                }}
                renderInput={(props) => (
                  <TextField
                    size="small"
                    fullWidth
                    color="secondary"
                    {...props}
                  />
                )}
              />
            </LocalizationProvider>
          </Col>
          <Col sm={12} className="mt-1">
            <TextField
              margin="normal"
              size="small"
              select
              fullWidth
              color="secondary"
              label="Seleccione un tipo de permiso"
              id="state"
              onChange={(e) => setTipoPermiso(parseInt(e.target.value))}
            >
              {listEstado.map((item: any) => (
                <MenuItem value={item.id}>{item.nombre}</MenuItem>
              ))}
            </TextField>
          </Col>
          <Col sm={12} className="mt-2">
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<BsFillCloudUploadFill />}
                className="my-3"
                fullWidth
                onClick={() => {
                  setShowLoad(true);
                }}
              >
                Subir formato
              </Button>
            </ThemeProvider>
            {showL ? (
              <div className="w-100">
                <a className="w-100" href={prevDoc}>
                  {file.Name}
                </a>
              </div>
            ) : (
              ""
            )}
          </Col>
          <Col sm={12}>
            <ThemeProvider theme={inputsTheme}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                endIcon={<BsFillPlusCircleFill />}
                className="my-3"
                fullWidth
                onClick={() => {
                  handleSubmit();
                }}
              >
                ASIGNAR
              </Button>
            </ThemeProvider>
          </Col>
        </Row>
      </Modal.Body>
      <SSpinner show={spinner} />
      {showLoad && (
        <SLoadDocument
          setShow={setShowLoad}
          type={1}
          title={"Permiso"}
          getMedia={getMedia}
          show={showLoad}
          beanAction={null}
          accept={[".xlsx"]}
        />
      )}
    </Modal>
  );
};

export default MUploadPermit;
