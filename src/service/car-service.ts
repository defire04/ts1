import { Car } from '../model/car';
import { CarFilter } from '../type/car-filter';
import { UniqueValue } from '../type/unique-value';
import { CarRepository } from '../repository/car-repository';

export class CarService {
    private carRepository: CarRepository;

    constructor(carRepository: CarRepository) {
        this.carRepository = carRepository;
    }

    public addCar(car: Car): void {
        this.carRepository.addCar(car);
    }

    public getCars(): Car[] {
        return this.carRepository.getCars();
    }

    public getUniqueValues(): UniqueValue {
        return this.carRepository.getUniqueValues();
    }

    public searchCars(filters: CarFilter): Car[] {
        return this.carRepository.searchCars(filters);
    }

    public getFeaturedCars(count: number): Car[] {
        return this.carRepository.getFeaturedCars(count);
    }

    public getNewCars(count: number): Car[] {
        return this.carRepository.getNewCars(count);
    }
}