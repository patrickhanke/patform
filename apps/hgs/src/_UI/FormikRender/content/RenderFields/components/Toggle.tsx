import styles from '../RenderFields.module.scss';
import { ToggleType } from '@/types';

const Toggle = ({toggleState = false, toggleHandler, disabled = false, labelBefore = false}: ToggleType) => {
	return (
		<div className={styles.toggle_content} data-labelbefore={labelBefore} >
			<div
				onClick ={() => {
					if (disabled === false)	{
						toggleHandler(!toggleState);
					}
					return null;
				}}
				className={styles.toggle_container}
			>
				<div className={styles.toggle_container_background} data-disabled={disabled} data-togglestate={toggleState} />
				<div className={styles.toggle_container_circle} data-disabled={disabled} data-togglestate={toggleState}  />
			</div>
		</div>
	);
};

export default Toggle;