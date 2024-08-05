import { PageHeaderComponent } from './types';
import { Plus, RotateCcw } from 'lucide-react';
import { isArray } from 'lodash';
import clsx from 'clsx';
import './styles.scss';
import CreateClass from './content/CreateClass';

const PageHeader = ({
	title,
	pageHeaderContent, 
	pageHeaderButtons, 
	emptyContent=false,
	refetch,
	createClass
}: PageHeaderComponent) => {
	return (
		<div className={'pageheader_content_container'}>
			<h2>{title}</h2>
			{pageHeaderContent || emptyContent && 
			<>
				<div>
					{pageHeaderContent}
				</div> 
				<div>{createClass?.className && ( 
					<CreateClass
						fields={createClass.fields}
						text={createClass.text || 'Neues Objekt erstellen'}
						className={createClass.className}
						refetch={refetch}
					/>
				)}
				</div>
			</>
			}
			{isArray(pageHeaderButtons) && pageHeaderButtons?.length > 0 && 
				<div className={'pageheader_button_container'} >
					{pageHeaderButtons.map(button => (
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
			}
		</div>
	);
};

export default PageHeader;