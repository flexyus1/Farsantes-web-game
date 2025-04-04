import Blob from "@/model/Blob";
import { BlobColor, Clue, GroupSide } from "@farsantes/common";

const genericHints: string[] = [
    "Lembre-se: Nem todo blob fala a verdade. Fique atento aos 'Falsos'!",
    "Compare as dicas. Elas se confirmam ou entram em conflito?",
    "O que palavras como 'todos', 'algum', 'nenhum' ou 'apenas X' realmente significam?",
    "Tente eliminar possibilidades. O que um blob definitivamente *não* pode ser?",
    "Concentre-se no que você tem certeza primeiro. Use isso como base.",
    "Às vezes, a chave está em como as dicas sobre 'cores' se relacionam.",
    "Uma dica 'Leal' é uma verdade absoluta. Use-a sem medo!",
    "Uma dica 'Falsa' significa que a afirmação é mentira. Como você pode usar essa informação?",
    "O que significa 'aqui' e 'lá'? Depende de quem está falando!",
    "Não tenha medo de testar uma hipótese. Se ela levar a um erro, você aprendeu algo.",
    "Organizar as informações pode ajudar. Já tentou anotar ou marcar?",
    "Releia uma dica que pareceu confusa. Talvez você note um detalhe novo.",
    "Verifique se alguma combinação de informações leva a uma contradição lógica.",
];

export function getRandomGenericHint(): string {
    if (genericHints.length === 0) {
        return "Sem dicas por agora!";
    }
    const randomIndex = Math.floor(Math.random() * genericHints.length);
    return genericHints[randomIndex];
}

export function getSmartHint(blobs: Blob[]): string {
    // Extrai as clues de dentro dos blobs
    const clues: Clue[] = blobs.map(blob => blob.clue);
    // Tenta gerar dica dinâmica
    const dynamicHint = generateDynamicHint(blobs, clues);
    if (dynamicHint && Math.random() < 1) {
        return dynamicHint;
    } else {
        return getRandomGenericHint();
    }
}

function generateDynamicHint(blobs: Blob[], clues: Clue[]): string | null {
    if (clues.length === 0 || blobs.length === 0) {
        return null; // Sem dados para analisar
    }

    const possibleHints: string[] = [];
    const totalBlobs = blobs.length;

    const clueCounts = { color: 0, side: 0, specific: 0, all: 0 };
    const colorMentions: { [key in BlobColor]?: number } = {};
    const sideMentions: { [key in GroupSide]?: number } = {};
    let hasStrictQuantifier = false;
    const specificTargets: string[] = [];

    for (const clue of clues) {
        clueCounts[clue.clueType]++;
        if (clue.clueType === 'color') {
            colorMentions[clue.targetedColor] = (colorMentions[clue.targetedColor] || 0) + 1;
            if (clue.target.type === 'all' || (clue.target.type === 'range' && clue.target.min === clue.target.max)) hasStrictQuantifier = true;
        } else if (clue.clueType === 'side') {
            sideMentions[clue.targetedSide] = (sideMentions[clue.targetedSide] || 0) + 1;
            if (clue.target.type === 'all' || (clue.target.type === 'range' && clue.target.min === clue.target.max)) hasStrictQuantifier = true;
        } else if (clue.clueType === 'specific') {
            specificTargets.push(clue.targetedName);
        } else if (clue.clueType === 'all') {
            hasStrictQuantifier = true;
        }
    }

    //Foco no tipo predominante
    const maxCount = Math.max(...Object.values(clueCounts));
    if (maxCount > 1) {
        if (clueCounts.color === maxCount) possibleHints.push(`As cores parecem importantes (${clueCounts.color} dicas). Já cruzou essas informações?`);
        if (clueCounts.side === maxCount) possibleHints.push(`Várias dicas mencionam lados (${clueCounts.side}). A posição relativa é chave.`);
    }

    //Lembrete sobre quantificadores
    if (hasStrictQuantifier) {
        possibleHints.push("Alguma dica usa 'todos' ou apenas 'X'? Lembre o que isso implica para os *outros* blobs.");
    }

    //Clues específicas
    if (specificTargets.length > 0) {
        const randomTarget = specificTargets[Math.floor(Math.random() * specificTargets.length)];
        possibleHints.push(`A dica sobre '${randomTarget}' é bem direta. Como ela se encaixa?`);
    }

    // Comparação de clues sobre mesma propriedade (exemplo para cores)
    for (const color in colorMentions) {
        if ((colorMentions[color as BlobColor] || 0) > 1) {
            possibleHints.push(`Compare as dicas sobre a cor ${color}. Elas concordam ou conflitam?`);
            break;
        }
    }

    //Contagem vs Total
    if (totalBlobs > 1) {
        possibleHints.push(`Existem ${totalBlobs} blobs no total. As contagens sugeridas pelas dicas batem?`);
    }

    //Informação Rara (exemplo para cores)
    const rareColors = Object.entries(colorMentions).filter(([_, count]) => count === 1);
    if (rareColors.length > 0) {
        const [rareColor] = rareColors[Math.floor(Math.random() * rareColors.length)];
        possibleHints.push(`A cor ${rareColor} foi mencionada só uma vez. Isso pode ser uma pista valiosa...`);
    }

    if (possibleHints.length > 0) {
        // Escolhe aleatoriamente uma das dicas dinâmicas possíveis
        const randomIndex = Math.floor(Math.random() * possibleHints.length);
        return possibleHints[randomIndex];
    }
    // Se não houver dicas dinâmicas, retorna null
    return null;
}