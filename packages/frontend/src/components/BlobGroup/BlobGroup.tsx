import styles from "./BlobGroup.module.scss";
import Blob from "../../model/Blob";
import { GroupSide } from "@farsantes/common";
import { Fragment } from "react/jsx-runtime";
import HoverState from "../HoverState/HoverState";
import { JSX } from "react";

interface BlobGroupProps {
  blobs: Blob[];
  side: GroupSide;
}

export default function BlobGroup({ blobs, side }: BlobGroupProps): JSX.Element {
  return (
    <div key={`group-${side}`} className={`${styles.blobGroup} ${styles[side]}`}>
      {blobs.map((blob: Blob, index: number) => (
        <Fragment key={`blob-${index}`}>{blob.card}</Fragment>
      ))}
      <HoverState blobs={blobs} side={side} />
    </div>

  );
}