import { UseGetImagesHook } from '../types';
import { useQuery } from '@apollo/client';
import { find_images } from '../constants/find_images';
import { paramsHandler } from '@repo/provider';

const useGetImages: UseGetImagesHook = ({projectId, filters} ) => {
	const {loading, data, refetch} = useQuery(find_images, {
		variables: {params: paramsHandler({projectId, filters})},
		notifyOnNetworkStatusChange: true
	});

	return ({
		loading, 
		images: data ? data.objects.findImage.results : undefined,
		refetch
	});
};

export default useGetImages;