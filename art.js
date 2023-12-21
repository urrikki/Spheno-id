window.addEventListener('load', () => {
    init();
    document.addEventListener("mousemove", handleMouseMove);
  })
  
  var isPlaying = false;
  var dropdownVisible = false;
  var timer;
  var interface = document.getElementById("controls-zone");
  const loader = document.querySelector('.loader');
  
  async function init() {
    await initSession(); 
  }
  
  async function onFirstFrame() {
    loader.classList.add('fondu-out');
    SDK3DVerse.notifier.off('onFramePreRender', onFirstFrame);
  }
  
  async function initSession() {
  
    await SDK3DVerse.joinOrStartSession({
      userToken: "public_VU0u4tvRqwxLIiZw",
      sceneUUID: "e61743e9-03cf-4744-bda0-04ec8a378698",
      canvas: document.getElementById("display-canvas"),
      viewportProperties: {
        defaultControllerType: SDK3DVerse.controller_type.orbit,
      },
    });
    SDK3DVerse.notifier.on('onFramePreRender', onFirstFrame);
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
  
    if (isPlaying) {
      SDK3DVerse.engineAPI.pauseAnimationSequence("02b3863e-3305-4f7a-9710-8a3ac6b3a5da");
      audioPlayer.pause();
      startPauseButton.innerHTML = '<i class="far fa-circle-play"></i>';
    } else {
      // Animation
      SDK3DVerse.engineAPI.playAnimationSequence("02b3863e-3305-4f7a-9710-8a3ac6b3a5da" , {playbackSpeed : 1});
      audioPlayer.currentTime = 0; // Rewind the audio to the beginning
      audioPlayer.play();
      startPauseButton.innerHTML = '<i class="far fa-circle-pause"></i>';
    }
  
    isPlaying = !isPlaying;
  }
  
  function reverse() {
    SDK3DVerse.engineAPI.playAnimationSequence("02b3863e-3305-4f7a-9710-8a3ac6b3a5da" ,{ playbackSpeed : -1 });
    if (isPlaying == false)
    {
      startPauseButton.innerHTML = '<i class="far fa-circle-pause"></i>';
      isPlaying = true;
    }
  }
  
  function forward() {
    SDK3DVerse.engineAPI.playAnimationSequence("02b3863e-3305-4f7a-9710-8a3ac6b3a5da" ,{ playbackSpeed : 2 });
    if (isPlaying == false)
    {
      startPauseButton.innerHTML = '<i class="far fa-circle-pause"></i>';
      isPlaying = true;
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
  
  function toggleSidenav() {
    var navbar = document.getElementById("sidenav");
    if (navbar.style.left === "0px") {
      navbar.style.left = "-250px";
    } else {
      navbar.style.left = "0px";
    }
  }