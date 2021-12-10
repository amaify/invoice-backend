// function Person(firstName, lastName, dob) {
// 	this.firstName = firstName;
// 	this.lastName = lastName;
// 	this.birthday = new Date(dob);
// }

// Person.prototype.calculateAge = function () {
// 	const diff = Date.now() - this.birthday.getTime();
// 	const ageDate = new Date(diff);
// 	return Math.abs(ageDate.getUTCFullYear() - 1970);
// };

// Person.prototype.greeting = function () {
// 	return `Hello there ${this.firstName} ${this.lastName}`;
// };

// Object.assign(Person.prototype, {
// 	calculateAge() {
// 		const diff = Date.now() - this.birthday.getTime();
// 		const ageDate = new Date(diff);
// 		return Math.abs(ageDate.getUTCFullYear() - 1970);
// 	},

// 	greeting() {
// 		return `Hello there ${this.firstName} ${this.lastName}`;
// 	},
// });

// const tobe = new Person("Tobe", "Ugwuanyi", "09/25/1993");

// console.log(tobe.calculateAge());

// let employee = {
// 	baseSalary: 30_000,
// 	overtime: 10,
// 	rate: 20,
// 	getWage: function () {
// 		return this.baseSalary + this.overtime * this.rate;
// 	},
// };

// console.log(employee.getWage());

let someArray = [1, 2, 3, 4, 5];

let x = someArray.map((x) => x * x).filter((y) => y % 3 === 0);
let y = someArray.forEach((number, index) => {
	return (someArray[index] = number * 4);
});

console.log(y);
