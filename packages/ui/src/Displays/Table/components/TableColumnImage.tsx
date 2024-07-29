import { getImageUrl } from '@repo/provider';

const TableColumnImage = ({url}: {url: string}) => {
    console.log(url);
    
	return (
		<>
			{url ?
				<img src={getImageUrl({filePath: url})} /> : '-'
			}</>

	);
};

export default TableColumnImage;