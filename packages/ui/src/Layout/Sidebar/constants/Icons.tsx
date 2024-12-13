import { AiFillCopy, AiOutlineForm, AiOutlineMinus, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsFillBarChartFill, BsLayoutTextWindowReverse, BsPeople, BsPlusLg } from 'react-icons/bs';
import { FaUsers, FaUser } from 'react-icons/fa';
import { GrProjects } from 'react-icons/gr';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { IoReceiptOutline, IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineCleaningServices, MdOutlineContactPage, MdOutlineEditCalendar, MdOutlineEvent, MdViewModule } from 'react-icons/md';
import { RiAdminLine, RiArticleLine, RiListSettingsLine } from 'react-icons/ri';
import { PiNewspaper } from 'react-icons/pi';
import { CgProfile, CgWebsite } from 'react-icons/cg';
import { BiLabel, BiMessageSquareError, BiSolidTrashAlt } from 'react-icons/bi';
import { BsHousesFill } from 'react-icons/bs';
import { FaShuttleVan } from 'react-icons/fa';
import { GrTask, GrDownload } from 'react-icons/gr';
import { ImImages } from 'react-icons/im';
import { CiLocationOn } from 'react-icons/ci';
import { TfiClose, TfiList, TfiViewList } from 'react-icons/tfi';
import { LuArchive } from 'react-icons/lu';
import { IoIosTimer } from 'react-icons/io';

const Icons = ({icon, color}: {icon: string, color?: string}) => {
	if (icon === 'projects') {
		return <GrProjects color={color || 'inherit'} />;
	}
	if (icon === 'participants') {
		return <BsPeople color={color || 'inherit'} />;
	}
	if (icon === 'settings') {
		return <IoSettingsOutline color={color || 'inherit'} />;
	}
	if (icon === 'users') {
		return <FaUsers color={color || 'inherit'} />;
	}
	if (icon === 'persons') {
		return <FaUser color={color || 'inherit'} />;
	}
	if (icon === 'project') {
		return <RiListSettingsLine color={color || 'inherit'} />;
	}
	if (icon === 'admin') {
		return <RiAdminLine color={color || 'inherit'} />;
	}
	if (icon === 'templates') {
		return <AiFillCopy color={color || 'inherit'} />;
	}
	if (icon === 'dashboard') {
		return <BsFillBarChartFill color={color || 'inherit'} />;
	}
	if (icon === 'products') {
		return <HiOutlineShoppingBag color={color || 'inherit'} />;
	}
	if (icon === 'contact') {
		return <MdOutlineContactPage color={color || 'inherit'} />;
	}
	if (icon === 'orders') {
		return <IoReceiptOutline color={color || 'inherit'} />;
	}
	if (icon === 'content') {
		return <BsLayoutTextWindowReverse color={color || 'inherit'} />;
	}
	if (icon === 'shop') {
		return <AiOutlineShoppingCart color={color || 'inherit'} />;
	}
	if (icon === 'profile') {
		return <CgProfile color={color || 'inherit'} />;
	}
	if (icon === 'waste') {
		return <BiSolidTrashAlt color={color || 'inherit'} />;
	}
	if (icon === 'tasks') {
		return <GrTask color={color || 'inherit'} />;
	}
	if (icon === 'tickets') {
		return <BiMessageSquareError color={color || 'inherit'} />;
	}
	if (icon === 'objects') {
		return <BsHousesFill color={color || 'inherit'} />;
	}
	if (icon === 'tours') {
		return <FaShuttleVan color={color || 'inherit'} />;
	}
	if (icon === 'workers') {
		return <CgProfile color={color || 'inherit'} />;
	}
	if (icon === 'staff') {
		return <CgProfile color={color || 'inherit'} />;
	}
	if (icon === 'services') {
		return <MdOutlineCleaningServices color={color || 'inherit'} />;
	}
	if (icon === 'images') {
		return <ImImages color={color || 'inherit'} />;
	}
	if (icon === 'forms') {
		return <AiOutlineForm color={color || 'inherit'} />;
	}
	if (icon === 'modules') {
		return <MdViewModule color={color || 'inherit'} />;
	}
	if (icon === 'categories') {
		return <BiLabel color={color || 'inherit'} />;
	}
	if (icon === 'news') {
		return <PiNewspaper color={color || 'inherit'} />;
	}
	if (icon === 'events') {
		return <MdOutlineEvent color={color || 'inherit'} />;
	}
	if (icon === 'website') {
		return <CgWebsite color={color || 'inherit'} />;
	}
	if (icon === 'location') {
		return <CiLocationOn color={color || 'inherit'} />;
	}
	if (icon === 'article') {
		return <RiArticleLine color={color || 'inherit'} />;
	}
	if (icon === 'group') {
		return <FaUsers color={color || 'inherit'} />;
	}
	if (icon === 'downloads') {
		return <GrDownload color={color || 'inherit'} />;
	}
	if (icon === 'extended_list') {
		return <TfiViewList color={color || 'inherit'} />;
	}
	if (icon === 'small_list') {
		return <TfiList color={color || 'inherit'} />;
	}
	if (icon === 'calendar') {
		return <MdOutlineEditCalendar color={color || 'inherit'} />;
	}
	if (icon === 'close') {
		return <TfiClose color={color || 'inherit'} />;
	}
	if (icon === 'archive'){
		return <LuArchive color={color || 'inherit'} />;
	}
	if (icon === 'time'){
		return <IoIosTimer color={color || 'inherit'} />;
	}
	if (icon === 'plus'){
		return <BsPlusLg color={color || 'inherit'} />;
	}
	if (icon === 'minus'){
		return <AiOutlineMinus color={color || 'inherit'} />;
	}

	return null;
};

export default Icons;