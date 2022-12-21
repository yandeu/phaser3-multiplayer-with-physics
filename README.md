<h1 align="center">
  <br>
  <a href="https://github.com/yandeu/phaser3-multiplayer-with-physics#readme"><img src="readme/phaser-with-nodejs.png" alt="header" width="400"></a>
  <br>
  Phaser 3 - Real-Time Multiplayer example with Physics
  <br>
</h1>

<h4 align="center">
A Real-Time Multiplayer example using <a href="https://phaser.io/" target="_blank" >Phaser 3</a> with Physics (MatterJS and Arcade) on a NodeJS server with <a href="https://expressjs.com/" target="_blank" >Express</a> and <a href="https://socket.io/" target="_blank" >Socket.io</a></h4>

<p align="center">
  <a href="https://david-dm.org/yandeu/phaser3-multiplayer-with-physics" title="dependencies status">
    <img src="https://david-dm.org/yandeu/phaser3-multiplayer-with-physics/status.svg?style=flat-square"/>
  </a>
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/yandeu/phaser3-multiplayer-with-physics?style=flat-square">
  <a href="https://opensource.org/licenses/MIT" title="License: MIT" >
    <img src="https://img.shields.io/badge/License-MIT-greenbright.svg?style=flat-square">
  </a>
  <img src="https://img.shields.io/github/last-commit/yandeu/phaser3-multiplayer-with-physics.svg?style=flat-square" alt="GitHub last commit">
  <a href="https://github.com/prettier/prettier" alt="code style: prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
</p>

---

## ⚠️ Note

This example is using [`@geckos.io/phaser-on-nodejs`](https://github.com/geckosio/phaser-on-nodejs#readme) which is very slow tedious. If you need to run Phaser's Arcade Physics on the Server, I recommend using [`arcade-physics`](https://github.com/yandeu/arcade-physics#readme). I will not update this example anymore.

## Play It

_This example is running on NodeJS on Heroku (**Free Dyno** in **Europe**) which causes the example sometimes to take **about 1 minute to load**._

- Play it here - [phaser3-multiplayer-example](http://phaser3-multiplayer-example.herokuapp.com/)  
  _It works best if your latency is below 100ms, which should the case if you are located in Europe._

## Key Features

- The physics is entirely calculated on the Server
- Automatically manages Rooms (new Phaser instances)
- Physics debugging version
- A nice Stats page

## Geckos.io

Why does this game example not use geckos.io?  
Well there are two reasons:

- Geckos.io did not exist back then.
- This example is deployed on heroku, which does not allow to forward UDP ports, geckos.io depends on.

## Video

Watch it on YouTube

[![thumbnail](https://i.ytimg.com/vi/n8gJQEfA18s/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpxKgRIHTOZICjxwhdKSrtsIrOJw)](https://youtu.be/n8gJQEfA18s)

## Matter Physics vs Arcade Physics

This example includes 2 different games. One with MatterJS and the other with Arcade. The MatterJS game has only one level. The Arcade one is a simple platformer game with 3 levels.

So in total, you can play 4 different levels. For each level, the server creates a new room, which creates a new Phaser instance, which are completely isolated from each other. There can be up to 4 players per room.

## Structure

```bash
├── src
│   ├── client  # Contains all the code the client will need
│   ├── physics # This is for debugging the physics (Arcade and MatterJS)
│   ├── server  # Contains the code running on the NodeJS server
│   └── stats   # The stats page will show useful information about the server
```

## How To Use

To clone and run this template, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.

You also need to install some additional packages since this example uses [Node-Canvas](https://www.npmjs.com/package/canvas). See [here](https://www.npmjs.com/package/canvas#compiling).

From your command line:

```bash
# Clone this repository
$ git clone --depth 1 https://github.com/yandeu/phaser3-multiplayer-with-physics.git phaser3-example

# Go into the repository
$ cd phaser3-example

# Install dependencies
$ npm install

# Start the local development server (on port 3000)
$ npm run dev

# To publish a production build using docker use docker:publish
# This needs docker and docker-compose to be installed on your machine
$ npm run docker:publish
```

## Other Multiplayer Examples

Looking for a simpler multiplayer example? Take a look at [Phaser 3 - Multiplayer Game Example](https://github.com/geckosio/phaser3-multiplayer-game-example).

## License

The MIT License (MIT) 2019 - [Yannick Deubel](https://github.com/yandeu). Please have a look at the [LICENSE](LICENSE) for more details.
