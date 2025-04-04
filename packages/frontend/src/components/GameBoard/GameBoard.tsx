import { useEffect } from "react";
import BlobGroup from "../BlobGroup/BlobGroup";
import styles from "./GameBoard.module.scss";
import Blob from "../../model/Blob";
import { groupSide, Level } from "@farsantes/common";
import SendButton from "../SendButton/SendButton";

interface GameBoardProps {
  level: Level;
  blobs: Blob[];
  setBlobs: React.Dispatch<React.SetStateAction<Blob[]>>;
}

export default function GameBoard({ level, blobs, setBlobs }: GameBoardProps) {
  useEffect(() => {
    // Se você ainda quiser criar instâncias de Blob aqui, só lembrar
    // de chamar setBlobs(...) para atualizar o estado no App.
    // Ou você faz isso diretamente no App.
  }, [level, setBlobs]);

  const { left: leftSide, right: rightSide, bottom: bottomSide } = organizeSides(blobs);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.middleRow}>
          <BlobGroup blobs={leftSide} side={groupSide.LEFT} />
          <BlobGroup blobs={rightSide} side={groupSide.RIGHT} />
        </div>
        <BlobGroup blobs={bottomSide} side={groupSide.BOTTOM} />
      </div>

      <div className={styles.bottomControlsContainer}>
        <SendButton blobs={blobs} />
        {/* HintButton foi removido daqui! */}
      </div>
    </>
  );
}

function organizeSides(blobs: Blob[]) {
  const left: Blob[] = [];
  const right: Blob[] = [];
  const bottom: Blob[] = [];

  blobs.forEach((blob) => {
    if (blob.side === groupSide.LEFT) {
      left.push(blob);
    } else if (blob.side === groupSide.RIGHT) {
      right.push(blob);
    } else if (blob.side === groupSide.BOTTOM) {
      bottom.push(blob);
    }
  });

  return { left, right, bottom };
}
