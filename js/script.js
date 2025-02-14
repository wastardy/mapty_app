'use strict';

//#region Declarings
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

let map;
let mapEvent;
//#endregion

class App {
    constructor() {
        this._getPosition();
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap, // position parameter will be passed automatically
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
        map = L.map('map').setView(coords, 16);
        
        // .org => .fr/hot
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // handle click on map
        map.on('click', function(mapE) {
            mapEvent = mapE;
    
            form.classList.remove('hidden');
            inputDistance.focus();
    
            // printMarker(mapEvent);
        });
    }

    _showForm() {

    }

    _toggleElevationField() {

    }

    _newWorkout() {

    }
}

const app = new App();

//#region Methods
const printMarker = (mapEvent) => {
    // console.log(mapEvent);
    const { lat, lng } = mapEvent.latlng;

    L.marker([lat, lng]).addTo(map)
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

const loadMapNMarker = () => {
    
}

function formSubmit(event) {
    event.preventDefault();

    // Clear input fields
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';

    // Display Marker
    printMarker(mapEvent);
}

const toggleInputType = () => {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
}

//#endregion

//#region Event Handlers
document.addEventListener('DOMContentLoaded', loadMapNMarker);

form.addEventListener('submit', formSubmit);

inputType.addEventListener('change', toggleInputType)
//#endregion

//#region Testing
//#endregion