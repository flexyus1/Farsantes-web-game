import { Blob } from "@farsantes/common";
import { firstToUpper, getAmountText, getColorText, getIntegrityText, getIsPlural, getSidePrefix, getSideText, getVerbText } from "./utils";

export function getBlobText(blob: Blob): string {
  const booleanType = blob.clue.assertionType;
  const clue = blob.clue;
  const isPlural = getIsPlural(clue);

  if (clue.clueType === "color") {
    const verbText = getVerbText(isPlural);
    const amountText = getAmountText(clue.target);
    const colorText = getColorText(clue.targetedColor, isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    const innerHtml = `
        <line>${firstToUpper(amountText)}</line>
        <line>${colorText}</line>
        <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
      `
    return innerHtml;
  }

  if (clue.clueType === "side") {
    const prefix = getSidePrefix(clue.targetedSide, blob);
    const sideText = getSideText(clue.targetedSide);
    const amountText = getAmountText(clue.target);
    const verbText = getVerbText(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    const innerHtml =
      `<line>${firstToUpper(prefix)} ${sideText}</line>
        <line>${amountText}</line>
        <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
        `
    return innerHtml;

  }

  if (clue.clueType === "specific") {
    const verbText = getVerbText(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    const innerHtml =
      `<line>${clue.targetedName}</line>
      <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
      `

    return innerHtml;
  }

  if (clue.clueType === "all") {
    const prefix = getAllPrefix(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    const innerHtml =
      `<line>${firstToUpper(prefix)}</line>
      <line>apenas</line>
      <line>${clue.amount} <${booleanType}>${booleanText}</${booleanType}></line>
      `

    return innerHtml;
  }

  return "";
}

export function getAllPrefix(isPlural: boolean): string {
  return isPlural ? "existem" : "existe";
}

// ############################
//          ColorClue
// Todos            são      
// Algum            é        
// 1 a 3            é/são
// 2                é                        
//        Laranjas             
//        Vermelhos
//        Azuis
//        Verdes
//                      Falsos
//                      Leais

// ############################
//          SideClue
// Lá   
// Aqui 
//      abaixo      
//      acima       
//      na esquerda 
//      na direita 
//                  Todos são
//                  Algum é
//                  1 a 3 
//                            Falsos
//                            Leais

// ############################
//         SpecificClue
// Pedro é 
//         Falso
//         Leal

// ############################
//           AllClue
// Existem 1 a 3 Falsos
// ############################