import { getFileUrl } from '@repo/provider';
import '../styles.scss';

const FilePreview = ({file, number}: {file:string, number: number}) => {
	return (
		<div className='content_element file_preview_container'>
			<a href={getFileUrl(file)} target='__blank'>
				Datei {number}
			</a>
		</div>
	);
};

export default FilePreview;