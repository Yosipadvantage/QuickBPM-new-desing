import { map, Observable } from "rxjs";
import { IActivityType } from "../../modules/configuration/model/ActivityType";
import { IAgendaSeccional } from "../../modules/agenda/model/AgendaSeccional";
import { IBusinessCharacterization } from "../../modules/configuration/model/BusinessCharacterization";
import {
  Characterization,
  CharacterizationK,
} from "../../modules/configuration/model/Characterization";
import { ICustomerType } from "../../modules/configuration/model/CustomerType";
import { IDocumentCharacterization } from "../../modules/configuration/model/DocumentCharacterization";
import { MemberWorkGroup } from "../../modules/configuration/model/MemberWorkGroup";
import { Office } from "../../modules/configuration/model/Office";
import { OfficeBusinessProcess } from "../../modules/configuration/model/OfficeBusinessProcess";
import { getSession } from "../../utils/UseProps";
import http from "../http-common";
import http2 from "../http-forms";

import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";
import { Antecedente } from "../../modules/trays/model/antecedente.interface";
import { JsonProperty } from "../../modules/configuration/model/json-property.interface";
import { Marcaje } from "../../modules/trays/model/marcaje.interface";
import { Impresion } from "../../modules/trays/model/impresion.interface";
import { NotificationK } from "../../modules/configuration/model/Notification";

import { PayFine } from "../../modules/trays/model/payFine.interface";

export class ConfigService {
  private url = "/jsserver";

  //:::://:::://..:: BUSINESS SERVICES ::..//..//:::://:::://

