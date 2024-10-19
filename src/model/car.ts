export class Car {
    constructor(
        public make: string,
        public model: string,
        public year: number,
        public mileage: number,
        public horsepower: number,
        public price: number,
        public description: string,
        public imageUrl: string,
        public style: string,
        public condition: string,
        public transmission: string = "automatic"
    ) {}
}