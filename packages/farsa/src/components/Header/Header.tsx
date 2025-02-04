import logo from "../../../public/img/title/title-white.png"
import genericMenu from "../../../public/img/menu/OIP.jpeg"
import styles from "./Header.module.scss"
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.item}>
        <img src={genericMenu} alt="" />
      </div>
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.quantity}>
        <p >1 - 2 Falsos</p>
      </div>
    </header>
  )
}

