import { useState, JSX } from 'react';
import styles from './Hints.module.scss';

interface HintButtonProps {
    getHintFunction: () => string;
}

export function HintButton({ getHintFunction }: HintButtonProps): JSX.Element {
    const [isHintVisible, setIsHintVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState<string | null>(null);

    const handleShowHint = () => {
        // Obtém a dica e exibe
        const newHint = getHintFunction();
        setCurrentHint(newHint);
        setIsHintVisible(true);
    };

    const handleMouseLeave = () => {
        // Quando sai do botão, ele volta ao tamanho original
        setIsHintVisible(false);
    };

    return (
        <div className={styles.helpContainer}>
            <button
                className={`${styles.helpButton} ${isHintVisible ? styles.expandedHint : ''}`}
                onClick={handleShowHint}
                onMouseLeave={handleMouseLeave} >
                {isHintVisible ? (
                    <div className={styles.hintContent}>
                        <p>{currentHint}</p>
                    </div>
                ) : (
                    '?'
                )}
            </button>
        </div>
    );
}
