import React from 'react';
import { IconProps } from './types';
import { Archive, Clock, Info, ListTodo, Plus, Home, CalendarDays, ChevronDown, Tag, Calendar } from 'lucide-react';

const Icon = ({size=18, strokeWidth=1, type}: IconProps) => {
	return (
		<>
			{type === 'calendar' && <Calendar width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'weeks' && <CalendarDays width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'clock' && <Clock width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'task' && <ListTodo width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'info' && <Info width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'archive' && <Archive width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'plus' && <Plus width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'house' && <Home width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'arrow-down' && <ChevronDown width={size} height={size} strokeWidth={strokeWidth} /> }
			{type === 'ticket' && <Tag width={size} height={size} strokeWidth={strokeWidth} /> }

		</>
	);
};

export default Icon;