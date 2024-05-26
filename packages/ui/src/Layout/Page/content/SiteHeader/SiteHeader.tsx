import { SiteHeaderComponent } from './types';
import { Plus, RotateCcw } from 'lucide-react';
import { isArray } from 'lodash';
import clsx from 'clsx';
import CalendarWeek from './components/CalendarWeek';
import './styles.scss';

const SiteHeader = ({
	title, 
	siteHeaderContent, 
	siteHeaderButtons, 
	hasSiteNavigation = false,
	isSubHeader = false,
	emptyContent=false
}: SiteHeaderComponent) => {

	return !isSubHeader ? 
		<div className={"main_container"} data-hassitenav={hasSiteNavigation} >
			<div className={"siteheader_container"}>
				<h1>
					{title}
				</h1>
				<div className={"siteheader_right_container"}>
					<div className='vertical_line' />
					<CalendarWeek />
					<div className='vertical_line' />
					{/* <UserDisplay /> */}
				</div>
			</div>
		</div>
		:
		<div className={"siteheader_content_container"}>
			{siteHeaderContent || emptyContent && 
				<div>
					{siteHeaderContent}
				</div> 
			}
			<div className={"siteheader_button_container"} >
				{isArray(siteHeaderButtons) && siteHeaderButtons?.length > 0 && siteHeaderButtons.map(button => (
					<button
						key={button.text}
						data-color={button.color || 'primary'}
						className={clsx('border_button', 'md', 'dark', "siteheader_createbutton")}
						onClick={() => button.onClick()}
						disabled={button.disabled}
					>
						{button.is_add_button && <div className={"add_icon"}><Plus strokeWidth={1} size={12} /></div> }
						{button.is_reset_button && <div className={"add_icon"}><RotateCcw strokeWidth={1} size={12} /></div> }
						<span>{`${button.text}`}</span>
					</button> 
				))}
			</div>
		</div>;
};

export default SiteHeader;