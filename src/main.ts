import { Car } from './model/car';
import { CarRepository } from './repository/car-repository';
import { CarService } from './service/car-service';
import {CarUI} from "./ui/car-ui";



const carsData = [
    new Car("BMW", "6-series gran coupe", 2017, 3100, 240, 89395, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc1.png", "sedan", "new"),
    new Car("Chevrolet", "Camaro WMV20", 2017, 3100, 240, 66575, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc2.png", "sedan", "new"),
    new Car("Lamborghini", "v520", 2017, 3100, 240, 125250, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc3.png", "sedan", "new"),
    new Car("Audi", "A3 Sedan", 2017, 3100, 240, 95500, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc4.png", "sedan", "new"),
    new Car("Infiniti", "Z5", 2017, 3100, 240, 36850, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc4.png", "sedan", "new"),
    new Car("Porsche", "718 Cayman", 2017, 3100, 240, 48500, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc5.png", "sedan", "new"),
    new Car("BMW", "8-series coupe", 2017, 3100, 240, 56000, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc7.png", "sedan", "new"),
    new Car("BMW", "X series-6", 2017, 3100, 240, 75800, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc8.png", "sedan", "new")
];
const carRepository = new CarRepository(carsData);
const carService = new CarService(carRepository);

const carUI = new CarUI(carService);

document.addEventListener('DOMContentLoaded', () => {
    carUI.renderFeaturedCars();
    carUI.renderNewCars();
    carUI.populateFilters();
    carUI.setupEventListeners();
});


