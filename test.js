// Get today's date
let today = new Date();

// Add 2 days to today's date
let twoDaysAfter = new Date(today);
twoDaysAfter.setDate(today.getDate() +2);

// Get the timestamp representing the date 2 days from now
let timestamp = twoDaysAfter.getTime();

console.log(timestamp); // Output the timestamp as a number
// console.log(Date.now())
// console.log(new Date(timestamp))

// const previousDate = 1703431278503; // Your stored date in milliseconds
// const currentDate = Date.now();

// // Convert both dates to the same day by resetting time components
// const previousDateObj = new Date(previousDate);
// const currentDateObj = new Date(currentDate);

// previousDateObj.setHours(0, 0, 0, 0); // Reset time to start of day
// currentDateObj.setHours(0, 0, 0, 0); // Reset time to start of day

// if (currentDateObj > previousDateObj) {
//     console.log("Greater Than");
// } else {
//     console.log("Less Than or Equal");
// }


// console.log()
// console.log("now",Date.now());

// let data="   sourav   ";
// const p="---"+data.trim()+"---";
// console.log(p)
// console.log(data)
// const te=Date.now();
// console.log(te)
// console.log(new Date(te))
const dp=new Date()
const cp=new Date(1703635200000)
console.log(dp.getFullYear(),dp.getMonth(),dp.getDate())
console.log(cp.getFullYear(),cp.getMonth(),cp.getDate())
const d="data";
console.log(d.slice(0,1))
console.log(Date.now())