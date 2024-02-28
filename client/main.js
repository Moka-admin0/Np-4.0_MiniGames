

RegisterNuiCallback("skillchecks:minigameResult", (data, cb) => {
    SetNuiFocus(false, false);
    console.log(data);
    cb("ok");
});

RegisterCommand('alphabet', () => {
  SetNuiFocus(true, true);
  SendNUIMessage({
      action: 'skillchecks:settings',
      data: {
          active: 'alphabet',
          show: true,
          name: 'Alphabet',
          description: 'This is the alphabet',
          gameTimeoutDuration: 10000,

          numKeys: 20,
      }
  });
}, false);

RegisterCommand('direction', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'direction',
            show: true,
            name: 'direction',
            description: 'This is the direction',
            gameTimeoutDuration: 30000,

            requiredCorrectChoices: 2,
            minGridSize: 3,
            maxGridSize: 7,
        }
    });

}, false);


RegisterCommand('flip', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'flip',
            show: true,
            name: 'flip',
            description: 'This is the flip',
            gameTimeoutDuration: 30000,

            gridSize: 5,
        }
    });
}, false);


RegisterCommand('lockpicking', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'lockpicking',
            show: true,
            name: 'lockpicking',
            description: 'This is the lockpicking',
            gameTimeoutDuration: 30000,

            numLocks: 12,
            numLevels: 3,
        }
    });
}, false);

RegisterCommand('same', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'same',
            show: true,
            name: 'same',
            description: 'This is the same',
            gameTimeoutDuration: 30000,

            gridSizeX: 11,
            gridSizeY: 8,
        }
    });
}, false);

RegisterCommand('untangle', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'untangle',
            show: true,
            name: 'untangle',
            description: 'This is the untangle',
            gameTimeoutDuration: 30000,
            
            numPoints: 6,
        }
    });

}, false);

RegisterCommand('words', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'words',
            show: true,
            name: 'words',
            description: 'This is the words',
            gameTimeoutDuration: 30000,
            
            requiredCorrectChoices: 5,
        }
    });
}, false);


RegisterCommand('flood', () => {
    SetNuiFocus(true, true);
    SendNUIMessage({
        action: 'skillchecks:settings',
        data: {
            active: 'flood',
            show: true,
            name: 'flood',
            description: 'This is the flood',
            gameTimeoutDuration: 30000,
            
            moveCountLeniency: 5,
            gridSize: 5,
        }
    });
}, false);