import StatementText from "../BlobText/StatementText";
import styles from "./BlobCard.module.scss"
import NameLabel from "../NameLabel/NameLabel";
import BlobSprite from "../BlobSprite/BlobSprite";
import { groupSide } from "../../imports/imports";
import Blob, { ClickState } from "../../model/Blob";
import { BlobIsTargeted } from "../../utils/blobMessageUtils";
import trueImage from "../../../public/img/checkMark/green_check_button.svg"
import falseImage from "../../../public/img/checkMark/red_check_button.svg"


interface BlobCardProps {
  blob: Blob;
}

export default function BlobCard({ blob }: BlobCardProps): JSX.Element {
  const side = blob.side || groupSide.LEFT;
  const flipCard = side === groupSide.RIGHT

  let blobCardStyle = `${styles.blobCard} ${styles[side]} ${styles[setCardBackground(blob.clickState, blob.hoverState)]}`

  function setCardBackground(clickState: ClickState, backgroundColor: ClickState) {
    if (clickState === ClickState.NONE) {
      return backgroundColor
    }

    return clickState
  }

  const onClick = () => {
    blob.mutateSelf((blobItem: Blob) => {
      blobItem.nextClickState();
      return new Blob(blobItem);
    })
  }

  const onMouseEnter = () => {

    blob.mutateAll((blobItem: Blob) => {
      const isTargeted = BlobIsTargeted(blob.clue, blobItem);
      if (isTargeted) {
        const newColor = blob.clue.assertionType ? ClickState.GREEN : ClickState.RED;
        blobItem.hoverState = newColor;

        return new Blob(blobItem);
      }
      return blobItem;
    })
  }
  const onMouseLeave = () => {

    blob.mutateAll((blobItem: Blob) => {


      if (blobItem.hoverState === ClickState.NONE) {
        return blobItem;
      }
      blobItem.hoverState = ClickState.NONE;
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


