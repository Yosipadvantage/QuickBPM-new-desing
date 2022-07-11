export interface Characterization {
    IDBusinessClass: number;
    Name: string;
    Description: string;
}

export interface CharacterizationK {
    IDCharacterization: number;
    Name: string;
    Description: string;
    IDCustomerType: number
    CustomerTypeName: string
}