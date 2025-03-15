const task_state_options = [
    { id: 'created', value: 'created', label: 'Erstellt', color: 'blue' },
    { id: 'assigned', value: 'assigned', label: 'Zugewiesen', color: 'yellow' },
    { id: 'executed', value: 'executed', label: 'Ausgeführt', color: 'violet' },
    {
        id: 'completed',
        value: 'completed',
        label: 'Abgeschlossen',
        color: 'green',
    },
    { id: 'archived', value: 'archived', label: 'Archiviert', color: 'grey' },
];

export default task_state_options;
