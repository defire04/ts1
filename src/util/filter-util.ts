import { Car } from '../model/car';
import { UniqueValue } from '../type/unique-value';

export class FilterUtil {
    static updateFilters(cars: Car[], selectedMake: string, selectedStyle: string, selectedCondition: string): UniqueValue {
        const filteredCars = cars.filter(car => {
            return (selectedMake === "" || car.make.toLowerCase() === selectedMake.toLowerCase()) &&
                (selectedStyle === "" || car.style.toLowerCase() === selectedStyle.toLowerCase()) &&
                (selectedCondition === "" || car.condition.toLowerCase() === selectedCondition.toLowerCase());
        });

        const uniqueModels = new Set<string>();
        const uniquePrices = new Set<number>();
        filteredCars.forEach(car => {
            uniqueModels.add(car.model);
            uniquePrices.add(car.price);
        });

        return {
            models: Array.from(uniqueModels),
            prices: Array.from(uniquePrices),
            makes: [],
            styles: [],
            conditions: [],
            years: []
        };
    }
}