import { GroupSide } from "@farsantes/common";
import Blob, { ClickState } from "../../model/Blob";
import styles from "./HoverState.module.scss"
interface HoverBar {
    size: number;
    hoverState: ClickState;
}

interface HoverStateProps {
    blobs: Blob[];
    side: GroupSide;
}

export default function HoverState({ blobs, side }: HoverStateProps): React.ReactNode {
    if (blobs.length === 0) return null;
    const bars = [];
    let currentBar = { size: 1, hoverState: blobs[0].currentAccusationState }

    blobs.slice(1).forEach((blob) => {
        if (blob.currentAccusationState === currentBar.hoverState) {
            currentBar.size++;
        } else {
            bars.push(currentBar)
            currentBar = { size: 1, hoverState: blob.currentAccusationState }
        }
    })

    bars.push(currentBar)

    const barElement = (bar: HoverBar) => {

        return <div style={{
            flexBasis: `${bar.size / blobs.length * 100}%`
        }}
            className={`${styles.hoverBar} ${styles[bar.hoverState]}`} />
    }
    return (
        <div className={`${styles.hoverBarsContainer} ${styles[side]}`}>
            {bars.map(barElement)}
        </div>)
}