'use client';

import { PageHeaderComponent } from './types';
import { Plus, RotateCcw } from 'lucide-react';
import { isArray } from 'lodash';
import clsx from 'clsx';
import './styles.scss';
import { PageNavigation } from '../PageNavigation';
import CreateClass from './content/CreateClass';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// const modalVariants = {
// 	visible: { opacity: 1, top: 0,  transition: { when: 'beforeChildren' } },
// 	hidden: { opacity: 0, top: -100,  transition: { when: 'afterChildren' } }
// };

const PageHeader = ({
	title,
	pageHeaderButtons,
	pageStates = [], 
	pageState, 
	setPageState,
	pageHeaderContent,
	emptyContent,
	createClass,
	refetch
}: PageHeaderComponent) => {
	const [scrollState, setScrollState] = useState(false);

	const { ref, inView } = useInView({
		threshold: 0
	  });

	useEffect(() => {
		if (inView) {
			setScrollState(false);
		} else {
			setScrollState(true);
		}
	}, [inView]);

	const headContent = useMemo(() => (
		<div className='pageheader_content' >
			<div className={'pageheader_content_container'} data-scroll={scrollState}>
				<div>
					{scrollState ? 
						<h3>{title}</h3>
						:
						<h2>{title}</h2>
					}
				</div>
				{isArray(pageHeaderButtons) && pageHeaderButtons?.length > 0 && 
				<div className={'pageheader_button_container'} >
					{pageHeaderButtons.map(button => (
						<button
							key={button.text}
							data-color={button.color || 'primary'}
							className={clsx('full_button', 'md', 'primary', 'pageheader_createbutton')}
							onClick={() => button.onClick()}
							disabled={button.disabled}
						>
							{button.is_add_button && <div className={'add_icon'}><Plus strokeWidth={1} size={12} /></div> }
							{button.is_reset_button && <div className={'add_icon'}><RotateCcw strokeWidth={1} size={12} /></div> }
							<span>{`${button.text}`}</span>
						</button> 
					))}
					{pageHeaderContent || emptyContent && 
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
	), [scrollState]);
	
	return (
		<>
			<div ref={ref} style={{width: '100%', position: 'relative'}}>
				{headContent}
			</div>
			{/* <AnimatePresence>
				{scrollState && (
					<motion.div
						className='pageheader_scroll_container'
						key='pageheader'
						id='pageheader'
						// style={{position: 'fixed', backgroundColor: 'white', zIndex: 11}}
						variants={modalVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						{headContent}
					</motion.div>
				)}
			</AnimatePresence> */}
		</>
	
	);
};

export default PageHeader;