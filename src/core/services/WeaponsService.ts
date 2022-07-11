import { ServerResponse } from "../model/server-response.interface";
import { map, Observable } from "rxjs";
import { IndumilOffice } from "../../modules/weapons/model/AlmacenIndumil";
import api from "../settings/api";
import { Iweapon } from "../../modules/weapons/model/modelWeapon";
import { IPermission } from "../../modules/weapons/model/permission.interface";
import { ITypeProduct } from "../../modules/weapons/model/typeProduct";
import { IProduct } from "../../modules/weapons/model/product";
import { IProductKind } from "../../modules/weapons/model/ProductKind";
import { Ilote } from "../../modules/weapons/model/lote";
import { ICapCarga } from "../../modules/weapons/model/capCarga";
import { DataItemCiudadano } from "../../modules/weapons/model/item-ciudadano.interface";
import { Record } from "../../modules/weapons/model/record.interface";
import { IDataUpdate } from "../../modules/admin/model/DataUpdate";
import { IBandejaImpresion } from "../../modules/trays/model/bandejaImpresion-interface";
import { IHojaPermiso } from "../../modules/trays/model/hojaPermiso-interface";
import { ICinar } from "../../modules/weapons/model/cinar.interface";
import { ICallCenter } from "../../modules/weapons/model/call-center.interface";
import { Fine } from "../../modules/trays/model/fine.interface";
const PORTE: number = 1;
const TENENCIA: number = 2;
const ESPECIAL: number = 3;
const OTRO = 6;
export class WeaponsService {
  private url = "/jsserver";

  // ..:::::::::: ALMACENES INDUMIL SERVICES ::::::::::.. //

