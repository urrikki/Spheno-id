window.addEventListener('load', () => {
  init();
  document.addEventListener("mousemove", handleMouseMove);
})

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
    sceneUUID: "e6d5bd66-be7f-47eb-8569-5cf441abfd7c",
    canvas: document.getElementById("display-canvas"),
    viewportProperties: {
      defaultControllerType: SDK3DVerse.controller_type.orbit,
    },
  });
  SDK3DVerse.notifier.on('onFramePreRender', onFirstFrame);
}

async function initEntities() {
  const entities = await SDK3DVerse.engineAPI.findEntitiesByEUID("8dda24fe-0d46-427a-ab54-a8771eca876f");
  linker = entities[0];
  linker.setVisibility(false);
  
  const hEntities = await SDK3DVerse.engineAPI.findEntitiesByEUID("fa9f5c6e-f595-47a8-8d96-13e57d5db262");
  hlinker = hEntities[0];

  lteeth = await SDK3DVerse.engineAPI.findEntitiesByNames('lteeth');
  lgum = await SDK3DVerse.engineAPI.findEntitiesByNames('lgum');
  lmuscle = await SDK3DVerse.engineAPI.findEntitiesByNames('lmuscle');
  hteeth = await SDK3DVerse.engineAPI.findEntitiesByNames('hteeth');
  hgum = await SDK3DVerse.engineAPI.findEntitiesByNames('hgum');
  hmuscle = await SDK3DVerse.engineAPI.findEntitiesByNames('hmuscle');

  lElements = [lteeth, lgum, lmuscle];
  hElements = [hteeth, hgum, hmuscle];

}

function opacity(Elements, theOneId , opacityValue , reset) {
  if (reset == true)
  {
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
  })
}

function comeBack()
{
  if (linker.isVisible())
  {
    opacity(lElements , 'ok' , 1 , false)
  }
  else
  {
    opacity(hElements , 'ok' , 1 , false)
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
    SDK3DVerse.engineAPI.pauseAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" , hlinker);
    SDK3DVerse.engineAPI.pauseAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0" , linker );
    audioPlayer.pause();
    startPauseButton.innerHTML = '<i class="far fa-circle-play"></i>';
  } else {
    // Animation
    SDK3DVerse.engineAPI.playAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" , {playbackSpeed : 1} , hlinker);
    SDK3DVerse.engineAPI.playAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0", {playbackSpeed : 1} , linker);
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
  SDK3DVerse.engineAPI.playAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e", { playbackSpeed: speed }, hlinker);
  SDK3DVerse.engineAPI.playAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0", { playbackSpeed: speed }, linker);

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

    
function openOptions(){
  if (linker.isVisible())
  {
    linker.setVisibility(false);
    hlinker.setVisibility(true);
  }
  else
  {
    linker.setVisibility(true);
    hlinker.setVisibility(false);
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
    if (clickedEntity.getID() == lteeth[0]?.getID()) {
      opacity(lElements , lteeth[0]?.getID() , 0.1 , true)
    }
    else if (clickedEntity.getID() == lgum[0]?.getID()){
      opacity(lElements , lgum[0]?.getID(), 0.1, true)
    }
    else if (clickedEntity.getID() == lmuscle[0]?.getID()){
      opacity(lElements , lmuscle[0]?.getID(), 0.1, true)
    }
  }
  else if (hlinker.isVisible())
  {
    if (clickedEntity.getID() == hteeth[0]?.getID()) {
      opacity(hElements , hteeth[0]?.getID(), 0.1, true)
    }
    else if (clickedEntity.getID() == hgum[0]?.getID()){
      opacity(hElements , hgum[0]?.getID(), 0.1, true)
    }
    else if (clickedEntity.getID() == hmuscle[0]?.getID()){
      opacity(hElements , hmuscle[0]?.getID(), 0.1, true)
    }
  }
};

const entityNames = {
  'None': '',
  0: 'Teeth',
  1: 'Gum',
  2: 'Muscle',
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
    else
    {
      opacity(hElements , getIDentity(hElements , selectedValue) , 0.3, true);
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