function add_binary(binary_1, binary_2) {
	// var firstBinary = "000110011";
	// var secondBinary = "00011000";
	var firstBinary = binary_1;
	var secondBinary = binary_2;
	// var total;
	var main_value;

	var total = (
		BigInt(`0b${firstBinary}`) + BigInt(`0b${secondBinary}`)
	).toString(2);

	// console.log(total);

	var value = "0";
	var x = total.length;
	while (x < 8) {
		// value += total;
		var p = value.concat(total);

		console.log(p);
		// break;
		// console.log(value);
		x++;

		if (x === 8) {
			// console.log(value);
			break;
		}
	}
	// console.log(value);
	// console.log(total.length);

	if (total.length < 8) {
		main_value = value;
	} else {
		main_value = total;
	}

	// console.log(main_value);

	return main_value;
}

add_binary("00011011", "00011000");
