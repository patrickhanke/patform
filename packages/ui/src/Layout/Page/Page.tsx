import {PageHeader} from './content/PageHeader';
import { PageProps } from './types';
import './styles.scss';
import { PageNavigation } from './content/PageNavigation';
import CreateClass from './content/PageHeader/content/CreateClass';

const Page = ({
	title, 
	children,
	pageHeaderContent, 
	pageHeaderButtons, 
	pageStates = [], 
	pageState, 
	setPageState,
	createClass,
	refetch,
	emptyContent=false
}: PageProps) => {
	return (
		<>
			<div className='page_header_container'>
				<PageHeader
					title={title}
					pageHeaderButtons={pageHeaderButtons}
				/>
				{setPageState && pageState && (
					<PageNavigation
						siteStates={pageStates}
						activeState={pageState}
						onClick={setPageState}
					/>
				)}
			</div>
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
			<div className='page-content'>
				{children}
			</div>
		</>
	);
};

export default Page;