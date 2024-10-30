import { activitiesPTBR, descriptionsPTBR } from '../constants/randomWords';

export function generateLevelName(blobName: string): string {
  const [randomActivity, activityArticle] = activitiesPTBR[Math.floor(Math.random() * activitiesPTBR.length)];
  const [randomDescription, descriptionArticle] = descriptionsPTBR[Math.floor(Math.random() * descriptionsPTBR.length)];

  // 60% chance of generating a 2-word phrase
  if (Math.random() < 0.6) {
    return `${activityArticle} ${randomActivity} de ${blobName}`;
  } else {
    // 40% chance of generating a 3-word phrase
    return `${activityArticle} ${randomActivity} ${randomDescription.toLowerCase()} de ${blobName}`;
  }
}