import SiteHeader from './content/SiteHeader';
import { PageProps } from './types';
import './styles.scss';
import { PageNavigation } from './content/PageNavigation';

const Page = ({
	title, 
	children,
	siteHeaderContent, 
	siteHeaderButtons, 
	siteStates = [], 
	activeState, 
	navOnClick,
	refetch,
	emptyContent=false

}: PageProps) => {
	return (
		<>
			<SiteHeader 
				title={title} 
				siteHeaderContent={siteHeaderContent} 
				siteHeaderButtons={siteHeaderButtons}
				emptyContent={emptyContent}
				refetch={refetch}
			/>
			{navOnClick && activeState && (
				<PageNavigation 
					siteStates={siteStates}
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