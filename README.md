# phaser-stencil-angular

Stencil web components containing a game made with Phaser. 

The importation of Phaser is left to the framework, once Phaser has been imported, 
it can be passed as a props to the Stencil component. All the code used to run the game is compiled with Stencil. 

This allow cross-framework re-utilization of your game. 

Games are organised with a factory pattern allowing you to easily chose the game you want to play from your framework. 


### Steps to install

Clone the repo
```
  npm run install:sub
  npm run serve
```

`npm run serve` will build the stencil components in the assets of the angular project, copy the asset of the game 
from stencil to angular and launch the angular project.

##### PS: you may need to install angular-cli globaly first or change the package.json at the ng command call

### Informations

Phaser 2.6.2 is used for the moment, next step is to go to Phaser 3.2.0

Phaser is not imported in the stencil-project. 

If you want typescript to use Phaser typing you can import files from phaser/typescript.
