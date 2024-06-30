Promise = nil

RegisterNUICallback("skillchecks:minigameResult", function(data, cb)
    SetNuiFocus(false, false)
    Promise:resolve(data.result)
    cb('ok')
end)

function AlphabetGame(time,keycount)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'alphabet',
            show = true,
            name = 'Alphabet',
            description = 'Press the letter before time takes its lunch break!',
            gameTimeoutDuration = time or 10000,
            numKeys = keycount or 5
        }
    })
    Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function DirectionGame(time,choice,min,max)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'direction',
            show = true,
            name = 'direction',
            description = 'Look for the fish, then take a left at the seaweed and a right at the talking crab!',
            gameTimeoutDuration = time or 10000,
            requiredCorrectChoices = choice or 2,
            minGridSize = min or 3,
            maxGridSize = max or 7
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function FlipGame(time,grid)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'flip',
            show = true,
            name = 'flip',
            description = ' ',
            gameTimeoutDuration = time or 10000,
            gridSize = grid or 5
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end


function LockpickingGame(time,num,lvl)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'lockpicking',
            show = true,
            name = 'Lockpick',
            description = 'The key to unlocking locks is... well, keys!',
            gameTimeoutDuration = time or 30000,
            gameFinishedEndpoint = "skillchecks:minigameResult:lockpick",
            numLocks = num or 12,
            numLevels = lvl or 3
        }
    })
    Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function SameGame(time,x,y)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'same',
            show = true,
            name = 'Box',
            description = "Boxes stick together when they're in the same clique",
            gameTimeoutDuration = time or 30000,
            gridSizeX = x or 11,
            gridSizeY = y or 8
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function UntangleGame(time,pts)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'untangle',
            show = true,
            name = 'untangle',
            description = 'Time to untangle those poor points',
            gameTimeoutDuration = time or 30000,
            numPoints = pts or 6
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function WordsGame(time,crt)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'words',
            show = true,
            name = 'words',
            description = 'Make those blocks color twins',
            gameTimeoutDuration = time or 30000,
            requiredCorrectChoices = crt or 5
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end

function FloodGame(time,mov,grid)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'skillchecks:settings',
        data = {
            active = 'flood',
            show = true,
            name = 'flood',
            description = 'Track down the elusive repeated work',
            gameTimeoutDuration = time or 80000,
            moveCountLeniency = mov or 2,
            gridSize = grid or 3
        }
    })
     Promise = promise.new()

    local result = Citizen.Await(Promise)
    return result
end


exports('AlphabetGame', AlphabetGame)
exports('DirectionGame', DirectionGame)
exports('FlipGame', FlipGame)
exports('LockpickingGame', LockpickingGame)
exports('SameGame', SameGame)
exports('UntangleGame', UntangleGame)
exports('WordsGame', WordsGame)
exports('FloodGame', FloodGame)