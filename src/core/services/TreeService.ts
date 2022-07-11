import http from "../http-common";
import api from "../settings/api";
import { map, Observable } from "rxjs";

export class TreeService {
  private url = "/jsserver";

  getTreeForFunctionalID(): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "com.advantage.shared.Tree_getTreeForFunctionalID_Number",
      ArgumentList: [0],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getFunctionalIDChilds(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getFunctionalIDChilds_Number_Number",
      ArgumentList: [id, null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  createFunctionalID(id: number, bean: any): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.orange.bean.functional.FunctionalID_createFunctionalID_com.orange.bean.functional.FunctionalID_com.orange.bean.functional.FunctionalID",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
        {
          DataBeanProperties: {
            IDLn: id,
          },
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  deleteFunctionalID(id: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash:
        "com.orange.bean.functional.FunctionalID_deleteFunctionalID_com.orange.bean.functional.FunctionalID",
      ArgumentList: [
        {
          DataBeanProperties: {
            IDLn: id,
          },
          DataBeanName: "com.orange.bean.functional.FunctionalID",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  addWorkGroupMember(idFn: number, idAccount: number): Observable<any> {
    const parameters = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_addWorkGroupMember_Number_Number",
      ArgumentList: [idFn, idAccount],
    };
    const data = JSON.stringify(parameters);
    return api.post(this.url, data);
  }

  removeWorkGroupMember(idFn: number, idAccount: number): Observable<any> {
    const parameters = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.WorkGroupMember_removeWorkGroupMember_Number_Number",
      ArgumentList: [idFn, idAccount],
    };
    const data = JSON.stringify(parameters);
    return api.post(this.url, data);
  }

  /* Tree Site */

  getTreeForSiteID(): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "com.advantage.shared.Tree_getTreeForSiteID_Number",
      ArgumentList: [0],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getSiteIDChilds(id: number): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash: "java.util.List_getSiteIDChilds_Number_Number",
      ArgumentList: [id, null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public createSiteID(idParent: any, id: any, code: any, nameSite: any): Observable<any> {
    const dataObj = {
      ServiceName: 'OrangeBase',
      MethodHash: 'com.orange.bean.site.SiteID_createSiteID_com.orange.bean.site.SiteID_com.orange.bean.site.SiteID',
      ArgumentList: [
        {
          DataBeanProperties: {
            IDLn: id,
            Code: code,
            Name: nameSite
          },
          DataBeanName: 'com.orange.bean.site.SiteID'
        },
        {
          DataBeanProperties: {
            IDLn: idParent
          },
          DataBeanName: 'com.orange.bean.site.SiteID'
        }
      ]
    };
    const data = JSON.stringify(dataObj);
    console.log(data);
    return api.post(this.url, data);
  }

  getSiteIDByKey(id: any): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.orange.bean.site.SiteID_getSiteIDByKey_Number_Number",
      ArgumentList: [
        id,
        null
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  deleteSiteID(id: any): Observable<any> {
    const parametros = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.orange.bean.site.SiteID_deleteSiteID_com.orange.bean.site.SiteID",
      ArgumentList: [
        {
          DataBeanProperties: {
            IDLn: id,
          },
          DataBeanName: "com.orange.bean.site.SiteID",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

}
