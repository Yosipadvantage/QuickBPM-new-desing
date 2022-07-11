import {Button, Card, Col, Form, Row} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

interface TUserSearch {}

export const TUserGroupSearch: React.FC<TUserSearch> = () => {
  return (
    <div>
      <Card>
          <Row>
              <Col sm={5}>
              <Form.Label>Grupo de trabajo:</Form.Label>
              <div className="input-group">
                <Form.Control
                  id="inlineFormInputGroup"
                />
                <div className="input-group-prepend">
                  <Button
                    type="button"
                    variant="success"
                    className="rounded-right"
                    /* onClick={() => openTree()} */
                  >
                    <BsSearch />
                  </Button>
                </div>
              </div>
              </Col>
              <Col sm={5}></Col>
              <Col sm={2}></Col>
          </Row>
      </Card>

      <Card>
        <Card.Header>
          <h2>Usuarios en este grupo de trabajo</h2>
        </Card.Header>
        <Card.Body>
          <table
            className="table table-bordered table-hover"
            id="dataTable"
            width="100%"
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Cédula/Nit</th>
                <th scope="col">Nombre</th>
                <th scope="col">Grupo de trabajo</th>
                <th scope="col">Desde</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </Card.Body>
      </Card>
    </div>
  );
};
