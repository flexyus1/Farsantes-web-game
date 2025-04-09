import { useState, useEffect } from 'react';
import styles from './Hints.module.scss';

interface HintButtonProps {
    getHintFunction: () => string;
}

export function HintButton({ getHintFunction }: HintButtonProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const handleShowHint = () => {
        const newHint = getHintFunction();
        setCurrentHint(newHint);
        setIsExpanded(true);
        setIsCollapsing(false);
    };

    const handleMouseLeave = () => {
        if (isExpanded) {
            setIsCollapsing(true);
        }
    };

    useEffect(() => {
        let timer: number;
        if (isCollapsing) {
            timer = window.setTimeout(() => {
                setIsExpanded(false);
                setIsCollapsing(false);
            }, 400);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isCollapsing]);

    return (
        <div className={styles.helpContainer}>
            <button
                className={`${styles.helpButton} ${isExpanded ? styles.expandedHint : ''} ${isCollapsing ? styles.collapsing : ''}`}
                onClick={handleShowHint}
                onMouseLeave={handleMouseLeave}>
                {isExpanded ? (
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
