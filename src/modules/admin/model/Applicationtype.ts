export interface IApplicationTypeModule {
    IDApplicationType: number;
    Name: string;
    Purpose: string;
    Type: number
}
export interface IApplicationTypeMenu {
    IDLn: number;
    Code: string;
    Name: string;
    URL: string;
    isActive: boolean;
}
export interface IApplicationTypeRole {
    IDRole: number,
    Name: string;
    Description: string;
    State: string;
}