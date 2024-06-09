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
	activeState, 
	navOnClick,
	refetch,
	emptyContent=false
}: PageProps) => {
	return (
		<>
			{navOnClick && activeState && (
				<PageNavigation 
					siteStates={pageStates}
					activeState={activeState}
					onClick={navOnClick}
				/>
			)}
			<PageHeader 
				title={title} 
				pageHeaderContent={pageHeaderContent} 
				pageHeaderButtons={pageHeaderButtons}
				emptyContent={emptyContent}
				refetch={refetch}
			/>
			<div className='page-content'>
				{children}
			</div>
		</>
	);
};

export default Page;