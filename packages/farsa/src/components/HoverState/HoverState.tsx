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
    console.log(side)
    let currentBar = { size: 1, hoverState: blobs[0].hoverState }

    blobs.slice(1).forEach((blob) => {
        if (blob.hoverState === currentBar.hoverState) {
            currentBar.size++;
        } else {
            bars.push(currentBar)
            currentBar = { size: 1, hoverState: blob.hoverState }
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