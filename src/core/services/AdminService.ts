import { map, Observable } from "rxjs";
import {
  IApplicationTypeMenu,
  IApplicationTypeModule,
  IApplicationTypeRole,
} from "../../modules/admin/model/Applicationtype";
import { IBusinessRole } from "../../modules/admin/model/BusinessRole";
import { IConditionStatement } from "../../modules/configuration/model/ConditionStatement";
import { ListParameter } from "../../modules/admin/model/ListParameter";
import { SystemProperty } from "../../modules/admin/model/SystemPropertie";
import { ITipoLista } from "../../modules/admin/model/TipoLista";
import { IWorkGroupRole } from "../../modules/admin/model/WorkGroupRole";
import { DataForm } from "../../modules/configuration/model/Form";
import { JsonService } from "../../modules/configuration/model/JsonService";
import { JsonServiceClass } from "../../modules/configuration/model/JsonServiceClass";
import { IResponseValue } from "../../modules/configuration/model/ResponseValue";
import { IResponseValueJson } from "../../modules/configuration/model/ResponseValueJson";
import { TypeForm } from "../../modules/configuration/model/TypeForm";
import { CategoryResource } from "../../modules/multimedia/model/CategoryResource";
import { New } from "../../modules/multimedia/model/New";
import { Resource } from "../../modules/multimedia/model/Resource";
import { User } from "../../shared/model/User";
import http from "../http-common";
import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";
import { env } from "../../env";
import { JsonProperty } from "../../modules/configuration/model/json-property.interface";


const baseUrl = env.REACT_APP_ENDPOINT;

export class AdminService {

  private url = "/jsserver";

  //..//..//...:: ROLE SERVICES ::..//..//..//..

