import { Office } from "../../modules/configuration/model/Office";
import { map, Observable } from "rxjs";

import http from "../http-common";
import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";
import { env } from "../../env";

export class SuscriptionService {
  private url = "/jsserver";
  private url_servidor = "/wsupload";
  private baseURL = env.REACT_APP_ENDPOINT;

  createBusinessProcessAndNextStage(
    idBusinessProcess: number,
    idOffice: number,
    accountID: number,
    description: string,
    alphaCode: String,
    runNextStage: Boolean,
    idCharacterization: number
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.ProcedureImp_createBusinessProcess_Number_Number_Number_String_String_Boolean_Number",
      ArgumentList: [
        idBusinessProcess,
        idOffice,
        accountID,
        description,
        alphaCode,
        runNextStage,
        idCharacterization,
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }
  getProcedureImpForInput(idAccount: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpForInput_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(dataObj);
    console.log("enviando...", data);
    return http.post(this.url, data);
  }

  getProcedureImpByAccount(idAccount: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpByAccount_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  getProcedureActionByAccount(idAccount: number, idProcedureImp: number) {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getProcedureActionByAccount_Number_Number_Number",
      ArgumentList: [idAccount, idProcedureImp, 0],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }
  responseProcedureAction2(
    idAction: number,
    description: string | null,
    responseValue: boolean | null,
    responseValues: any,
    test: boolean | null
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_responseProcedureAction_Number_String_Boolean_java.util.Map_Boolean",
      ArgumentList: [idAction, null, null, responseValues, false],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }
  isValidStage(idAccount: number, idStage: number) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "Boolean_isValidStage_Number_Number",
      ArgumentList: [idAccount, idStage],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }
  getProcedureImpForVerify(idSesion: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpForVerify_Number",
      ArgumentList: [idSesion],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  getProcedureActionForVerify(idAccount: number, idProcedureImp: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionForVerify_Number_Number",
      ArgumentList: [idAccount, idProcedureImp],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  verifyProcedureAction(idProcedureAction: number, description: string) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "boolean_verifyProcedureAction_Number_String",
      ArgumentList: [idProcedureAction, description],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  declineProcedureAction(idProcedureAction: number, description: string) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "boolean_declineProcedureAction_Number_String",
      ArgumentList: [idProcedureAction, description],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  /* getProcedureImpForAssign(idAccount: number,
        idBusinessProcess: number) {
        const dataObj = {
            "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
            "ServiceName": "BpmService",
            "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
            "MethodHash": "java.util.List_getProcedureImpForAssign_Number_Number_Number",
            "ArgumentList": [
                idAccount,
                idBusinessProcess,
                idOffice
            ]
        }
        const data = JSON.stringify(dataObj);
        return http.post(this.url, data);
    } */
  getProcedureImpForAssign(
    idAccount: number,
    idBusinessProcess: number,
    idOffice: number
  ) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash:
        "java.util.List_getProcedureImpForAssign_Number_Number_Number",
      ArgumentList: [idAccount, idBusinessProcess, idOffice],
    };
    const data = JSON.stringify(dataObj);
    console.log(idAccount, idBusinessProcess, idOffice);

    return http.post(this.url, data);
  }
  getProcedureActionForAssign(idProcedureImp: number) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getProcedureActionForAssign_Number",
      ArgumentList: [idProcedureImp],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  getWorkGroupMember(
    idProcedure: number,
    nit: number,
    nombre: string,
    apellido: string
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getWorkGroupMember_Number_Number_Number_String_String",
      ArgumentList: [idProcedure, 0, nit, nombre, apellido],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  getWorkGroupMemberCatalog(idLn: number) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getWorkGroupMemberCatalog_Number_Number",
      ArgumentList: [idLn, 0],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  assignProcedureImpToGroupMember(
    idProcedureImp: number,
    idAccount: number,
    idAccountAllocator: number
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "Number_assignProcedureImpToGroupMember_Number_Number_Number",
      ArgumentList: [idProcedureImp, idAccount, idAccountAllocator],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  assignActionResponseToGroupMember(
    idAction: number,
    idAccount: number,
    idAccountAllocator: number
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "Number_assignActionResponseToGroupMember_Number_Number_Number",
      ArgumentList: [idAction, idAccount, idAccountAllocator],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  getProcedureImpForResponse(idAccount: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpForResponse_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  getProcedureActionForResponse(idAccount: number, idProcedureImp: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionForResponse_Number_Number",
      ArgumentList: [idAccount, idProcedureImp],
    };
    const data = JSON.stringify(dataObj);
    console.log("enviando...", data);
    return http.post(this.url, data);
  }

  responseProcedureAction(
    idProcedureAction: number,
    description: string,
    responseValue?: boolean
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_responseProcedureAction_Number_String_Boolean_java.util.Map_Boolean",
      ArgumentList: [idProcedureAction, description, responseValue, null, null],
    };
    const data = JSON.stringify(dataObj);
    return api.post(this.url, data);
  }

  declineResponseProcedureAction(
    idProcedureAction: number,
    description: string
  ) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "boolean_declineResponseProcedureAction_Number_String",
      ArgumentList: [idProcedureAction, description],
    };
    const data = JSON.stringify(dataObj);
    console.log("enviando...", data);
    return http.post(this.url, data);
  }

  getProcedureImpRejectedForInput(idAccount: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpRejectedForInput_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  getProcedureActionRejected(idAccount: number, idProcedureImp: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionRejected_Number_Number",
      ArgumentList: [idAccount, idProcedureImp],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  reprocessProcedureAction(
    idAction: number,
    media: string,
    mediaContext: string,
    observations: string
  ) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "boolean_reprocessProcedureAction_Number_String_String_String_Boolean",
      ArgumentList: [idAction, media, mediaContext, observations, true],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  postFile(imagenParaSubir: File) {
    const data = {
      SessionID: 0,
      Zipped: 0,
      PartIndex: 0,
      DataStore: null,
      SerializerType: "json",
      Filename: imagenParaSubir.name,
      Directory: "temp",
      IDAccount: 0,
      Function: "upload",
    };
    console.log(this.baseURL);
    const formData = new FormData();
    formData.append("FileUpload", imagenParaSubir, JSON.stringify(data));
    console.log(data);
    return http.post(this.url_servidor, formData);
  }

  getOfficeCatalogForAccount(idAccount: number) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
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

  parseForInvokeJsonServiceFromProcedureAction(idAction: number) {
    const dataObj = {
      ServiceName: "BpmService",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_parseForInvokeJsonServiceFromProcedureAction_Number",
      ArgumentList: [idAction],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
}
