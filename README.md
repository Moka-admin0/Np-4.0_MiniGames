## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)


# Exports Usage and Images 

```lua
exports['minigame']:AlphabetGame(function(success)
    if success then
        print("Alphabet game success")
    else
        print("Alphabet game failed")
    end
end, 10000, 5) -- Timeout duration (milliseconds), Number of keys
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/8391b0d5-c88a-4e05-bf17-3a62f76e92f6)

```lua
exports['minigame']:DirectionGame(function(success)
    if success then
        print("Direction game success")
    else
        print("Direction game failed")
    end
end, 10000, 2, 3, 7) -- Timeout duration (milliseconds), Required correct choices, Min grid size, Max grid size
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/c2db95ae-20c2-4ae4-83e3-41e1c6490f6c)

```lua
exports['minigame']:FlipGame(function(success)
    if success then
        print("Flip game success")
    else
        print("Flip game failed")
    end
end, 10000, 5) -- Timeout duration (milliseconds), Grid size
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/8ed414db-f73e-4d97-97d6-fc1c02751be4)

```lua
exports['minigame']:LockpickingGame(function(success)
    if success then
        print("Lockpicking game success")
    else
        print("Lockpicking game failed")
    end
end, 30000, 12, 3) -- Timeout duration (milliseconds), Number of locks, Number of levels
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/65920743-1f07-446e-abf5-5d967d8e08be)

```lua
exports['minigame']:SameGame(function(success)
    if success then
        print("Same game success")
    else
        print("Same game failed")
    end
end, 30000, 11, 8) -- Timeout duration (milliseconds), Grid size X, Grid size Y
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/77cc24f9-109c-4daf-ab47-0fee7d8e6e89)

```lua
exports['minigame']:UntangleGame(function(success)
    if success then
        print("Untangle game success")
    else
        print("Untangle game failed")
    end
end, 30000, 6) -- Timeout duration (milliseconds), Number of points
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/8835f2b0-a2c6-423b-a48c-e01656039890)

```lua
exports['minigame']:WordsGame(function(success)
    if success then
        print("Words game success")
    else
        print("Words game failed")
    end
end, 30000, 5) -- Timeout duration (milliseconds), Required correct choices
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/5928a33b-0931-4906-b8b1-3d377af16aff)

```lua
exports['minigame']:FloodGame(function(success)
    if success then
        print("Flood game success")
    else
        print("Flood game failed")
    end
end, 80000, 2, 3) -- Timeout duration (milliseconds), Move count leniency, Grid size
```
![image](https://github.com/Moka-admin0/Np-4.0_MiniGames/assets/89666622/524a3540-98dd-490f-9b76-646a342f8252)
