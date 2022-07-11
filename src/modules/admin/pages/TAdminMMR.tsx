import React, { useEffect, useState } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";

import { AdminService } from "../../../core/services/AdminService";
import { TAdminMenus } from "./TAdminMenus";
import { TAdminModules } from "./TAdminModules";
import {SSpinner} from '../../../shared/components/SSpinner'
import { Toast } from "../../../utils/Toastify";
import { IApplicationTypeModule } from "../model/Applicationtype";

interface ITAdminMMR { }

const _adminService = new AdminService();

export const TAdminMMR: React.FC<ITAdminMMR> = () => {

  const [showSpinner, setShowSpinner] = useState(true);
  const [listModules, setListModules] = useState<IApplicationTypeModule[]>([]);

  useEffect(() => {
    getApplicationTypeCatalog();
  }, [])

  const getActive = (data: any) => {
    console.log(data);
    setShowSpinner(data);
  };

  const getApplicationTypeCatalog = () => {
    _adminService.getApplicationTypeCatalog().subscribe(resp => {
      console.log(resp);
      if (resp) {
        setShowSpinner(false);
        setListModules(resp);
      } else {
        Toast.fire({
          icon: "error",
          title: "No se ha cargado la información",
        });
      }
    });
  };

  return (
    <div className="d-flex nWhite p-3 m-3 w-80 flex-wrap align-items-start justify-content-center p-2">
      <Tab.Container id="left-tabs-example" defaultActiveKey="modules">
        <Row className="w-100">
          <Col sm={12}>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="modules">Módulos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="menus" onSelect={getApplicationTypeCatalog}>Menú</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="modules">
                <TAdminModules getShowSpinner={getActive} listModules={listModules} refresh={getApplicationTypeCatalog} />
              </Tab.Pane>
              <Tab.Pane eventKey="menus">
                <TAdminMenus getShowSpinner={getActive} listModules={listModules} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      {showSpinner && (
        <div className="spinner d-flex justify-content-center">
         <SSpinner show={showSpinner}/>
        </div>
      )}
    </div>
  );
};
