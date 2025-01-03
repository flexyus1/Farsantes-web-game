import Body from "./Body";
import Hat from "./Hat";
import styles from "../BlobSprite/blobSprite.module.scss"
import { BlobColor } from "@farsantes/common";

export interface BlobContainerProps {
    color: BlobColor
}

export default function BlobContainer({ color }: BlobContainerProps) {
    return (
        <div className={`${styles.blobContainer}  ${styles[color]}`}>
            <Hat />
            <Body />
        </div>
    )
}