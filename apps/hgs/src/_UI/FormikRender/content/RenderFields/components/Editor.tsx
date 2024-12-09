'use client';
import {Editor} from '@/_UI';

import React from 'react';
import '../styles/editor.scss';

const EditorField = ({onChange, value}: {onChange: (T: string) => void, value: string }) => (
	// <div  style={{ maxWidth: width}} className={styles.editor_container} >
	window !== undefined ?
		<Editor
			content={value}
			onChange={(value ) => onChange(value) }
		/>
		:
		null
		
	// </div>
);

export default EditorField;