//get the container element where the cards will be inserted
const countriesList = document.getElementById('country-list');
//get the container for the modal
const countryModal = document.getElementById('country-modal');
//get the button element for closing the modal
const closeModal = document.getElementById('close');
//get the element that represents the input for the search bar
const searchCountry = document.getElementById('search-country');
//get the element for displaying the no results message
const noRes = document.getElementById('no-result');
//get the element which represents the filter button for regions
const filterBtn = document.getElementById('filter');
//get the element which represents the filter button for languages
const filterLang = document.getElementById('filter-lang');
//get the element which represents the lsit of languages
const languageList = document.getElementById('lang-list');
//get the elements containing the regions from the filter
const regions = filterBtn.querySelectorAll('li');



//Population range
const slider = document.getElementById('slider-input');
const value = document.getElementById('slider-value');
value.textContent = slider.value;
slider.oninput = function() {
    //set the displayed value with the slider value
    value.textContent = this.value;
    //get all the elements that contain the population
    const countryPopulation = document.querySelectorAll('.country-population');

    //for each country population check if it is less than the slider value
    //if it is less the display it, otherwise don't 
    for (let i = 0; i < countryPopulation.length; i++) {
        let n1 = 0;
        let n2 = 0;
        //split the population because it has 'Population: number' format
        let pop = countryPopulation[i].innerText.split(': ');
        //convert the strings into numbers
        n1 = parseInt(pop[1], 10);
        n2 = parseInt(this.value, 10);
        if (n1 <= n2) {
            countryPopulation[i].parentElement.parentElement.style.display = 'block';
        } else {
            countryPopulation[i].parentElement.parentElement.style.display = 'none';
        }
    }

}

//Display all the countries
getCountries();
async function getCountries() {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const countries = await res.json();
    showCountries(countries);
}

function showCountries(countries) {
    //for each json containing the information about the country create a div element with the country-item class
    //and then set the innerHTML with the requiered information
    let langList = new Set();

    for (let i = 0; i < countries.length; i++) {

        const countryItem = document.createElement('div');
        countryItem.classList.add('country-item');

        countryItem.innerHTML = `
           
            <div class="country-flag">
                
                <img src="${countries[i].flag}"/>
            </div>
            <div class="country-information">
                <h2 class="country-name">${countries[i].name}</h2>
                <p class="country-capital"><strong>Capital:</strong>${countries[i].capital}</p>
                <p class="country-region"><strong>Region: </strong>${countries[i].region}</p>
                <p class="country-population"><strong>Population: </strong>${countries[i].population}</p>
                <p class="country-code"><strong>Alpha 2 code: </strong>${countries[i].alpha2Code}</p>
                <p class="country-language">${countries[i].languages.map(language => language.name)}</p>    
            </div>
           
        `;

        //add in a set the languages for every country
        for (let j = 0; j < countries[i].languages.length; j++) {
            langList.add(countries[i].languages[j].name);
        }


        //when clicking the card display the modal with the details
        countryItem.addEventListener('click', () => {
            countryModal.style.display = 'flex';
            showModalDetails(countries[i]);
        });


        //append the div to the parent element which is the country-container
        countriesList.appendChild(countryItem);

    }

    //convert the set into an array
    let langArray = [...langList];
    //add the languages in the filter list
    for (let i = 0; i < langArray.length; i++) {
        let listElement = document.createElement('li');
        listElement.innerText = langArray[i];
        languageList.appendChild(listElement);
    }

    //get the elemenets for the language list
    const languages = filterLang.querySelectorAll('li');
    //if a language filter is applied check for the languages of every country and 
    //display only those who have the corresponding language
    languages.forEach(language => {
        language.addEventListener('click', () => {
            console.log(language.innerText);
            const countryLanguages = document.querySelectorAll('.country-language');

            for (let i = 0; i < countryLanguages.length; i++) {
                if (countryLanguages[i].innerText.toLowerCase().includes(language.innerText.toLowerCase())) {
                    countryLanguages[i].parentElement.parentElement.style.display = 'block';
                } else {
                    countryLanguages[i].parentElement.parentElement.style.display = 'none';
                }

            }
        });
    })
}

//Display country details
function showModalDetails(country) {
    //set the innerHTML of the modalContainer with the information required
    modalContainer = document.getElementById("modal-container")
    modalContainer.innerHTML = `
                <div class="modal-left">
                    <h2>${country.name}</h2>
                    <img src="${country.flag}"/>      
                </div>  
                <div class="modal-right"> 
                    <p><strong>Alpha 2 code: </strong>${country.alpha2Code}</p>
                    <p><strong>Capital: </strong>${country.capital}</p>
                    <p><strong>Region: </strong>${country.region}</p>
                    <p><strong>Population: </strong>${country.population}</p>
                    <p><strong>Latitude Longitude: </strong>${country.latlng}</p>
                    <p><strong>Area: </strong>${country.capital}</p>
                    <p><strong>Timezone: </strong>${country.timezones}</p>
                    <p><strong>Neighbors: </strong>${country.borders}</p>
                    <p><strong>Currencies: </strong>${country.currencies.map(currency => currency.code)}</p>
                    <p><strong>Official languages: </strong>${country.languages.map(language => language.name)}</p>         
                </div>
            </div> 
        `;
}


//Close the modal
closeModal.addEventListener('click', () => {
    countryModal.style.display = 'none';
});

//Dropdown filter -> it will display or hide the dropdown
filterBtn.addEventListener('click', () => {
    filterBtn.classList.toggle('open');
})

//Dropdown filter -> it will display or hide the dropdown
filterLang.addEventListener('click', () => {
    filterLang.classList.toggle('open');
})

//when you click on a region from the filter it will compare it to the region of every country 
//and it will display only the countries from the corresponding region
regions.forEach(filter => {
    filter.addEventListener('click', () => {
        const countryRegion = document.querySelectorAll('.country-region');

        for (let i = 0; i < countryRegion.length; i++) {
            if (countryRegion[i].innerText.toLowerCase().includes(filter.innerText.toLowerCase())) {
                countryRegion[i].parentElement.parentElement.style.display = 'block';
            } else {
                countryRegion[i].parentElement.parentElement.style.display = 'none';
            }
        }
    });
});




//Search country
searchCountry.addEventListener('input', (e) => {
    //get the value from the search bar
    const val = e.target.value;
    //get the values for name, capital and code for every country
    const countryName = document.querySelectorAll('.country-name');
    const countryCapital = document.querySelectorAll('.country-capital');
    const countryCode = document.querySelectorAll('.country-code');

    noRes.innerHTML = "No results.";
    let resNumber = 0
        //display only the countries that match with the search information
    for (let i = 0; i < countryName.length; i++) {

        if (countryName[i].innerText.toLowerCase().includes(val.toLowerCase()) ||
            countryCapital[i].innerText.toLowerCase().includes(val.toLowerCase()) ||
            countryCode[i].innerText.toLowerCase().includes(val.toLowerCase())
        ) {
            countryName[i].parentElement.parentElement.style.display = 'block';
            resNumber++;
        } else {
            countryName[i].parentElement.parentElement.style.display = 'none';
        }
    }
    if (resNumber === 0) {
        noRes.style.display = 'block';
    } else {
        noRes.style.display = 'none';
    }

});