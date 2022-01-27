import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Styles';

const TwoColumns = ({columnOne, columnTwo, isDisplay}): JSX.Element => {

    return (
        <div className={styles.TwoColumns}>
        <div className={clsx(styles.column, styles.last, styles.right) + ((isDisplay && (columnOne.type != 'img' && columnOne.props.title)) ? '   transition-right' : '')}>
            {columnOne}
        </div>
        <div className={clsx(styles.column, styles.first, styles.left) + ((isDisplay && (columnTwo.type != 'img' && columnTwo.props.title)) ? '   transition-left' : '')}>
            {columnTwo}
        </div>
        </div>
    );
};

export default TwoColumns;