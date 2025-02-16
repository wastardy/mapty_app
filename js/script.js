'use strict';

//#region Declarations
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//#endregion

//#region Base Class
class Workout {
    date = new Date();
    clicks = 0;
    
    // convert date to string and select last 10 numbers
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        // this.date = ...
        // this.id = ...
        this.coords = coords; // [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }

    _setDescription() {
        const months = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December'
        ];

        this.description = 
            `${this.type[0].toUpperCase()}` + 
            `${this.type.slice(1)} ` +
            `on ${months[this.date.getMonth()]} ` +
            `${this.date.getDate()}`;
    }

    clicksCount() {
        this.clicks++;
    }
}
//#endregion

//#region Child Classes
class Running extends Workout {
    type = 'running'

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        
        this.cadence = cadence;

        this.calculatePace();
        this._setDescription();
    }

    calculatePace() {
        // min/km
        this.pace = Number((this.duration / this.distance)
            .toFixed(2));
            
        return this.pace.toFixed(2);
    }
}

class Cycling extends Workout {
    type = 'cycling'

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);

        this.elevationGain = elevationGain;

        this.calculateSpeed();
        this._setDescription();
    }

    calculateSpeed() {
        // km/h
        this.speed = +((this.distance / (this.duration / 60))
            .toFixed(2));

        return this.speed;
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);
//#endregion

//#region App Class
class App {
    #map;
    #mapZoomLevel = 16;
    #mapEvent;
    #workoutsList = [];

    constructor() {
        // Get user position
        this._getPosition();

        // Get workouts from local storage
        this._getDataFromLocalStorage();

        // Event handlers
        form.addEventListener(
            'submit', 
            this._newWorkout.bind(this)
        );
        
        inputType.addEventListener(
            'change', 
            this._toggleElevationField.bind(this)
        );

        containerWorkouts.addEventListener(
            'click',
            this._moveToPopup.bind(this)
        );
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this), // position parameter will be passed automatically
                () => alert('Cood not get your position'),
            );
        }
    }

    _loadMap(position) {
        const { latitude } = position.coords; 
        const { longitude } = position.coords;
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
                    
        const coords = [latitude, longitude];
                    
        // use leaflet map
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
        
        // .org => .fr/hot
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        // handle click on map
        this.#map.on('click', this._showForm.bind(this));
        this.#workoutsList.forEach(workout => this._printMarker(workout));
    }

    _renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">
                        ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
                    </span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;

        if (workout.type === 'running') {
            html += `
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.pace}</span>
                        <span class="workout__unit">min/km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.cadence}</span>
                        <span class="workout__unit">spm</span>
                    </div>
                </li>
            `;
        }

        if (workout.type === 'cycling') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed}</span>
                    <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevationGain}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>
            `;
        }

        form.insertAdjacentHTML('afterend', html);
    }

    _printMarker(workout) {
        // console.log(mapEvent);
        // const { lat, lng } = this.#mapEvent.latlng;
    
        // L.marker([lat, lng])
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250, 
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent(
                `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ` + 
                `${workout.description}`)
            .openPopup();
    }

    _getDataFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts_list'));

        if (!data) return;

        this.#workoutsList = data;
        
        this.#workoutsList.forEach(workout => {
            this._renderWorkout(workout);
            // this._printMarker(workout);
        });
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row')
            .classList.toggle('form__row--hidden');
        
        inputCadence.closest('.form__row').classList
            .toggle('form__row--hidden');
    }

    _hideInputForm() {
        // Clear inputs
        inputDistance.value = '';
        inputDuration.value = '';
        inputCadence.value = '';
        inputElevation.value = '';

        /*  
            If uncomment bottom lines, 
            form will dissapper immediately
            actually i don't like it that way
        */

        // form.style.display = 'none';
        form.classList.add('hidden');
        // setTimeout(() => form.style.display = 'grid', 1000);
    }

    _moveToPopup(event) {
        const workoutElement = event.target.closest('.workout');
        // console.log(workoutElement);

        if (!workoutElement) return;

        const workout = this.#workoutsList.find(workout => 
            workout.id === workoutElement.dataset.id
        );

        this.#map.setView(
            workout.coords, 
            this.#mapZoomLevel,
            {
                animate: true,
                pan: {
                    duration: 1, 
                }
            }
        );

        // Using the public interface   
        // workout.clicksCount();
    }

    _setLocalStorage() {
        localStorage.setItem(
            'workouts_list', 
            JSON.stringify(this.#workoutsList)
        );
    }

    _newWorkout(event) {
        const checkIsNumberInputs = (...inputs) => 
            inputs.every(input => Number.isFinite(input));

        const checkIsPositiveInputs = (...inputs) =>
            inputs.every(input => input > 0);
            
        event.preventDefault();

        // Get data from the form
        const type = inputType.value;
        const { lat, lng } = this.#mapEvent.latlng;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        let workout;
        // const cadence = type === 'running' ? +inputCadence.value : null;
        // const elevation = type === 'cycling' ? +inputElevation.value : null;

        // If running => Running
        if (type === 'running') {
            const cadence = +inputCadence.value;

            // Check if data is valid
            if (!checkIsNumberInputs(distance, duration, cadence) ||
                !checkIsPositiveInputs(distance, duration, cadence)) 
            {
                return alert('All inputs have to be positive numbers!');
            }

            workout = new Running([lat, lng], distance, duration, cadence);
        }
        
        // If cycling => Cycling
        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            // Check if data is valid
            if (!checkIsNumberInputs(distance, duration, elevation) ||
                !checkIsPositiveInputs(distance, duration)) 
            {
                return alert('All inputs have to be positive numbers!');
            }   

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        console.log(workout);

        // Add new obj to workout arr
        this.#workoutsList.push(workout)
        console.log(this.#workoutsList);

        // Render workout on map as marker
        this._printMarker(workout);

        // Render workout on list
        this._renderWorkout(workout);

        // Hide form, clear input fields
        this._hideInputForm();

        // Set local storage to all workouts
        this._setLocalStorage();
    }

    reset() {
        localStorage.removeItem('workouts_list');
        location.reload();
    }
}

const app = new App();
// app.reset();
//#endregion