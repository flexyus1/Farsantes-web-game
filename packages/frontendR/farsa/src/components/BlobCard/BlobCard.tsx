import BlobContainer from "../BlobSprite/BlobContainer";
import StatementText from "../BlobText/StatementText";
import styles from "./BlobCard.module.scss"
import NameLabel from "../NameLabel/NameLabel";
import { BlobColor, Clue, GroupSide } from "@farsantes/common";

interface BlobCardProps {
    color: BlobColor;
    name: string;
    side: GroupSide;
    clue: Clue;
}

export default function BlobCard({ color, name, side, clue }: BlobCardProps): JSX.Element {
    console.log(side);
    return (
        <>
            <div className={`${styles.blobCard} ${styles[side]}`}>
                <div className={styles.blobSide}>
                    <BlobContainer color={color} />
                    <NameLabel name={name} />
                </div>
                <div className={styles.textSide}>
                    <StatementText side={side} clue={clue} />
                </div>
            </div>
        </>
    )
}
