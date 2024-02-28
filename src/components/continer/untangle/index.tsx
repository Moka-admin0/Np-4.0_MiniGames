import { createEffect } from "solid-js";

import { getRandomInt } from "../../../lib/numbers";
import { resetGame, useConfig } from "../../../lib/store";
import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";

const Untangle = () => {

  function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  class Circle {
    x;
    y;
    radius;
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }
  }

  class Line {
    startPoint;
    endPoint;
    thickness;
    constructor(startPoint, endPoint, thickness) {
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.thickness = thickness;
    }
  }

  let gameState = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: [],
    currentLevel: 0,
    progressPercentage: 0,
    layers: null,
    levels: [],
    callback: null,
    audioFn: null,
    numPoints: 6,
    interval: -1,
    width: 0,
    targetCircle: undefined
  };

  const maxConnections = 4;

  function generateCircles(numPoints) {
    let points = [];
    const gridWidth = gameState.width / (numPoints + 1);
    let attemptCounter = 0;
    const maxGridIndex = Math.round((gameState.width - gridWidth) / gridWidth);

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + getRandomInt(1, maxGridIndex) * gridWidth;
      const y = 10 + getRandomInt(1, maxGridIndex) * gridWidth;
      if (points.find(point => point.x === x && point.y === y)) {
        if (attemptCounter > 100) {
          break;
        }
        attemptCounter++;
        i--;
        continue;
      }
      points.push({
        x: x,
        y: y,
        edges: [],
        id: i
      });
    }

    let connections = [];
    for (let i = 0; i < numPoints; i++) {
      const startPoint = points[i];
      if (connections.filter(conn => conn.startIndex === i || conn.endIndex === i).length >= maxConnections) {
        continue;
      }
      const remainingPoints = points.slice(i + 1);
      remainingPoints.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(startPoint.x - a.x, 2) + Math.pow(startPoint.y - a.y, 2));
        const distB = Math.sqrt(Math.pow(startPoint.x - b.x, 2) + Math.pow(startPoint.y - b.y, 2));
        if (distA - distB > 0) {
          return 1;
        } else {
          return -1;
        }
      });
      connectionLoop: for (let j = 0; j < remainingPoints.length; j++) {
        const endPoint = points.find(point => point.id === remainingPoints[j].id);
        if (!endPoint) {
          continue;
        }

        if (connections.filter(conn => conn.startIndex === i || conn.endIndex === i).length >= maxConnections) {
          break;
        }
        if (connections.filter(conn => conn.endIndex === endPoint.id || conn.startIndex === endPoint.id).length >= maxConnections) {
          continue;
        }

        const line = {
          startPoint: {
            x: startPoint.x,
            y: startPoint.y
          },
          endPoint: {
            x: endPoint.x,
            y: endPoint.y
          },
          id: endPoint.id,
          j: j
        };

        for (const existingConnection of connections) {
          if (checkIfLinesIntersect(line, existingConnection)) {
            continue connectionLoop;
          }
        }
        if (!connections.find(conn => conn.endIndex === endPoint.id && conn.startIndex === i)) {
          for (const point of points) {
            if (point.id !== i && point.id !== endPoint.id && isPointOnLine(line.startPoint, line.endPoint, point)) {
              continue connectionLoop;
            }
          }
          connections.push({
            ...line,
            startIndex: i,
            endIndex: endPoint.id
          });
        }
      }
    }

    let connectedPoints = new Set();
    for (const connection of connections) {
      connectedPoints.add(connection.startIndex);
      connectedPoints.add(connection.endIndex);
    }
    if (connectedPoints.size !== points.length) {
      return generateCircles(numPoints);
    }

    const countIntersectingConnections = () => {
      let intersectionCount = 0;
      for (let i = 0; i < connections.length; i++) {
        const startPoint1 = points.find(point => point.id === connections[i].startIndex);
        const endPoint1 = points.find(point => point.id === connections[i].endIndex);
        if (!!startPoint1 && !!endPoint1) {
          connections[i].startPoint = {
            x: startPoint1.x,
            y: startPoint1.y
          };
          connections[i].endPoint = {
            x: endPoint1.x,
            y: endPoint1.y
          };
          for (let j = i + 1; j < connections.length; j++) {
            const startPoint2 = points.find(point => point.id === connections[j].startIndex);
            const endPoint2 = points.find(point => point.id === connections[j].endIndex);
            if (!!startPoint2 && !!endPoint2) {
              connections[j].startPoint = {
                x: startPoint2.x,
                y: startPoint2.y
              };
              connections[j].endPoint = {
                x: endPoint2.x,
                y: endPoint2.y
              };
              if (checkIfLinesIntersect(connections[i], connections[j])) {
                intersectionCount++;
              }
            }
          }
        }
      }
      return intersectionCount;
    };

    const halfWidth = gameState.width / 2;
    const quarterWidth = gameState.width / 4 + Math.floor(Math.random() * halfWidth / Math.floor(numPoints / 2));
    for (let i = 0; i < numPoints; i++) {
      points[i].x = halfWidth + quarterWidth * Math.cos(i * 2 * Math.PI / numPoints);
      points[i].y = halfWidth + quarterWidth * Math.sin(i * 2 * Math.PI / numPoints);
    }
    if (countIntersectingConnections() < numPoints - 1) {
      return generateCircles(numPoints);
    } else {
      return {
        circles: points,
        relationship: points.reduce((relationships, point, index) => {
          const connected = connections.filter(connection => connection.startIndex === point.id);
          relationships[index] = {
            connectedPoints: connected.map(conn => conn.endIndex)
          };
          return relationships;
        }, {})
      };
    }
  }

  function initializeLevel() {
    let levelData = generateCircles(gameState.numPoints);
    gameState.circles = [];
    gameState.levels[gameState.currentLevel] = levelData;
    for (let i = 0; i < levelData.circles.length; i++) {
      gameState.circles.push(new Circle (levelData.circles[i].x, levelData.circles[i].y, 18));
    }
    createLinesFromRelationships();
    adjustLineThickness();
  }

  function checkGameCompletion() {
    if (gameState.progressPercentage === 100) {
      gameState.callback(true);
      resetGame();
      return true;
    } else {
      return false;
    }
  }

  function drawLine(canvasContext, startX, StartY, endX, endY, thickness) {
    canvasContext.beginPath();
    canvasContext.moveTo(startX, StartY);
    canvasContext.lineTo(endX, endY);
    canvasContext.lineWidth = 3;
    canvasContext.strokeStyle = thickness === gameState.boldLineThickness ? "#ff2200" : "#00ff00";
    canvasContext.stroke();
  }

  function drawCircle(canvasContext, x, y, radius) {
    let gradient = canvasContext.createRadialGradient(x - 3, y - 3, 1, x, y, radius);
    gradient.addColorStop(0, "#00ff00");
    gradient.addColorStop(1, "#00aa00");
    canvasContext.fillStyle = gradient;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
    canvasContext.closePath();
    canvasContext.fill();
  }

  function identifyClickedCircle(event) {
    let offsetX = event.offsetX || 0;
    let offsetY = event.offsetY || 0;
    for (let i = 0; i < gameState.circles.length; i++) {
      let circleX = gameState.circles[i].x;
      let circleY = gameState.circles[i].y;
      let redius = gameState.circles[i].radius;
      if (Math.pow(offsetX - circleX, 2) + Math.pow(offsetY - circleY, 2) < Math.pow(redius, 2)) {
        gameState.targetCircle = i;
        break;
      }
    }
  }

  function adjustCirclePosition(event) {
    if (gameState.targetCircle !== undefined) {
      let offsetX = event.offsetX || 0;
      let offsetY = event.offsetY || 0;
      let radius = gameState.circles[gameState.targetCircle].radius;
      gameState.circles[gameState.targetCircle] = new Circle (offsetX, offsetY, radius);
      createLinesFromRelationships();
      adjustLineThickness();
      calculateProgressPercentage();
    }
  }

  function handleMouseUp(event) {
    const gameCompleted = checkGameCompletion();
    if (gameState.targetCircle !== undefined) {
      gameState.audioFn(gameCompleted);
    }
    gameState.targetCircle = undefined;
  }

  function initGame(width, points, callback, audio) {
    let layers = document.getElementById("game")?.getContext("2d");
    gameState.width = width;
    gameState.layers = layers;
    gameState.audioFn = audio;
    gameState.callback = callback;
    gameState.numPoints = points;
    gameState.targetCircle = undefined;
    gameState.interval = setInterval(drawGameElements, 10);
    initializeLevel();
    calculateProgressPercentage();
    document.getElementById("layers")?.addEventListener("mousedown", identifyClickedCircle);
    document.getElementById("layers")?.addEventListener("mousemove", adjustCirclePosition);
    document.getElementById("layers")?.addEventListener("mouseup", handleMouseUp);
  }

  function clearGame() {
    clearInterval(gameState.interval);
    document.getElementById("layers")?.removeEventListener("mousedown", identifyClickedCircle);
    document.getElementById("layers")?.removeEventListener("mousemove", adjustCirclePosition);
    document.getElementById("layers")?.removeEventListener("mouseup", handleMouseUp);
  }

  function drawGameElements() {
    const canvasContext = gameState.layers;
    clearCanvas(canvasContext);
    for (let i = 0; i < gameState.lines.length; i++) {
      let line = gameState.lines[i];
      let startPoint = line.startPoint;
      let endPoint = line.endPoint;
      let thickness = line.thickness;
      drawLine(canvasContext, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness);
    }
    for (let i = 0; i < gameState.circles.length; i++) {
      let circle = gameState.circles[i];
      drawCircle(canvasContext, circle.x, circle.y, circle.radius);
    }
  }

  function createLinesFromRelationships() {
    const currentLevelData = gameState.levels[gameState.currentLevel];
    gameState.lines.length = 0;
    for (let pointId in currentLevelData.relationship) {
      const connectedPoints = currentLevelData.relationship[pointId].connectedPoints;
      const startPoint = gameState.circles[pointId];
      for (let connectedPointId in connectedPoints) {
        const endPoint = gameState.circles[connectedPoints[connectedPointId]];
        gameState.lines.push(new Line (startPoint, endPoint, 1));
      }
    }
  }

  function adjustLineThickness() {
    for (let i = 0; i < gameState.lines.length; i++) {
      let currentLine = gameState.lines[i];
      currentLine.thickness = gameState.thinLineThickness;
      for (let j = 0; j < i; j++) {
        let otherLine = gameState.lines[j];
        if (checkIfLinesIntersect(currentLine, otherLine)) {
          currentLine.thickness = gameState.boldLineThickness;
          otherLine.thickness = gameState.boldLineThickness;
        }
      }
    }
  }

  function calculateProgressPercentage() {
    let thinLineCount = 0;
    for (let i = 0; i < gameState.lines.length; i++) {
      if (gameState.lines[i].thickness === gameState.thinLineThickness) {
        thinLineCount++;
      }
    }
    gameState.progressPercentage = Math.floor(thinLineCount / gameState.lines.length * 100);
  }

  function checkIfLinesIntersect(line1, line2) {
    let a1 = line1.endPoint.y - line1.startPoint.y;
    let b1 = line1.startPoint.x - line1.endPoint.x;
    let c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
    let a2 = line2.endPoint.y - line2.startPoint.y;
    let b2 = line2.startPoint.x - line2.endPoint.x;
    let c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
    let determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) {
      return false;
    }
    {
      let x = (b2 * c1 - b1 * c2) / determinant;
      let y = (a1 * c2 - a2 * c1) / determinant;
      if ((isBetween(line1.startPoint.x, x, line1.endPoint.x) || isBetween(line1.startPoint.y, y, line1.endPoint.y)) && (isBetween(line2.startPoint.x, x, line2.endPoint.x) || isBetween(line2.startPoint.y, y, line2.endPoint.y))) {
        return true;
      }
    }
    return false;
  }

  function isBetween(a, b, c) {
    if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
      return false;
    } else {
      return a < b && b < c || c < b && b < a;
    }
  }

  function isPointOnLine(startPoint, endPoint, point) {
    let a = endPoint.y - startPoint.y;
    let b = startPoint.x - endPoint.x;
    let c = a * startPoint.x + b * startPoint.y;
    return a * point.x + b * point.y - c === 0 && (isBetween(startPoint.x, point.x, endPoint.x) || isBetween(startPoint.y, point.y, endPoint.y));
  }

  createEffect(() => {
    initGame(640, useConfig().numPoints, callback, isFinshed);
    return () => {
      clearGame();
    };
  });

  return (
    <div id="layers" style={{background: "radial-gradient(rgba(0, 255, 0, 0.125), rgb(5, 20, 31))"}}>
      <canvas id="game" width="640" height="640"></canvas>
    </div>
  );
};

export default Untangle;
