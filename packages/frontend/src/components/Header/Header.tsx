import { Level } from "@farsantes/common";
import logo from "../../../public/img/title/title-white.png";
import styles from "./Header.module.scss";
// Importe o HintButton
import { HintButton } from "../Hints/Hints";

interface HeaderProps {
  level: Level;
  getHintFunction: () => string; // <--- prop para receber a função do App
}

export function getLiarCount(level: Level) {
  const { minimumLiars, maximumLiars } = level;
  if (minimumLiars === maximumLiars) {
    return `Falsos: ${minimumLiars}`;
  }
  return `Falsos: ${minimumLiars} - ${maximumLiars}`;
}

export default function Header({ level, getHintFunction }: HeaderProps) {
  const liarCountText = getLiarCount(level);

  return (
    <header className={styles.header}>
      <HintButton getHintFunction={getHintFunction} />
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>

      <div className={styles.quantity}>
        <p>{liarCountText}</p>
      </div>

    </header>
  );
}
