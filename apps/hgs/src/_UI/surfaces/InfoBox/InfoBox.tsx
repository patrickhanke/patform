import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import styles from './Infobox.module.scss';

type InfoBoxComponent = {
	content?: () => React.ReactElement,
	text?: string,
	color?: 'red' | 'green'
}

const InfoBox = ({content, text, color = 'green'}: InfoBoxComponent) => (
	<div className={styles.infobox_container} data-color={color}>
		{content ? 
			content() 
			:
			<p>
				<span className={styles.infobox_icon}>
					<AiOutlineInfoCircle />
				</span> 
				{text && text }
			</p>
		}
	</div>
);

export default InfoBox;