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
    link: string,
    label: string,
    icon: string,
    subMenu: MenuItemType['sub_menu'],
    disabled?: boolean
  }