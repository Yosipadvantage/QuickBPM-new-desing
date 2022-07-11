import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { P_Login } from "./auth/P_Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/Store";
import T_Characterization from "./modules/configuration/pages/T_Chararacterization";
import { Navbar } from "./core/components/Navbar";
import { Sidenav } from "./core/components/Sidenav";
import { TUsersRoles } from "./modules/admin/pages/TUsersRoles";
import TTreeGroup from "./modules/configuration/pages/TTreeGroup";
import TKindProcedure from "./modules/configuration/pages/TKindProcedure";
import { T_Procedure } from "./modules/configuration/pages/T_Procedure";
import { T_BusinesProcess } from "./modules/configuration/pages/T_BusinessProcess";
import { TSuscription } from "./modules/suscription/pages/TSuscription";
import { TTrayForVerify } from "./modules/trays/pages/TTrayForVerify";
import { TAdminMMR } from "./modules/admin/pages/TAdminMMR";
import TListParameter from "./modules/admin/pages/TListParameter";
import { TTrayToBeAssing } from "./modules/trays/pages/TTrayToBeAssign";
import { TTrayForManage } from "./modules/trays/pages/TTrayForManage";
import { TTrayForRejected } from "./modules/trays/pages/TTrayForRejected";
import { TTrayMyProcedures } from "./modules/trays/pages/TTrayMyProcedures";
import { TSystemProperties } from "./modules/admin/pages/TSystemProperties";
import THistoryProcess from "./modules/configuration/pages/THistoryProcess";
import TOficce from "./modules/configuration/pages/TOffice";
import TTypeForms from "./modules/configuration/pages/TTypeForms";
import TForms from "./modules/configuration/pages/TForms";
import TJsonServiceClass from "./modules/configuration/pages/TJsonServiceClass";
import TJsonService from "./modules/configuration/pages/TJsonService";
import T_CustomerType from "./modules/configuration/pages/T_CustomerType";
import { useEffect } from "react";
import { getBusinessClassCatalog } from "./actions/AConfig";
import TCategoryResource from "./modules/multimedia/pages/TCategoryResource";
import TResource from "./modules/multimedia/pages/TResource";
import TNew from "./modules/multimedia/pages/TNew";
import { formP } from "./auth/formp";
import { TOpenAgenda } from "./modules/agenda/pages/TOpenAgenda";
import { TAgenda } from "./modules/agenda/pages/TAgenda2";
import { T_CinarList } from "./modules/weapons/pages/TAtencionCINAR";
import { TIndumilOffices } from "./modules/weapons/pages/TIndumilOffices";
import { TWeapon } from "./modules/weapons/pages/TWeapon";
import { NEMeet } from "./modules/agenda/components/NEMeet";
import { SRegisterBioData } from "./modules/citizenData/pages/SRegisterBioData";
import { SValidationBioData } from "./modules/citizenData/pages/SValidationBioData";
import { SUser } from "./modules/admin/pages/SUser";
import { SSpecialPermission } from "./modules/weapons/pages/SSpecialPermission";
import { TPermission } from "./modules/weapons/pages/TPermission";
import { DataBase } from "./auth/DataBase";
import { TTypeProduct } from "./modules/weapons/pages/TTypeProduct";
import { TLote } from "./modules/weapons/pages/TLote";
import { TProductKind } from "./modules/weapons/pages/TProductKind";
import { TProduct } from "./modules/weapons/pages/TProduct";
import { TloadStore } from "./modules/weapons/pages/TloadStore";
import { TPushStore } from "./modules/weapons/components/TPushStore";
import { TIncomeStore } from "./modules/weapons/pages/TIncomeStore";
import { TRealeaseStore } from "./modules/weapons/pages/TRealeaseStore";
import { TWeaponCitizen } from "./modules/weapons/pages/TWeaponCitizen";
import TTrayAntecedent from "./modules/trays/pages/TTrayAntecedent";
import TTrayAntecedentCommittee from "./modules/trays/pages/TTrayAntecedentCommittee";
import TRecord from "./modules/weapons/pages/TRecord";
import { TCitizenCreate } from "./modules/citizenData/pages/TCitizenCreate";
import TTrayMarking from "./modules/trays/pages/TTrayMarking";
import TTrayPrint from "./modules/trays/pages/TTrayPrint";
import { TCompanyCreate } from "./modules/citizenData/pages/TCompanyCreate";
import { TFireWeapon } from "./modules/weapons/pages/TFireWeapon";
import TTrayPermit from "./modules/trays/pages/TTrayPermit";
import { TTrayNotification } from "./modules/trays/pages/TTrayNotification";
import { SGenerateCinar } from "./modules/weapons/pages/SGenerateCinar";
import { SDataSyncro } from "./modules/citizenData/pages/SDataSyncro";
import { TManageFines } from "./modules/weapons/pages/TManageFines";
import { RegisterCall } from "./modules/weapons/pages/SRegisterCall";
import { TTableCall } from "./modules/weapons/pages/TTableCall";
import TBasicData from "./modules/audit/pages/TBasicData";
import { TMulta } from "./modules/audit/components/TMulta";
import { TAuditorias } from "./modules/audit/pages/TAuditorias";
// import { TItemsCiudadano } from "./modules/audit/components/TItemCiudadano";
import { TAutorizado } from './modules/audit/components/TAutorizado';
import { AprobationForm } from "./modules/weapons/components/AprobaionForm";
import { TipoNovedad } from "./modules/weapons/pages/TipoNovedad";
import { RevalidationForm } from "./modules/weapons/components/RevalidationForm";
import { HomologacionArmas } from "./modules/weapons/pages/HomologacionArmas";

