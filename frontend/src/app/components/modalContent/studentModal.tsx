import React from 'react';
import styles from './teacherModal.module.scss';

interface Props {
    lessonInformation: any
}


const StudentModal: React.FC<{ onClose: () => void, lessonInformation: any, classId: number }> = (props) => {
    console.log(props.lessonInformation);
    return (
        <div className={styles.teacherModal}>
            {props.lessonInformation}
            {props.classId}
        </div>

    );

};

export { StudentModal };
