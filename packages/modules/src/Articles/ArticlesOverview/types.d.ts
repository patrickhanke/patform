import {Filter, ArticleClass} from '@repo/types';
import { ApolloRefetch } from '@repo/provider';

type FilterArray = Filter[];

export type UseFindArticlesHook = ({
	moduleId: string,
	filters: FilterArray 
}) => ({
    loading: boolean,
    articles?: ArticleClass[],
    refetch: () => void
});

export type CreateArticleProps =  {
    refetch: ApolloRefetch
}


export type DeleteModalProps = {
    isOpen: boolean,
	confirmButtonHandler: () => void,
	header: 'Bericht löschen'
}