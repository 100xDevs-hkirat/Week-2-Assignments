const USERS = [
  {
    id: 1,
    username: "kirat",
    firstName: "Kirat",
    lastName: "Singh",
  },
  {
    id: 2,
    username: "hitesh",
    firstName: "Hitesh",
    lastName: "Choudhary",
  },
  {
    id: 3,
    username: "shubham",
    firstName: "Shubham",
    lastName: "Chaudhary",
  },
];

// const index = USERS.findIndex((user) => user.id === 3);
function getid(id) {
  const userIndex = USERS.findIndex((user) => user.id === id);
  return userIndex;
}
let ans = getid(2);
console.log(ans);
// console.log(index);

// USERS.splice(index, 1);
// console.log(USERS);

// const newOb=USERS[2];
// const newObj={
//   id:2,
//   username:"sanket",
//   firstName:"Sanket",
//   lastName:"Singh",
// }
// USERS[1]=newObj;

// console.log(USERS);

// const newArr = [];

// for (let i = 0; i < USERS.length; i++) {
//     let newObj={
//         username:USERS[i].username,
//         firstName:USERS[i].firstName,
//     }
//     newArr.push(newObj)
// }

// console.log(newArr);

// const findUser = (username) => USERS.find((user) => user.username === username);

// console.log(findUser("hitesh"));

// const user1={
//     username:"akshat",
//     firstName:"Akshat",
//     lastName:"XYS",
// }
// const user2={
//     username:"newUser",
//     firstName:"let",
//     lastName:"lfdjs",
// }

// newArr.push(user1);
// newArr.push(user2);

// console.log(newArr);
// {
//     users:[
//         {
//             username:"zyx",

//         }
//     ]
// }
