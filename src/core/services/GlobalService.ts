import { map, Observable } from "rxjs";
import { Dane } from "../../modules/admin/model/Dane";
import { User } from "../../shared/model/User";
import { ServerResponse } from "../model/server-response.interface";
import api from "../settings/api";
import { IFingerPrintData } from "../../modules/citizenData/model/FingerPrintData";
import { IPersonPhotoData } from "../../modules/citizenData/model/PersonPhotoData";
import { env } from "../../env";
export class GlobalService {
  private url = "/jsserver";

  public getAccountByNit(nit: number): Observable<User[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getAccountByNit_Number",
      ArgumentList: [nit],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<User>>(this.url, data).pipe(
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

  public sincronizarPersonasNaturalJuridica(nit: number) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_sincronizarPersonasNaturalJuridica_Number",
      ArgumentList: [nit],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public sincronizarCargueArma = (id: number) => {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_sincronizarCargueArma_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data).pipe(
      map((item: any) => {
        return item.DataBeanProperties.ObjectValue.ListaArmas.map((res: any) => res.DataBeanProperties)
      })
    );
  };

  public getArmasSiaemCatalogPorPropiedades(mapPropiedades: any) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_sincronizarPersonasNaturalJuridica_Number",
      ArgumentList: [
        mapPropiedades,
        null
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public updateSincronizacionRender(
    idAccount: number,
    idPersons: number[],
    idFuncionario: number
  ) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_updateSincronizacionRender_Number_Number_java.util.List",
      ArgumentList: [idAccount, idFuncionario, idPersons],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getUsuariosSistema(): Observable<User[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getUsuariosSistema_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<User>>(this.url, data).pipe(
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

  public getAccountByIDAccount(IDAccount: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_getAccount_Number",
      ArgumentList: [IDAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public sincronizarUsuario(nit: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_sincronizarUsuario_Number",
      ArgumentList: [nit],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getAccount(names: string, lastNames: string): Observable<User[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getAccount_String_String",
      ArgumentList: [names, lastNames],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<User>>(this.url, data).pipe(
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

  public getAutorizadosEmpresa(idAccount: number): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAutorizadosEmpresa_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<any>>(this.url, data).pipe(
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

  public getDaneCatalogLikeCity(item: string): Observable<Dane[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getDaneCatalogLike_String_String_Number",
      ArgumentList: ["Municipio", item, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Dane>>(this.url, data).pipe(
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

  public getDaneCatalogLikeDep(item: string): Observable<Dane[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getDaneCatalogLike_String_String_Number",
      ArgumentList: ["Departamento", item, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Dane>>("", data).pipe(
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

  // BIODATA SERVICES

  public registerFingerPrint(
    idAccount: string,
    handType: number,
    fingerType: number
  ): Observable<any> {
    const parametros = {
      URL: env.REACT_APP_ENDPOINT,
      ReaderType: localStorage.getItem("readerType"),
      BioType: "Fingerprint",
      IDAccount: idAccount,
      HandType: handType,
      FingerType: fingerType,
      Function: "RegisterFingerprint",
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost("", data);
  }

  public validateFingerPrint(
    idAccount: string,
    handType: number,
    fingerType: number
  ): Observable<any> {
    const parametros = {
      URL: env.REACT_APP_ENDPOINT,
      ReaderType: localStorage.getItem("readerType"),
      BioType: "Fingerprint",
      IDAccount: idAccount,
      HandType: handType,
      FingerType: fingerType,
      Function: "VerifyFingerprint",
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost("", data);
  }

  public registerPersonPhoto(
    idAccount: string,
    viewType: number,
    sideType: number
  ): Observable<any> {
    const parametros = {
      URL: env.REACT_APP_ENDPOINT,
      ReaderType: "zkteco",
      BioType: "PersonPhoto",
      IDAccount: idAccount,
      ViewType: viewType,
      SideType: sideType,
      Function: "RegisterPersonPhoto",
    };
    const data = JSON.stringify(parametros);
    console.log(data);
    return api.bioPost("", data);
  }
  public registrarPersonPhotoByMedia(
    idAccount: number,
    viewType: number,
    media: string,
    mediaContext: string
  ) {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_agregarFotoCiudadanoMediaContext_Number_Number_String_String",
      ArgumentList: [idAccount, viewType, mediaContext, media],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getFingerPrintDataCatalog(
    idAccount: number
  ): Observable<IFingerPrintData[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getFingerprint_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IFingerPrintData>>(this.url, data).pipe(
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

  public getPersonPhotoDataCatalog(
    idAccount: number
  ): Observable<IPersonPhotoData[]> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getPersonPhoto_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IPersonPhotoData>>(this.url, data).pipe(
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

  public activarUsuarioCiu(IDAccount: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_activarUsuarioCiu_Number",
      ArgumentList: [IDAccount],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }
}
