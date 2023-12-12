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
      
      const hEntities = await SDK3DVerse.engineAPI.findEntitiesByEUID("fa9f5c6e-f595-47a8-8d96-13e57d5db262");
      hlinker = hEntities[0];
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

    async function onClick(event) {

      console.log("lteeth");
      const target = await SDK3DVerse.engineAPI.castScreenSpaceRay(
        event.clientX,
        event.clientY 
      );

      
      if (!target.pickedPosition) return;
      const clickedEntity = target.entity;
      const rootEntities = await SDK3DVerse.engineAPI.getRootEntities();
      /*
      const hteeth = rootEntities.find(
        (e) => e.getName() === 'hteeth'
      );
      const hgum = rootEntities.find(
        (e) => e.getName() === 'hgum'
      );
      const hmuscle = rootEntities.find(
        (e) => e.getName() === 'hmuscle'
      );

      const lgum = rootEntities.find(
        (e) => e.getName() === 'lgum'
      );

      const lmuscle = rootEntities.find(
        (e) => e.getName() === 'lmuscle'
      );

      */
      const lteeth = rootEntities.find(
        (e) => e.getName() === 'lteeth' 
      );
      
      if (clickedEntity.getID() !== lteeth?.getID()) {
        console.log("lteeth2");
        lteeth.setComponent('material_lteeth', material_lteeth_opa);
      }

    };
    
    init(); 