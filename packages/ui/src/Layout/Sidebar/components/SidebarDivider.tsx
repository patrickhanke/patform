
const SidebarDivider = ({text}: {text: string}) => {
	return (
		<div className={'sidebar_divider_container' }> 
			<h4>
				{text}
			</h4>

		</div>
	);
};

export default SidebarDivider;