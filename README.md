## Back - End
### For the server side I used: 

 1. Node.js 
 2. Express.js
 3. bcrypt for encrypting passwords
 4. JWTs for token-based authentication
 5. MongoDB & Mongoose
 

### In the `guestbook-server`You'll find:

 - `models` directory containing all the DB models implemented


 - `server.js` containing all endpoints' logic and functionality
### Make sure to: 
 - create a `.env` file with PORT and JWT_SECRET
 - run `npm install` to include all dependencies
 - Preferably install `nodemon` globally for a smoother experience
 - have mongoDB server running with `mongod` on Windows/MacOS & with `sudo systemctl start mongod` for Linux (This is for Fedora, it varies on other distros) 
 - run your server with 	`nodemon server.js`	

### Endpoints
| **Endpoint** | **Functionality** |
|--|--|
|  POST/signup| Registers new user |
|POST/login|Log in existing user|
|GET/isUserAuth| Checks if user is authenticated|
|GET/messages|List all messages|
|GET/messages/:id|get specific message|
|POST/messages/create|Create new message|
|POST/messages/edit/:id|Updates existing message|

### Some of the practices I followed:

 - Single Responsbility Princible: writing functions with descriptive names that have one sole purpose
 - I have not included any comments in my code because "A comment is a failure to express yourself in code" -Robert Martin
 - all variables and constants have descriptive names, no `x`, `y` or `var1` naming
 - used `const` instead of `let` almost always, I believe that if I find myself needing to use a variable I ask myself "is there a better way to do this?"

### What to Improve: 

 1. add middleware authentication checker to each private route


