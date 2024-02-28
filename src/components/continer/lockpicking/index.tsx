import { createSignal, onCleanup, onMount } from "solid-js";

import { getRandomInt } from "../../../lib/numbers";
import { resetGame, useConfig } from "../../../lib/store";
import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";


const Lockpicking = () => {
  
  const colors = ["#FFC107", "#1E88E5", "#D81B60"];

  const arrows = {
    up: [83, 40],
    down: [87, 38],
    left: [68, 39],
    right: [65, 37]
  };
  
  const [isLocked, setLocked] = createSignal(false);
  const [selectedSegment, setSelectedSegment] = createSignal(0);

  let Ref;
  let segments = [];
  let orbs = [];


  const drawOrbits = (numSegments) => {
    onMount(() => {
      const canvas = Ref.getContext("2d");
      const angleIncrement = 360 / numSegments;
      const segmentCount = segments.length;
      canvas?.clearRect(0, 0, Ref.width, Ref.height);
      const calculateOrbitRadius = level => level * calculateOrbitSpeed() + numSegments * 3.75;


      const calculateOrbitSpeed = () => {
        const baseSpeed = (9 - segmentCount) * 7.5;
        return (segmentCount + 1) * (baseSpeed / segmentCount);
      };

      const drawOrbits = () => {
        if (canvas) {
          segments.forEach((segment, index) => {
            const orbitRadius = calculateOrbitRadius(index);
            segment.orbs.forEach(orb => {
              const renderAngle = orb.renderAngle ?? orb.index * angleIncrement;
              const x = Ref.width / 2 + orbitRadius * Math.cos(renderAngle * Math.PI / 180);
              const y = Ref.height / 2 + orbitRadius * Math.sin(renderAngle * Math.PI / 180);
              canvas.beginPath();
              canvas.arc(x, y, orb.radius, 0, Math.PI * 2);
              canvas.fillStyle = orb.color;
              canvas.fill();
              canvas.lineWidth = 1;
              canvas.strokeStyle = "rgba(0, 0, 0, 0.05)";
              canvas.stroke();
              canvas.closePath();
            });
          });
        }
      }

      const drawMainOrbit = () => {
        if (canvas) {
          segments.forEach((segment, index) => {
            const orbitRadius = calculateOrbitRadius(index);
            canvas.beginPath();
            canvas.arc(Ref.width / 2, Ref.height / 2, orbitRadius, 0, Math.PI * 2);
            canvas.lineWidth = 2;
            canvas.strokeStyle = selectedSegment() === index ? "yellow" : "white";
            canvas.stroke();
            canvas.closePath();
          });
        }
      }

      
      const drawConnections = () => {
        if (canvas) {
          for (let i = 0; i < numSegments; i++) {
            const x1 = Ref.width / 2 + Math.cos(360 / numSegments * i * Math.PI / 180) * 200;
            const y1 = Ref.height / 2 + Math.sin(360 / numSegments * i * Math.PI / 180) * 200;
            canvas.beginPath();
            canvas.moveTo(Ref.width / 2, Ref.height / 2);
            canvas.lineTo(x1, y1);
            canvas.lineWidth = 2;
            canvas.strokeStyle = "gray";
            canvas.stroke();
            canvas.closePath();
          }
        }
      }

      
      const drawProgressArcs = () => {
        if (canvas) {
          orbs.forEach(segment => {
            const orbitRadius = calculateOrbitRadius(segment.level);
            const offset = calculateOrbitSpeed() / 2.5;
            const startAngle = angleIncrement * (segment.index - 1) + angleIncrement / 2;
            Ref.width / 2 + (orbitRadius - offset) * Math.cos(startAngle * Math.PI / 180);
            Ref.height / 2 + (orbitRadius - offset) * Math.sin(startAngle * Math.PI / 180);
            canvas.beginPath();
            canvas.arc(Ref.width / 2, Ref.height / 2, orbitRadius + offset, startAngle * Math.PI / 180, (startAngle + 360 / numSegments) * Math.PI / 180);
            canvas.lineWidth = 5;
            canvas.strokeStyle = segment.color;
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();
            canvas.fillStyle = segment.color;
            canvas.fill();
            canvas.closePath();
          });
        }
      }

      function init() {
        if (!!canvas && !!Ref && !!orbs.length) {
          canvas.clearRect(0, 0, Ref.width, Ref.height);
          drawConnections ();
          drawMainOrbit();
          drawProgressArcs();
          drawOrbits();
          requestAnimationFrame(init);
        }
      }
      init();
    });
  }



  const [numSegments, setNumSegments] = createSignal(useConfig().numLocks ?? 16);

  const handleKeyDown = (event) => {
    if (event.keyCode === arrows.left[0] || event.keyCode === arrows.left[1]) {
      rotateSegments(1);
    } else if (event.keyCode === arrows.right[0] || event.keyCode === arrows.right[1]) {
      rotateSegments(-1);
    }
    if (event.keyCode === 32) {
      checkMatch();
    }
    event.preventDefault();
  }

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      rotateSegments(1);
    } else if (event.deltaY < 0) {
      rotateSegments(-1);
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);
    onCleanup(() => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    });
    
    segments = [];
    orbs = [];

    setNumSegments(useConfig().numLocks ?? 16);
    setLocked(false);
    setSelectedSegment(0);
    for (let i = 0; i < useConfig().numLevels; i++) {
      const segment = {
        orbs: []
      };
      const orbCount = getRandomInt(numSegments() / 2 - 2, numSegments() - 3);
      const segmentIndexes = [...Array(numSegments()).keys()].sort(() => Math.random() - 0.5);
      for (let j = 0; j < orbCount; j++) {
        const index = segmentIndexes[j];
        const color = colors[getRandomInt(0, colors.length - 1)];
        const orb = {
          index: index,
          level: i,
          color: color
        };
        orbs.push(orb);
      }
      const remainingIndexes = segmentIndexes.filter(index => !orbs.some(orb => orb.index === index && orb.level === i));
      const nonMatchedOrbCount = getRandomInt(remainingIndexes.length / 2 - 1, remainingIndexes.length - 1);
      for (let k = 0; k < nonMatchedOrbCount; k++) {
        const index = remainingIndexes[k];
        const color = colors[getRandomInt(0, colors.length - 1)];
        const orb = {
          index: index,
          radius: 9,
          color: color
        };
        segment.orbs.push(orb);
      }
      segments.push(segment);
    }
    orbs.forEach(orb => {
      const newOrb = {
        index: orb.index,
        radius: 9,
        color: orb.color
      };
      segments[orb.level].orbs.push(newOrb);
    });
    segments.forEach(segment => {
      const offset = getRandomInt(2, numSegments() - 2);
      segment.orbs.forEach(orb => {
        orb.index = (orb.index + offset) % numSegments();
      });
    });
    drawOrbits(12);
  });
  
  onCleanup(() => {
    segments = [];
    orbs = [];
    setNumSegments(0);
  });

  const rotateSegments = (direction) => {
    if (isLocked()) {
      return;
    }
    setLocked(true);
    const animationDuration = 200;
    let lastTime = Date.now();
    const rotationInterval = setInterval(() => {
      const currentSegment = segments[selectedSegment()];
      if (currentSegment) {
        currentSegment.orbs.forEach(orb => {
          if (orb.renderAngle === undefined) {
            orb.renderAngle = orb.index * (360 / numSegments());
          }
          orb.renderAngle += 360 / numSegments() * direction * ((Date.now() - lastTime) / animationDuration);
        });
        lastTime = Date.now();
      }
    }, 10);

    setTimeout(() => {
      clearInterval(rotationInterval);
      segments[selectedSegment()].orbs.forEach(orb => {
        orb.renderAngle = undefined;
        orb.index = Math.round(orb.index + direction);
        if (orb.index < 0) {
          orb.index += numSegments();
        }
        if (orb.index >= numSegments()) {
          orb.index -= numSegments();
        }
      });
      setLocked(false);
    }, animationDuration);
  }

  const moveSegment = (offset, shouldUpdate = true) => {
    const newIndex = selectedSegment() + offset;
    if (newIndex < 0 || newIndex >= segments.length) {
      if (shouldUpdate) {
        setSelectedSegment((newIndex + segments.length) % segments.length);
      }
      return;
    }
    setSelectedSegment(newIndex);
  }

  function checkMatch() {
    const currentSegmentIndex = selectedSegment();
    const currentSegment = segments[currentSegmentIndex];
    const orbsInSegment = orbs.filter(orb => orb.level === currentSegmentIndex);
    if (orbsInSegment.filter(orb => currentSegment.orbs.find(segmentOrb => segmentOrb.index === orb.index)?.color === orb.color).length === orbsInSegment.length) {
      if (selectedSegment() === segments.length - 1) {
        callback(true);
        isFinshed(true);
        return;
      }
      currentSegment.orbs.forEach(orb => {
        orb.color = "rgba(0, 248, 185, 0.555)";
      });
      orbsInSegment.forEach(orb => {
        orb.color = "rgba(0, 248, 185, 0.55)";
      });
      moveSegment(1);
      isFinshed(true);
      return;
    }
    isFinshed(false);
    callback(false)
  }



  return (
    <>
      <div class="flex w-[32rem] flex-col gap-y-4 p-2 text-white">
        <div class="w-full text-center"></div>
        <div class="flex h-[25rem] w-full place-content-center items-center rounded-md text-center text-4xl" style="background: radial-gradient(119.58% 127.46% at 50% 50%, rgb(9, 35, 53) 0%, rgba(9, 35, 53, 0) 100%);">
          <canvas
            ref={Ref}
            id="lockpicking"
            width="1000"
            height="800"
            class="h-[180%] w-[200%]"
          ></canvas>
        </div>
        <div class="flex gap-1">
          <div class="flex h-8 w-full gap-1">
            <div onClick={() => rotateSegments(1)} class="bg-darkorchid/20 text-darkorchid hover:bg-darkorchid/40 flex h-full w-full place-content-center items-center rounded-md p-1 text-center">
              Rotate Left
            </div>
            <div onClick={() => rotateSegments(-1)} class="bg-darkorchid/20 text-darkorchid hover:bg-darkorchid/40 flex h-full w-full place-content-center items-center rounded-md p-1 text-center">
              Rotate Right
            </div>
          </div>
        </div>
        <div class="flex h-8 w-full gap-1">
          <div onClick={checkMatch} class="bg-mediumspringgreen-100/20 text-mediumspringgreen-100 hover:bg-mediumspringgreen-100/40 flex h-full w-full place-content-center items-center rounded-md p-1 text-center">
            Unlock
          </div>
        </div>
      </div>
    </>
  );
};

export default Lockpicking;
