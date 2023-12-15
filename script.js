var isPlaying = false;

    async function init() {
      await initSession(); 
      await initEntities(); 
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

    function togglePlayPause() {
      var startPauseButton = document.getElementById("startPauseButton");
  
      if (isPlaying) {
        SDK3DVerse.engineAPI.pauseAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" , hlinker);
        SDK3DVerse.engineAPI.pauseAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0" , linker );
        startPauseButton.textContent = "▶️";
      } else {
        // Animation
        SDK3DVerse.engineAPI.playAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" , {playbackSpeed : 1} , hlinker);
        SDK3DVerse.engineAPI.playAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0", {playbackSpeed : 1} , linker);
        startPauseButton.textContent = "⏸";
      }

      isPlaying = !isPlaying;
    }

    function reverse() {
      SDK3DVerse.engineAPI.playAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" ,{ playbackSpeed : -1 } , hlinker);
      SDK3DVerse.engineAPI.playAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0" , { playbackSpeed : -1 } , linker);
      if (isPlaying == false)
      {
        startPauseButton.textContent = "⏸"
        isPlaying = true;
      }
    }

    function forward() {
      SDK3DVerse.engineAPI.playAnimationSequence("22a4a489-f0fc-449b-aa87-81d59cc31d6e" ,{ playbackSpeed : 2 } , hlinker);
      SDK3DVerse.engineAPI.playAnimationSequence("6bbf5e8c-d3ea-4f44-8c04-c477955bc8b0" , { playbackSpeed : 2 }, linker);
      if (isPlaying == false)
      {
        startPauseButton.textContent = "⏸"
        isPlaying = true;
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

    async function hideInterface() {
      var interfaceDiv = await document.getElementById("interface");
      var hideButton = document.getElementById("hideButton");
    
      if (interfaceDiv.style.visibility == "visible" || interfaceDiv.style.visibility == "") {
        interfaceDiv.style.visibility = "hidden";
        hideButton.classList.remove("arrow-down");
        hideButton.classList.add("arrow-up");
      } else {
        interfaceDiv.style.visibility = "visible";
        hideButton.classList.remove("arrow-up");
        hideButton.classList.add("arrow-down");
      }
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

    function getIDentity(Elements , Number) {
      return Elements[Number][0]?.getID();
    }

    function onEntitySelected() {
      const dropdown = document.getElementById("entityDropdown");
      const selectedEntityId = dropdown.value;
      if (selectedEntityId == "null")
      {
        comeBack();
      }
      else
      {
        if (linker.isVisible())
        {
          opacity(lElements , getIDentity(lElements , selectedEntityId) , 0.3, true);
        }
        else
        {
          opacity(hElements , getIDentity(hElements , selectedEntityId) , 0.3, true);
        }
      }
      
    }
    
    init(); 