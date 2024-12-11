'use client';

import { UserTypes } from '@/types';
import { useEffect, useState } from 'react';

type StorageType = 'session' | 'local';
type keys = 'user'| 'project'


type UseStorageReturnValue = {
  getItem: (key: keys, type?: StorageType, value_type?: valueType) =>  UserTypes.User | undefined ;
  setItem: (key: keys, value: string, type?: StorageType, value_type?: valueType) => boolean;
  removeItem: (key: keys, type?: StorageType) => void;
};

type valueType = 'object' | 'string'

const useStorage = (): UseStorageReturnValue => {
	const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' => `${type ?? 'session'}Storage`;
	const [isClient, setIsClient] = useState(false);
 
	useEffect(() => {
		setIsClient(true);
	}, []);

	const getItem = (key: keys, type?: StorageType, value_type?: valueType) => {
		if (isClient === true) {
			const objectToRetreive = window[storageType(type)][key];
			if (objectToRetreive) {
				return JSON.parse(objectToRetreive) as UserTypes.User;	
			}
			
		}
		return undefined;
	};

	const setItem = (key: keys, value: string | object, type?: StorageType): boolean => {
		// if (isBrowser) {
		window[storageType(type)].setItem(key, typeof value === 'object' ? JSON.stringify(value) : value );
		return true;
		// }

		// return false;
	};

	const removeItem = (key: string, type?: StorageType): void => {
		window[storageType(type)].removeItem(key);
	};

	return {
		getItem,
		setItem,
		removeItem
	};
};

export default useStorage;