  public getRoleCatalog(): Observable<IApplicationTypeRole[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getRoleCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IApplicationTypeRole>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateRole(
    bean: IApplicationTypeRole
  ): Observable<IApplicationTypeRole> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.securitymanager.Role_updateRole_com.advantage.bean.securitymanager.Role",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.advantage.bean.securitymanager.Role",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IApplicationTypeRole
        )
      );
  }

  public deleteRole(id: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "void_deleteRole_com.advantage.bean.securitymanager.Role",
      ArgumentList: [
        {
          DataBeanProperties: {
            IDRole: id,
          },
          DataBeanName: "com.advantage.bean.securitymanager.Role",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public checkBusinessLogicForRole(idRole: number, idLn: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "Boolean_checkBusinessLogicForRole_Number_Number",
      ArgumentList: [idRole, idLn],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public addBusinessLogicToRole(idRole: number, idLn: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.securitymanager.BusinessFunction_addBusinessLogicToRole_Number_Number",
      ArgumentList: [idRole, idLn],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public deleteBusinessLogicToRole(idRole: number, idLn: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.securitymanager.BusinessFunction_removeBusinessLogicToRole_Number_Number",
      ArgumentList: [idRole, idLn],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: ABSTRACT ACCOUNTS SERVICES ::..//..//..//..

  updateAbstractAccount(idAccount: number, idRole: number): Observable<User> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_updateAbstractAccount_com.advantage.bean.account.AbstractAccount",
      ArgumentList: [
        {
          DataBeanProperties: {
            RoleID: idRole,
            IDAccount: idAccount,
            Active: true,
          },
          DataBeanName: "com.advantage.bean.account.AbstractAccount",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as User
        )
      );
  }

  restablecerContrasena(email: string) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_restablecerContrasena_String",
      ArgumentList: [email],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  cambiarContrasena(idAccount: number, oldPassword: string, newPassword: string) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_actualizarContrasena_Number_String_String",
      ArgumentList: [idAccount, oldPassword, newPassword],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  desactivateUserAccount(idAccount: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "Number_desactivateUserAccount_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  createAbstractAccount(bean: any): Observable<User> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_createAbstractAccount_com.advantage.bean.account.AbstractAccount",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.advantage.bean.account.AbstractAccount",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as User
        )
      );
  }

  putAbstractAccount(bean: any): Observable<User> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_updateAbstractAccount_com.advantage.bean.account.AbstractAccount",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.advantage.bean.account.AbstractAccount",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as User
        )
      );
  }

  // Tipo Lista Parametros

  public updateTipoLista(bean: ITipoLista): Observable<ITipoLista> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.TipoLista_updateTipoLista_co.mil.dccae.armas.bean.TipoLista",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.TipoLista",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as ITipoLista
        )
      );
  }

  public getTipoListaCatalogPorPropiedad(): Observable<ListParameter[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getTipoListaCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ListParameter>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public deleteTipoLista(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteTipoLista_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  // Contenido Lista Parametros

  public updateListaParametros(bean: ListParameter): Observable<ListParameter> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.ListaParametros_updateListaParametros_co.mil.dccae.armas.bean.ListaParametros",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.ListaParametros",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as ListParameter
        )
      );
  }

  /* getListaParametrosOrdenado(id: number) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.ListaParametros_getListaParametros_Number",
      ArgumentList:[ id ]        
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  public getListaParametrosOrdenado(id: number): Observable<ListParameter[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getListaParametrosCatalogPorPropiedad_String_Object_Number",
      ArgumentList: ["IDTipoLista", id, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ListParameter>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public deleteListaParametros(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteListaParametros_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: APPLICATIONS TYPES SERVICES ::..//..//..//..

  public getApplicationTypeCatalog(): Observable<IApplicationTypeModule[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getApplicationTypeCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<SystemProperty>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateApplicationType(
    bean: IApplicationTypeModule
  ): Observable<IApplicationTypeModule> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.orange.bean.application.ApplicationType_updateApplicationType_com.orange.bean.application.ApplicationType",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.orange.bean.application.ApplicationType",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IApplicationTypeModule
        )
      );
  }

  deleteApplicationType(id: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "void_deleteApplicationType_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: APPLICATIONS DA SERVICES ::..//..//..//..

  public getRolPermisoPorMenu(
    id: number,
    idRole: number
  ): Observable<IApplicationTypeMenu[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getRolPermisoPorMenu_Number_Number",
      ArgumentList: [id, idRole]
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IApplicationTypeMenu>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getApplicationIDAtLevel(
    id: number
  ): Observable<IApplicationTypeMenu[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "java.util.List_getApplicationIDAtLevel_Number_int_String_Number_Number_Number",
      ArgumentList: [id, 0, null, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IApplicationTypeMenu>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public createApplicationID(
    bean: IApplicationTypeMenu
  ): Observable<IApplicationTypeMenu> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.orange.bean.application.ApplicationID_createApplicationID_com.orange.bean.application.ApplicationID_Number",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.orange.bean.application.ApplicationID",
        },
        0,
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IApplicationTypeMenu
        )
      );
  }

  public deleteApplicationID(id: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "Number_deleteApplicationID_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: SYSTEM PROPERTIES SERVICES ::..//..//..//..

  public getSystemPropertyList(): Observable<SystemProperty[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getSystemPropertyList_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<SystemProperty>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateSystemProperty(
    bean: SystemProperty
  ): Observable<SystemProperty> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.SystemProperty_updateSystemProperty_com.advantage.bean.account.SystemProperty",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.advantage.bean.account.SystemProperty",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as SystemProperty
        )
      );
  }

  public deleteSystemProperty(id: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "void_deleteSystemProperty_com.advantage.bean.account.SystemProperty",
      ArgumentList: [
        {
          DataBeanProperties: {
            IDSystemProperty: id,
          },
          DataBeanName: "com.advantage.bean.account.SystemProperty",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public Report_executeSQL(media: string, mediaContext: string) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "OrangeCore",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.advantage.shared.Report_executeSQL_String_String_String",
      "ArgumentList": [
        media,
        mediaContext,
        null
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);

  }


  //..//..//...:: TYPE FORMS SERVICES ::..//..//..//..

  public getFormClassCatalog(): Observable<TypeForm[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFormClassCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<TypeForm>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateFormClass(bean: TypeForm): Observable<TypeForm> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.FormClass_updateFormClass_com.quickbpm.bean.FormClass",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.FormClass",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as TypeForm
        )
      );
  }

  public deleteFormClass(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteFormClass_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: FORMS SERVICES ::..//..//..//..

  public getFormCatalogByBusinessProcess(id: number): Observable<DataForm[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFormCatalogByBusinessProcess_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<DataForm>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getFormCatalog(id: number | null): Observable<DataForm[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFormCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<DataForm>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateForm(bean: DataForm): Observable<DataForm> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.quickbpm.bean.Form_updateForm_com.quickbpm.bean.Form",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.Form",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as DataForm
        )
      );
  }

  public deleteForm(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteForm_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: JSON SERVICE CLASS SERVICES ::..//..//..//..

  public getJsonServiceClassCatalog(): Observable<JsonServiceClass[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getJsonServiceClassCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<JsonServiceClass>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateJsonServiceClass(
    bean: JsonServiceClass
  ): Observable<JsonServiceClass> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.JsonServiceClass_updateJsonServiceClass_com.quickbpm.bean.JsonServiceClass",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.JsonServiceClass",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as JsonServiceClass
        )
      );
  }

  public deleteJsonServiceClass(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteJsonServiceClass_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public updateJsonPropertiesFromJsonService(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_updateJsonPropertiesFromJsonService_Number",
      ArgumentList: [
        id
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public validateForInvokeJsonService(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_validateForInvokeJsonService_Number",
      ArgumentList: [
        id
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getJsonPropertyCatalog(id: number): Observable<JsonProperty[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getJsonPropertyCatalog_Number",
      ArgumentList: [
        id
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<JsonProperty>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  //..//..//...:: JSON SERVICE SERVICES ::..//..//..//..

  public getJsonServiceCatalog(id: number | null): Observable<JsonService[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getJsonServiceCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<JsonService>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateJsonService(bean: JsonService): Observable<JsonService> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.JsonService_updateJsonService_com.quickbpm.bean.JsonService",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.JsonService",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as JsonService
        )
      );
  }

  public deleteJsonService(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteJsonService_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: CATEGORY RESOURCE ::..//..//..//..

  public getCategoriaRecursoCatalogPorPropiedad(): Observable<
    CategoryResource[]
  > {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getCategoriaRecursoCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<CategoryResource>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateCategoriaRecurso(
    bean: CategoryResource
  ): Observable<CategoryResource> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.CategoriaRecurso_updateCategoriaRecurso_co.mil.dccae.armas.bean.CategoriaRecurso",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.CategoriaRecurso",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as CategoryResource
        )
      );
  }

  public deleteCategoriaRecurso(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteCategoriaRecurso_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: RESOURCE ::..//..//..//..

  public getRecursosCatalogPorPropiedad(
    id: number | null
  ): Observable<Resource[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getRecursosCatalogPorIDCategoriaRecurso_Number_Number",
      ArgumentList: [id, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Resource>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateRecursos(bean: Resource): Observable<Resource> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.Recursos_updateRecursos_co.mil.dccae.armas.bean.Recursos",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Recursos",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Resource
        )
      );
  }

  public deleteRecursos(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteRecursos_Number",
      ArgumentList: [
        id
      ]
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: CATEGORY RESOURCE ::..//..//..//..

  public getNoticiaCatalogPorPropiedad(id: number): Observable<New[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getNoticiaCatalogPorPropiedad_String_Object_Number",
      ArgumentList: ["IDVisualizacion", id, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<New>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public updateNoticia(bean: New): Observable<New> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.Noticia_updateNoticia_co.mil.dccae.armas.bean.Noticia",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Noticia",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as New
        )
      );
  }

  public deleteNoticia(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteNoticia_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public updateBusinessRole(bean: IBusinessRole): Observable<IBusinessRole> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.BusinessRole_updateBusinessRole_com.quickbpm.bean.BusinessRole",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.BusinessRole",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IBusinessRole
        )
      );
  }

  getBusinessRoleCatalog(idLn: number): Observable<IBusinessRole[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getBusinessRoleCatalog_Number",
      ArgumentList: [idLn],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<New>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }
  deleteBusinessRole(idBusinessRole: number | undefined): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "Integer_deleteBusinessRole_Number",
      ArgumentList: [idBusinessRole],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  addWorkGroupRole(
    idWorkGroupMember: number,
    idBusinessRole: number
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupRole_addWorkGroupRole_Number_Number",
      ArgumentList: [idWorkGroupMember, idBusinessRole],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getWorkGroupRoleCatalog(
    idWorkGroupMember: number
  ): Observable<IWorkGroupRole[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getWorkGroupRoleCatalog_Number",
      ArgumentList: [idWorkGroupMember],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IWorkGroupRole>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }
  updateWorkGroupRole(bean: IWorkGroupRole): Observable<IWorkGroupRole> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupRole_updateWorkGroupRole_com.quickbpm.bean.WorkGroupRole",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.WorkGroupRole",
        },
      ],
    };
    return api
      .post<any>(this.url, parametros)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IWorkGroupRole
        )
      );
  }

  //..//..//...:: RESPONSE VALUE ::..//..//..//..
  public getResponseValueForForm(idForm: number): Observable<IResponseValue[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getResponseValueForForm_Number",
      ArgumentList: [idForm],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IResponseValue>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getJsonDataTypes(): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getJsonDataTypes_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public addResponseValue(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_addResponseValue_com.quickbpm.bean.ResponseValue",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.ResponseValue",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public deleteResponseValue(idResponse: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteResponseValue_Number",
      ArgumentList: [idResponse],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //..//..//...:: RESPONSE VALUE JSON::..//..//..//..
  public getResponseValueForJson(
    idForm: number
  ): Observable<IResponseValueJson[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getResponseValueForJsonService_Number",
      ArgumentList: [idForm],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IResponseValueJson>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }
  public responseValue_responseProcedureAction(
    jsonParse: string
  ): Observable<any> {
    const data = jsonParse;
    return api.post(this.url, data);
  }

  //..//..//...:: JSON SERVICE SERVICES ::..//..//..//..

  public getJsonServiceCatalogByBusinessProcess(id: number): Observable<JsonService[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getJsonServiceCatalogByBusinessProcess_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<DataForm>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getConditionStatementCatalog(
    id: number | null
  ): Observable<IConditionStatement[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getConditionStatementCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IConditionStatement>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }





  /* En observación */
  public addFlowControlStatement(
    idConditionStatement: any,
    idProcedure: any,
    idProcedureDestinity: number,
    idProcedureSource: number,
    flowControl: string,
    conditionalOperator: any,
    idDocument: any,
    idResponseValue: number,
    value: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ConditionStatement_addFlowControlStatement_Number_Number_Number_Number_String_String_Number_Number_String",
      ArgumentList: [
        idConditionStatement,
        idProcedure,
        idProcedureDestinity,
        idProcedureSource,
        flowControl,
        conditionalOperator,
        idDocument,
        idResponseValue,
        value,
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public moveConditionStatementToPosition(
    idConditionStatement: any,
    index: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "int_moveConditionStatementToPosition_Number_Number",
      ArgumentList: [idConditionStatement, index],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getFlowControlOperators(): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFlowControlOperators_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public requiresVariable(flowControl: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "boolean_requiresVariable_String",
      ArgumentList: [flowControl],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getProcedureListExcluding(idProcedure: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureListExcluding_Number",
      ArgumentList: [idProcedure],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getProcedureDocumentWithJsonFormAndJsonService(idProcedure: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureDocumentWithJsonFormAndJsonService_Number",
      ArgumentList: [idProcedure],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getProcedureDocumentCatalog(idProcedure: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureDocumentCatalog_Number",
      ArgumentList: [idProcedure],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getResponseValueForDocument(idDocument: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getResponseValueForDocument_Number",
      ArgumentList: [idDocument],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getConditionalOperators(flowControl: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getConditionalOperators_String",
      ArgumentList: [flowControl],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public deleteConditionStatement(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteConditionStatement_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getUrl(idForm: number, idAction: number) {
    return `${baseUrl}/formulario?idacction=${idAction}&form=${idForm}`;
  }

  public getForm(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.quickbpm.bean.Form_getForm_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getProcedureCatalog(idBusinessProcess: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureCatalog_Number",
      ArgumentList: [idBusinessProcess],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }


  getMenuUsuario(idAccount: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getMenuUsuario_Number",
      ArgumentList: [
        idAccount
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data)
  }

  exportDataBase(): Observable<any> {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "OrangeCore",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.advantage.shared.Report_exportDataBase_java.util.List_String_boolean_boolean",
      "ArgumentList": [
        [
          "com.orange.dao.AbstractAccountModel",
          "com.orange.dao.AdminModel",
          "com.orange.dao.ApplicationIDModel",
          "com.orange.dao.BusinessLogicModel",
          "com.orange.dao.FunctionalIDModel",
          "com.orange.dao.SiteIDModel",
          "com.quickbpm.dao.BusinessProcessModel",
          "com.quickbpm.dao.ProcedureModel"
        ],
        "ORACLE",
        true,
        true
      ]
    }
    const data = JSON.stringify(parametros);
    return api.post(this.url, data)
  }

}
