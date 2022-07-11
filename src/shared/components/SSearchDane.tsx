import React from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { BsXSquare, BsSearch, BsPlus } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { GlobalService } from "../../core/services/GlobalService";
import { useState } from "react";
import { Dane } from "../../modules/admin/model/Dane";
import { MenuItem, Select, TextField } from "@mui/material";

import { InputAdornment, IconButton } from "@mui/material";
import { Toast } from "../../utils/Toastify";

const _globalService = new GlobalService();

interface IDane {
  getShowDane: Function;
  getDane: Function;
  dataShowDane: boolean;
}

const SSearchDane: React.FC<IDane> = (props: IDane) => {
  const { register, handleSubmit, getValues, setValue  } = useForm();
  const [type, setType] = useState(0);
  const [list, setList] = useState<Dane[]>([]);

  const closeModal = () => {
    setList([]);
    setValue("entity", {
      Type: "",
      Name: ""
    });
    props.getShowDane(false);
  };

  const getCity = (item: string) => {
    _globalService.getDaneCatalogLikeCity(item).subscribe(resp => {
      console.log(resp);
      if(resp.length > 0){
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

  const getDepartment = (item: string) => {
    _globalService.getDaneCatalogLikeDep(item).subscribe(resp => {
      console.log(resp);
      if(resp.length > 0){
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

  const getData = (data: any) => {
    props.getDane(data);
    closeModal();
  };

  const onChangeSelect = (e: any) => {
    setType(e);
  };

  const searchDane = () => {
    console.log(getValues().entity.Type);
    if (getValues().entity.Type === 1) {
      getDepartment(getValues().entity.Name);
    }
    if (getValues().entity.Type === 2) {
      getCity(getValues().entity.Name);
    }
  };

  return (
    <Modal
      show={props.dataShowDane}
       onHide={closeModal}
      centered
       
    >
      <Modal.Header>
        Buscar Dane
        <BsXSquare  className='pointer' onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Row className="mt-3">
          <Col sm={6}>
            <TextField
              size="small"
              select
              fullWidth
              color="secondary"
              label=".:Seleccione:."
              id="state"
              {...register("entity.Type")}
              onChange={(e) => onChangeSelect(e.target.value)}
            >
              <MenuItem value={1}>Departamento</MenuItem>
              <MenuItem value={2}>Municipio</MenuItem>
            </TextField>
          </Col>
          <Col sm={6}>
            <TextField
              size="small"
              label="Escribir *"
              fullWidth
              color="secondary"
              id="dane"
              {...register("entity.Name", { required: true })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => searchDane()}>
                      <BsSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={12}>
            <ListGroup>
              {list.map((item) => (
                <ListGroup.Item key={item.IDDane}>
                  <div>
                      <IconButton
                        color="secondary"
                        onClick={() => getData(item)}
                      >
                        <BsPlus />
                      </IconButton>
                      {item.IDDane} - {item.Municipio} - {item.Departamento}
                    </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SSearchDane;
