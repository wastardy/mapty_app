'use strict';

//#region Declarations
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
    
    // convert date to string and select last 10 numbers
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        // this.date = ...
        // this.id = ...
        this.coords = coords; // [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
}
//#endregion

//#region Child Classes
class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        
        this.cadence = cadence;

        this.calculatePace();
    }

    calculatePace() {
        // min/km
        this.pace = Number((this.duration / this.distance)
            .toFixed(2));
            
        return this.pace.toFixed(2);
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);

        this.elevationGain = elevationGain;

        this.calculateSpeed();
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
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener(
            'submit', 
            this._newWorkout.bind(this)
        );
        
        inputType.addEventListener(
            'change', 
            this._toggleElevationField.bind(this)
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
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
                    
        const coords = [latitude, longitude];
                    
        // use leaflet map
        this.#map = L.map('map').setView(coords, 16);
        
        // .org => .fr/hot
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        // handle click on map
        this.#map.on('click', this._showForm.bind(this));
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

    _printMarker() {
        // console.log(mapEvent);
        const { lat, lng } = this.#mapEvent.latlng;
    
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250, 
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            }))
            .setPopupContent('Workout')
            .openPopup();
    }

    _newWorkout(event) {
        const checkIsNumberInputs = (...inputs) => 
            inputs.every(input => Number.isFinite(input));

        const checkIsPositiveInputs = (...inputs) =>
            inputs.every(input => input > 0);
            
        event.preventDefault();

        // Get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
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
        }

        // Add new obj to workout arr

        // Render workout on map as marker
        this._printMarker();

        // Render workout on list

        // Hide form, clear input

        // Clear input fields
        inputDistance.value = '';
        inputDuration.value = '';
        inputCadence.value = '';
        inputElevation.value = '';
    }
}

const app = new App();
//#endregion