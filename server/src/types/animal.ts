export type AnimalType = {
    name: string;
    type: string;
    age: number;
    breed: string;
    vaccinated: VaccineType[]
};

export type VaccineType = {
    name: string;
    dose: number;
    date: Date;
}

export type CreateNewAnimalType = {
    name: string,
    type: string,
    age: number,
    breed: string,
    vaccineName: string
}