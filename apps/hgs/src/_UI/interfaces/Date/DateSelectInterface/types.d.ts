export type DateSelectInterfaceTaskProps = {
    taskId: string, 
    showDateInterface: boolean, 
    setShowDateInterface: React.Dispatch<React.SetStateAction<boolean>>,
    tasksRefetch?: () => void
}