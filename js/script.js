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
const loadMapNMarker = () => {
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
                L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
    
                map.on('click', (mapEvent) => {
                    console.log(mapEvent);
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
                });
            }, 
            () => {
                alert('Cood not get your position');
            }
        );
    }
}

//#endregion

//#region Event Handlers
document.addEventListener('DOMContentLoaded', loadMapNMarker);
//#endregion

//#region Testing
//#endregion