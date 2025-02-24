export type IconTypes = 
| 'delete' | 'edit' | 'cancel' | 'save' | 'arrow' | 'download' | 'view' | 'email' | 'message' | 'settings' 
| 'check' | 'copy' | 'info' | 'link' | 'change' | 'chart' | 'page' | 'text' | 'grid' | 'documents' | 'comments' 
| 'password' | 'images' | 'projects' | 'participants' | 'users' | 'project' | 'admin' | 'templates' | 'dashboard' 
| 'products' | 'contact' | 'orders' | 'content' | 'shop' | 'profile' | 'waste' | 'tasks' | 'tickets' | 'objects' 
| 'tours' | 'workers' | 'staff' | 'services' | 'extended_list' | 'small_list' | 'calendar' | 'close' | 'archive' 
| 'time' | 'plus' | 'minus';

export type IconProps = {
	icon: IconTypes;
	color?: string;
};

export type IconButtonProps = {
    icon: IconTypes,
    isLink?: boolean,
    isDarkButton?: boolean,
    onClick?: () => void,
    disabled?: boolean,
    link?: string,
    isBlank?: boolean,
    text?: string,
    noBorder?: boolean,
    size?: number,
    color?: string
}