# Smart Garden

### Description:
This project is a web-based platform about plants and their cultivation. It should provide a range of services like a blog, a chat, a gallery and others. But the main goal is an application to control the breeding of plants. Therefore devices are needed, which are sold in the shop. After creating an account the user register a main device to get access to its dashboard through internet. When the serialnumber is correct, he can add modules like sensor for soil moisture to it, which are connected to the hub by RF. The actual measured value and before that in a period of 30 minutes will be shown on the display. The data of the devices get stored in the cloud. Now the user is able to observe or control the grow of his plants by using lights, waterpumps, heatings, etc. The collected data of the users can help to determine an optimized template of each kind of plant as an offer for an automized planting.

### Details:
For the frontend application we have used react. The DOM elements of the surface rely on reactstrap and are designed with SCSS as well as bootstrap. A color theme based on the world of plants divides the platform into different parts. The optical appearance of the interface is less technical. On backend side we are using express and a mysql database. For informations in realtime the devices are communicating with the application over websocket by socket.io.

Coding and Modules:
- HTML
- SCSS
- Vanilla-JS

- React
- React-Dom
- React-Router-Dom
- Reactstrap
- Bootstrap
- Chart.js
- Nodemailer
- Validator
- Socket.io
- Redux

- Node.js
- Express
- Express-Session
- Express-Fileupload
- password-hash
- html-entities
- MySQL
- Nodemon

### Demo:
currently not available

### Authors:
Ingo Fischer & Hamoud Shwiri & Felix Wurst & Ahmad Osman & Mostafa Othman
