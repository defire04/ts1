import { CarService } from '../service/car-service';
import { Car } from '../model/car';
import { CarFilter } from '../type/car-filter';
import { FilterUtil } from '../util/filter-util';

export class CarUI {
    private carService: CarService;

    constructor(carService: CarService) {
        this.carService = carService;
    }

    renderFeaturedCars() {
        const featuredCarsContainer = document.getElementById('featured-cars-content');
        if (!featuredCarsContainer) return;

        const featuredCars = this.carService.getFeaturedCars(8);
        featuredCarsContainer.innerHTML = featuredCars.map(this.createFeaturedCarHTML).join('');
    }

    renderNewCars() {
        const newCarsCarousel = document.getElementById('new-cars-carousel');
        if (!newCarsCarousel) return;

        const newCars = this.carService.getNewCars(3);
        newCarsCarousel.innerHTML = newCars.map(this.createNewCarHTML).join('');
    }

    populateFilters() {
        const uniqueValues = this.carService.getUniqueValues();
        this.populateSelect('filter-year', uniqueValues.years, 'Year');
        this.populateSelect('filter-make', uniqueValues.makes, 'Make');
        this.populateSelect('filter-style', uniqueValues.styles, 'Style');
        this.populateSelect('filter-condition', uniqueValues.conditions, 'Condition');
        this.populateSelect('filter-model', uniqueValues.models, 'Model');
        this.populateSelect('filter-price', uniqueValues.prices, 'Price', (price) => `$${price.toLocaleString()}`);
    }

    setupEventListeners() {
        document.getElementById('search-btn')?.addEventListener('click', this.handleSearch.bind(this));
        document.getElementById('filter-make')?.addEventListener('change', this.updateFilters.bind(this));
        document.getElementById('filter-style')?.addEventListener('change', this.updateFilters.bind(this));
        document.getElementById('filter-condition')?.addEventListener('change', this.updateFilters.bind(this));
        document.getElementById('filter-model')?.addEventListener('change', this.handleModelChange.bind(this));
        document.getElementById('filter-price')?.addEventListener('change', this.updateFilters.bind(this));
        document.getElementById('close-btn')?.addEventListener('click', this.closeModal.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.onclick = this.handleWindowClick.bind(this);
    }

    private createFeaturedCarHTML(car: Car): string {
        return `
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
        `;
    }

    private createNewCarHTML(car: Car): string {
        return `
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
        `;
    }

    private populateSelect(id: string, values: (string | number)[], placeholder: string, formatter: (value: string | number) => string = String) {
        const select = document.getElementById(id) as HTMLSelectElement;
        if (!select) return;

        select.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        values.forEach(value => {
            const option = document.createElement("option");
            option.value = String(value);
            option.textContent = formatter(value);
            select.appendChild(option);
        });
    }

    private handleSearch() {
        const filters: CarFilter = {
            year: (document.getElementById('filter-year') as HTMLSelectElement).value,
            style: (document.getElementById('filter-style') as HTMLSelectElement).value,
            make: (document.getElementById('filter-make') as HTMLSelectElement).value,
            model: (document.getElementById('filter-model') as HTMLSelectElement).value,
            condition: (document.getElementById('filter-condition') as HTMLSelectElement).value,
            price: (document.getElementById('filter-price') as HTMLSelectElement).value,
        };

        const results = this.carService.searchCars(filters);
        this.displaySearchResults(results);
    }

    private updateFilters() {
        const makeSelect = document.getElementById("filter-make") as HTMLSelectElement;
        const styleSelect = document.getElementById("filter-style") as HTMLSelectElement;
        const conditionSelect = document.getElementById("filter-condition") as HTMLSelectElement;

        const updatedValues = FilterUtil.updateFilters(
            this.carService.getCars(),
            makeSelect.value,
            styleSelect.value,
            conditionSelect.value
        );

        this.populateSelect('filter-model', updatedValues.models, 'Model');
        this.populateSelect('filter-price', updatedValues.prices, 'Price', (price) => `$${Number(price).toLocaleString()}`);
    }

    private handleModelChange() {
        const modelSelect = document.getElementById("filter-model") as HTMLSelectElement;
        const priceSelect = document.getElementById("filter-price") as HTMLSelectElement;

        const selectedModel = modelSelect.value;
        if (selectedModel) {
            const selectedCar = this.carService.getCars().find(car => car.model === selectedModel);
            if (selectedCar) {
                priceSelect.value = selectedCar.price.toString();
            }
        } else {
            priceSelect.value = "";
        }
    }

    private displaySearchResults(results: Car[]) {
        const resultsContainer = document.getElementById('search-results')!;
        resultsContainer.innerHTML = '';

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
        } else {
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

        const modal = document.getElementById('car-details-modal')!;
        modal.style.display = 'block';
    }

    private closeModal() {
        const modal = document.getElementById('car-details-modal')!;
        modal.style.display = 'none';
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            const modal = document.getElementById('car-details-modal')!;
            if (modal) {
                modal.style.display = 'none';
            }
        }
    }

    private handleWindowClick(event: MouseEvent) {
        const modal = document.getElementById('car-details-modal')!;
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}