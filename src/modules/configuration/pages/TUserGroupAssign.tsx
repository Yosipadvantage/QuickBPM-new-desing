import React, { useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BsBrush, BsSearch } from "react-icons/bs";


import { TreeService } from "../../../core/services/TreeService";
import SSearchPerson from "../../../shared/components/SSearchPerson";
import { SSearchTree } from "../../../shared/components/SSearchTree";

const _treeService = new TreeService();

interface IUserGroupAssign { }

export const TUserGroupAssign: React.FC<IUserGroupAssign> = () => {


  const [showSTree, setSTree] = useState(false);
  const [group, setGroup] = useState('');
  const [show, setShow] = useState(false);

  const [nit, setNit] = useState('');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [surname1, setSurname1] = useState('');
  const [surname2, setSurname2] = useState('');


  const getData = (data: any) => {

    setGroup(data.name);
  }

  const closeSearch = (data: any) => {
    setShow(data);
  };

  const getItem = (data: any) => {

    setNit(data.Nit);
    setName1(data.Name1);
    setName2(data.Name2);
    setSurname1(data.Surname1);
    setSurname2(data.Surname2);

  }

  const cleanUser = () => {
    setNit('');
    setName1('');
    setName2('');
    setSurname1('');
    setSurname2('');
  }


  const openTree = () => {
    setSTree(true);
  }
  const closeSearchTree = (data: any) => {
    setSTree(data);
  }

  const activateUserToGroup = async (idFn: number, idAccount: number) => {
    await _treeService
      .addWorkGroupMember(idFn, idAccount)
      .subscribe((resp: any) => {
        console.log(resp);
        //Verificar la respuesta y mostrar una alerta de éxito o en su defecto de error, se activo o no correctamente.
      });
  }

  const removeUserFromGroup = async (idFn: number, idAccount: number) => {
    await _treeService
      .removeWorkGroupMember(idFn, idAccount)
      .subscribe((resp: any) => {
        console.log(resp);
        //Verificar la respuesta y mostrar una alerta de éxito o en su defecto de error, se desactivo o no correctamente.
      });
  }


  return (
    <div>
      <Card>
        <Row>
          <Col sm={6}>
            <Card className="w-100 h-100">
              <Card.Title>Usuario</Card.Title>
              <span></span>
              <Card.Body>
                <p>Cédula: {" " + nit}</p>
                <p>Nombre: {" " + name1 + " " + name2}</p>
                <p>Apellido: {" " + surname1 + " " + surname2}</p>
              </Card.Body>
              <Card.Footer>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">Buscar usuario</Tooltip>
                  }
                >
                  <Button className="btn btn-dark"
                    onClick={() => setShow(true)}
                  >
                    <BsSearch />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">Limpiar usuario</Tooltip>
                  }
                >
                  <Button className="btn btn-primary"
                    onClick={() => cleanUser()}
                  >
                    <BsBrush />
                  </Button>
                </OverlayTrigger>
              </Card.Footer>
            </Card>
          </Col>
          <Col sm={6}>
            <Card className="w-100 h-100">
              <Card.Title>Grupo de trabajo</Card.Title>
              <span></span>
              <Card.Body>
                <p>Grupo: {group}</p>
              </Card.Body>
              <Card.Footer>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">Buscar grupo</Tooltip>
                  }
                >
                  <Button className="btn btn-dark"
                    onClick={() => openTree()}
                  >
                    <BsSearch />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">Limpiar grupo</Tooltip>
                  }
                >
                  <Button className="btn btn-primary"
                    onClick={() => setGroup('')}
                  >
                    <BsBrush />
                  </Button>
                </OverlayTrigger>
              </Card.Footer>
            </Card>
          </Col>
          <Card.Footer className="w-100">
            <Col sm={12}>
              <div className="row">
                <div className="col sm-6">
                  <Button className="btn btn-primary">Activar</Button>
                </div>
                <div className="col sm-6">
                  <Button className="btn btn-danger">Desactivar</Button>
                </div>
              </div>
            </Col>
          </Card.Footer>
        </Row>
      </Card>
      <SSearchTree getShowSTree={closeSearchTree} getDataTree={getData} dataShowTree={showSTree} />
      <SSearchPerson getShow={closeSearch} getPerson={getItem} dataShow={show} />
    </div>
  );
};
