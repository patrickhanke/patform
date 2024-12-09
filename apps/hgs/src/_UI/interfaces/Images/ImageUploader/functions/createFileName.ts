import { v4 } from 'uuid';

const createFileName = (filename: string) => {
	return ({
		filename: `${filename}_${v4()}`,
		fallback: `${filename}_${v4()}`
	});
};

export default createFileName;