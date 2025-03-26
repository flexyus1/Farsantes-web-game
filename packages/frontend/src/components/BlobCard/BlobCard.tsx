import StatementText from "../BlobText/StatementText";
import styles from "./BlobCard.module.scss"
import NameLabel from "../NameLabel/NameLabel";
import BlobSprite from "../BlobSprite/BlobSprite";
import Blob, { ClickState } from "../../model/Blob";
import { BlobIsTargeted } from "../../utils/blobMessageUtils";
import trueImage from "../../../public/img/checkMark/green_check_button.svg"
import falseImage from "../../../public/img/checkMark/red_check_button.svg"
import { JSX, useEffect } from "react";
import { groupSide } from "@farsantes/common";
import { isMobile } from "@/utils/isMobile";


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
      blobItem.nextClickState();
      const todayDate = new Date().toISOString().split('T')[0];
      const clickAtual = blobItem.clickState;
      const blobName = blobItem.name; // getter da classe


      const oldSavedState = localStorage.getItem('dayList');
      let data = {
        date: todayDate,
        blobs: [] as { name: string; state: string }[]
      };

      if (oldSavedState) {
        const json = JSON.parse(oldSavedState);
        if (json.date === todayDate) {
          data.blobs = json.blobs;
        }
      }
      // Verifica se já existe um blob com esse nome na lista
      const existingIndex = data.blobs.findIndex((b) => b.name === blobName);
      if (existingIndex !== -1) {
        // Se já existe, atualiza o estado
        data.blobs[existingIndex].state = clickAtual;
      } else {
        // Se não existe, adiciona novo
        data.blobs.push({ name: blobName, state: clickAtual });
      }
      localStorage.setItem('dayList', JSON.stringify(data));
      return new Blob(blobItem);
    });
  };


  const onMouseEnter = () => {
    if (isMobile()) return;
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

  useEffect(() => {
    const saved = localStorage.getItem("dayList");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    const todayDate = new Date().toISOString().split("T")[0];

    if (parsed.date !== todayDate) return;

    // Procurar pelo estado do blob atual
    const blobData = parsed.blobs.find((b: { name: string }) => b.name === blob.name);

    if (blobData) {
      blob.mutateSelf((blobItem: Blob) => {
        const newBlob = new Blob(blobItem);
        newBlob.clickState = blobData.state;
        return newBlob;
      });
    }
  }, []);

  const onMouseLeave = () => {
    if (isMobile()) return;
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