// import { TItemsCiudadano } from "./modules/audit/components/TItemCiudadano";

interface IApp { }

export const App: React.FC<IApp> = () => {


  const { checking } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBusinessClassCatalog());
  }, [dispatch]);

  if (!checking) {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" component={P_Login} />
          <Route exact path="/data-base" component={DataBase} />

          {!checking ? <Redirect to="/login" /> : <Redirect to="/dashboard" />}
        </Switch>
      </HashRouter>
    );
  } else {
    return (
      <div>
        <HashRouter>
          <Route exact path="/formPrueba" component={formP} />
          <Navbar />
          <div id="layoutSidenav">
            <Sidenav />
            <Switch>
              <Route exact path="/user" component={TUsersRoles} />
              <Route exact path="/grupo" component={TTreeGroup} />
              <Route exact path="/kindProcedure" component={TKindProcedure} />
              <Route exact path="/procedure" component={T_Procedure} />
              <Route exact path="/process" component={T_BusinesProcess} />
              <Route exact path="/suscription" component={TSuscription} />
              <Route
                exact
                path="/trayDocumentsForVerify"
                component={TTrayForVerify}
              />
              <Route exact path="/adminMenu" component={TAdminMMR} />
              <Route exact path="/parameter" component={TListParameter} />
              <Route
                exact
                path="/trayProcessToBeAssign"
                component={TTrayToBeAssing}
              />
              <Route
                exact
                path="/trayDocumentsForManage"
                component={TTrayForManage}
              />
              <Route
                exact
                path="/trayDocumentsReject"
                component={TTrayForRejected}
              />
              <Route
                exact
                path="/trayMyProcess"
                component={TTrayMyProcedures}
              />
              <Route
                exact
                path="/systemProperties"
                component={TSystemProperties}
              />
              <Route
                exact
                path="/history-process"
                component={THistoryProcess}
              />
              <Route exact path="/Office" component={TOficce} />
              <Route exact path="/type-forms" component={TTypeForms} />
              <Route exact path="/forms" component={TForms} />
              <Route
                exact
                path="/json-service-class"
                component={TJsonServiceClass}
              />
              <Route exact path="/json-service" component={TJsonService} />
              <Route exact path="/customer-type" component={T_CustomerType} />
              <Route
                exact
                path="/characterization"
                component={T_Characterization}
              />
              <Route
                exact
                path="/category-resource"
                component={TCategoryResource}
              />
              <Route exact path="/resource" component={TResource} />
              <Route exact path="/news" component={TNew} />
              <Route exact path="/agenda" component={TOpenAgenda} />
              <Route
                exact
                path="/indumil-offices"
                component={TIndumilOffices}
              />
              <Route exact path="/weapons" component={TWeapon} />
              <Route exact path="/new-meet" component={NEMeet} />
              <Route exact path="/view-agenda" component={TAgenda} />
              <Route exact path="/user-config" component={SUser} />
              <Route exact path="/product-kind" component={TProductKind} />
              <Route
                exact
                path="/permissions-generator"
                component={SSpecialPermission}
              />
              <Route exact path="/permissions" component={TPermission} />
              <Route exact path="/bio-data" component={SRegisterBioData} />
              <Route exact path="/sync-data" component={SDataSyncro} />
              <Route
                exact
                path="/bio-data-validation"
                component={SValidationBioData}
              />
              <Route exact path="/product-type" component={TTypeProduct} />
              <Route exact path="/lots" component={TLote} />
              <Route exact path="/products" component={TProduct} />
              <Route exact path="/load-store" component={TloadStore} />
              <Route exact path="/push-store" component={TPushStore} />
              <Route exact path="/income-store-list" component={TIncomeStore} />
              <Route
                exact
                path="/realease-store-list"
                component={TRealeaseStore}
              />
              <Route exact path="/weapon-citizen" component={TWeaponCitizen} />
              <Route
                exact
                path="/tray-antecedent"
                component={TTrayAntecedent}
              />
              <Route
                exact
                path="/tray-antecedent-committee"
                component={TTrayAntecedentCommittee}
              />
              <Route exact path="/document-records" component={TRecord} />
              <Route
                exact
                path="/activate-citizen"
                component={TCitizenCreate}
              />
              TPermisos
              <Route exact path="/create-company" component={TCompanyCreate} />
              <Route exact path="/tray-marking" component={TTrayMarking} />
              <Route exact path="/tray-print" component={TTrayPrint} />
              <Route exact path="/fire-weapons" component={TFireWeapon} />
              <Route exact path="/tray-permit" component={TTrayPermit} />
              <Route exact path="/register-call" component={RegisterCall} />
              <Route exact path="/table-call" component={TTableCall} />
              <Route
                exact
                path="/tray-notification"
                component={TTrayNotification}
              />
              <Route exact path="/cinar" component={SGenerateCinar} />
              <Route exact path="/cinar-list" component={T_CinarList} />
              <Route exact path="/basic-data" component={TBasicData} />
              <Route exact path='/table-basic' component={TAutorizado} />
              <Route exact path="/manage-fines" component={TManageFines} />
              <Route exact path="/tipo-novedad" component={TipoNovedad} />
              <Route exact path="/my-audits" render={() => <TAuditorias type={1} />} />
              <Route exact path="/audits" render={() => <TAuditorias type={2} />} />
              <Route exact path='/revalidationForm' component={RevalidationForm} />
              <Route exact path='/weapons-homologation' component={HomologacionArmas} />

              (!checking) ?
              <Redirect to="/login" />
              : (
              <Redirect to="/dashboard" />
              )
            </Switch>
          </div>
        </HashRouter>
      </div>
    );
  }
};
