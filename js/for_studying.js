'use strict';

// 1. ==================> Construnctor Functions
// Construnctor Functions always start from capital
// Arrow function does not work as a f. constructor (becouse of this kword)
const Person = function(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;

    // ❌ Never create methods inside the constructor! 
    // (Avoid duplicating methods in memory)
    // Instead, use prototypes!

    // this.showInfo = function () {
    //     console.log(
    //         `hi there, my name is ${this.firstName}, ` + 
    //         `i'm ${2025 - this.birthYear} years old`
    //     );
    // }
}

// Call constructor with the 'new' keyword
const developer = new Person('Andrew', 2005);
// console.log(developer);

const user = new Person('Testuser', 2003);
// console.log(user instanceof Person);
// user.showInfo(); // ❌ Bad practice, should be in prototype!

////////////////////////////////////////////////////////
/*  
    🔹 When the constructor function is called using `new`:

    1. A new empty object `{}` is created.
    2. The function is called, and `this` is set to the new object `{}`.
    3. The new object `{}` is linked to the prototype (`__proto__`).
    4. The function automatically returns `{}`.
*/
////////////////////////////////////////////////////////

// 2. ==================> Prototypes
// All objects created with the Person constructor function
// will have access to all methods defined on its prototype.
Person.prototype.calculateAge = function () {
    console.log(new Date().getFullYear() - this.birthYear);
}

// developer.calculateAge();

// console.log(developer.__proto__ === Person.prototype); // true
// console.log(Person.prototype.isPrototypeOf(developer)); // true

// Adding a property to the prototype
Person.prototype.species = 'Homo Sapiens';
// console.log(developer, user.species);

// console.dir(Person.prototype.constructor); // Points back to Person function

// 3. ==================> ES6 Classes
//❗Classes are NOT hoisted - you can't use class before it declaration

// Class Expression (alternative way)
// const PersonCl = class {}

// Class Declaration
class PersonCl {
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }

    // ✅ Instance method (will be in prototype)
    printAge() {
        console.log(`I'm ${(new Date().getFullYear() - this.birthYear)} years old`);
    }
    
    // ✅ Getter
    get getAge() {
        return (new Date().getFullYear() - this.birthYear);
    }

    // ✅ Setter
    set setName(newName) {
        this.firstName = newName;
    }

    // ✅ Static method (available only on the class, not on instances)
    static getInfo() {
        console.log('This is a Person class.');
    }
}

// Work as well
PersonCl.prototype.sayHi = function () {
    console.log(`Hi there, my name is ${this.firstName}`);
}

const person1 = new PersonCl('Brayan', 2004);
person1.printAge();
person1.sayHi();
person1.getAge;
person1.setName = 'Stephen';
person1.sayHi();

////////////////////////////////////////////////////////

//#region Coding Challenges
// Challenge #1

/* 
1.  Use a constructor function to implement a Car. A car has a name 
    and a speed property. The speed property is the current speed of 
    the car in km/h;
2.  Implement an 'accelerate' method that will increase the car's 
    speed by 10, and log the new speed to the console;
3.  Implement a 'brake' method that will decrease the car's speed by 5, 
    and log the new speed to the console;
4.  Create 2 car objects and experiment with calling 'accelerate' and 
    'brake' multiple times on each of them.
*/

/*  ES6 ~

    class Car {
    constructor(name, speed) {
        this.name = name;
        this.speed = speed;
    }
    accelerate() {
        console.log(`Init ${this.name}'s speed = ${this.speed}km/h`);

        this.speed += 10;
        console.log(`New ${this.name}'s speed = ${this.speed}km/h`);
    }
    break() {
        console.log(`Current ${this.name}'s speed = ${this.speed}km/h`);

        this.speed -= 5;
        console.log(`New ${this.name}'s speed = ${this.speed}km/h`);
    }
} */

const Car = function (name, speed) {
    this.name = name;
    this.speed = speed;
}

Car.prototype.accelerate = function () {
    console.log(`Init ${this.name}'s speed = ${this.speed}km/h`);
    
    this.speed += 10;
    console.log(`New ${this.name}'s speed = ${this.speed}km/h`);
}

Car.prototype.break = function () {
    console.log(`Current ${this.name}'s speed = ${this.speed}km/h`);

    this.speed -= 5;
    console.log(`New ${this.name}'s speed = ${this.speed}km/h`);
}

const supra = new Car('Toyota Supra', 170);
const gtr = new Car('Nissan GT-R', 175);

// supra.accelerate();
// gtr.break();

////////////////////////////////////////////////////////

// Challenge #2

/* 
1.  Re-create challenge 1, but this time using an ES6 class;
2.  Add a getter called 'speedUS' which returns the current 
    speed in mi/h (divide by 1.6);
3.  Add a setter called 'speedUS' which sets the current speed 
    in mi/h (but converts it to km/h before storing the value, 
    by multiplying the input by 1.6);
4.  Create a new car and experiment with the accelerate and 
    brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h

*/

////////////////////////////////////////////////////////

// Challenge #3

/* 
1.  Use a constructor function to implement an Electric Car 
    (called EV) as a CHILD "class" of Car. Besides a make and 
    current speed, the EV also has the current battery charge 
    in % ('charge' property);
2.  Implement a 'chargeBattery' method which takes an argument 
    'chargeTo' and sets the battery charge to 'chargeTo';
3.  Implement an 'accelerate' method that will increase the car's 
    speed by 20, and decrease the charge by 1%. Then log a message 
    like this: 'Tesla going at 140 km/h, with a charge of 22%';
4.  Create an electric car object and experiment with calling 
    'accelerate', 'brake' and 'chargeBattery' (charge to 90%). 
    Notice what happens when you 'accelerate'! HINT: Review the 
    definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%

*/

////////////////////////////////////////////////////////

// Challenge #4

/* 
1.  Re-create challenge #3, but this time using ES6 classes: 
    create an 'EVCl' child class of the 'CarCl' class
2.  Make the 'charge' property private;
3.  Implement the ability to chain the 'accelerate' and 
    'chargeBattery' methods of this class, and also update 
    the 'brake' method in the 'CarCl' class. They experiment 
    with chining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%

*/
//#endregion