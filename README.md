# Farewell

A game written in AssemblyScript for the [WASM-4](https://wasm4.org) fantasy console.

## What to be done?

- [x] Add a probability to the enemy spawn a new ball.
- [X] Change ball colors according to the rebounces.
- [X] Add sounds to bounce.
- [X] Add indicator bar to release special.
- [X] Add game state controller
- [X] Add multi-language support
- [X] Add menu
  - [X] Add option to change language (perhaps through the mouse)
  - [X] Add transition sound
  - [X] Add confirmation sound
- [X] Add level map
  - [X] Add sound effect to transition
  - [X] Add negation sound
- [ ] Add end of level screen.
  - [X] Add coins
  ~ [ ] Add "stars"
  - [X] Enhance look
  - [X] Add confirmation feedback
- [X] Add levels
  - [X] Increase difficulty according to levels.
  - [X] Level is just completed if you didn't take more than 50% of the balls before completing the goal.
  - [X] Give coins according to how well the player did.
    - [X] No losing points = 5 coins.
    - [X] Up until 25% points lost = 3 coins.
    - [X] Up until 50% points lost = 1 coin.
- [X] Change palette according to levels.
- [X] Add shop button to buy special
  - [X] All balls increase one rebounce (5 coins)
  - [X] Slow motion (10 coins)
  - [X] Freeze all balls that has no debounces (10 coins)
  - [X] All balls increase two rebounces (15 coins)
  - [X] Shinra tensei special (50 coins)
- [X] Implement specials
  - [X] All balls increase one rebounce
  - [X] Slow motion
  - [X] Freeze all balls that has no debounces
  - [X] All balls increase two rebounces
  - [X] Shinra tensei special
- [X] Treat special differently
  - [X] Different sound per special
  - [ ] (not doing) Different animation per special
- [ ] (Don't think so) Increase the power meter gain according to the level
- [ ] Create the game -> meta game transition
- [ ] Create the dialog UI
- [X] Add the enemy sprites
- [ ] Add the console sprite
- [ ] Add NPC
- [ ] Add interaction between player and NPC
- [ ] Add interaction between player and console
- [ ] (impossible) Add new "seed" to random


## Polishment

- [ ] Add icons to the shop
  - [ ] Now display the icon followed by the cost (or has/using).
  - [ ] Hold right click on item opens a description.
- [ ] (No) Add save state
- [ ] Add menu music.
- [ ] Add easy level music.
- [ ] Add medium level music.
- [ ] Add hard level music.
- [ ] Try to make the balls come more to the middle of the screen?
- [X] Fix the problem where the ball only works properly if the speed is enough.

## Building

First setup the project by running:

```shell
npm install
```

Build the cart by running:

```shell
npm run build
```

Then run it with:

```shell
w4 run build/cart.wasm
```

For more info about setting up WASM-4, see the [quickstart guide](https://wasm4.org/docs/getting-started/setup?code-lang=assemblyscript#quickstart).

## Links

- [Documentation](https://wasm4.org/docs): Learn more about WASM-4.
- [Snake Tutorial](https://wasm4.org/docs/tutorials/snake/goal): Learn how to build a complete game
  with a step-by-step tutorial.
- [GitHub](https://github.com/aduros/wasm4): Submit an issue or PR. Contributions are welcome!
