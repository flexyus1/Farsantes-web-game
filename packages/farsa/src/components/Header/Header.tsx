import logo from "../../../public/img/title/title-white.png"
import genericMenu from "../../../public/img/menu/OIP.jpeg"
import styles from "./Header.module.scss"
import { Level } from "@farsantes/common"

interface HeaderProps {
  level: Level
}

export function getLiarCount(level: Level) {
  const { minimumLiars, maximumLiars } = level

  if (minimumLiars === maximumLiars) {
    return `Falsos: ${minimumLiars}`
  }
  return `Falsos:  ${minimumLiars} - ${maximumLiars}`
}

export default function Header({ level }: HeaderProps) {
  const liarCountText = getLiarCount(level);

  return (
    <header className={styles.header}>
      <div className={styles.item}>
        <img src={genericMenu} alt="" />
      </div>
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.quantity}>
        <p>{liarCountText}</p>
      </div>
    </header>
  )
}

