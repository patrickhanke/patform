import {PageHeader} from './content/PageHeader';
import { PageProps } from './types';
import './styles.scss';
import { PageNavigation } from './content/PageNavigation';

const Page = ({
	title, 
	children,
	pageHeaderContent, 
	pageHeaderButtons, 
	pageStates = [], 
	createClass,
	activeState, 
	navOnClick,
	refetch,
	emptyContent=false
}: PageProps) => {
	return (
		<>
			<PageHeader 
				title={title} 
				pageHeaderContent={pageHeaderContent} 
				pageHeaderButtons={pageHeaderButtons}
				emptyContent={emptyContent}
				createClass={createClass}
				refetch={refetch}
			/>
			{navOnClick && activeState && (
				<PageNavigation
					siteStates={pageStates}
					activeState={activeState}
					onClick={navOnClick}
				/>
			)}
			<div className='page-content'>
				{children}
			</div>
		</>
	);
};

export default Page;