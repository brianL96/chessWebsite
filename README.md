# Chess Site with Multiple Game Modes
Chess website. Players can play in different rooms across different game modes, view leaderboards which rank according to ELO, and save, view, and edit past games. There is also an admin dashboard in which the admin can view highest peak concurrent player count, boot players, and increase or decrease the amount of rooms available for each game mode. 

[Visit Site](https://brian-chess-site-e89fd39726a3.herokuapp.com/)

## Tech Used:
JavaScript, HTML, and Tailwind for most of the frontend. The admin page uses regular CSS. SocketIO is used for connecting users to different rooms within different game modes, and for keeping track of disconnects. MySQL for the database, and the mysql2 node package for controlling a pool of connections to the database.

## How It Works:
Before a user can connect to a room, their credentials are sent via a HTTP request. Upon confirmation, a socketIO connection is established between the client and the server. The server uses timers to make sure users don't idle inside a room for too long, and will boot players if no initial move is made by one or both players, or if no rematch is agreed upon within a given time. Fair warnings are sent beforehand at regular intervals. 

## Running Locally:
Navigate to the root folder and in the command line run the following two commands:
>npm install  
>npm run dev

and the application will run on localhost:3000. However, most of the features on the site will be unavailable without a proper database setup. Having acquired access to a MySQL database, update the following variables inside accessFile.js in the root directory: `databaseHost`, `databaseName`, `databaseUser`, and `databasePassword`. You can also update the value for `adminPassword`, which is used to login to the admin page, and `adminActionPassword`, which must be entered whenever an admin wants to carry out an action.

## Future Updates:
The frontend should be refactored from plain JavaScript and HTML to React -- it'll make maintaining the site easier.

Want to introduce a single player mode to incentivize users to play on the site while overall concurrent users may be low. Want to add multiple single player modes that incorporate rogue-like elements to challenge the player. 








