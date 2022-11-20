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

export {fetchCountries}