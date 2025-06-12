<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Quiz App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="card" class="card">
    <h2 id="question"></h2>
    <ul id="answers"></ul>
    <button id="next" class="hidden">Next</button>
    <div id="score"></div>
    <div id="timer"></div>
  </div>
  <div id="end-screen" class="hidden">
    <h2 id="final-msg"></h2>
  </div>
  <script type="module" src="js/quiz.js"></script>
</body>
</html>
