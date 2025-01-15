import { v4 } from 'uuid';

const createFileName: (filename?: string) => string = (filename) => {
	if (filename) {
		return `${filename}`;
	}
	return v4();
};

export default createFileName;