import { JSX, useEffect, useState } from "react";
import BlobGroup from "../BlobGroup/BlobGroup";
import styles from "./GameBoard.module.scss";
import Blob from "../../model/Blob";
import { BlobData } from "../../imports/imports";
import { groupSide, Level } from "@farsantes/common";
import SendButton from "../SendButton/SendButton";

interface GameBoardProps {
  level: Level
}

export default function GameBoard({ level }: GameBoardProps): JSX.Element {
  const [blobs, setBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    const mutateAll = (callback: (blob: Blob) => Blob) => {
      setBlobs((prevBlobs) => prevBlobs.map((blob) => callback(blob)));
    };

    const initialBlobs = level.blobs.map(
      (blobData: BlobData) => new Blob(blobData, mutateAll)
    );
    setBlobs(initialBlobs);
  }, []); // Empty dependency array ensures this runs only once

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
      <div className={styles.sendButtonContainer}>
        <SendButton blobs={blobs} />
      </div>
    </>
  );
}

function organizeSides(blobs: Blob[]): { left: Blob[]; right: Blob[]; bottom: Blob[] } {
  const left: Blob[] = [];
  const right: Blob[] = [];
  const bottom: Blob[] = [];

  blobs.forEach((blob: Blob) => {
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
