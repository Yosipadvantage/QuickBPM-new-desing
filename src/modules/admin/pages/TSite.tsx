
import { useState, useEffect } from "react";

import {
    Col,
    
    Row,
    Breadcrumb,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import {
    Button,
    ButtonGroup,
    MenuItem,
    ThemeProvider,
    TextField,
} from "@mui/material";
import { BsCheckSquare, BsFillBookmarkPlusFill, BsPencilSquare, BsSearch, BsTrash } from "react-icons/bs";
import { TreeService } from "../../../core/services/TreeService";
import { SSpinner } from "../../../shared/components/SSpinner";
import { inputsTheme, useStyles } from "../../../utils/Themes";
import NESite from "../components/NESite";
import { Site } from "../model/site.interface";
import { Toast } from "../../../utils/Toastify";
import { GenericConfirmAction } from "../../../utils/GenericConfirmAction";

const _treeService = new TreeService();


interface ITSite { }

let listAux: any[] = [];

const TSite: React.FC<ITSite> = () => {

    const [IDLn, setIDLn] = useState(0);
    const [formdata, setformdata] = useState<Site>();
    const [list, setList] = useState([]);
    const [name, setName] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showNESite, setShowNESite] = useState(false);
    const [title, setTitle] = useState("");
    const [idDelete, setIDDelete] = useState("");

    useEffect(() => {
        if (listAux.length > 0) {
            listAux.splice(0, listAux.length);
        }
        getTreeForSiteID();
    }, []);

    const getTreeForSiteID = () => {
        setShowSpinner(true);
        _treeService
            .getTreeForSiteID()
            .subscribe((resp: any) => {
                if (resp.DataBeanProperties.ObjectValue) {
                    listAux.push(
                        generateData(
                            0,
                            resp.DataBeanProperties.ObjectValue.EnvolvedObject
                                .DataBeanProperties.Name
                        )
                    );
                    getSiteIDChilds(0);
                    setShowSpinner(false);
                } else {
                    setShowSpinner(false);
                }
            });
    };

    const getSiteIDChilds = (id: number) => {
        setShowSpinner(true);
        _treeService
            .getSiteIDChilds(id)
            .subscribe((resp: any) => {
                if (resp.DataBeanProperties.ObjectValue) {
                    setList(resp.DataBeanProperties.ObjectValue);
                    setShowSpinner(false);
                } else {
                    setShowSpinner(false);
                }
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
                getSiteIDChilds(id);
            } else {
                getTreeForSiteID();
                if (validate(id) === true) {
                    getData(id);
                }
            }
        }
        if (state === "Eliminar") {
            if (id > 0) {
                getSiteIDChilds(id);
            } else {
                getSiteIDChilds(0);
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

    const getItem = (id: number , title: string) => {
        console.log(id, title);
    }

    const closeShowNESite = (data: any) => {
        setShowNESite(data);
        getSelection(IDLn, name, 'Editar');
    }

    // Cambiar any por interface
    const formComponent = (title: string, data?: any) => {
        setTitle(title);
        if (title === "Editar") {
            setformdata(data);
        }
        setShowNESite(true);
    };

    const deleteSiteID = (id: any) => {
        setShowSpinner(true);
        _treeService
            .deleteSiteID(id)
            .subscribe((resp: any) => {
                if (resp.DataBeanProperties.ObjectValue) {
                    getSelection(IDLn, name, 'Eliminar');
                    Toast.fire({
                        icon: "success",
                        title: "Se ha eliminado con éxito!",
                    });
                    setShowSpinner(false);
                } else {
                    setShowSpinner(false);
                }
            });
    };

    /* const deleteItem = (id: any, title: string) => {
        console.log(id, title);
        deleteSiteID(id);
    } */

    const deleteElement = (data: boolean) => {
        if (data) {
            deleteSiteID(idDelete);
        }
    };

    return (
        <Row className="mt-3">
            <Col sm={12}>
                <Breadcrumb className="main-breadcrumb">
                    {listAux.map((item) => (
                        <Breadcrumb.Item
                            className="site-breadcrumb"
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
                        <ThemeProvider theme={inputsTheme}>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                endIcon={<BsFillBookmarkPlusFill />}
                                className="mb-3"
                                onClick={() => {
                                    formComponent("Crear");
                                    getItem(
                                        0,
                                        "Crear"
                                    );
                                }}
                            >
                                Agregar
                            </Button>
                        </ThemeProvider>
                    </Col>
                    <Col sm={12}>
                        <div className="bg-white">
                            <ul className="p-4 site">
                                {list.map((item: any) => (
                                    <li
                                        className="d-flex m-3 align-items-center"
                                        key={item.DataBeanProperties.IDLn}
                                    >
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip id="tooltip-disabled">
                                                    Seleccionar Item
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                title="Seleccionar Grupo"
                                                className="btn btn-datatable btn-icon btn-transparent-dark button-site"
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

                                        {/* editar */}
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip id="tooltip-disabled">
                                                    Editar Item
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                title="Editar"
                                                className="btn btn-datatable btn-icon btn-transparent-dark button-site"
                                                type="button"
                                                onClick={() => {
                                                    formComponent("Editar", item.DataBeanProperties);
                                                    getItem(
                                                        item.DataBeanProperties.IDLn,
                                                        "Editar"
                                                    );
                                                }}
                                            >
                                                <BsPencilSquare />
                                            </button>
                                        </OverlayTrigger>

                                        {/* Eliminar */}
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip id="tooltip-disabled">
                                                    Eliminar Item
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                title="Eliminar"
                                                className="btn btn-datatable btn-icon btn-transparent-dark button-site"
                                                type="button"
                                                onClick={() => {
                                                    setShowDelete(true);
                                                    setIDDelete(item.DataBeanProperties.IDLn);
                                                }}
                                            >
                                                <BsTrash />
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
                    </Col>
                </Row>
            </Col>
            {showNESite && (
                <NESite
                    getShowNESite={closeShowNESite}
                    dataShowNESite={showNESite}
                    dataTitle={title}
                    dataObj={formdata}
                    dataIDLn={IDLn}
                />
            )}
            {showDelete && (
                <GenericConfirmAction
                    show={showDelete}
                    setShow={setShowDelete}
                    confirmAction={deleteElement}
                    title={"¿Está seguro de eliminar el elemento?"}
                />
            )}
            {showSpinner && <SSpinner show={showSpinner} />}
        </Row>
    )
}

export default TSite;