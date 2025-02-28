import { forwardRef } from 'react';
import { PageNavigation } from '../../PageNavigation';
import { Plus, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { isArray } from 'lodash';
import CreateClass from '../content/CreateClass';
import { PageHeaderRegularProps } from '../types';
import '../styles.scss';

const PageHeaderRegular = forwardRef<HTMLDivElement, PageHeaderRegularProps>(({
	title,
	description,
	pageHeaderButtons,
	pageHeaderContent,
	emptyContent,
	createClass,
	refetch,
	pageStates = [],
	pageState,
	setPageState
}, ref) => {
	return (
		<div ref={ref} className='pageheader_content'>
			<div className={'pageheader_content_container'}>
				<div>
					<h2>{title}</h2>
					{description && <p style={{ marginTop: '18px' }}>{description}</p>}
				</div>
				{(isArray(pageHeaderButtons) && pageHeaderButtons?.length > 0) &&
                    <div className={'pageheader_button_container'}>
                    	{isArray(pageHeaderButtons) && pageHeaderButtons.map(button => (
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
				}
			</div>
			{pageStates.length > 0 && pageState && setPageState &&
                <PageNavigation
                    siteStates={pageStates}
                    activeState={pageState}
                    onClick={setPageState}
                />
			}
		</div>
	);
});

PageHeaderRegular.displayName = 'PageHeaderRegular';

export default PageHeaderRegular;
