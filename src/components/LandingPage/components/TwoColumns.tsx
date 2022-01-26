import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Styles';

const TwoColumns = ({columnOne, columnTwo}): JSX.Element => {

    const [showText, setShowText] = useState(true);

    const enterCaptureAndSend = () => {        
        setShowText(false);
    }

    return (
        <div className={styles.TwoColumns} onMouseEnter={enterCaptureAndSend}>
        <div className={clsx(styles.column, styles.last, styles.right) + ((showText && (columnOne.type !== 'img' && columnOne.props.title)) ? '   transition-right' : '')}>
            {columnOne}
        </div>
        <div className={clsx(styles.column, styles.first, styles.left) + ((showText && (columnTwo.type !== 'img' && columnTwo.props.title)) ? '   transition-left' : '')}>
            {columnTwo}
        </div>
        </div>
    );
};

export default TwoColumns;