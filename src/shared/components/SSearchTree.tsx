import {
  Button,
  Col,
  Modal,
  Row,
  Breadcrumb,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsXSquare, BsCheckSquare } from "react-icons/bs";
import { useState, useEffect } from "react";
import { TreeService } from "../../core/services/TreeService";

const _treeService = new TreeService();

let listAux: any[] = [];

interface ISSearchTree {
  getShowSTree: Function;
  getDataTree: Function;
  dataShowTree: boolean;
}

export const SSearchTree: React.FC<ISSearchTree> = (props: ISSearchTree) => {

  const [list, setList] = useState([]);
  const [IDLn, setIDLn] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    if (listAux.length > 0) {
      listAux.splice(0, listAux.length);
    }
    getTreeForFunctionalID();
  }, []);

  const getTreeForFunctionalID = () => {
    _treeService
      .getTreeForFunctionalID()
      .subscribe((resp: any) => {
        listAux.push(
          generateData(
            0,
            resp.DataBeanProperties.ObjectValue.EnvolvedObject
              .DataBeanProperties.Name
          )
        );
        getFunctionalIDChilds(0);
      });
  };

  const getFunctionalIDChilds = (id: number) => {
    _treeService
      .getFunctionalIDChilds(id)
      .subscribe((resp: any) => {
        setList(resp.DataBeanProperties.ObjectValue);
      });
  };

  const getSelection = (id: number, name: any, state?: string) => {
    setIDLn(id);
    setName(name);
    if (state === "Editar") {
      if (id > 0) {
        if (validate(id) === true) {
          getData(id);
        }
        if (validate(id) === false) {
          listAux.push(generateData(id, name));
        }
        getFunctionalIDChilds(id);
      } else {
        getTreeForFunctionalID();
        if (validate(id) === true) {
          getData(id);
        }
      }
    }
    if (state === "Eliminar") {
      if (id > 0) {
        getFunctionalIDChilds(id);
      } else {
        getFunctionalIDChilds(0);
      }
    }
  };

  const validate = (id: number) => {
    for (let i = 0; i < listAux.length; i++) {
      if (id === listAux[i].idValue) {
        return true;
      }
    }
    return false;
  };

  const getData = (id: number) => {
    for (let i = 0; i < listAux.length; i++) {
      if (id === listAux[i].idValue) {
        listAux.splice(i, listAux.length);
      }
    }
  };

  const generateData = (id: number, value: any) => {
    const data = {
      idValue: id,
      dataValue: value,
    };
    return data;
  };

  const saveID = () => {
    props.getDataTree({ IDLn, name });
    closeModalSTree();
  }

  const closeModalSTree = () => {
    props.getShowSTree(false);
  };

  return (
    <Modal
      show={props.dataShowTree}
      modal
      size="lg"
      centered
      onHide={closeModalSTree}
    >
      <Modal.Header>
        Buscar Grupo de Trabajo
        <BsXSquare className='pointer' onClick={closeModalSTree} />
      </Modal.Header>
      <Modal.Body>
        <Row className="mt-3">
          <Col sm={12}>
            <Breadcrumb>
              {listAux.map((item) => (
                <Breadcrumb.Item
                  key={item}
                  onClick={() => {
                    getSelection(item.idValue, item.dataValue, "Editar");
                  }}
                >
                  {item.dataValue}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Row className="mt-3">
              <Col sm={12}>
                <div className="bg-white">
                  <ul className="p-4">
                    {list.map((item: any) => (
                      <li
                        className="d-flex m-3 align-items-center"
                        key={item.DataBeanProperties.IDLn}
                      >
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Seleccionar Grupo
                            </Tooltip>
                          }
                        >
                          <button
                            title="Seleccionar Grupo"
                            className="btn btn-datatable btn-icon btn-transparent-dark"
                            type="button"
                            onClick={() => {
                              getSelection(
                                item.DataBeanProperties.IDLn,
                                item.DataBeanProperties.Name,
                                "Editar"
                              );
                            }}
                          >
                            <BsCheckSquare />
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Seleccionar Grupo
                            </Tooltip>
                          }
                        >
                          <p
                            className="mb-0 p-1"
                            onClick={() => {
                              getSelection(
                                item.DataBeanProperties.IDLn,
                                item.DataBeanProperties.Name,
                                "Editar"
                              );
                            }}
                          >
                            {item.DataBeanProperties.Code} -{" "}
                            {item.DataBeanProperties.Name}{" "}
                          </p>
                        </OverlayTrigger>
                      </li>
                    ))}
                  </ul>
                </div>
                <Row className="mb-3">
                  <Col sm={12}>
                    {name} &nbsp;&nbsp;
                    <Button
                      variant="success"
                      type="button"
                      onClick={() => {
                        saveID();
                      }}>
                      Seleccionar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
