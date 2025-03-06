import {useCallback} from 'react';
import { useQuery } from '@apollo/client';
import { generateGraphQLQuery, paramsHandler, useDataHandler } from '@repo/provider';
import { SlideIn, Table } from '@repo/ui';
import useUserColumns from './hooks/useUserColumns';
import { AppUsersProps, UserObject } from './types';
import { FC, useEffect, useState } from 'react';
import CreateUser from './components/CreateUser';
import AddUser from './components/AddUser';
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';

const AppUsers: FC<AppUsersProps> = ({
    projectId, 
    createUser, 
    setCreateUser, 
    addUser, 
    setAddUser
}) => {
    const {updateData, createData} = useDataHandler();
    const {data, refetch} = useQuery(generateGraphQLQuery({
        type: 'find',
        objectName: '_User',
        fields: ['objectId', 'username', 'email', 'label']
    }), {
        variables: {params: paramsHandler({filters: [{key: 'projects', value: projectId, operator: '_in', id: 'projects'}]})}
    })
    const columns = useUserColumns();

    const [user, setUser] = useState<UserObject | undefined>();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user && createUser) {
            setUser({
                username: '',
                label: '',
                value:'',
                projects: [projectId]
            })
        }
    }, [createUser, user])
    
    const updateUserHandler = useCallback(async () => {
        setLoading(true)
        console.log('update user')
        if (createUser && user) {
            await createData({
                className: '_User',
                updateObject: {
                    username: user?.username,
                    label: user?.label,
                    projects: [projectId],
                    password: v4(),
                    email: user?.username,
                    set_passowrd: true
                }
            })
        }
        if (addUser && user) {
            const projectsCopy = cloneDeep(user.projects)
            projectsCopy.push(projectId)
            await updateData({
                className: '_User',
                objectId: user?.value,
                updateObject: {
                    projects: projectsCopy
                }
            })
        }   
        await refetch();
        setLoading(false)

    }, [user])
    
    return (
        <div>
            <Table 
                columns={columns}
                data={data?.objects.find_User.results || []}
            />
            <SlideIn
                header='Neuen Benutzer erstellen'
                isOpen={createUser || addUser}
                cancel={() => {
                    if (createUser) {
                        setCreateUser(false)
                    } else {
                        setAddUser(false)
                    }
                }}
                confirm={() => updateUserHandler()}
                disabled={[loading, loading]}
            >
                <div>
                    {createUser && user && <CreateUser user={user} setUser={setUser} />}
                    {addUser && <AddUser user={user} setUser={setUser} projectId={projectId}  />}
                </div>
            </SlideIn>
        </div>
    )
}

export default AppUsers