import { BlobColor } from "@farsantes/common";
import styles from "./BlobSprite.module.scss"
import Body from "./Body";
import Hat from "./Hat";

export interface BlobSpriteProps {
  color: BlobColor
  flipped?: boolean
}

export default function BlobSprite({ color, flipped }: BlobSpriteProps) {
  const flippedStyles = flipped ? styles.flipped : "";
  return (
    <div className={`${styles.blobSprite} ${styles[color]} ${flippedStyles} `}>
      <Hat />
      <Body />
    </div>
  );
}