"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const displaymovement = function (movement) {
  containerMovements.innerHTML = "";
  movement.forEach((movement, index) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${movement}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createusername = function (accs) {
  console.log(accs);
  accs.forEach((ac) => {
    ac.username = ac.owner
      .toLowerCase()
      .split(" ")
      .map((n) => n[0])
      .join("");
  });
};
createusername(accounts);

const calculatebalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, a) {
    return acc + a;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

///

const calcdisplaysummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = income;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((desposit) => (desposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest;
};

const updateUI = function (acc) {
  displaymovement(acc.movements);
  calculatebalance(acc);
  calcdisplaysummary(acc);
};

let currentaccount;
///addding event listeners for login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentaccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentaccount);
  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    //display message
    labelWelcome.textContent = `Welcome Back ${
      currentaccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //updateUI
    updateUI(currentaccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveracc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiveracc &&
    currentaccount.balance >= amount &&
    receiveracc?.username !== currentaccount.username
  ) {
    //dng the transfer
    currentaccount.movements.push(-amount);
    receiveracc.movements.push(amount);
    updateUI(currentaccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentaccount.username &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentaccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentaccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //add the movement
    currentaccount.movements.push(amount);

    updateUI(currentaccount);
  }
});

let time = 15;
const timer = setInterval(function () {
  const sec = String(time % 60).padStart(2, 0);

  console.log(sec);
  time--;

  if (time === 0) clearInterval(timer);
}, 1000);
