# NotMarioKart

## Project setup
- Install [NodeJS](https://nodejs.org/en/) on your system (requires version 8.*).
- Do `npm install` in the root of the project.

## Run
- Do `npm start` to:
    - Start the local server ([localhost:5000](http://localhost:5000)).
    - Build the javascript sources in watch mode.
- Once the local server is running you can share your ip and anyone can connect to your server with the addres http://you.rip.add.ress:5000
- You can find your ip address by running the ifconfig command if you are on linux or the ipconfig if you are on windows.

## Project structure
- `assets` contains all images, sounds ...
- `js/src` contains the javascript source code, which we will edit.
- `js/dist` contains the built javascript file(s), which are imported in the main html entry point.
- `lib` contains libraries, such as three.js.
- `.editorconfig` is a simple file to make editors a little more consistent.
- `gulpfile.js` is used for building tasks.
- `index.html` is the main entry point of the game.
