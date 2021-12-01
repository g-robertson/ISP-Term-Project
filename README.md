### How to use

- Install node.js if not already installed on your machine
- ```git clone``` the repository
- Create dbuser.js with the line ```export const dbuser = "YOURDBUSERHERE";```
- Create dbpassword.js with the line ```export const dbpassword = "YOURDBPASSWORDHERE";```
- Type ```npm run init``` in the directory you cloned the project into to initialize any non-web-server needs (e.g. DB server, building gatsby pages)
  - If an error occurs during this phase you don't have your database server or pre-init-config.js configured correctly. Both users and passwords between your database server and pre-init-config.js MySQL config should match (you can avoid tracking changes to pre-init-config.js with ```git update-index --assume-unchanged pre-init-config.js```,
- Type ```npm start``` to start the web server
- Connect in browser through localhost:8080
