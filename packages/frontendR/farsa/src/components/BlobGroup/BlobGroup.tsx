import styles from "./BlobGroup.module.scss";
import Blob from "./../../model/Blob"
import { GroupSide } from "@farsantes/common";


interface BlobGroupProps {
  blobs: Blob[]
  side: GroupSide
}

export default function BlobGroup({ blobs, side }: BlobGroupProps): JSX.Element {
  return (
    <div className={`${styles.blobGroup} ${styles[side]}`}>
      {blobs.map((blob: Blob) => blob.card)}
    </div>
  )
}