'use client';

import React, { useCallback, useContext, useState } from 'react';
import { PersonsInterfaceComponent } from './types';
import { PersonClass } from '@repo/types';
import './styles.scss';
import { AppContext } from '@repo/provider';
import useFindPerson from './hooks/useFindPerson';
import DisplayPersonsInterface from './components/DisplayPersonInterface';
import { IconButton, PersonDisplay, SlideIn } from '@repo/ui';
import { cloneDeep, set } from 'lodash';

const PersonsInterface = ({persons, onChange, nextDate}: PersonsInterfaceComponent) => {
	const {modules} = useContext(AppContext);
	const {persons: personData} = useFindPerson({moduleId: modules.find(module => module.path === '/persons')?.objectId, filters: []});
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPersons, setSelectedPersons] = useState<string[]>(persons);
	const changeHandler = useCallback((type: 'add' | 'remove' , id: string) => {
		const valueCopy = cloneDeep(persons);
		if (type === 'add') {
			setSelectedPersons([...valueCopy, id]);
		} else {
			setSelectedPersons(valueCopy.filter(personId => personId !== id));
		}
	}, [persons]);
    
	return (
		<div>
			<div className='person_display_container'>
				{persons.map(person => (
					<PersonDisplay 
						key={person} 
						person={personData.find((ps: PersonClass) => ps.objectId === person)} 
						onlyImage={true}
					/>
				))}
				<IconButton 
					icon='edit' 
					onClick={() => setIsOpen(true)}
				/>
			</div>
			
			<SlideIn 
				isOpen={isOpen} 
				cancel={() => setIsOpen(false)} 
				confirm={() => {
					onChange(selectedPersons);
					setIsOpen(false);
				}}
				header='Personen auswählen'
			>
				<div className='person_interface_container'>
					{personData.map((person: PersonClass) => (
						<DisplayPersonsInterface
							key={person.objectId}
							person={person}
							isSelected={selectedPersons.includes(person.objectId)}
							onChange={changeHandler}
							nextDate={nextDate}
						/>
					))}
				</div>
			</SlideIn>
		</div>
	);
};

export default PersonsInterface;