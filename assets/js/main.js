"use strict";
var _a, _b, _c, _d, _e;
class Car {
    constructor(make, model, year, mileage, horsepower, price, description, imageUrl, style, condition, transmission = "automatic") {
        this.make = make;
        this.model = model;
        this.year = year;
        this.mileage = mileage;
        this.horsepower = horsepower;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.style = style;
        this.condition = condition;
        this.transmission = transmission;
    }
}
class CarManager {
    constructor() {
        this.cars = [];
    }
    addCar(car) {
        this.cars.push(car);
    }
    getUniqueValues() {
        const makes = new Set();
        const styles = new Set();
        const conditions = new Set();
        const models = new Set();
        const years = new Set();
        const prices = new Set();
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
    searchCars(filters) {
        return this.cars.filter(car => {
            return (!filters.year || car.year.toString() === filters.year) &&
                (!filters.style || car.style.toLowerCase() === filters.style.toLowerCase()) &&
                (!filters.make || car.make.toLowerCase() === filters.make.toLowerCase()) &&
                (!filters.model || car.model.toLowerCase() === filters.model.toLowerCase()) &&
                (!filters.condition || car.condition.toLowerCase() === filters.condition.toLowerCase()) &&
                (!filters.price || car.price <= parseInt(filters.price));
        });
    }
    getCars() {
        return this.cars;
    }
    getFeaturedCars(count) {
        return this.cars.slice(0, count);
    }
    getNewCars(count) {
        return this.cars
            .sort((a, b) => b.year - a.year)
            .slice(0, count);
    }
}
function populateFilters(cars) {
    const carManager = new CarManager();
    cars.forEach(car => carManager.addCar(car));
    const uniqueValues = carManager.getUniqueValues();
    // Заполнение years
    const yearSelect = document.getElementById("filter-year");
    yearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
    uniqueValues.years.forEach(year => {
        const option = document.createElement("option");
        option.value = year.toString();
        option.textContent = year.toString();
        yearSelect.appendChild(option);
    });
    const makeSelect = document.getElementById("filter-make");
    makeSelect.innerHTML = '<option value="" disabled selected>Make</option>';
    uniqueValues.makes.forEach(make => {
        const option = document.createElement("option");
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
    });
    const styleSelect = document.getElementById("filter-style");
    styleSelect.innerHTML = '<option value="" disabled selected>Style</option>';
    uniqueValues.styles.forEach(style => {
        const option = document.createElement("option");
        option.value = style;
        option.textContent = style;
        styleSelect.appendChild(option);
    });
    const conditionSelect = document.getElementById("filter-condition");
    conditionSelect.innerHTML = '<option value="" disabled selected>Condition</option>';
    uniqueValues.conditions.forEach(condition => {
        const option = document.createElement("option");
        option.value = condition;
        option.textContent = condition;
        conditionSelect.appendChild(option);
    });
    const modelSelect = document.getElementById("filter-model");
    modelSelect.innerHTML = '<option value="" disabled selected>Model</option>';
    uniqueValues.models.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
    const priceSelect = document.getElementById("filter-price");
    priceSelect.innerHTML = '<option value="" disabled selected>Price</option>';
    uniqueValues.prices.forEach(price => {
        const option = document.createElement("option");
        option.value = price.toString();
        option.textContent = `$${price.toLocaleString()}`;
        priceSelect.appendChild(option);
    });
}
function updateFilters() {
    const makeSelect = document.getElementById("filter-make");
    const styleSelect = document.getElementById("filter-style");
    const conditionSelect = document.getElementById("filter-condition");
    const modelSelect = document.getElementById("filter-model");
    const priceSelect = document.getElementById("filter-price");
    const selectedMake = makeSelect.value.toLowerCase();
    const selectedStyle = styleSelect.value.toLowerCase();
    const selectedCondition = conditionSelect.value.toLowerCase();
    const filteredCars = carManager.getCars().filter(car => {
        return (selectedMake === "" || car.make.toLowerCase() === selectedMake) &&
            (selectedStyle === "" || car.style.toLowerCase() === selectedStyle) &&
            (selectedCondition === "" || car.condition.toLowerCase() === selectedCondition);
    });
    const uniqueModels = new Set();
    filteredCars.forEach(car => uniqueModels.add(car.model));
    modelSelect.innerHTML = '<option value="">Model</option>';
    uniqueModels.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
    const uniquePrices = new Set();
    filteredCars.forEach(car => uniquePrices.add(car.price));
    priceSelect.innerHTML = '<option value="">Price</option>';
    uniquePrices.forEach(price => {
        const option = document.createElement("option");
        option.value = price.toString();
        option.textContent = `$${price.toLocaleString()}`;
        priceSelect.appendChild(option);
    });
}
(_a = document.getElementById("filter-make")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", updateFilters);
(_b = document.getElementById("filter-style")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", updateFilters);
(_c = document.getElementById("filter-condition")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", updateFilters);
(_d = document.getElementById("filter-model")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", () => {
    const selectedModel = document.getElementById("filter-model").value;
    if (selectedModel) {
        const selectedCar = carManager.getCars().find(car => car.model === selectedModel);
        if (selectedCar) {
            document.getElementById("filter-price").value = selectedCar.price.toString();
        }
    }
    else {
        document.getElementById("filter-price").value = "";
    }
});
(_e = document.getElementById("filter-price")) === null || _e === void 0 ? void 0 : _e.addEventListener("change", updateFilters);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modal = document.getElementById('car-details-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
});
const carManager = new CarManager();
carManager.addCar(new Car("BMW", "6-series gran coupe", 2017, 3100, 240, 89395, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc1.png", "sedan", "new"));
carManager.addCar(new Car("Chevrolet", "Camaro WMV20", 2017, 3100, 240, 66575, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc2.png", "sedan", "new"));
carManager.addCar(new Car("Lamborghini", "v520", 2017, 3100, 240, 125250, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc3.png", "sedan", "new"));
carManager.addCar(new Car("Audi", "A3 Sedan", 2017, 3100, 240, 95500, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc4.png", "sedan", "new"));
carManager.addCar(new Car("Infiniti", "Z5", 2017, 3100, 240, 36850, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc4.png", "sedan", "new"));
carManager.addCar(new Car("Porsche", "718 Cayman", 2017, 3100, 240, 48500, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc5.png", "sedan", "new"));
carManager.addCar(new Car("BMW", "8-series coupe", 2017, 3100, 240, 56000, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc7.png", "sedan", "new"));
carManager.addCar(new Car("BMW", "X series-6", 2017, 3100, 240, 75800, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "assets/images/featured-cars/fc8.png", "sedan", "new"));
// Добавляем другие машины...
function renderFeaturedCars() {
    const featuredCarsContainer = document.getElementById('featured-cars-content');
    if (!featuredCarsContainer)
        return;
    const featuredCars = carManager.getFeaturedCars(8);
    featuredCarsContainer.innerHTML = featuredCars.map(car => `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="single-featured-cars">
        <div class="featured-img-box">
          <div class="featured-cars-img">
            <img src="${car.imageUrl}" alt="${car.make} ${car.model}">
          </div>
          <div class="featured-model-info">
            <p>
              model: ${car.year}
              <span class="featured-mi-span"> ${car.mileage} mi</span> 
              <span class="featured-hp-span"> ${car.horsepower}HP</span>
              ${car.transmission}
            </p>
          </div>
        </div>
        <div class="featured-cars-txt">
          <h2><a href="#">${car.make} ${car.model}</a></h2>
          <h3>$${car.price.toLocaleString()}</h3>
          <p>${car.description}</p>
        </div>
      </div>
    </div>
    `).join('');
}
function renderNewCars() {
    const newCarsCarousel = document.getElementById('new-cars-carousel');
    if (!newCarsCarousel)
        return;
    const newCars = carManager.getNewCars(3);
    newCarsCarousel.innerHTML = newCars.map(car => `
    <div class="new-cars-item">
      <div class="single-new-cars-item">
        <div class="row">
          <div class="col-md-7 col-sm-12">
            <div class="new-cars-img">
              <img src="${car.imageUrl}" alt="${car.make} ${car.model}"/>
            </div>
          </div>
          <div class="col-md-5 col-sm-12">
            <div class="new-cars-txt">
              <h2><a href="#">${car.make} ${car.model}</a></h2>
              <p>${car.description}</p>
              <p class="new-cars-para2">
                Model: ${car.year}, ${car.mileage} mi, ${car.horsepower}HP, ${car.transmission}
              </p>
              <button class="welcome-btn new-cars-btn" onclick="window.location.href='#'">
                view details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `).join('');
}
document.getElementById('search-btn').addEventListener('click', () => {
    const filters = {
        year: document.getElementById('filter-year').value,
        style: document.getElementById('filter-style').value,
        make: document.getElementById('filter-make').value,
        model: document.getElementById('filter-model').value,
        condition: document.getElementById('filter-condition').value,
        price: document.getElementById('filter-price').value,
    };
    const results = carManager.searchCars(filters);
    displaySearchResults(results);
});
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Очистить предыдущие результаты
    const table = document.createElement('table');
    table.className = 'results-table';
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th>Make</th>
    <th>Model</th>
    <th>Year</th>
    <th>Price</th>
    <th>Description</th>
    <th>Image</th>
`;
    table.appendChild(headerRow);
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Нет результатов</p>';
    }
    else {
        results.forEach(car => {
            const carRow = document.createElement('tr');
            carRow.innerHTML = `
                <td>${car.make}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>$${car.price.toLocaleString()}</td>
                <td>${car.description}</td>
                <td><img src="${car.imageUrl}" alt="${car.make} ${car.model}" class="car-image"></td>
            `;
            table.appendChild(carRow);
        });
    }
    resultsContainer.appendChild(table);
    const modal = document.getElementById('car-details-modal');
    modal.style.display = 'block';
}
document.getElementById('close-btn').addEventListener('click', () => {
    const modal = document.getElementById('car-details-modal');
    modal.style.display = 'none';
});
window.onclick = function (event) {
    const modal = document.getElementById('car-details-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedCars();
    renderNewCars();
    populateFilters(carManager.getCars());
});
