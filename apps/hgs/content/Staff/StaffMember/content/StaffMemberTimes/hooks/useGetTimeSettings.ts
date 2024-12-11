import { UserContext } from '@provider';
import  { useContext } from 'react';

const useGetTimeSettings = () => {
	const {project} = useContext(UserContext);
	
	
	return {
		timeSettings: project.time_settings
	};
	
};

export default useGetTimeSettings;