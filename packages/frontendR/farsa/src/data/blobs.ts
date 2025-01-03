import { Level } from "@farsantes/common"

interface LiarCount {
  min: number;
  max: number;
  isRevealed: boolean;
}

interface LevelData {
  level: Level;
  liarCount: LiarCount
}

export const levelData: LevelData = {
  level: {
    name: "O Mapa oculto de Lucas",
    minimumLiars: 1,
    maximumLiars: 4,
    blobs: [
      {
        name: "Miki",
        color: "orange",
        clue: {
          clueType: "all",
          amount: 2,
          assertionType: false
        },
        side: "left"
      },
      {
        name: "Lucas",
        color: "blue",
        clue: {
          clueType: "all",
          amount: 3,
          assertionType: false
        },
        side: "left"
      },
      {
        name: "Lolita",
        color: "green",
        clue: {
          clueType: "specific",
          targetedName: "Teco",
          assertionType: false
        },
        side: "left"
      },
      {
        name: "Gummy",
        color: "green",
        clue: {
          clueType: "color",
          targetedColor: "red",
          target: {
            type: "some"
          },
          assertionType: true
        },
        side: "bottom"
      },
      {
        name: "Peludo",
        color: "red",
        clue: {
          clueType: "color",
          targetedColor: "green",
          target: {
            type: "range",
            min: 1,
            max: 2
          },
          assertionType: true
        },
        side: "bottom"
      },
      {
        name: "Pipo",
        color: "blue",
        clue: {
          clueType: "specific",
          targetedName: "Lucas",
          assertionType: true
        },
        side: "bottom"
      },
      {
        name: "Moti",
        color: "red",
        clue: {
          clueType: "side",
          targetedSide: "left",
          target: {
            type: "all"
          },
          assertionType: true
        },
        side: "right"
      },
      {
        name: "Alvin",
        color: "blue",
        clue: {
          clueType: "color",
          targetedColor: "red",
          target: {
            type: "range",
            min: 1,
            max: 2
          },
          assertionType: true
        },
        side: "right"
      },
      {
        name: "Teco",
        color: "blue",
        clue: {
          clueType: "side",
          targetedSide: "bottom",
          target: {
            type: "some"
          },
          assertionType: true
        },
        side: "right"
      }
    ],
    seed: "1121599470"
  },
  liarCount: {
    min: 1,
    max: 4,
    isRevealed: false
  }
}