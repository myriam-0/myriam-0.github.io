const audios = {
  intro:   "https://assets.codepen.io/5700655/FINAL20PYTHON.m4a",
};

const audio = new Audio(audios['intro'])
const questions = [ 
  {   
    title: "Were you paying attention?",
    question: "In which year was I created?",
    a: "1989",
    b: "1992",
    correct: "a",
  },  
  {   
    title: "Let’s test your attention skills!",
    question: "What is guido’s background?",
    a: "Maths",
    b: "Cmps",
    correct: "a",
  },  
  {   
    title: "You thought this was just a game didn't you?",
    question: "I am a multi purpose, interpreted language with a __ syntax ?",
    a: "Simple",
    b: "Dynamic",
    correct: "b",
  },  
  {   
    title: "Let’s test your attention span",
    question: "\"You can write me and share me with whoever you please\"\n Defines which feature?",
    a: "Portability",
    b: "Huge Libraries",
    correct: "a",
  },  
  {   
    title: "Of course I was going to quiz you! ",
    question: "I am a/an __ __?",
    a: "Open source",
    b: "Closed source",
    correct: "a",
  },  
  {   
    title: "Having fun? Quiz time!",
    question: "Why was I not loved at first?",
    a: "I am Complicated",
    b: "I am Slow",
    correct: "b", 
  },
  
  {   
    title: "You lost! Quiz time :D!",
    question: "Why did I become popular?",
    a: "I make the work more productive",
    b: "I am quick",
    correct: "a", 
  },
  
    {   
    title: "Let's see if you are a multitasker",
    question: "An open source means??",
    a: "Open for everybody to use",
    b: "a paid software",
    correct: "a", 
  },
  
  
]


function stop_audio() {
  audio.pause();
  audio.load();
}

function play_audio() {
  audio.play();
}

$(document).ready(function () {
  // Canvas variables
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var w = $("#canvas").width();
  var h = $("#canvas").height();

  // Game variables
  var food;
  var score;
  var level;
  var snake_array;
  var cw = 20;
  var d;
  var game_done = false;

  // Initial GameSetup Function
  function initial() {
    d = "right";
    score = 0;
    level = 1;
    game_done = false;
    create_snake();
    create_food();

    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 100);
  }
  initial();

  // Create Snake Function
  function create_snake() {
    var length = 5;
    snake_array = [];

    for (var i = length - 1; i >= 0; i--) {
      snake_array.push({ x: i, y: 0 });
    }
  }

  // Create Food Function
  function create_food() {
    food = {
      x: Math.round((Math.random() * (w - cw)) / cw),
      y: Math.round((Math.random() * (h - cw)) / cw)
    };
  }

  // Create Paint Function
  function paint() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "neongreen";

    // create movement of snake
    var head_x = snake_array[0].x;
    var head_y = snake_array[0].y;

    if (d == "right") head_x++;
    else if (d == "left") head_x--;
    else if (d == "up") head_y++;
    else if (d == "down") head_y--;

    // when to restart game
    if (
      (head_x == -1 ||
      head_x == w / cw ||
      head_y == -1 ||
      head_y == h / cw ||
      collision(head_x, head_y, snake_array)) &&
      !game_done
    ) {
      game_done = true
      stop_audio();
      var question = questions[Math.floor(Math.random()*(questions.length))]
      $("#modal").removeClass("hidden")
      $('#result').addClass("hidden")
      $('#game').addClass("hidden")
      $("#title").text(question.title)
      $("#question").text(question.question)
      $('#choice-a').next('label').text(question.a)
      $('#choice-b').next('label').text(question.b)
      var result = "You chose the "
      $('input[name="choices"]').attr("checked", false)
      $('#answer').click(()=> {
        if(question.correct === $('input[name="choices"]:checked').val()) {
          result = result + "Correct answer!"
        } else {
          result = result + "Wrong answer!"
        }
        $('#result').removeClass("hidden")
        $('#result').text(result)
        $('#game').removeClass("hidden")
      })
      
      $('#game').click(() => {
        $("#modal").addClass("hidden")
        initial()
        
      })
      return;
    }

    if (head_x == food.x && head_y == food.y) {
      var tail = { x: head_x, y: head_y };
      play_audio();
      score++;
      create_food();
    } else {
      var tail = snake_array.pop();
      tail.x = head_x;
      tail.y = head_y;
    }

    snake_array.unshift(tail);

    for (var i = 0; i < snake_array.length; i++) {
      var c = snake_array[i];
      paint_cell(c.x, c.y, "lightblue");
    }

    paint_food(food.x, food.y);

    var score_text = "Score: " + score;
    var level_text = "Level: " + level;
    ctx.fillText(score_text, 5, h - 5);
    ctx.fillText(level_text, 100, h -5);
    ctx.font = "20px Verdana";
  }

  // Create Paint Cell Function
  function paint_cell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
  }
  
  function paint_food(x, y) {
    const image = document.getElementById('apple-img');
    ctx.drawImage(image, x * cw - cw / 2, y * cw - cw, cw * 2, cw * 2.5);
  }

  // Create collision check function
  function collision(x, y, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].x == x && array[i].y == y) return true;
    }
    return false;
  }

  function direction(x, y) {
    var head_x = snake_array[0].x * cw;
    var head_y = snake_array[0].y * cw;
    var displacement_x = Math.abs(x - head_x);
    var displacement_y = Math.abs(y - head_y);
    if(displacement_x > displacement_y && d != "right" && d != "left") {
      if(x < head_x && d != "right") {
        return "left";
      } else if (x > head_x && d != "left") {
        return "right";
      }
    } else if(d != "up" && d != "down"){
      if (y > head_y && d != "down") {
        return "up";
      } else if(y < head_y && d != "up"){
        return "down";
      }
    }
    return d;
  }
  $(document).on("touchstart", function(e) {
    e.preventDefault();
    touchEvent = e.originalEvent.touches[0]
    d = direction(touchEvent.pageX, touchEvent.pageY)
  })


  $(document).keydown(function (e) {
    var key = e.which;

    if (key == "37" && d != "right") d = "left";
    else if (key == "38" && d != "up") d = "down";
    else if (key == "39" && d != "left") d = "right";
    else if (key == "40" && d != "down") d = "up";
  });
});

