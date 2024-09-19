import { IconButton } from '@repo/ui';

import '../styles.scss';
import { AppModuleCategoryProps } from '../types';

const AppModuleField = ({category, setActiveCategory}: AppModuleCategoryProps) => {

	return (
		<div className='app_module_category_container'>
			<div>
				<h3>
					{category.label}
				</h3>
			</div>
			<div className='button_container'>
				<IconButton
					icon='edit'
					onClick={() => setActiveCategory(category.id)}
				/>
				<IconButton
					icon='delete'
					onClick={() => null}
				/>
			</div>
		</div>
	);
};

export default AppModuleField;