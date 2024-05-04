window.addEventListener('load', () => {
    init();
    document.addEventListener("mousemove", handleMouseMove);
});

var isPlaying = false;
var dropdownVisible = false;
var currentAudioTime = 0;
var timer;
var interface = document.getElementById("controls-zone");
const loader = document.querySelector('.loader');

async function init() {
    await initSession(); 
    await initEntities(); 
}

async function onFirstFrame() {
    loader.classList.add('fondu-out');
    SDK3DVerse.notifier.off('onFramePreRender', onFirstFrame);
}

async function initSession() {
    await SDK3DVerse.joinOrStartSession({
        userToken: "public_VU0u4tvRqwxLIiZw",
        sceneUUID: "3862f8ed-85f7-40c2-96da-de79a4e56fe5",
        canvas: document.getElementById("display-canvas"),
        viewportProperties: {
            defaultControllerType: SDK3DVerse.controller_type.orbit,
        },
    });
    SDK3DVerse.notifier.on('onFramePreRender', onFirstFrame);
}

async function initEntities() {
    const entities = await SDK3DVerse.engineAPI.findEntitiesByEUID("e9f5a54b-98c4-4b4f-bf7d-581dcfe067b6");
    linker = entities[0];
    linker.setVisibility(true);
    
    mcmp = await SDK3DVerse.engineAPI.findEntitiesByNames('mcmp');
    oh = await SDK3DVerse.engineAPI.findEntitiesByNames('oh');
    mhgbg = await SDK3DVerse.engineAPI.findEntitiesByNames('mhgbg');
    mhg = await SDK3DVerse.engineAPI.findEntitiesByNames('mhg');
    mhgcg = await SDK3DVerse.engineAPI.findEntitiesByNames('mhgcg');
    msg = await SDK3DVerse.engineAPI.findEntitiesByNames('msg');
    dents = await SDK3DVerse.engineAPI.findEntitiesByNames('dents');
    ommh = await SDK3DVerse.engineAPI.findEntitiesByNames('ommh');
    msh = await SDK3DVerse.engineAPI.findEntitiesByNames('msh');
    mdva = await SDK3DVerse.engineAPI.findEntitiesByNames('mdva');
    Dents = await SDK3DVerse.engineAPI.findEntitiesByNames('Dents');
    ommho = await SDK3DVerse.engineAPI.findEntitiesByNames('ommho');
    mgh = await SDK3DVerse.engineAPI.findEntitiesByNames('mgh');
    om = await SDK3DVerse.engineAPI.findEntitiesByNames('om');
    mls = await SDK3DVerse.engineAPI.findEntitiesByNames('mls');
    md = await SDK3DVerse.engineAPI.findEntitiesByNames('md');
    mgg = await SDK3DVerse.engineAPI.findEntitiesByNames('mgg');
    mmh = await SDK3DVerse.engineAPI.findEntitiesByNames('mmh');
    oArtere = await SDK3DVerse.engineAPI.findEntitiesByNames('oArtere');
    omsg = await SDK3DVerse.engineAPI.findEntitiesByNames('omsg');
    aai = await SDK3DVerse.engineAPI.findEntitiesByNames('aai');
    lsh = await SDK3DVerse.engineAPI.findEntitiesByNames('lsh');
    td = await SDK3DVerse.engineAPI.findEntitiesByNames('td');
    sl = await SDK3DVerse.engineAPI.findEntitiesByNames('sl');

    lElements = [mcmp, oh, mhgbg, mhg, mhgcg, msg, dents, ommh, msh, mdva, Dents, ommho, mgh, om, mls, md, mgg, mmh, oArtere,omsg, aai, lsh, td, sl];

}

function opacity(Elements, theOneId , opacityValue , reset) {
    if (reset == true) {
        opacity(Elements , 'ok' , 1 , false);
    }
    Elements.forEach(element => {
        const entity = element[0];
        if (entity?.getID() === theOneId) {
            return;
        }
        let materialDataJSON = entity.getComponent('material').dataJSON;
        materialDataJSON = SDK3DVerse.utils.clone(materialDataJSON);
        materialDataJSON.opacity = opacityValue;
        entity.setComponent('material', { dataJSON : materialDataJSON });
    });
}

function comeBack() {
    if (linker.isVisible()) {
        opacity(lElements , 'ok' , 1 , false);
    } else {
        opacity(hElements , 'ok' , 1 , false);
    }
}

function mute() {
    var audioPlayer = document.getElementById("audioPlayer");
    var muteButton = document.querySelector("#controls button[data-action='mute']");

    audioPlayer.muted = !audioPlayer.muted;

    if (audioPlayer.muted) {
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteButton.innerHTML = '<i class="fas fa-volume-high"></i>';
    }
}

