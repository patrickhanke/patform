import { PageHeaderComponent } from './types';
import { Plus, RotateCcw } from 'lucide-react';
import { isArray } from 'lodash';
import clsx from 'clsx';
import './styles.scss';

const PageHeader = ({
	pageHeaderContent, 
	pageHeaderButtons, 
	emptyContent=false
}: PageHeaderComponent) => {
	return (
		<div className={'pageheader_content_container'}>
			{pageHeaderContent || emptyContent && 
				<div>
					{pageHeaderContent}
				</div> 
			}
			<div className={'pageheader_button_container'} >
				{isArray(pageHeaderButtons) && pageHeaderButtons?.length > 0 && pageHeaderButtons.map(button => (
					<button
						key={button.text}
						data-color={button.color || 'primary'}
						className={clsx('border_button', 'md', 'dark', 'pageheader_createbutton')}
						onClick={() => button.onClick()}
						disabled={button.disabled}
					>
						{button.is_add_button && <div className={'add_icon'}><Plus strokeWidth={1} size={12} /></div> }
						{button.is_reset_button && <div className={'add_icon'}><RotateCcw strokeWidth={1} size={12} /></div> }
						<span>{`${button.text}`}</span>
					</button> 
				))}
			</div>
		</div>
	);
};

export default PageHeader;