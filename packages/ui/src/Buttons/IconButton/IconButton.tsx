import IconRenderHandler from './components/IconRenderHandler';
import { IconButton as IconButtonComponent } from './types';
import Link from 'next/link';
import './styles.scss';

const IconButton = ({icon, isLink, isBlank, link, onClick, isDarkButton=false, disabled, text}: IconButtonComponent) => {
	if (!isLink && onClick) return (
		<button
			type='button'
			onClick={() => onClick()}
			className='icon_button_container'
			data-isdark={isDarkButton}
			disabled={disabled}
			data-haslabel={text ? true : false}
		>
			<div className='icon_container'>
				<IconRenderHandler icon={icon} />
			</div>
			<div className='label'>{text}</div>
		</button>
	);
	if (isLink && link) return (
		<Link href={link} target={isBlank ? '_blank' : '_self'} >
			<button
				type='button'
				onClick={() => null}
				className='icon_button_container'
				data-isdark={isDarkButton}
				disabled={disabled}
				data-haslabel={text ? true : false}
			>
				<div className='icon_container'>
					<IconRenderHandler icon={icon} />
				</div>
				<div className='label'>{text}</div>
			</button>
		
		
		</Link>
	);

	return null;

};

export default IconButton;