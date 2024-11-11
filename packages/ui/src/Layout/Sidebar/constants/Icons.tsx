import { AiFillCopy, AiOutlineForm, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsFillBarChartFill, BsLayoutTextWindowReverse, BsPeople } from 'react-icons/bs';
import { FaUsers, FaUser } from 'react-icons/fa';
import { GrProjects } from 'react-icons/gr';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { IoReceiptOutline, IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineCleaningServices, MdOutlineContactPage, MdOutlineEvent, MdViewModule } from 'react-icons/md';
import { RiAdminLine, RiArticleLine, RiListSettingsLine } from 'react-icons/ri';
import { PiNewspaper } from 'react-icons/pi';
import { CgProfile, CgWebsite } from 'react-icons/cg';
import { BiLabel, BiMessageSquareError, BiSolidTrashAlt } from 'react-icons/bi';
import { BsHousesFill } from 'react-icons/bs';
import { FaShuttleVan } from 'react-icons/fa';
import { GrTask, GrDownload } from 'react-icons/gr';
import { ImImages } from 'react-icons/im';
import { CiLocationOn } from 'react-icons/ci';

const Icons = ({icon}: {icon: string}) => {
	if (icon === 'projects') {
		return <GrProjects />;
	}
	if (icon === 'participants') {
		return <BsPeople />;
	}
	if (icon === 'settings') {
		return <IoSettingsOutline />;
	}
	if (icon === 'users') {
		return <FaUsers />;
	}
	if (icon === 'persons') {
		return <FaUser />;
	}
	if (icon === 'project') {
		return <RiListSettingsLine />;
	}
	if (icon === 'admin') {
		return <RiAdminLine />;
	}
	if (icon === 'templates') {
		return <AiFillCopy />;
	}
	if (icon === 'dashboard') {
		return <BsFillBarChartFill />;
	}
	if (icon === 'products') {
		return <HiOutlineShoppingBag />;
	}
	if (icon === 'contact') {
		return <MdOutlineContactPage />;
	}
	if (icon === 'orders') {
		return <IoReceiptOutline />;
	}
	if (icon === 'content') {
		return <BsLayoutTextWindowReverse />;
	}
	if (icon === 'shop') {
		return <AiOutlineShoppingCart />;
	}
	if (icon === 'profile') {
		return <CgProfile />;
	}
	if (icon === 'waste') {
		return <BiSolidTrashAlt  />;
	}
	if (icon === 'tasks') {
		return <GrTask />;
	}
	if (icon === 'tickets') {
		return <BiMessageSquareError />;
	}
	if (icon === 'objects') {
		return <BsHousesFill />;
	}
	if (icon === 'tours') {
		return <FaShuttleVan />;
	}
	if (icon === 'workers') {
		return <CgProfile />;
	}
	if (icon === 'staff') {
		return <CgProfile />;
	}
	if (icon === 'services') {
		return <MdOutlineCleaningServices />;
	}
	if (icon === 'images') {
		return <ImImages />;
	}
	if (icon === 'forms') {
		return <AiOutlineForm />;
	}
	if (icon === 'modules') {
		return <MdViewModule />;
	}
	if (icon === 'categories') {
		return <BiLabel />;
	}
	if (icon === 'news') {
		return <PiNewspaper />;
	}
	if (icon === 'events') {
		return <MdOutlineEvent />;
	}
	if (icon === 'website') {
		return <CgWebsite />;
	}
	if (icon === 'location') {
		return <CiLocationOn />;
	}
	if (icon === 'article') {
		return <RiArticleLine />;
	}
	if (icon === 'group') {
		return <FaUsers />;
	}
	if (icon === 'downloads') {
		return <GrDownload />;
	}

	return null;
};

export default Icons;