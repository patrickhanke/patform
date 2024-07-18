import { BsPlusCircleDotted } from 'react-icons/bs';
import './styles.scss';

type CreateButtonType = {
    onClick: (t?: any) => void,
    text: string,
    size: 'small' | 'medium'
}

const CreateButton = ({onClick, text, size}: CreateButtonType) => {
	return (
		<button
			type='button'
			className={'create_button'}
			data-size={size}
			onClick={() => onClick()}
		>
			<div className={'create_button_content'} >
				<BsPlusCircleDotted  />
				{text}
			</div>
		</button>
	);
};

export default CreateButton;
