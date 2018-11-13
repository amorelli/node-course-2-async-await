// http://data.fixer.io/api/latest?access_key=48ddf55564cf614560396ad363c77475&format=1
const axios = require('axios'); // Promise based HTTP client

const getExchangeRate = async (from, to) => {
	try {
	const response = await axios.get('http://data.fixer.io/api/latest?access_key=48ddf55564cf614560396ad363c77475');
	const euro = 1 / response.data.rates[from];
	const rate = euro * response.data.rates[to];

	if (isNaN(rate)) {
		throw new Error();
	}

	return rate;
	} catch (e) {
		throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
	}
};

const getCountries = async (currencyCode) => {
	try {
	const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
	return response.data.map((country) => country.name );
	} catch (e) {
		throw new Error(`Unable to get countries that use ${currencyCode}.`)
	} 
};

// Convert Currency using .then
// const convertCurrency = (from, to, amount) => {
// 	let convertedAmount;
// 	return getExchangeRate(from, to).then((rate) => {
// 		convertedAmount = (amount * rate).toFixed(2);
// 		return getCountries(to);
// 	}).then((countries) => {
// 		return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
// 	});
// };

// Convert Currency using async/await
const convertCurrency = async (from, to, amount) => {
	const rate = await getExchangeRate(from, to);
	const convertedAmount = (amount * rate).toFixed(2);
	const countries = await getCountries(to);
	return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
};

convertCurrency('USD', 'CAD', 20).then((message) => {
	console.log(message);
}).catch((e) => {
	console.log(e.message);
});