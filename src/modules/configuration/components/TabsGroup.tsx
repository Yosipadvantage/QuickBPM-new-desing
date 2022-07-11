import { Card, Nav, Tab } from "react-bootstrap";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import TTreeGroup from "../pages/TTreeGroup";
import { TUserGroupAssign } from "../pages/TUserGroupAssign";
import { TUserGroupSearch } from "../pages/TUserGroupSearch";

interface TabsGroup {

}

const TabsGroup: React.FC<TabsGroup> = () => {
  return (

    <div className="nWhite w-80 p-3 m-3">
      <Tab.Container>
        <Nav variant="pills" defaultActiveKey="wg">
          <Nav.Item>
            <Nav.Link eventKey="wg">Gestión de grupos de trabajo</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="wg-asign">
              Asignar usuario a grupo de trabajo
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="wg-users">
              Lista de usuarios por grupos de trabajo
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <hr className="mt-0 colorCustom" />
        <Tab.Content>
          <Tab.Pane eventKey="wg">
            <TTreeGroup />
          </Tab.Pane>
          <Tab.Pane eventKey="wg-asign">
            <TUserGroupAssign />
          </Tab.Pane>
          <Tab.Pane eventKey="wg-users">
            <TUserGroupSearch />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>

  );
};

export default TabsGroup;
