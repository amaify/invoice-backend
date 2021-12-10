exports.getPriceSum = (totalPrice) => {
	if (totalPrice.length > 0) {
		return totalPrice.reduce((acc, crr) => acc + crr);
	} else {
		return 0;
	}
};

exports.roundNumber = (value, decimal) => {
	return Number(Math.round(value + "e" + decimal) + "e-" + decimal);
};
