import { FC } from 'react';
import { PageNavigation } from '../../PageNavigation';
import { Plus, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { isArray } from 'lodash-es';
import CreateClass from '../content/CreateClass';
import { PageHeaderScrollProps } from '../types';
import '../styles.scss';

const PageHeaderScroll: FC<PageHeaderScrollProps> = ({
	title,
	pageHeaderButtons,
	pageHeaderContent,
	emptyContent,
	createClass,
	refetch,
	pageStates = [],
	pageState,
	setPageState
}) => {
	return (
		<div className='pageheader_scroll_content'>
			<div className={'pageheader_scroll_content_container'}>
				<div>
					<h3>{title}</h3>
				</div>
				{isArray(pageHeaderButtons) && pageHeaderButtons?.length > 0 && (
					<div className={'pageheader_button_container'}>
                    	{pageHeaderButtons.map(button => (
                    		<button
								key={button.text}
								data-color={button.color || 'primary'}
								className={clsx('full_button', 'md', 'primary', 'pageheader_createbutton')}
								onClick={() => button.onClick()}
								disabled={button.disabled}
                    		>
                    			{button.is_add_button && <div className={'add_icon'}><Plus strokeWidth={1} size={12} /></div>}
                    			{button.is_reset_button && <div className={'add_icon'}><RotateCcw strokeWidth={1} size={12} /></div>}
                    			<span>{`${button.text}`}</span>
                    		</button>
                    	))}
                    	{(pageHeaderContent || emptyContent) &&
                            <>
                            	<div>
                            		{pageHeaderContent}
                            	</div>
                            	<div>
                            		{createClass?.className && (
                            			<CreateClass
	initialData={createClass.initialData}
	fields={createClass.fields}
	text={createClass.text || 'Neues Objekt erstellen'}
	className={createClass.className}
	refetch={refetch}
                            			/>
                            		)}
                            	</div>
                            </>
                    	}
					</div>
				)}
			</div>
			{pageStates.length > 0 && pageState && setPageState &&
				<div className='pageheader_scroll_navigation_container'>
					<PageNavigation
						siteStates={pageStates}
						activeState={pageState}
						onClick={setPageState}
					/>
				</div>
			}
		</div>
	);
};

PageHeaderScroll.displayName = 'PageHeaderScroll';

export default PageHeaderScroll;
