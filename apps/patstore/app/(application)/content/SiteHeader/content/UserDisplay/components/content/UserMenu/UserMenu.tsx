import React, { useMemo } from 'react'
import './styles.scss'

const UserMenu = ({user}) => {

    const userMenu = useMemo(() => {
        const menuArray = [
            {
                label: 'Profile',
                onClick: () => console.log('Profile')
            },
            {
                label: 'Settings',
                onClick: () => console.log('Settings')
            },
            {
                label: 'Logout',
                onClick: () => console.log('Logout')
            }
        ]

        return menuArray

    }, [user])

  return (
    <div className='user_menu_container'>
        {userMenu.map((menuItem, index) => (
            <div key={index} className='user_menu_item' onClick={menuItem.onClick}>
                {menuItem.label}
            </div>
        ))}
    </div>
  )
}

export default UserMenu