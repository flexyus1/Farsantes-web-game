import styles from "../BlobText/StatementText.module.scss"
import { Blob, Clue, ClueTarget, BlobColor, BlobIntegrity, GroupSide } from "@farsantes/common";

interface StatementTextProps {
  clue: Clue;
  side: GroupSide | null;
}

export default function StatementText({ side, clue }: StatementTextProps) {
  return (
    <div className={styles.textContainer}>
      {getBlobText(side, clue)}
    </div>
  )
}

export function getBlobText(blobSide: GroupSide | null, clue: Clue) {
  const booleanType = clue.assertionType
  const isPlural = getIsPlural(clue);

  if (clue.clueType === "color") {
    const verbText = getVerbText(isPlural);
    const amountText = getAmountText(clue.target);
    const colorText = getColorText(clue.targetedColor, isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    return (<>
      <line>{firstToUpper(amountText)}</line>
      <line>{colorText}</line>
      <line>{verbText} <span className={booleanType ? "true" : "false"}>{booleanText}</span></line>
    </>)
  }

  if (clue.clueType === "side") {
    const prefix = getSidePrefix(clue.targetedSide, blobSide);
    const sideText = getSideText(clue.targetedSide);
    const amountText = getAmountText(clue.target);
    const verbText = getVerbText(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    return (<>
      <line>{firstToUpper(prefix)} {sideText}</line>
      <line>{amountText}</line>
      <line>{verbText} <span className={booleanType ? "true" : "false"}>{booleanText}</span></line>
    </>)
  }

  if (clue.clueType === "specific") {
    const verbText = getVerbText(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    return (<>
      <line>{clue.targetedName}</line>
      <line>{verbText} <span className={booleanType ? "true" : "false"}>{booleanText}</span></line>
    </>)
  }

  if (clue.clueType === "all") {
    const prefix = getAllPrefix(isPlural);
    const booleanText = getIntegrityText(booleanType, isPlural);

    return (<>
      <line>{firstToUpper(prefix)}</line>
      <line>apenas</line>
      <line>{clue.amount} <span className={booleanType ? "true" : "false"}>{booleanText}</span></line>
    </>)
  }

  return <></>
}

export function getAllPrefix(isPlural: boolean): string {
  return isPlural ? "existem" : "existe";
}

export function getIsPlural(clue: Clue): boolean {
  if (clue.clueType === "color" || clue.clueType === "side") {
    if (clue.target.type === "all") {
      return true;
    }
    if (clue.target.type === "range") {
      if (clue.target.max === 1) {
        return false
      }
      return true
    }
  } else if (clue.clueType === "specific") {
    return false;
  } else if (clue.clueType === "all") {
    return clue.amount !== 1;
  }
  return false
}

export function getAmountText(amount: ClueTarget): string {
  if (amount.type === "all") {
    return "todos";
  }
  if (amount.type === "some") {
    return "algum";
  }
  if (amount.type === "range") {
    if (amount.min === amount.max) {
      return "apenas " + amount.min.toString();
    }
    return `entre ${amount.min} a ${amount.max}`;
  }
  return "";
}

export function getColorText(color: BlobColor, isPlural: boolean): string {
  if (color === "orange") {
    return isPlural ? "Laranjas" : "Laranja";
  }
  if (color === "red") {
    return isPlural ? "Vermelhos" : "Vermelho";
  }
  if (color === "blue") {
    return isPlural ? "Azuis" : "Azul";
  }
  if (color === "green") {
    return isPlural ? "Verdes" : "Verde";
  }
  return "";
}

export function getIntegrityText(blobIntegrity: BlobIntegrity, isPlural: boolean): string {
  if (blobIntegrity) {
    return isPlural ? "Leais" : "Leal";
  } else {
    return isPlural ? "Falsos" : "Falso";
  }
}

export function getSidePrefix(side: string | undefined, blobSide: GroupSide | null): string {
  if (blobSide === undefined) {
    return "";
  }
  if (blobSide === side) {
    return "aqui";
  } else {
    return "lá";
  }
}

export function getSideText(side: string): string {
  if (side === "top") {
    return "acima";
  }
  if (side === "bottom") {
    return "abaixo";
  }
  if (side === "left") {
    return "na esquerda";
  }
  if (side === "right") {
    return "na direita";
  }
  return "";
}

export function getVerbText(isPlural: boolean): string {
  return isPlural ? "são" : "é";
}

export function firstToUpper(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// Checks if the blob we're looking at is the target of the clue
// Returns "true", "maybe", or "false"
// True = Clue says it IS what it suggest
// Maybe = Clue says it CAN BE what it suggest
// False = Clue says nothing about it
export function BlobNameIsTargeted(clue: Clue, targetName: string, blobsMap: Map<string, Blob>): boolean {
  const target = blobsMap.get(targetName);
  if (!target) return false;

  if (clue.clueType === "color") {
    return target.color === clue.targetedColor;
  }

  if (clue.clueType === "side") {
    return target.side === clue.targetedSide;
  }

  if (clue.clueType === "specific") {
    return target.name === clue.targetedName
  }

  return false;
}