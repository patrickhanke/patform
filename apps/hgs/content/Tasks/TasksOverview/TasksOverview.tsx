'use client';

import { TaskPageState, Tasks } from '@content';
import React, { Suspense, useState } from 'react';

const TasksOverview = ({pageState}: {pageState: TaskPageState}) => {
	return (
			<Suspense>
				<Tasks 
					pageState={pageState}
				/>
			</Suspense>
	);
};

export default TasksOverview;