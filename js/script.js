'use strict';

//#region Query Selectors
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

//#region Methods
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude } = position.coords; 
                const { longitude } = position.coords;
                console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
                
                const coords = [latitude, longitude];
                
                // use leaflet map
                const map = L.map('map').setView(coords, 15);
    
                // .org => .fr/hot
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
    
                L.marker(coords).addTo(map)
                    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                    .openPopup();
            }, 
            () => {
                alert('Cood not get your position');
            }
        );
    }
});

//#endregion

//#region Event Handlers
//#endregion

//#region Testing
//#endregion