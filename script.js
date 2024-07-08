const myCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
const myBaseCurrencyDropdown = document.getElementById('my-base-currency');
const myExchangeRateDisplay = document.getElementById('my-exchange-rate');
const myClock = document.getElementById('my-clock');
const myAmountInput = document.getElementById('my-amount');
const myConvertButton = document.getElementById('my-convert-button');
const myConversionResult = document.getElementById('my-conversion-result');

myCurrencies.forEach(currency => {
    const myOption = document.createElement('option');
    myOption.value = currency;
    myOption.textContent = currency;
    myBaseCurrencyDropdown.appendChild(myOption);
});

async function myFetchExchangeRate(baseCurrency) {
    try {
        const myResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const myData = await myResponse.json();
        myUpdateExchangeRate(myData);
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        myExchangeRateDisplay.textContent = 'Error fetching data';
    }
}

function myUpdateExchangeRate(data) {
    const myRate = data.rates['USD'];
    myExchangeRateDisplay.textContent = `1 ${data.base} = ${myRate} USD`;
}

function myUpdateClock() {
    const myNow = new Date();
    const myHours = myNow.getHours().toString().padStart(2, '0');
    const myMinutes = myNow.getMinutes().toString().padStart(2, '0');
    const mySeconds = myNow.getSeconds().toString().padStart(2, '0');
    myClock.textContent = `${myHours}:${myMinutes}:${mySeconds}`;
}

myBaseCurrencyDropdown.addEventListener('change', (event) => {
    const mySelectedCurrency = event.target.value;
    myFetchExchangeRate(mySelectedCurrency);
});

myConvertButton.addEventListener('click', () => {
    const myAmount = myAmountInput.value;
    const mySelectedCurrency = myBaseCurrencyDropdown.value;
    if (myAmount && mySelectedCurrency) {
        myFetchExchangeRateAndConvert(mySelectedCurrency, myAmount);
    } else {
        myConversionResult.textContent = 'Please select a currency and enter an amount';
    }
});

async function myFetchExchangeRateAndConvert(baseCurrency, amount) {
    try {
        const myResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const myData = await myResponse.json();
        const myRate = myData.rates['USD'];
        const myConvertedAmount = (amount * myRate).toFixed(2);
        myConversionResult.textContent = `${amount} ${baseCurrency} = ${myConvertedAmount} USD`;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        myConversionResult.textContent = 'Error fetching data';
    }
}

myFetchExchangeRate('USD');
setInterval(myUpdateClock, 1000);
