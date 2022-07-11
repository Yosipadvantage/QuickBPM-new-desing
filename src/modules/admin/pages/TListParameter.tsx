import React, { useEffect, useState } from 'react'

import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { AdminService } from '../../../core/services/AdminService';
import { SSpinner } from '../../../shared/components/SSpinner';
import { ListParameter } from '../model/ListParameter';
import TContentParameter from './TContentParameter';
import TSite from './TSite';
import TTypeParameter from './TTypeParameter';

interface ITListParameter { }


const _adminService = new AdminService();

const TListParameter: React.FC<ITListParameter> = () => {

    const [list, setList] = useState<ListParameter[]>([]);
    const [codeList, setCodeList] = useState<number[]>([]);

    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        getTipoListaCatalogPorPropiedad();
    }, [])

    const getTipoListaCatalogPorPropiedad = () => {
        let aux: any = [];
        setShowSpinner(true);
        _adminService.getTipoListaCatalogPorPropiedad()
            .subscribe((resp) => {
                setShowSpinner(false);
                resp.map((item: ListParameter) => {
                    aux.push(item.Codigo);
                })
                setCodeList(aux);
                setList(resp)
            });
    };

    return (
        <div className="nWhite p-3 m-3 w-100">
            <Tab.Container id="left-tabs-example" defaultActiveKey="1">
                <Row>
                    <Col sm={12}>
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link eventKey="1" onClick={() => { getTipoListaCatalogPorPropiedad() }}>Tipo Parámetros</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2" onClick={() => { getTipoListaCatalogPorPropiedad() }}>Contenido Parámetros</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="3">Departamento - Ciudad</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            <Tab.Pane eventKey="1">
                                <TTypeParameter list={list} refreshList={getTipoListaCatalogPorPropiedad} codeList={codeList} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="2">
                                <TContentParameter list={list} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="3">
                                <TSite></TSite>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            {showSpinner && (
                <SSpinner
                    show={showSpinner}
                />
            )}
        </div>
    )
}

export default TListParameter;
