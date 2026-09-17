// url
const from_URL = "https://latest.currency-api.pages.dev/v1/currencies/";

// Get DOM elements
const form = document.getElementById('currency');
const amountInput = document.getElementById('amount');
const fromCountry = document.getElementById('from-country');
const toCountry = document.getElementById('to-country');
const msg = document.querySelector('.msg');
const convertedAmount = document.getElementById('converted-amount');
const toText = document.getElementById('to-text');
const fromText = document.getElementById('from-text');
const dropdowns = document.querySelectorAll('.dropdown select');
const convertBtn = document.getElementById('convert-btn');
const fromcurrency = document.querySelector('.from select');
const toCurrency = document.querySelector('.to select');
const switchBtn = document.getElementById('switch-btn');



// Populate country dropdowns using object entries in `countryList`
for (let select of dropdowns) {
    // clear any existing options
    select.innerHTML = '';

    for (const currency_code in countryList) {
        const entry = countryList[currency_code];
        const option = document.createElement('option');

        option.value = currency_code;
        // support both object-format and older string-format fallbacks
        option.text = `${(entry && entry.currencyName) || entry || currency_code} (${currency_code})`;

        // Set default country selections
        if (select.id === 'from-country' && currency_code === 'USD') {
            option.selected = true;
        } else if (select.id === 'to-country' && currency_code === 'INR') {
            option.selected = true;
        }

        select.appendChild(option);
    }

    // update flag when selection changes
    select.addEventListener('change', (evt) => updateFlag(evt.target));
}

// Update flag images on country selection (use object countryCode when available)
const updateFlag = (element) => {
    const currency_code = element.value;//Getting selected currency code
    const entry = countryList[currency_code];//Getting object for USD, INR
    let countryCode = entry.countryCode;//Getting country code US, IN


    //getting flag according to country code
    const newFlagUrl = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    const imgTag = element.parentElement.querySelector('img');
    imgTag.src = newFlagUrl;
};

    //Run conversion on button click
convertBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();//Preventing form from refreshing the page
    let amount = amountInput.value;
    //Input validation
    if (amount === '' || isNaN(amount) || (amount  < 0)) {
        msg.innerText = 'Please enter a valid amount';
        convertedAmount.innerText = '0';
        return;
    }

    const url = `${from_URL}${fromCountry.value.toLowerCase()}.json`;//Getting url according to from country
    let response = await fetch(url);//Fetching api response
    response = await response.json();//Converting to json
    let rate = response[fromCountry.value.toLowerCase()][toCountry.value.toLowerCase()];//Getting conversion rate
    msg.innerText = `1 ${fromCountry.value} = ${rate} ${toCountry.value}`;//Displaying conversion rate
    let total = (amount * rate).toFixed(2);//Calculating total amount after conversion
    convertedAmount.innerText = `${total}`;
    toText.innerText = countryList[toCountry.value].currencyName;//Setting to country name
});

//switching country functionality
switchBtn.addEventListener('click', () => {
    //swapping selected values of both dropdowns
    let temp = fromcurrency.value;
    fromcurrency.value = toCurrency.value;
    toCurrency.value = temp;

    //updating flags according to new selection
    updateFlag(fromcurrency);
    updateFlag(toCurrency);
}
);
