import { Fragment } from 'react/jsx-runtime';
import './styles.scss';
import { ModalComponent } from './types';
import clsx from 'clsx';

const Modal = ({
	children, 
	header, 
	isOpen = false, 
	cancelButtonHandler, 
	confirmButtonHandler,
	buttonDisabled = [false, false]
}: ModalComponent) => {
	if (isOpen === true) return (
		<Fragment key={header}>
			<div className={clsx('modal_overlay_container', 'modal_animate')} />
        
			<div className={clsx( 'modal_container', 'animate')}>
				<div className={'modal_header'}>
					<h3>
						{header}
					</h3>
				</div>
				<div className={'modal_content'}>{children}</div>
				<div className={'modal_footer'}>
					<button className={clsx('full_button', 'md', 'light')} onClick={() => cancelButtonHandler()} disabled={buttonDisabled[0]}>
                        Abbrechen
					</button>
					<button className={clsx('full_button', 'md', 'dark')} onClick={() => confirmButtonHandler()} disabled={buttonDisabled[1]}>
                        Bestätigen
					</button>
				</div>
			</div>
		</Fragment>
	);
	return null;
};

export default Modal;