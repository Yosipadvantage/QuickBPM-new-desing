export interface IDataPermission {
    IDPermiso?: number,
    Names: string;
    Surnames: string;
    ClaseArma?: string;
    Marca?: string;
    Serie?: string;
    Calibre?: string | null;
    Capacidad?: string;
    Vence: string;
    Dpto?: string;
    Mpio?: string;
    Ubicacion?: string;
    Barrio?: string;
    CodeA: string,
    CodeB: string,
    TipoPermiso: number,
    NombreTipo: string,
    Estado: string,
    TipoArma?: any,
    Fire?: boolean,
    IDItem?: number,
    FechDocumento?: string,
    DocType: number,
    TipoUso?: string
    CodSec?: string
}