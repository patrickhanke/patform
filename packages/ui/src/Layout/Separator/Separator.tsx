import './styles.scss';
import { SeparatorComponent } from './types';

const Separator: SeparatorComponent = ({size, noLine}) => {
	return (
		<div className={`separator ${size}`} data-no-line={noLine}></div>
	);
};

export default Separator;