  updateBusinessProcess(bean: any) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.BusinessProcess_updateBusinessProcess_com.quickbpm.bean.BusinessProcess",

      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.BusinessProcess",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getBusinessProcessCatalog(
    idBusinessClass: number | null,
    idCustomerType: number | null,
    idCharacterization: number | null
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getBusinessProcessCatalog_Number_Boolean_Boolean_Number_Number_Number",
      ArgumentList: [
        null,
        null,
        null,
        idBusinessClass,
        idCustomerType,
        idCharacterization,
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getSateListForBusinessProcess() {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getSateListForBusinessProcess_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureImpByAccount(
    idBusinessProcess: any,
    idAccount: any,
    init: any,
    final: any,
    state: any
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getProcedureImpByAccount_Number_Number_java.util.Date_java.util.Date_Number",
      ArgumentList: [idBusinessProcess, idAccount, init, final, state],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteBusinessProcess(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "void_deleteBusinessProcess_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  //..//..//...:: CHARACTERIZATION SERVICES ::..//..//..//..

  public getBusinessClassCatalog(): Observable<Characterization[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getBusinessClassCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Characterization>>(this.url, data).pipe(
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

  updateBusinessClass(bean: Characterization): Observable<Characterization> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.BusinessClass_updateBusinessClass_com.quickbpm.bean.BusinessClass",

      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.BusinessClass",
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
              .DataBeanProperties as Characterization
        )
      );
  }

  deleteBusinessClass(id: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "Integer_deleteBusinessClass_Number",

      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getBusinessClassByCustomerType(idCustomer: number) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getBusinessClassByCustomerType_Number",
      ArgumentList: [idCustomer],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getCharacterizationByCustomerType(idCustomer: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getCharacterizationCatalogByCustomerType_Number",
      ArgumentList: [idCustomer],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: PROCEDURE SERVICES ::..//..//:::://:::://

  getProcedureList(id?: number) {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getProcedureList_Number_String_Number_Number",
      ArgumentList: [id, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureList2(id?: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureList_Number_String_Number_Number",
      ArgumentList: [id, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getProcedureDocumentCatalogByType(id: number, type: number) {
    console.log(id, type);
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getProcedureDocumentCatalogByType_Number_Number_Number",
      ArgumentList: [id, type, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureDocumentCatalog(id: number) {
    console.log(id);

    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureDocumentCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);

    return http.post(this.url, data);
  }

  updateProcedure(bean: any) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.Procedure_updateProcedure_com.quickbpm.bean.Procedure",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.Procedure",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteProcedure(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteProcedure_Number_Number",
      ArgumentList: [id, parseInt(getSession().IDAccount)],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  // MÉTODOS DE LISTAR ESTADOS (PROCEDURE)

  getBusinessStateCatalog(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getBusinessStateCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureStateCatalog(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureStateCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  // Procedure Documento
  updateProcedureDocument(bean: any) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ProcedureDocument_updateProcedureDocument_com.quickbpm.bean.ProcedureDocument",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.ProcedureDocument",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  deleteProcedureDocument(id: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteProcedureDocument_Number_Number",
      ArgumentList: [id, parseInt(getSession().IDAccount)],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  /* getWorkGroupMemberCatalog(idLn: number) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getWorkGroupMemberCatalog_Number_Number",
      "ArgumentList": [
        idLn,
        0
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  public getWorkGroupMemberCatalog(
    idLn: number,
    idOffice: number
  ): Observable<MemberWorkGroup[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getWorkGroupMemberCatalog_Number_Number_Number",
      ArgumentList: [idLn, idOffice, 0],
    };
    const data = JSON.stringify(parametros);
    /* return http.post(this.url, data); */
    return api.post<ServerResponse<MemberWorkGroup>>(this.url, data).pipe(
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

  public addWorkGroupMember(
    idLnFunctionalID: number,
    idAccount: number,
    idOffice: number
  ): Observable<MemberWorkGroup> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number_Number",
      ArgumentList: [idLnFunctionalID, idAccount, idOffice],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as MemberWorkGroup
        )
      );
  }

  /* addWorkGroupMember(idLnFunctionalID: number, idAccount: number) {
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number",
      "ArgumentList": [
        idLnFunctionalID,
        idAccount
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  public removeWorkGroupMember(
    idLnFunctionalID: number,
    idAccount: number,
    idOffice: number
  ): Observable<MemberWorkGroup> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number_Number",
      ArgumentList: [idLnFunctionalID, idAccount, idOffice],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as MemberWorkGroup
        )
      );
  }
  /* removeWorkGroupMember(idLnFunctionalID: number, idAccount: number) {
    const parametros = {
      "ServiceName": "BpmService",
      "MethodHash": "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number",
      "ArgumentList": [
        idLnFunctionalID,
        idAccount
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  } */

  //:::://:::://..:: PROCESS HISTORY SERVICES ::..//..//:::://:::://

  getStageCatalog(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getStageCatalog_Number",
      ArgumentList: [idProcedureImp],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureActionByProcedureImp(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionByProcedureImp_Number",
      ArgumentList: [idProcedureImp],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getPendingProcedureActionForProcedureImp(idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getPendingProcedureActionForProcedureImp_Number",
      ArgumentList: [idProcedureImp],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  setInPendingForInputState(idAction: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ProcedureAction_setInPendingForInputState_Number",
      ArgumentList: [idAction],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  //:::://:::://..:: OFFICE SERVICES ::..//..//:::://:::://

  public getOfficeCatalog(id?: number | null): Observable<Office[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getOfficeCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data).pipe(
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

  public getSeccionalUsuario(id?: number | null): Observable<Office[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getSeccionalesUsuario_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data).pipe(
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

  public updateOffice(bean: Office): Observable<Office> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.Office_updateOffice_com.quickbpm.bean.Office",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.Office",
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
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Office
        )
      );
  }

  public deleteOffice(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteOffice_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getOfficeBusinessProcessCatalog(
    id: number
  ): Observable<OfficeBusinessProcess[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getOfficeBusinessProcessCatalog_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<OfficeBusinessProcess>>(this.url, data).pipe(
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

  public addOfficeToBusinessProcess(
    idBusiness: number,
    idOffice: number
  ): Observable<Office> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.OfficeBusinessProcess_addOfficeToBusinessProcess_Number_Number",
      ArgumentList: [idBusiness, idOffice],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Office
        )
      );
  }

  getOfficeCatalogForAccount(idAccount: number): Observable<Office[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getOfficeCatalogForAccount_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data).pipe(
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

  getSeccionalesUsuario(idAccount: number): Observable<Office[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getSeccionalesUsuario_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Office>>(this.url, data).pipe(
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

  removeOfficeToBusinessOffice(
    idBusinessProcess: number,
    IDOffice: number
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.OfficeBusinessProcess_removeOfficeToBusinessOffice_Number_Number",
      ArgumentList: [idBusinessProcess, IDOffice],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getNotificationCatalog(
    id?: number | null
  ): Observable<CharacterizationK[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getNotificacionCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<NotificationK>>(this.url, data).pipe(
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

  updateNotificacion(bean: any): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "co.mil.dccae.armas.bean.Notificacion_updateNotificacion_co.mil.dccae.armas.bean.Notificacion",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Notificacion",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ///:::://///::::// CHARACTERIZATION SERVICES :::://///:::://

  public getCharacterizationCatalog(
    id?: number | null
  ): Observable<CharacterizationK[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getCharacterizationCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<NotificationK>>(this.url, data).pipe(
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

  public updateCharacterization(
    bean: CharacterizationK
  ): Observable<CharacterizationK> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.Characterization_updateCharacterization_com.quickbpm.bean.Characterization",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.Characterization",
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
              .DataBeanProperties as CharacterizationK
        )
      );
  }

  public deleteCharacterization(id: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "boolean_deleteNotificacion_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: CUSTOMER TYPE SERVICES ::..//..//:::://:::://

  public getCustomerTypeCatalog(): Observable<ICustomerType[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getCustomerTypeCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ICustomerType>>(this.url, data).pipe(
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

  updateCustomerType(bean: ICustomerType): Observable<ICustomerType> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.CustomerType_updateCustomerType_com.quickbpm.bean.CustomerType",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.CustomerType",
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
              .DataBeanProperties as ICustomerType
        )
      );
  }

  public deleteCustomerType(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "void_deleteCustomerType_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: BUSINESS CHARACTERIZATION SERVICES ::..//..//:::://:::://

  addBusinessCharacterization(
    idBusinessProcess: number,
    idCharacterization: number
  ): Observable<IBusinessCharacterization> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.BusinessCharacterization_addBusinessCharacterization_Number_Number",
      ArgumentList: [idBusinessProcess, idCharacterization],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IBusinessCharacterization
        )
      );
  }

  public getBusinessCharacterizationCatalog(
    idBusinessProcess: number
  ): Observable<IBusinessCharacterization[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getBusinessCharacterizationCatalog_Number",
      ArgumentList: [idBusinessProcess],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<ServerResponse<IBusinessCharacterization>>(this.url, data)
      .pipe(
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

  public deleteBusinessCharacterization(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteBusinessCharacterization_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: DOCUMENT CHARACTERIZATION SERVICES ::..//..//:::://:::://

  addDocumentCharacterization(
    idDocument: number,
    idCharacterization: number
  ): Observable<IDocumentCharacterization> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.DocumentCharacterization_addDocumentCharacterization_Number_Number",
      ArgumentList: [idDocument, idCharacterization],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue
              .DataBeanProperties as IDocumentCharacterization
        )
      );
  }

  public getDocumentCharacterizationCatalog(
    idDocument: number
  ): Observable<IDocumentCharacterization[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getDocumentCharacterizationCatalog_Number",
      ArgumentList: [idDocument],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<ServerResponse<IDocumentCharacterization>>(this.url, data)
      .pipe(
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

  public deleteDocumentCharacterization(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "Integer_deleteDocumentCharacterization_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //:::://:::://..:: DOCUMENT CHARACTERIZATION SERVICES ::..//..//:::://:::://

  public getProcedureTypeList(): Observable<IActivityType[]> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureTypeList_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IActivityType>>(this.url, data).pipe(
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

  public getOfficeCatalogForBusinessProcess(idBusinessProcess: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getOfficeCatalogForBusinessProcess_Number",
      ArgumentList: [idBusinessProcess],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public responseProcedureAction(
    idProcedureAction: number,
    description: string
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "boolean_responseProcedureAction_Number_String_Boolean",
      ArgumentList: [idProcedureAction, description, true],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  getProcedureDocumentList() {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getProcedureDocumentList_Number",
      ArgumentList: [0],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  testJsonForm(idForm: number) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "com.quickbpm.bean.ResponseValue_testJsonForm_Number",
      ArgumentList: [idForm],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }
  getForm(url: string) {
    return http2.post(url, "");
  }
  getSystemProperty(name: string) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "OrangeBase",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.advantage.bean.account.SystemProperty_getSystemProperty_String",
      ArgumentList: [name],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  //:::://:::://..:: AGENDA SERVICES ::..//..//:::://:::://

  public getAgendaSeccional(
    idOffice: number,
    fecha: string
  ): Observable<IAgendaSeccional[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAgendaSeccional_Number_String",
      ArgumentList: [idOffice, fecha],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IAgendaSeccional>>(this.url, data).pipe(
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

  updateAgendaSeccional(bean: IAgendaSeccional): Observable<IAgendaSeccional> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.AgendaSeccional_updateAgendaSeccional_co.mil.dccae.armas.bean.AgendaSeccional",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.AgendaSeccional",
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
              .DataBeanProperties as IAgendaSeccional
        )
      );
  }

  public deleteAgenda(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteAgendaSeccional_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public asignarCita(IDAgendaSeccional: number, bean: any): Observable<any> {
    console.log(bean);

    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.Map_asignarCita_Number_java.util.Map",
      ArgumentList: [IDAgendaSeccional, bean],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public bandejaCitas(idSeccional: number, fecha: string): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_bandejaCitas_Number_String",
      ArgumentList: [idSeccional, fecha],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public reprogramarCita(
    idAgenda: number,
    idAgendaSeccional: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_reagendarCita_Number_Number",
      ArgumentList: [idAgenda, idAgendaSeccional],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public cancelarCita(idAgenda: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_cancelarCita_Number",
      ArgumentList: [idAgenda],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  // Antecedentes
  public getAntecedentesRender(estado: number | null, fechaInit: string | null, fechaFin: string | null): Observable<Antecedente[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAntecedentesRender_Number_java.util.Date_java.util.Date",
      ArgumentList: [estado, fechaInit, fechaFin],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Antecedente>>(this.url, data).pipe(
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

  public getAntecedentesIdentificacionRender(identificacion: number | null): Observable<Antecedente[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAntecedentesIdentificacionRender_Number",
      ArgumentList: [identificacion],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Antecedente>>(this.url, data).pipe(
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

  public getAntecedentesCorteRender(corte: number | null): Observable<Antecedente[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAntecedentesCorteRender_Number",
      ArgumentList: [corte],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Antecedente>>(this.url, data).pipe(
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



  public getAntecedentesEstadoRender(): Observable<Antecedente[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAntecedentesRender_Number_java.util.Date",
      ArgumentList: [1, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Antecedente>>(this.url, data).pipe(
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

  public actualizarTablaAntecendetes(
    idAccount: number,
    idOffice: number,
    dateInit: string,
    dateFinal: string
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_actualizarTablaAntecendetes_Number_Number_java.util.Date_java.util.Date",
      ArgumentList: [idAccount, idOffice, dateInit, dateFinal],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public cargarArchivoAntecedentes(
    state: number,
    mediaContext: string,
    media: string
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.Map_cargarArchivoAntecedentes_Number_String_String",
      ArgumentList: [state, mediaContext, media],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getProtocoloCatalogPorPropiedadRender(
    idAccount: number
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getProtocoloCatalogPorPropiedadRender_String_Number",
      ArgumentList: ["IDAccount", idAccount],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public descargarArchivoAntecedentes(
    state: any,
    dateUpto: any
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.advantage.bean.filemanagement.FileMap_descargarArchivoAntecedentes_Number_java.util.Date",
      ArgumentList: [state, dateUpto],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  // Marcaje
  // Indumil
  bandejaIndumilRender(
    state: any,
    dateInit: string,
    dateFinal: string
  ): Observable<Marcaje[]> {
    const dataObj = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_bandejaIndumilRender_Number_java.util.Date_java.util.Date",
      ArgumentList: [state, dateInit, dateFinal],
    };
    const data = JSON.stringify(dataObj);
    return api.post<ServerResponse<Marcaje>>(this.url, data).pipe(
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

  bajarArchivoIndumilMarca(
    state: number,
    dateInit: any,
    dateFinal: any
  ): Observable<any> {
    const dataObj = {
      ServiceName: "ArmasService",
      MethodHash:
        "com.advantage.bean.filemanagement.FileMap_bajarArchivoIndumilMarca_Number_java.util.Date_java.util.Date",
      ArgumentList: [state, dateInit, dateFinal],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  subirArchivoIndumilMarca(
    Context: any,
    Media: any,
    idFuncionario: number
  ): Observable<any> {
    const dataObj = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_subirArchivoIndumilMarca_String_String_Number",
      ArgumentList: [Context, Media, idFuncionario],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  // Servicios
  public getJsonPropertyType(): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getJsonPropertyType_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getBPMStructsForQuery(): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getBPMStructsForQuery_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getPropertiesForQuery(BPMDataBeanClass: any): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getPropertiesForQuery_String",
      ArgumentList: [BPMDataBeanClass],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  updateJsonProperty(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.JsonProperty_updateJsonProperty_com.quickbpm.bean.JsonProperty",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.quickbpm.bean.JsonProperty",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getURLRequestType(): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getURLRequestType_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public actualizarAntecendetes(
    idAntecedente: any,
    estado: any,
    observacion: any,
    idFuncionario: any
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.Map_actualizarAntecendetes_Number_Number_String_Number",
      ArgumentList: [idAntecedente, estado, observacion, idFuncionario],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public actualizarAntecedentesMultiple(
    estado: any,
    observacion: any,
    idFuncionario: any,
    listAntecedentes: any
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.Map_actualizarAntecedentesMultiple_Number_String_Number_java.util.List",
      ArgumentList: [estado, observacion, idFuncionario, listAntecedentes],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public getJsonPropertyDocumentType(): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getJsonPropertyDocumentType_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  public invokeJsonServiceInPeriod(
    idJsonService: any,
    dateInit: any,
    dateFinal: any,
    maxRows: number
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "Number_invokeJsonServiceInPeriod_Number_java.util.Date_java.util.Date_Number",
      ArgumentList: [idJsonService, dateInit, dateFinal, maxRows],
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.post(this.url, data);
  }

  // Impreision
  bandejaImpresionRender(
    idOffice: number,
    state: any,
    stateCiu: any,
    dateInit: string,
    dateFinal: string,
    cedula: number | null
  ): Observable<Impresion[]> {
    const dataObj = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_bandejaImpresionRender_Number_Number_Number_java.util.Date_java.util.Date_Number",
      ArgumentList: [idOffice, state, stateCiu, dateInit, dateFinal, cedula],
    };
    const data = JSON.stringify(dataObj);
    return api.post<ServerResponse<Impresion>>(this.url, data).pipe(
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

  pagarMulta(IDMulta: number, Data: object): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_pagarMulta_Number_java.util.Map",
      ArgumentList: [IDMulta, Data],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public liquidarMulta(idMulta: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_liquidarMulta_Number",
      ArgumentList: [idMulta],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data).pipe(
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

  updateAuditoriaRender = (
    bean: any,
    descripcion: string,
    evidencia: string
  ) => {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_updateAuditoriaRender_co.mil.dccae.armas.bean.Auditoria_String_String",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Auditoria",
        },
        descripcion,
        evidencia,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  };
}
