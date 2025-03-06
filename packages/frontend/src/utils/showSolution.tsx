import { BlobIntegrity, blobIntegrity, Level } from "@farsantes/common";
import LevelManager from "@farsantes/common/dist/LevelManager/LevelManager";

export function showSolutionInConsole(level: Level) {
  const levelManager = new LevelManager(level);
  const { solutions } = levelManager.findSolutions();

  // Find fake blobs and truthful blobs
  const allBlobs = new Set<string>();
  const everFakeBlobs = new Set<string>();

  solutions.forEach(solution => {
    solution.blobsClassifications.forEach((blobClassification: BlobIntegrity, name: string) => {
      allBlobs.add(name);
      if (blobClassification === blobIntegrity.FALSE) {
        everFakeBlobs.add(name);
      }
    });
  });

  const truthfulBlobs = Array.from(allBlobs).filter(blob => !everFakeBlobs.has(blob));

  // if (!isDebugEnabled) console.clear()

  // Print solutions
  console.log(`\n%c🧩 ${level.name} 🧩`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');
  console.log(`%cFound ${solutions.length} solution(s)`, 'color: #2196F3; font-weight: bold;');

  solutions.forEach((solution, index) => {
    const fakeBlobs = Array.from(solution.blobsClassifications.entries())
      .filter(([_, type]) => type === blobIntegrity.FALSE)
      .map(([name, _]) => name);

    console.log(`%cSolution ${index + 1}:`, 'color: #FF9800; font-weight: bold;');
    console.log(`  %c${fakeBlobs.join(', ') || 'None'}`, 'color: #F44336; font-weight: bold;');
  });

  // Print truthful blobs
  console.log('\n%cSafe Blobs', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
  if (truthfulBlobs.length > 0) {
    console.log(`  %c${truthfulBlobs.join(', ')}`, 'color: #2196F3; font-weight: bold;');
  } else {
    console.log("%cNo blobs are always truthful across all solutions.", 'color: #F44336;');
  }

  // show level.seed 
  console.log(`\n%cSeed: ${level.seed}`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');

}