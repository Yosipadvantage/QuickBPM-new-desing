export interface IDataUpdate {
    IDFuncionario: number,
    IDItem: number,
    Observaciones: string,
    TipoUso?: number,
    NombreTipoUso?: string,
    FechaMarcaje?: string | null,
    SerialIndumil?: string
}