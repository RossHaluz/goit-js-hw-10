import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

 const refs = {
    input: document.querySelector("#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
}

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

 function fetchCountries(name) {
    const BASE_URL = "https://restcountries.com/v3.1/name/";
    return fetch(`${BASE_URL}${name}?fields=name,capital,population,flags,languages`).then(responce => {
        if (!responce.ok) {
            throw new Error();
            return
        }
        return responce.json();
    }).catch(err => console.log(err))
}


function onSearch(evt) {
    const searchName = evt.target.value;

    if (!searchName) {
        refs.countryInfo.innerHTML = "";
        refs.countryList.innerHTML = "";
       return
    }
    
    fetchCountries(searchName).then(county => {
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";

        if (county.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return
        }
        if (county.length > 1 && county.length < 10) {
            Notiflix.Notify.success(`Found ${county.length} countries`);
            refs.countryList.innerHTML = renderMarkapList(county)
            return
        }
        refs.countryInfo.innerHTML = renderMarkspCounty(county)
    }).catch(err => {
        Notiflix.Notify.failure("Oops, there is no country with that name")
    })
}

function renderMarkapList(arr) {
    return arr.map(({flags, name}) => `
    <li class="country-list__item">
        <img src="${flags.svg}" alt="${name.common}" width="40" heigth="30">
        <h3 class="country-list__title">${name.common}</h3>
      </li>
    `).join('')
}

function renderMarkspCounty(arr) {
    return arr.map(({ name, flags, capital, population, languages }) => `
    <div class="country-wrap">
     <img src="${flags.svg}" alt="${name.common}" width="40" height="30">
    <h2>${name.common}</h2>
    </div>
      <ul class="country-list">
        <li><span class="country-list__option">Capital:</span> ${capital}</li>
        <li><span class="country-list__option">Population:</span> ${population}</li>
        <li><span class="country-list__option">Languages:</span> ${Object.values(languages)}</li>
      </ul>
    `).join('') 
}