  public getIndumilOffices(): Observable<IndumilOffice[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getAlmaIndumilCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IndumilOffice>>(this.url, data).pipe(
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

  updateAlmacenIndumil(bean: IndumilOffice): Observable<IndumilOffice> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.AlmaIndumil_updateAlmaIndumil_co.mil.dccae.armas.bean.AlmaIndumil",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.AlmaIndumil",
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
              .DataBeanProperties as IndumilOffice
        )
      );
  }

  deleteIndumilOffice(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteAlmaIndumil_Number",
      ArgumentList: [id],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  // ..:::::::::: TRAUMATICA SERVICES ::::::::::.. //

  getTraumaticaCatalogPorPropiedad(): Observable<Iweapon[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getTraumaticaCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IndumilOffice>>(this.url, data).pipe(
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

  getListasPorCodigo(lista: any): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getListasPorCodigo_Number_java.util.List",
      ArgumentList: [0, lista],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  updateTraumatica(bean: Iweapon): Observable<Iweapon> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.Traumatica_updateTraumatica_co.mil.dccae.armas.bean.Traumatica",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Traumatica",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Iweapon
        )
      );
  }

  deleteTraumatica(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteTraumatica_Number",
      ArgumentList: [id],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  cargueListaTraumaticasDevolucion(
    idAccount: number,
    idFuncionario: number,
    idOffice: number,
    contextMedia: string,
    media: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cargueListaTraumaticasDevolucion_Number_Number_Number_String_String",
      ArgumentList: [idAccount, idFuncionario, idOffice, contextMedia, media],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  cargueListaTraumaticasMarcaje(
    idAccount: number,
    idFuncionario: number,
    idOffice: number,
    contextMedia: string,
    media: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cargueLoteMarcaje_Number_Number_Number_String_String",
      ArgumentList: [idAccount, idFuncionario, idOffice, contextMedia, media],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  cargueAsignacionArmasFuego(
    idAction: number,
    idAccount: number,
    idFuncionario: number,
    idOffice: number,
    contextMedia: string,
    media: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cargueAsignacionArmasFuego_Number_Number_Number_Number_String_String",
      ArgumentList: [
        idAction,
        idAccount,
        idFuncionario,
        idOffice,
        contextMedia,
        media,
      ],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  // ..:::::::::: PERMISSIONS SERVICES ::::::::::.. //

  generateCryptoCode(
    context: string,
    media: string,
    names: string,
    surnames: string,
    cc: number,
    weapon: any,
    date: string,
    type: number,
    idFuncionario: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.Map_genQRCode_Number_java.util.Map",
      ArgumentList: [
        type,
        weapon.IDPermiso
          ? {
            IDPermiso: weapon.IDPermiso,
            IDFuncionario: idFuncionario,
            Contex: context,
            Media: media,
            Identificacion: cc,
            Nombre: surnames + " " + names,
            Nombres: names,
            Apellidos: surnames,
            ClaseArma: weapon.ClaseArma,
            TipoArma: weapon.TipoArma,
            TipoPermiso: weapon.TipoPermiso,
            NombreTipo: weapon.NombreTipo,
            Marca: weapon.Marca,
            Serie: weapon.Serie,
            Calibre: weapon.Calibre,
            Capacidad: weapon.Capacidad,
            FechaVencimiento: date /* "2022-12-31" */,
            CodeA: weapon.CodeA,
            CodeB: weapon.CodeB,
            Dpto: weapon.Dpto,
            Mpio: weapon.Mpio,
            Ubicacion: weapon.Ubicacion,
            Fire: weapon.Fire,
            IDItem: weapon.IDItem,
            FechDocumento: weapon.FechDocumento,
            DocType: weapon.DocType,
            TipoUso: weapon.TipoUso,
            CodSec: weapon.CodSec,
          }
          : {
            IDFuncionario: idFuncionario,
            Contex: context,
            Media: media,
            Identificacion: cc,
            Nombre: surnames + " " + names,
            Nombres: names,
            Apellidos: surnames,
            ClaseArma: weapon.ClaseArma,
            TipoArma: weapon.TipoArma,
            TipoPermiso: weapon.TipoPermiso,
            NombreTipo: weapon.NombreTipo,
            Marca: weapon.Marca,
            Serie: weapon.Serie,
            Calibre: weapon.Calibre,
            Capacidad: weapon.Capacidad,
            FechaVencimiento: date /* "2022-12-31" */,
            CodeA: weapon.CodeA,
            CodeB: weapon.CodeB,
            Dpto: weapon.Dpto,
            Mpio: weapon.Mpio,
            Ubicacion: weapon.Ubicacion,
            Fire: weapon.Fire,
            IDItem: weapon.IDItem,
            FechDocumento: weapon.FechDocumento,
            DocType: weapon.DocType,
            TipoUso: weapon.TipoUso,
            CodSec: weapon.CodSec,
          },
      ],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getPermisoCatalogPorPropiedad(): Observable<IPermission[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getPermisoCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IPermission>>(this.url, data).pipe(
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

  getPermissionByIdentification(id: number | null): Observable<IPermission[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getPermisoCatalogPorPropiedades_java.util.Map_Number",
      ArgumentList: [{ Identificacion: id }, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IPermission>>(this.url, data).pipe(
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

  public updatePermission(bean: IPermission): Observable<IPermission> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.Permiso_updatePermiso_co.mil.dccae.armas.bean.Permiso",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.Permiso",
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
              .DataBeanProperties as IPermission
        )
      );
  }

  public deletePermission(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deletePermiso_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getTipoProducto(): Observable<ITypeProduct[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getTipoProductoCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ITypeProduct>>(this.url, data).pipe(
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

  /////// BANDEJA DE IMPRESIÓN SERVICES ////////

  public agregaraArmaImpresion(
    idAccount: number,
    idFuncionario: number,
    propiedades: any
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.BandejaImpresion_agregaraArmaImpresion_Number_Number_java.util.Map",
      ArgumentList: [idAccount, idFuncionario, propiedades],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public updateBandejaImpresion(
    bean: IBandejaImpresion
  ): Observable<IBandejaImpresion> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.BandejaImpresion_updateBandejaImpresion_co.mil.dccae.armas.bean.BandejaImpresion",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.BandejaImpresion",
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
              .DataBeanProperties as IBandejaImpresion
        )
      );
  }

  // ..:::::::::: PRODUCT KIND SERVICES ::::::::::.. //

  getClaseProductoCatalogLike(): Observable<IProductKind[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "java.util.List_getClaseProductoCatalogLike_String_String_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProductKind>>(this.url, data).pipe(
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

  deleteTipoProducto(id: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "boolean_deleteTipoProducto_Number",
      ArgumentList: [id],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  updateTipoProducto(bean: ITypeProduct): Observable<ITypeProduct> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "co.mil.dccae.inventarios.bean.TipoProducto_updateTipoProducto_co.mil.dccae.inventarios.bean.TipoProducto",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.TipoProducto",
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
              .DataBeanProperties as ITypeProduct
        )
      );
  }

  public updateClaseProducto(bean: IProductKind): Observable<IProductKind> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.ClaseProducto_updateClaseProducto_co.mil.dccae.inventarios.bean.ClaseProducto",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.ClaseProducto",
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
              .DataBeanProperties as IProductKind
        )
      );
  }

  public deleteClaseProducto(id: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "boolean_deleteClaseProducto_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ////////// PRODUCTO SERVICES ////////////////////////

  getProductoCatalog(): Observable<IProduct[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getProductoCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  getProductoCatalogPorIDProducto(
    idProducto: number | null
  ): Observable<IProduct[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getProductoCatalogPorPropiedades_java.util.Map_Number",
      ArgumentList: [
        {
          IDProducto: idProducto,
        },
        null,
      ],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  getProductosRender(
    idClaseProducto: number | null,
    idTipoProducto: number | null
  ): Observable<IProduct[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getProductosRender_Number_Number_Number",
      ArgumentList: [null, idClaseProducto, idTipoProducto],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  getProductoslikeRender(nombre: string): Observable<IProduct[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getProductoslikeRender_Number_String",
      ArgumentList: [null, nombre],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  /* getProductoCatalogPorPropiedades(
        idClaseProducto: number | null,
        idTipoProducto: number | null,
        nombre: string,
        type: number
    ): Observable<IProduct[]> {
        const parametros = {
            ServiceName: "InventariosService",
            MethodHash:
                "java.util.List_getProductoCatalogPorPropiedades_java.util.Map_Number",
            ArgumentList: [
                type === 1
                    ? {
                        IDClaseProducto: idClaseProducto,
                        IDTipoProducto: idTipoProducto,
                    }
                    : {
                        Nombre: nombre,
                    },
                null,
            ],
        };
        const data = JSON.stringify(parametros);
        return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
            map((value: any) => {
                if (value.DataBeanProperties.ObjectValue) {
                    return value.DataBeanProperties.ObjectValue.map(
                        (value1: any) => value1.DataBeanProperties
                    );
                }
                return [];
            })
        );
    } */

  getProductoCatalogPorClaseProducto(
    idClaseProducto: number | null,
    idTipoProducto: number | null
  ): Observable<IProduct[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "java.util.List_getProductoCatalogPorPropiedades_java.util.Map_Number",
      ArgumentList: [
        {
          IDClaseProducto: idClaseProducto,
          IDTipoProducto: idTipoProducto,
        },
        null,
      ],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  getProductoCatalogPorCod(
    cod: number | null,
    type: number
  ): Observable<IProduct[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "java.util.List_getProductoCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [type === 1 ? "CodSAP" : "CodDCCAE", cod, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  getProductoCatalogPorNombre(nombre: string): Observable<IProduct[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "java.util.List_getProductoCatalogLike_String_String_Number",
      ArgumentList: ["Descripcion", nombre, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProduct>>(this.url, data).pipe(
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

  public updateProducto(bean: IProduct): Observable<IProduct> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.Producto_updateProducto_co.mil.dccae.inventarios.bean.Producto",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.Producto",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as IProduct
        )
      );
  }

  public deleteProducto(id: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "boolean_deleteProducto_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /////////// ENTRADA DE ALMACEN SERVICES /////////////////////

  listarEstadosPorEntradaAlmacen(): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash: "java.util.List_listarEstadosPorEntradaAlmacen_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getEntradaAlmacenByState(
    dateFrom: string,
    dateUpto: string,
    state: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "java.util.List_getEntradaAlmacenByState_java.util.Date_java.util.Date_Number",
      ArgumentList: [dateFrom, dateUpto, state],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /////////// SALIDA DE ALMACEN SERVICES /////////////////////

  listarEstadosPorSalidaAlmacen(): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash: "java.util.List_listarEstadosPorSalidaAlmacen_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getSalidaAlmacenByState(
    dateFrom: string,
    dateUpto: string,
    state: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "java.util.List_getSalidaAlmacenByState_java.util.Date_java.util.Date_Number",
      ArgumentList: [dateFrom, dateUpto, state],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /////////// CONSULTAR PRODUCTOS CIUDADANOS /////////////////////

  getItemsPorCiudadano(
    idCittizen: number,
    dateFrom: string | null,
    dateUpto: string | null
  ): Observable<DataItemCiudadano[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getArmasCiudanoRender_Number",
      ArgumentList: [idCittizen],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<DataItemCiudadano>>(this.url, data).pipe(
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

  ////////////////////////// CAP CARGA SERVICES ///////////////////////////////

  getgetCapCargaCatalogPorIDProducto(
    idProducto: number
  ): Observable<ICapCarga[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "java.util.List_getCapCargaCatalogPorIDProducto_Number_Number",
      ArgumentList: [idProducto, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<ICapCarga>>(this.url, data).pipe(
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

  public updateCapCarga(bean: ICapCarga): Observable<ICapCarga> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.CapCarga_updateCapCarga_co.mil.dccae.inventarios.bean.CapCarga",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.CapCarga",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as ICapCarga
        )
      );
  }

  public deleteCapCarga(id: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "boolean_deleteCapCarga_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  getItemCatalog(
    dateFrom: string,
    dateUpto: string,
    idProducto: number,
    state: number
  ): Observable<any[]> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "java.util.List_getItemCatalog_java.util.Date_java.util.Date_Number_Number",
      ArgumentList: [idProducto, state],
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

  public crearSalidaAlmacen(
    fecha: string | null,
    idAlmaindumil: number,
    idCiudadano: number,
    idFuncionario: number,
    listProducts: IProduct[]
  ): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "com.advantage.shared.Report_crearSalidaAlmacen_java.util.Date_Number_Number_Number_java.util.List_Number",
      ArgumentList: [
        fecha,
        idAlmaindumil,
        idCiudadano,
        idFuncionario,
        listProducts.map((item: IProduct) => ({
          DataBeanProperties: item,
          DataBeanName: "co.mil.dccae.inventarios.bean.Producto",
        })),
        null,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getAvailableItems(
    idAlmaIndumil: number,
    idProducto: number,
    fechaFrom: string | null,
    fechaUpto: string | null,
    serial: string | null
  ): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "java.util.List_getAvailableItems_Number_Number_java.util.Date_java.util.Date_String",
      ArgumentList: [idAlmaIndumil, idProducto, fechaFrom, fechaUpto, serial],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ////////// LOTE SERVICES ////////////////////////

  getLoteCatalogPorPropiedad(id: number | null): Observable<Ilote[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "InventariosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getLoteCatalogPorPropiedad_String_Object_Number",
      ArgumentList: ["IDProducto", id, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<Ilote>>(this.url, data).pipe(
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

  public updateLote(bean: Ilote): Observable<Ilote> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.Lote_updateLote_co.mil.dccae.inventarios.bean.Lote",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.Lote",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Ilote
        )
      );
  }

  public deleteLote(id: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "boolean_deleteLote_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ////////// ENTRADA ALMACEN SERVICES ////////////////////////

  descargarFormatoEntradaAlmacen() {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash: "java.util.List_descargarFormatoEntradaAlmacen_String",
      ArgumentList: [null],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  crearEntradaAlmacen(
    fecha: string,
    idProveedor: number,
    idEmpleado: number,
    numeroEntrada: string,
    media: string,
    mediaContext: string,
    dataStore: string,
    idAlmaIndumil: number
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "DocumentosService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.advantage.shared.Report_crearEntradaAlmacen_java.util.Date_Number_Number_String_String_String_String_Number_Number",
      ArgumentList: [
        fecha,
        idProveedor,
        idEmpleado,
        numeroEntrada,
        media,
        mediaContext,
        dataStore,
        idAlmaIndumil,
        null,
      ],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  crearEntradaAlmacen2(
    fecha: string,
    idProveedor: number,
    idEmpleado: number,
    numeroEntrada: string,
    product: IProduct | undefined,
    idAlmaIndumil: number
  ) {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "com.advantage.shared.Report_crearEntradaAlmacen_java.util.Date_Number_Number_String_java.util.List_Number_Number",
      ArgumentList: [
        fecha,
        idProveedor,
        idEmpleado,
        numeroEntrada,
        [
          {
            DataBeanProperties: product,
            DataBeanName: "co.mil.dccae.inventarios.bean.Producto",
          },
        ],
        idAlmaIndumil,
        null,
      ],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  crearEntradaSalidaAlmacen(
    fecha: string,
    idProveedor: number,
    idCiudadano: number,
    idEmpleado: number,
    numeroEntrada: string,
    product: IProduct | undefined,
    idAlmaIndumil: number,
    idOffice: number
  ) {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "com.advantage.shared.Report_crearEntradaSalidaAlmacen_java.util.Date_Number_Number_Number_String_java.util.List_Number_Number",
      ArgumentList: [
        fecha,
        idProveedor,
        idCiudadano,
        idEmpleado,
        numeroEntrada,
        [
          {
            DataBeanProperties: product,
            DataBeanName: "co.mil.dccae.inventarios.bean.Producto",
          },
        ],
        idAlmaIndumil,
        idOffice,
      ],
    };

    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /**
   * Servicios Acta Traumatica
   */

  public getActaTraumaticaCatalogPorPropiedad(): Observable<Record[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getActaTraumaticaCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Record>>(this.url, data).pipe(
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

  updateActaTraumatica(bean: any): Observable<Record> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.ActaTraumatica_updateActaTraumatica_co.mil.dccae.armas.bean.ActaTraumatica",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.ActaTraumatica",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as Record
        )
      );
  }

  public deleteActaTraumatica(id: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "boolean_deleteActaTraumatica_Number",
      ArgumentList: [id],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getArmasPorIDSalida(
    idSalida: number,
    dateSalida: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getArmasPorIDSalida_Number_java.util.Date",
      ArgumentList: [idSalida, dateSalida],
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

  /**
   * MARCAJE DE TRAUMATICA
   */

  public agregarListaMarcaje(
    idAccount: number,
    idSalida: number,
    fechaSolicitud: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.MarcaIndumil_agregarListaMarcaje_Number_Number_java.util.Date",
      ArgumentList: [idAccount, idSalida, fechaSolicitud],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public actualizarEstadoMarcaje(
    state: number,
    idAccount: number,
    IDMarcaIndumil: number,
    idFuncionario: number,
    dataUpdate: IDataUpdate
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.MarcaIndumil_actualizarEstadoMarcaje_Number_Number_Number_Number_java.util.Map",
      ArgumentList: [
        state,
        idAccount,
        IDMarcaIndumil,
        idFuncionario,
        dataUpdate,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getItem(iditem: number, fechaDoc: string): Observable<any> {
    const parametros = {
      ServiceName: "DocumentosService",
      MethodHash:
        "co.mil.dccae.documentos.bean.Item_getItem_Number_java.util.Date",
      ArgumentList: [iditem, fechaDoc],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  //........ INVENTARIO DE HOJAS DE PERMISO //........

  public hojaPermisoRender(map: any): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_HojaPermisoRender_Number_java.util.Map",
      ArgumentList: [null, map],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getHojaPermisoCatalogPorPropiedades(map: any): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_HojaPermisoBandeja_Number_java.util.Map",
      ArgumentList: [null, map],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public getHojaPermiso(idHojaPermiso: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.HojaPermiso_getHojaPermiso_Number",
      ArgumentList: [idHojaPermiso],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public cargarInventarioHojaPermisos(
    idFuncionario: number,
    idOffice: number,
    idTipoPermiso: number,
    fechaRegistro: string,
    mediaContext: string,
    media: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cargarInventarioHojaPermisos_Number_Number_Number_java.util.Date_String_String",
      ArgumentList: [
        idFuncionario,
        idOffice,
        idTipoPermiso,
        fechaRegistro,
        mediaContext,
        media,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public asignarPermiso(
    IDHojaPermiso: number,
    IDAccount: number,
    IDItem: number,
    fechaDocumento: string,
    IDFuncionarioAsigna: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.HojaPermiso_asignarPermiso_Number_Number_Number_java.util.Date_Number",
      ArgumentList: [
        IDHojaPermiso,
        IDAccount,
        IDItem,
        fechaDocumento,
        IDFuncionarioAsigna,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public anularPermiso(
    IDHojaPermiso: number,
    IDBandejaImpresion: number,
    IDFuncionarioAsigna: number,
    Observaciones: string
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.HojaPermiso_anularPermiso_Number_Number_Number_String",
      ArgumentList: [
        IDHojaPermiso,
        IDBandejaImpresion,
        IDFuncionarioAsigna,
        Observaciones,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  // ......::::::: CINAR SERVICES ::::::::.......

  getAtencionCINARCatalogLike(): Observable<ICinar[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_getAtencionCINARCatalogLike_String_String_Number",
      ArgumentList: [null, null, null],
    };
    const data = JSON.stringify(parametros);

    return api.post<ServerResponse<IProductKind>>(this.url, data).pipe(
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

  updateAtencionCINAR(bean: any): Observable<ICinar> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.AtencionCINAR_updateAtencionCINAR_co.mil.dccae.armas.bean.AtencionCINAR",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.AtencionCINAR",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(
        map(
          (value) =>
            value.DataBeanProperties.ObjectValue.DataBeanProperties as ICinar
        )
      );
  }
  filterCinar = (bean: any) => {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_consultarAtencionCINAR_Number_java.util.Date_java.util.Date",
      ArgumentList: [bean.IDAccount, bean.FechaInicial, bean.FechaFinal],
    };
    const data = JSON.stringify(parametros);
    return api.post<any>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  };

  // ......::::::: CALL CENTER SERVICES ::::::::.......

  updateCallCenter(bean: any): Observable<ICallCenter> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "co.mil.dccae.armas.bean.CallCenter_updateCallCenter_co.mil.dccae.armas.bean.CallCenter",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.CallCenter",
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
              .DataBeanProperties as ICallCenter
        )
      );
  }

  consultarCallCenter = (
    idAccount: any,
    fechaInicial: any,
    fechaFinal: any
  ) => {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.List_consultarCallCenter_Number_java.util.Date_java.util.Date",
      ArgumentList: [idAccount, fechaInicial, fechaFinal],
    };
    const data = JSON.stringify(parametros);
    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  };

  listaMultasRender(
    state: number,
    dateFrom: string,
    dateUpto: string
  ): Observable<Fine[]> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_listaMultasRender_Number_java.util.Date_java.util.Date",
      ArgumentList: [state, dateFrom, dateUpto],
    };
    const data = JSON.stringify(parametros);
    return api.post<ServerResponse<Fine>>(this.url, data).pipe(
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

  public eximirMulta(
    IdMulta: number,
    IDFuncionario: number,
    Soporte: string,
    Observacion: string
  ) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_eximirMulta_Number_java.util.Map",
      ArgumentList: [IdMulta, { IDFuncionario, Soporte, Observacion }],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  public multasDatosBasicos(IdAccount: number): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_multasDatosBasicos_Number",
      ArgumentList: [IdAccount],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  //////////////////// AUDITORIA SERVICES ////////////////////

  public getAuditoriaCatalogPorPropiedad(
    namePropiedad: number | null,
    object: any | null,
    maxRows: number | null
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getAuditoriaCatalogPorPropiedad_String_Object_Number",
      ArgumentList: [namePropiedad, object, maxRows],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  public getAuditoriaAuditorRender(idAuditor: any): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getAuditoriaAuditorRender_Number",
      ArgumentList: [idAuditor],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  public getAuditoriaFuncionarioRender(idFuncionario: any): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "ArmasService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getAuditoriaFuncionarioRender_Number",
      ArgumentList: [idFuncionario],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  //////////////////// AUDITORIA HISTORICO SERVICES ////////////////////

  public getAuditoriaHistoricoRender(idAuditoria: any): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_getAuditoriaHistoricoRender_Number",
      ArgumentList: [idAuditoria],
    };

    const data = JSON.stringify(parametros);

    return api
      .post<any>(this.url, data)
      .pipe(map((value) => value.DataBeanProperties.ObjectValue));
  }

  updateAuditoriaHistoricoRender(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_updateAuditoriaHistoricoRender_co.mil.dccae.armas.bean.AuditoriaHistorico",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.armas.bean.AuditoriaHistorico",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ////////////////////////////////// REVALIDACION SERVICES //////////////////////////////////

  agregaraArmaImpresionRevalidacion(
    idFuncionario: number,
    idProcedureIMP: number,
    map: any
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_agregaraArmaImpresionRevalidacion_Number_Number_java.util.List",
      ArgumentList: [idFuncionario, idProcedureIMP, map],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  ////////////////////////////////// TIPO NOVEDAD SERVICES //////////////////////////////////

  public getTipoNovedadRender(): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_tipoNovedadRender_Number",
      ArgumentList: [null],
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

  public updateTipoNovedad(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.TipoNovedad_updateTipoNovedad_co.mil.dccae.inventarios.bean.TipoNovedad",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.TipoNovedad",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public deleteTipoNovedad(idTipoNovedad: number): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash: "boolean_deleteTipoNovedad_Number",
      ArgumentList: [idTipoNovedad],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /////////////////////////// SOLICITUD PRODUCTO SERVICES /////////////////////////////////////

  public getSolProductoCatalogLike(): Observable<any[]> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "java.util.List_getSolProductoCatalogLike_String_String_Number",
      ArgumentList: [null, null, null],
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

  public solProductoRender(idProdcedureImp: number): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_solProductoRender_Number",
      ArgumentList: [idProdcedureImp],
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

  public solProductoRenderEstado(
    idProdcedureImp: number,
    state: number
  ): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_solProductoRenderEstado_Number_Number",
      ArgumentList: [idProdcedureImp, state],
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

  public updateSolProducto(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.SolProducto_updateSolProducto_co.mil.dccae.inventarios.bean.SolProducto",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.SolProducto",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public cargueAsignacionArmasFuegoTramite(
    idAction: number,
    idFuncionario: number,
    idProducto: number,
    tipoUso: number,
    serialArma: string,
    capacidad: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cargueAsignacionArmasFuegoTramite_Number_Number_Number_Number_String_Number",
      ArgumentList: [
        idAction,
        idFuncionario,
        idProducto,
        tipoUso,
        serialArma,
        capacidad,
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  /////////////////////////// SOLICITUD CESION SERVICES /////////////////////////////////////

  public solCesionRender(idProdcedureImp: number): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_solCesionRender_Number",
      ArgumentList: [idProdcedureImp],
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

  public updateSolCesion(bean: any): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.SolCesion_updateSolCesion_co.mil.dccae.inventarios.bean.SolCesion",
      ArgumentList: [
        {
          DataBeanProperties: bean,
          DataBeanName: "co.mil.dccae.inventarios.bean.SolCesion",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }

  public cesionArmas(idProcedureImp: number, idFuncionario: number): Observable<any> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash:
        "java.util.Map_cesionarArmas_Number_Number",
      ArgumentList: [
        idProcedureImp,
        idFuncionario
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }



  /////////////////////////// SOLICITUD REVALIDACION SERVICES /////////////////////////////////////

  public solRevalidacionRender(idProdcedureImp: number): Observable<any[]> {
    const parametros = {
      ServiceName: "ArmasService",
      MethodHash: "java.util.List_solRevalidacionRender_Number",
      ArgumentList: [idProdcedureImp],
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
  public updateSolRevalidacion(dataBean: any): Observable<any> {
    const parametros = {
      ServiceName: "InventariosService",
      MethodHash:
        "co.mil.dccae.inventarios.bean.SolRevalidacion_updateSolRevalidacion_co.mil.dccae.inventarios.bean.SolRevalidacion",
      ArgumentList: [
        {
          DataBeanProperties: dataBean,
          DataBeanName: "co.mil.dccae.inventarios.bean.SolRevalidacion",
        },
      ],
    };
    const data = JSON.stringify(parametros);
    return api.post(this.url, data);
  }
}