function togglePlayPause() {
    var startPauseButton = document.getElementById("startPauseButton");
    var audioPlayer = document.getElementById("audioPlayer");

    if (isPlaying) {
        currentAudioTime = audioPlayer.currentTime;
        SDK3DVerse.engineAPI.pauseAnimationSequence("7a929d41-ff66-4ab6-8b50-a5ed808e757a" , linker);
        audioPlayer.pause();
        startPauseButton.innerHTML = '<i class="far fa-circle-play"></i>';
    } else {
        // Animation
        SDK3DVerse.engineAPI.playAnimationSequence("7a929d41-ff66-4ab6-8b50-a5ed808e757a" , {playbackSpeed : 1} , linker);
        audioPlayer.currentTime = currentAudioTime;
        audioPlayer.play();
        startPauseButton.innerHTML = '<i class="far fa-circle-pause"></i>';
    }

    isPlaying = !isPlaying;
}

function reverse() {
    const speed = -2; // Valeur de vitesse pour l'animation et le fichier audio
    updatePlayback(speed);
}

function forward() {
    const speed = 2; // Valeur de vitesse pour l'animation et le fichier audio
    updatePlayback(speed);
}

function updatePlayback(speed) {
    SDK3DVerse.engineAPI.playAnimationSequence("7a929d41-ff66-4ab6-8b50-a5ed808e757a", { playbackSpeed: speed }, linker);

    if (isPlaying) {
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.currentTime += speed; // Met à jour la position du fichier audio

        // Assurez-vous que le fichier audio ne dépasse pas la fin ou le début
        if (audioPlayer.currentTime < 0) {
            audioPlayer.currentTime = 0;
        } else if (audioPlayer.currentTime > audioPlayer.duration) {
            audioPlayer.currentTime = audioPlayer.duration;
        }
    }

    if (!isPlaying) {
        const startPauseButton = document.getElementById("startPauseButton");
        startPauseButton.innerHTML = speed > 0 ? '<i class="far fa-circle-play"></i>' : '<i class="far fa-circle-pause"></i>';
        isPlaying = true;
        togglePlayPause(); // Inverse l'état pour mettre en pause si la lecture était arrêtée
    }
}

function openOptions() {
    if (linker.isVisible()) {
        linker.setVisibility(false);
    } else {
        linker.setVisibility(true);
    }
}

function handleMouseMove() {
    interface.style.visibility = "visible";
    resetTimeout();
}

function resetTimeout() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        interface.style.visibility = "hidden";
    }, 5000); 
}
  
  async function onClick(event) {
    const target = await SDK3DVerse.engineAPI.castScreenSpaceRay(
      event.clientX,
      event.clientY 
    );
    
    if (!target.pickedPosition) return;
    const clickedEntity = target.entity;
  
    if (linker.isVisible())
    {
        const elementNames = [
            'mcmp', 'oh', 'mhgbg', 'mhg', 'mhgcg', 'msg', 'g', 'dents', 'ommh', 'msh', 'mdva', 
            'Dents', 'ommho', 'mgh', 'Artere', 'om', 'mls', 'md', 'mgg', 'mmh', 'oArtere', 
            'omsg', 'aai', 'lsh', 'td', 'sl'
          ];
        
          for (let i = 0; i < elementNames.length; i++) {
            const elementName = elementNames[i];
            const element = lElements[i][0]; 
        
            if (clickedEntity.getID() === element?.getID()) {
              opacity(lElements, element.getID(), 0.1, true);
              break; 
            }
          }
    }
  };
  
  const entityNames = {
    'None': '',
    0: 'Muscle constricteur moyen du pharynx',
    1: 'Os hyoide',
    2: 'Muscle hyo-glosse basio glosse',
    3: 'Membrane hyo-glossienne',
    4: 'Muscle hyo-glosse cerato glosse',
    5: 'Muscle stylo-glosse',
    6: 'Group1',
    7: 'dents',
    8: 'Muscle mylo-hyoidien',
    9: 'Muscle stylo-hyoidien',
    10: 'Muscle digastrique ventre anterieur',
    11: 'Dents',
    12: 'Muscle mylo-hyoidien_1',
    13: 'Muscle genio-hyoidien',
    14: 'Artere ',
    15: 'Os mandibulaire ',
    16: 'Muscle longitudinal superieur',
    17: 'Muscle digastrique',
    18: 'Muscle genio-glosse',
    19: 'Muscle mylo-hyoidien',
    20: 'Artere_1',
    21: 'Muscle stylo-glosse',
    22: 'Artere alveolaire inferieur',
    23: 'Lygament stylo-hyoidien',
    24: 'Tendon digastrique',
    25: 'Septum lingual'
};
      
  function toggleDropdown() {
    const dropdownOptions = document.querySelector('.dropdown-options');
    dropdownOptions.classList.toggle('hidden');
  }
      
  function handleOptionSelection(event) {
    const selectedValue = event.target.getAttribute('data-value');
    const selectedName = entityNames[selectedValue];
  
    document.querySelector('.dropdown-header').innerHTML = `Models : ${selectedName} &#9660;`;
    if (selectedValue == "None")
    {
      comeBack();
    }
    else
    {
      if (linker.isVisible())
      {
        opacity(lElements , getIDentity(lElements , selectedValue) , 0.3, true);
      }
    }
  }
  
  function getIDentity(Elements , Number) {
    return Elements[Number][0]?.getID();
  }
  
  function toggleSidenav() {
    var navbar = document.getElementById("sidenav");
    if (navbar.style.left === "0px") {
      navbar.style.left = "-250px";
    } else {
      navbar.style.left = "0px";
    }
  }