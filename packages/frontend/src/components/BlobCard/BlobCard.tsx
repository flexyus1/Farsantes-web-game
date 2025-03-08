import StatementText from "../BlobText/StatementText";
import styles from "./BlobCard.module.scss"
import NameLabel from "../NameLabel/NameLabel";
import BlobSprite from "../BlobSprite/BlobSprite";
import Blob, { ClickState } from "../../model/Blob";
import { BlobIsTargeted } from "../../utils/blobMessageUtils";
import trueImage from "../../../public/img/checkMark/green_check_button.svg"
import falseImage from "../../../public/img/checkMark/red_check_button.svg"
import { JSX } from "react";
import { groupSide } from "@farsantes/common";


interface BlobCardProps {
  blob: Blob;
}

export default function BlobCard({ blob }: BlobCardProps): JSX.Element {
  const side = blob.side || groupSide.LEFT;
  const flipCard = side === groupSide.RIGHT;
  const clickStateStyle = styles[blob.clickState];
  const isHoveredStyle = blob.isHovered ? styles.hovered : "";
  let blobCardStyle = `${styles.blobCard} ${styles[side]} ${clickStateStyle} ${isHoveredStyle}`;

  const onClick = () => {
    blob.mutateSelf((blobItem: Blob) => {
      blob.isHovered
      blobItem.nextClickState();
      return new Blob(blobItem);
    })
  }

  const onMouseEnter = () => {

    blob.mutateAll((blobItem: Blob) => {
      if (blobItem.name === blob.name) {
        blob.isHovered = true
      }
      const isTargeted = BlobIsTargeted(blob.clue, blobItem);
      if (isTargeted) {
        const newColor = blob.clue.assertionType ? ClickState.GREEN : ClickState.RED;
        blobItem.currentAccusationState = newColor;
      }
      return new Blob(blobItem);
    })
  }

  const onMouseLeave = () => {

    blob.mutateAll((blobItem: Blob) => {
      if (blobItem.name === blob.name) {
        blob.isHovered = false
      }
      blobItem.currentAccusationState = ClickState.NONE;
      return new Blob(blobItem);
    })
  }
  const image = blob.clickState === ClickState.GREEN ? trueImage : blob.clickState === ClickState.RED ? falseImage : null;

  return (
    <>
      <div key={`blob-${blob.name}`} className={blobCardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
        <div className={styles.blobSide}>
          <BlobSprite color={blob.color} flipped={flipCard} />
          <NameLabel name={blob.name} />
          {image && <img key={blob.clickState} src={image} className={`${styles.stateImage} ${styles.animate}`} />}
        </div>
        <div className={styles.textSide}>
          <StatementText side={side} clue={blob.clue} />
        </div>

      </div>
    </>
  )

}


