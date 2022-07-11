import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom";
import {
  BsBoxArrowRight,
  BsFillFilePersonFill,
  BsGearFill,
} from "react-icons/bs";
import { startLogout } from "../../actions/Auth";
import { RootState } from "../../store/Store";
import { ReaderTypeDialog } from "../../modules/citizenData/components/ReaderTypeDialog";
import { getSession } from "../../utils/UseProps";
import { GlobalService } from "../services/GlobalService";
import { IPersonPhotoData } from "../../modules/citizenData/model/PersonPhotoData";

interface INavBar {}

export const Navbar: React.FC<INavBar> = () => {
  var timer: any;
  let history = useHistory();
  const dispatch = useDispatch();
  const [abierto, setAbierto] = useState(false);
  const [nombreApp, setNombreApp] = useState("");
  const [Contador, setContador] = useState(0);
  const [personPhotos, setPersonPhotos] = useState<string[]>([]);

  const [show, setShow] = useState(false);
  const _globalService = new GlobalService();
  const FACE = 6;

  const logout = () => {
    console.log("salio");
    dispatch(startLogout());
    history.push("/login");
    localStorage.setItem("c", "f");
    localStorage.removeItem("usuario");
    window.removeEventListener("load", (e) => e);
    window.removeEventListener("mousemove", (e) => e);
    window.removeEventListener("mousedown", (e) => e);
    window.removeEventListener("touchstart", (e) => e);
    window.removeEventListener("click", (e) => e);
    window.removeEventListener("keydown", (e) => e);
    window.removeEventListener("load", (e) => e);
  };
  const { name } = useSelector((state: RootState) => state.appname);
  useEffect(() => {
    setNombreApp(name);
    const u = getSession();
    getPersonPhotoDataByAccount(u.IDAccount);

  }, [name]);

  const getPersonPhotoDataByAccount = (idAccount: number) => {
    let aux: string[] = [];
    _globalService.getPersonPhotoDataCatalog(idAccount).subscribe((resp) => {
      console.log('foto user response ',resp)
      if (resp.length > 0) {
        resp.map((data: IPersonPhotoData) => {
          if (data.SideType === FACE) {
            aux[data.ViewType] = data.URL;
          }
        });
        
        setPersonPhotos(aux);
      }
    });
  };

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setContador(Contador + 1);
      console.log(Contador);
      logout();
    }, 500000);
  };

  const mostrarLateral = () => {
    if (abierto === true) {
      document.getElementById("layoutSidenav_nav")!.style.transform =
        "translateX(-15rem)";
      setAbierto(false);
    } else {
      document.getElementById("layoutSidenav_nav")!.style.transform =
        "translateX(0)";
      setAbierto(true);
    }
  };
  console.log('foto perfil user',personPhotos);
  return (
    <div>
      <nav
        className="topnav navbar navbar-expand shadow navbar-light "
        id="sidenavAccordion"
      >
        <a className="navbar-brand" href="index.html">
          {nombreApp}
        </a>
        <button
          className="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2 ml-10"
          id="sidebarToggle"
          onClick={() => mostrarLateral()}
        ></button>

        <ul className="navbar-nav align-items-center ml-auto">
          <Dropdown
            className="no-caret  dropdown-user  "
          >
            
            {/* Logo  */}
            <Dropdown.Toggle
              className="btn btn-icon btn-transparent-dark dropdown-toggle"
              id="navbarDropdownUserImage"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="img-fluid"
                src={process.env.PUBLIC_URL + "/assets/logodccae_192_192.png"}
                alt="Profile Mini"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="animated--fade-in-up position"
              aria-labelledby="navbarDropdownUserImage"
              style={{margin:0}}
            >
              <div className="dropdown-header d-flex align-items-center justify-content-between">
                <img
                  className="dropdown-user-img "
                  src={
                    !personPhotos[0]
                      ? process.env.PUBLIC_URL + "/assets/img_avatar.png"
                      : personPhotos[0]
                  }
                  style={{
                    width:65,
                    height:65,
                    objectFit:'cover'
                  }}
                  alt="Profile Mini" //comentario para el merge
                />
                <div className="dropdown-user-details ms-5">
                  {getSession() ? (
                    <div>
                      <div className="dropdown-user-details-name">{`${
                        getSession().Name1
                      } ${getSession().Surname1}`}</div>
                      <div className="dropdown-user-details-email">{`${
                        getSession().eMail
                      }`}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="dropdown-user-details-name">
                        Valerie Luna
                      </div>
                      <div className="dropdown-user-details-email">
                        vluna@aol.com
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Dropdown.Item
                className="dropdown-item"
                onClick={() => history.push("/user-config")}
              >
                <div className="dropdown-item-icon">
                  <BsFillFilePersonFill />
                </div>
                Usuario
              </Dropdown.Item>
              <Dropdown.Item
                className="dropdown-item"
                onClick={() => setShow(true)}
              >
                <div className="dropdown-item-icon">
                  <BsGearFill />
                </div>
                Configurar lector biométrico
              </Dropdown.Item>
              <hr className="mb-0 mt-1" />
              <Dropdown.Item
                className="dropdown-item-icon"
                onClick={logout}
              >
                <div className="dropdown-item-icon">
                  <BsBoxArrowRight />
                </div>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown>
        </ul>
      </nav>
      <ReaderTypeDialog show={show} setShow={setShow} />
    </div>
  );
};
