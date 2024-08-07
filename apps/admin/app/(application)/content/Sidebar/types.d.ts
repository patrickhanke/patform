import React from 'react';

export type MenuItemType = ReadOnly<{
    value: string,
    label: string,
    icon: string,
    disabled?: boolean,
    sub_menu: {
      value: string,
      label: string,
      icon: string,
      disabled?: boolean
    }[]
  }>

export type MenuItemProps = {
    link: Me,
    label: string,
    image: React.JSX.Element | null,
    subMenu: MenuItemType['sub_menu'],
    disabled?: boolean
  }