import styles from "../NameLabel/NameLabel.module.scss"

export interface NameProps {
    name: string
}

export default function NameLabel({ name }: NameProps) {
    return (
        <>
            <div className={styles.nameLabel}>{name}</div>
        </>
    )
}