import express from 'express';
import path from 'path';
import { difficultyConfigs, difficultyLevel, DifficultyLevel, difficultyLevels, Level, tutorial1 } from '@farsantes/common';
import LevelGenerator from '../../common/dist/LevelGenerator/LevelGenerator';
import LevelManager from '@farsantes/common/dist/LevelManager/LevelManager';
import SimpleRNG from '@farsantes/common/dist/LevelGenerator/SimpleRNG';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use(express.json());
// app.use('/public', express.static(path.join(__dirname, '../../frontend/public')));


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.get('/level/:data', (req, res) => {
  const data = req.params.data;
  if (data === 'tutorial') {
    const level = tutorial1();
    res.json(level);
  }

  const difficulty = data as DifficultyLevel;
  if (difficultyLevels.includes(difficulty)) {
    const level = createLevelByDifficulty(difficulty, 2, 3);
    const difficultyConfig = difficultyConfigs.get(difficulty)!;
    const liarCount = difficultyConfig.liarCount;
    const result = { level, liarCount };
    res.json(result);
  } else {
    res.status(400).send('Invalid difficulty level');
  }
})

app.post("/submit/:data", (req, res) => {
  console.log(req)
  const data = req.params.data;
  const { solution: rawSolution } = req.body as { solution: Map<string, boolean | null> };
  const solution = new Map<string, boolean | null>(Object.entries(rawSolution));
  // res.send("Received");
  let level: Level;
  if (data === 'tutorial') {
    level = tutorial1();
  }
  const difficulty = data as DifficultyLevel;
  if (difficultyLevels.includes(difficulty)) {
    level = createLevelByDifficulty(difficulty, 2, 3);
    const isCorrect = checkSolution(level, solution);
    console.log(isCorrect);
    res.send(`Resposta: ${isCorrect}`);
  } else {
    res.send(`Invalid difficulty level`);
  }

  // console.log(JSON.stringify(solution));
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

function checkSolution(level: Level, solution: Map<string, boolean | null>): boolean {
  const levelManager = new LevelManager(level);
  const { solutions: correctSolutions } = levelManager.findSolutions();
  let isCorrect = false;
  correctSolutions.forEach(correctSolution => {
    let currentSolutionCorrectness = true;
    correctSolution.blobsClassifications.forEach((isTrue, name) => {
      const playerChoice = solution.get(name);
      if (playerChoice !== isTrue) {
        currentSolutionCorrectness = false;
      }
    });
    if (currentSolutionCorrectness) {
      isCorrect = true;
    }
  });
  return isCorrect;
}

function createLevelByDifficulty(
  difficulty: DifficultyLevel,
  minSolutions: number,
  maxSolutions: number
): Level {
  // Get the current date and create an initial seed
  const startDate = Math.floor(Date.now() / (24 * 60 * 60 * 1000)).toString() + difficulty + "s";
  const rng = new SimpleRNG(startDate);
  let attempts = 0;

  while (true) {
    // Calculate the seed based on the current date and increment
    const seed = rng.getSeed().toString();

    attempts++;
    console.log(`Attempt ${attempts} with seed: ${seed}`);

    const generator = new LevelGenerator(difficulty, seed);
    const level = generator.generateRandomLevel();
    const levelManager = new LevelManager(level);
    const { solutions, counter } = levelManager.findSolutions();

    if (solutions.length >= minSolutions && solutions.length <= maxSolutions) {
      console.log(`Success! Solutions found: ${solutions.length}`);
      console.log(JSON.stringify(level.blobs));
      console.log(`Total attempts: ${attempts}`);
      return level;
    } else {
      console.log(`Solutions found: ${solutions.length} (required range: ${minSolutions}-${maxSolutions})`);
      rng.next();
    }

    // Optional: add a delay or break condition to prevent infinite loops
    if (attempts >= 1000) {
      throw new Error("Failed to generate a level after 1000 attempts");
    }
  }
}



