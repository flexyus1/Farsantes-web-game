import BlobGroup from "../BlobGroup/BlobGroup";
import { groupSide } from "../../imports/imports";
import styles from "./GameBoard.module.scss";
import { levelData } from "../../data/blobs";
import Blob from "../../model/Blob";
import { BlobData } from "../../imports/imports";

export default function GameBoard(): JSX.Element {
  const blobs = levelData.level.blobs;
  const { left: leftSide, right: rightSide, bottom: bottomSide } = organizeSides(blobs);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.middleRow}>
        <BlobGroup blobs={leftSide} side={groupSide.LEFT} />
        <BlobGroup blobs={rightSide} side={groupSide.RIGHT} />
      </div>
      <BlobGroup blobs={bottomSide} side={groupSide.BOTTOM} />
    </div>
  )
}

function organizeSides(blobs: BlobData[]): { left: Blob[], right: Blob[], bottom: Blob[] } {
  const left: Blob[] = [];
  const right: Blob[] = [];
  const bottom: Blob[] = [];

  blobs.forEach((blob: BlobData) => {
    if (blob.side === groupSide.LEFT) {
      left.push(new Blob(blob));
    }
    if (blob.side === groupSide.RIGHT) {
      right.push(new Blob(blob));
    }
    if (blob.side === groupSide.BOTTOM) {
      bottom.push(new Blob(blob));
    }
  });

  return { left, right, bottom };
}