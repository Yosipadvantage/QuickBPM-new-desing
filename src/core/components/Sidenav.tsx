import Accordion from "react-bootstrap/Accordion";
import {
  AccordionContext,
  useAccordionToggle,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AdminService } from "../services/AdminService";
import { ConfigService } from "../services/ConfigService";
import { TypesItems, TypesNameApp, TypesPermiso } from "../../types/Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { SSpinner } from "../../shared/components/SSpinner";
import { getSession } from "../../utils/UseProps";
import { ICONS } from "../../modules/admin/components/Icon";

const _adminService = new AdminService();
const _configService = new ConfigService();

function ContextAwareToggle({ children, eventKey, callback }: any) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <button
      className="nav-link btnAccord hvr-sweep-to-left"
      type="button"
      style={{
        backgroundColor: isCurrentEventKey ? "#A492b1" : "#503464",
        borderTopLeftRadius: isCurrentEventKey ? "3rem" : "0rem",
        borderBottomLeftRadius: isCurrentEventKey ? "3rem" : "0rem",
      }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

interface ISideNav { }


export const Sidenav: React.FC<ISideNav> = () => {


  const [radioValue, setRadioValue] = useState("0");
  const [listaMenus, setListaMenu] = useState<any[]>();
  const { IDAccount } = useSelector((state: RootState) => state.auth);
  const [showSpinner, setShowSpinner] = useState(false);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  )

  const llamarUsuario = () => {
    if (getSession()) {
      return `${getSession().Name1} ${getSession().Surname1}`;
    } else {
      return '';
    }
  }

  const dispatch = useDispatch();
  useEffect(() => {
    addID();
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener('change', e => setMatches(e.matches));
    mediaq();
    console.log(IDAccount);

    if (getSession()) {
      loadMenu(getSession().IDAccount);
    } else if (IDAccount) {
      loadMenu(IDAccount);
    }
    loadProperties();

  }, [radioValue, matches, IDAccount]);

  const loadMenu = (id: number) => {
    setShowSpinner(true);
    _adminService.getMenuUsuario(id).subscribe((resp: any) => {
      setShowSpinner(false);
      if (resp.DataBeanProperties.ObjectValue) {
        setListaMenu(resp.DataBeanProperties.ObjectValue);
        console.log(resp.DataBeanProperties.ObjectValue);
      } else {
        setListaMenu([]);
      }
    })
  }

  const loadProperties = (): void => {
    loadItemPerPage();
    loadItemAppName();
    loadPermiso();
  }

  const loadItemPerPage = () => {
    _configService.getSystemProperty("numero_items_tablas").subscribe((resp: any) => {
      /* console.log(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue); */
      if (resp.DataBeanProperties.ObjectValue) {
        dispatch(setearItems(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue));
        // _configService.setItemPerPage(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue);
      }
    })
  }
  const loadItemAppName = () => {
    _configService.getSystemProperty("AppMainName").subscribe((resp: any) => {
      if (resp.DataBeanProperties.ObjectValue) {
        dispatch(setearName(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue));
        // _configService.setItemPerPage(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue);
      }
    })
  }
  const loadPermiso = () => {
    _configService.getSystemProperty("Permiso").subscribe((resp: any) => {
      if (resp.DataBeanProperties.ObjectValue) {
        dispatch(setearPermiso(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue));
        // _configService.setItemPerPage(resp.DataBeanProperties.ObjectValue.DataBeanProperties.SystemValue);
      }
    })
  }

  const setearItems = (data: any) => ({
    type: TypesItems.itemsPerpage,
    data: data
  })
  const setearName = (data: any) => ({
    type: TypesNameApp.appName,
    data: data
  })

  const setearPermiso = (data: any) => ({
    type: TypesPermiso.statusPermiso,
    data: data
  })
  const addID = () => {
    try {

      document.getElementsByClassName('nWhite')[0].setAttribute("id", "layoutSidenav_content");
    } catch (error) {
      console.log(error);
    }
  }
  const mediaq = () => {
    console.log('intenta');
    console.log(matches);

    if (!matches) {

      try {
        document.getElementById('layoutSidenav_content')?.classList.remove('p-3');
        document.getElementById('layoutSidenav_content')?.classList.remove('m-3');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        document.getElementById('layoutSidenav_content')?.classList.add('p-3');
        document.getElementById('layoutSidenav_content')?.classList.add('m-3');
      } catch (error) {
        console.log(error);
      }
    }

  }
  const currentLocation = useLocation();

  let history = useHistory();

  return (
    <>
      <div id="layoutSidenav_nav">
        <nav
          className="sidenav shadow-right sidenav">
          <div className="sidenav-menu">
            <Accordion className="nav accordion mt-5" id="accordionSidenav">
              {listaMenus?.map((item, index) => (
                <>
                  {item?.DataBeanProperties.Hijos.length >= 1 &&
                    <>
                      <ContextAwareToggle variant="" key={`${item.DataBeanProperties.IDApplicationType}-P`} eventKey={item.DataBeanProperties.IDApplicationType}>
                        <div className="mr-2">{ICONS[item.DataBeanProperties.Type ? item.DataBeanProperties.Type : 0]}</div> {item.DataBeanProperties.Name}
                      </ContextAwareToggle>
                      <Accordion.Collapse
                        eventKey={item.DataBeanProperties.IDApplicationType}
                        className="sidenav-menu-nested nav accordion"
                      >
                        <ButtonGroup className="d-flex flex-column">
                          {item.DataBeanProperties.Hijos.map((item2: any, index: number) => (
                            <ToggleButton
                              className="pt-1 pb-1 m-0 d-flex justify-content-start text-left"
                              key={`${item2.Code}-H`}
                              id={`radio-${index}`}
                              type="radio"
                              variant={
                                radioValue === item2.Code ? "menuSelect" : "text-white"
                              }
                              value={item2.Name}
                              checked={radioValue === item2.Name}
                            >
                              <Link
                                to={item2.URL}
                                className="link-sidenav"
                                onClick={() => {

                                  (currentLocation.pathname === item2.URL) && history.go(0)

                                }}
                              >
                                {item2.Name}
                              </Link>
                              {/* {item2.Name} */}
                            </ToggleButton>
                          ))}
                        </ButtonGroup>
                      </Accordion.Collapse>
                    </>
                  }
                </>
              ))}
            </Accordion>
          </div>
          <div className="sidenav-footer">
            <div className="sidenav-footer-content">
              <div className="sidenav-footer-subtitle">Logueado como:</div>
              <div className="sidenav-footer-title">{llamarUsuario()}</div>
            </div>
          </div>
        </nav>
      </div>
      {showSpinner &&
        <SSpinner show={showSpinner} />
      }
    </>
  );
};