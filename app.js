class Person {
  constructor(nationality, img) {
    this.nationality = nationality;
    this.image = img;
  }
}
let allNations = [
  new Person("chinese", "./img/chinese.png"),
  new Person("japanese", "./img/japanese.png"),
  new Person("korean", "./img/korea.png"),
  new Person("thai", "./img/thai.png"),
];
let person = {};
let nationality;
const rounds = 10;
let gameCounter = 0;
let winPoint = 20;
let losePoint = -5;
let finalPoint = 0;
const threshold = 20;
const fadingTimeMS = 3000;
let containerWidth = $(".container").width();
const boxWidht = $("#guess").width();
const center = containerWidth / 2 - boxWidht;
const animateToTopValue =
  $(".container").height() - $("#guess").height() - $("#guess")[0].offsetTop;

const animationRoute = {
  start: {
    top: 0,
    left: center,
  },
  end: {
    top: animateToTopValue,
    left: center,
  },
};

$(document).ready(function () {
  $("#guess").css({ left: center });
  $("#btn").click(function () {
    initDraggble();
    initPerson();
    startGame();
  });
});
function initPerson() {
  person = allNations[Math.floor(Math.random() * allNations.length)];
  $("#guess").css({
    background: `url(${person.image}) no-repeat`,
    "background-size": "5rem",
  });
}
function startGame() {
  gameCounter = 0;
  animateTo({
    top: animateToTopValue,
    left: center,
  });
}

function checkAnswer() {
  if (person.nationality.toLowerCase() === nationality.toLowerCase()) {
    finalPoint += winPoint;
  } else {
    finalPoint += losePoint;
  }
  updatePointCell();
  resetNationality();
}
function resetNationality() {
  nationality = "";
}
function updatePointCell() {
  $("#point").text(`point: ${finalPoint}`);
}

function initDraggble() {
  let start = {};
  let current = {};
  $("#guess").draggable({
    start: function (e, ui) {
      start.left = e.target.offsetLeft;
      start.top = e.target.offsetTop;
    },
    drag: function (e, ui) {
      current.left = e.target.offsetLeft;
      current.top = e.target.offsetTop;
      if (distance(current, start) > threshold) {
        $("#guess").stop();
      }
    },
    stop: function (e, ui) {
      let end = { left: e.target.offsetLeft, top: e.target.offsetTop };
      if (goToBottomRight(end, start)) {
        $("#guess").stop();

        nationality = $(".box-br").text().toLowerCase();

        animateTo({
          left: $(".box-br")[0].offsetLeft,
          top: $(".box-br")[0].offsetTop,
        });
      } else if (goToTopRight(end, start)) {
        $("#guess").stop();

        nationality = $(".box-tr").text().toLowerCase();
        animateTo({
          left: $(".box-tr")[0].offsetLeft,
          top: $(".box-tr")[0].offsetTop,
        });
      } else if (goToTopLeft(end, start)) {
        $("#guess").stop();
        nationality = $(".box-tl").text().toLowerCase();
        animateTo({
          left: $(".box-tl")[0].offsetLeft,
          top: $(".box-tl")[0].offsetTop,
        });
      } else if (goToBottomLeft(end, start)) {
        $("#guess").stop();
        nationality = $(".box-bl").text().toLowerCase();
        animateTo({
          top: $(".box-bl")[0].offsetTop,
          left: $(".box-bl")[0].offsetLeft,
        });
      }
    },
  });
}
function enableDrag() {
  $("#guess").draggable("enable");
}
function showResult() {
  alert(`POINT: ${finalPoint}`);
}

function resetGame() {
  gameCounter = 0;
  finalPoint = 0;
  updatePointCell();
  updateGameCounterCell();
  $("#guess").stop(true);
  init();
}

function updateGameCounterCell() {
  $("#gameCounter").text(`rounds: ${gameCounter}`);
}
function init() {
  $("#guess").css({
    top: animationRoute.start.top,
    left: center,
  });
  initPerson();
}
function animateTo(point) {
  $("#guess").animate(
    {
      left: point.left,
      top: point.top,
    },
    fadingTimeMS,
    function () {
      checkAnswer();
      increaseGameCounter();
      checkGameStatus();
    }
  );
}
function increaseGameCounter() {
  gameCounter++;
  updateGameCounterCell();
}
function checkGameStatus() {
  if (gameCounter >= rounds) {
    setTimeout(function () {
      if (confirm(`You point is : ${finalPoint} Play Again?`)) {
        resetGame();
      } else {
        location.reload();
      }
    }, 500);
  } else {
    init();
    animateTo({
      top: animateToTopValue,
      left: center,
    });
  }
}

function distance(end, start) {
  let y = Math.pow(end.top - start.top, 2);
  let x = Math.pow(end.left - start.left, 2);
  return Math.sqrt(x + y);
}

function movedRight(end, start) {
  return end.left - start.left > 0;
}

function movedDown(end, start) {
  return end.top - start.top > 0;
}

function goToBottomRight(end, start) {
  return (
    movedDown(end, start) &&
    movedRight(end, start) &&
    distance(end, start) > threshold
  );
}

function goToTopRight(end, start) {
  return (
    !movedDown(end, start) &&
    movedRight(end, start) &&
    distance(end, start) > threshold
  );
}

function goToTopLeft(end, start) {
  return (
    !movedDown(end, start) &&
    !movedRight(end, start) &&
    distance(end, start) > threshold
  );
}

function goToBottomLeft(end, start) {
  return (
    movedDown(end, start) &&
    !movedRight(end, start) &&
    distance(end, start) > threshold
  );
}
