import { Car } from '../model/car';
import { CarFilter } from '../type/car-filter';
import { UniqueValue } from '../type/unique-value';

export class CarRepository {


    private cars: Car[] = [];

    constructor(carsData: Car[]) {
        carsData.forEach(car => this.cars.push(car));
    }

    public addCar(car: Car): void {
        this.cars.push(car);
    }

    public getCars(): Car[] {
        return this.cars;
    }

    public getUniqueValues(): UniqueValue {
        const makes = new Set<string>();
        const styles = new Set<string>();
        const conditions = new Set<string>();
        const models = new Set<string>();
        const years = new Set<number>();
        const prices = new Set<number>();

        this.cars.forEach(car => {
            makes.add(car.make);
            styles.add(car.style);
            conditions.add(car.condition);
            models.add(car.model);
            years.add(car.year);
            prices.add(car.price);
        });

        return {
            makes: Array.from(makes),
            styles: Array.from(styles),
            conditions: Array.from(conditions),
            models: Array.from(models),
            years: Array.from(years),
            prices: Array.from(prices),
        };
    }

    public searchCars(filters: CarFilter): Car[] {
        return this.cars.filter(car => {
            return (!filters.year || car.year.toString() === filters.year) &&
                (!filters.style || car.style.toLowerCase() === filters.style.toLowerCase()) &&
                (!filters.make || car.make.toLowerCase() === filters.make.toLowerCase()) &&
                (!filters.model || car.model.toLowerCase() === filters.model.toLowerCase()) &&
                (!filters.condition || car.condition.toLowerCase() === filters.condition.toLowerCase()) &&
                (!filters.price || car.price <= parseInt(filters.price));
        });
    }

    public getFeaturedCars(count: number): Car[] {
        return this.cars.slice(0, count);
    }

    public getNewCars(count: number): Car[] {
        return this.cars
            .sort((a, b) => b.year - a.year)
            .slice(0, count);
    }
}