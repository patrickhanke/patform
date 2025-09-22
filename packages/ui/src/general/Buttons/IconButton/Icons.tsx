import React from "react";
import {
	AiFillCopy,
	AiOutlineMinus,
	AiOutlineShoppingCart
} from "react-icons/ai";
import {
	BsFillBarChartFill,
	BsLayoutTextWindowReverse,
	BsPeople,
	BsPlusLg
} from "react-icons/bs";
import { FaInfo, FaRegEye, FaSave, FaTrash, FaUsers } from "react-icons/fa";
import { GrClose, GrProjects } from "react-icons/gr";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoReceiptOutline, IoSettingsOutline } from "react-icons/io5";
import {
	MdOutlineCleaningServices,
	MdOutlineContactPage
} from "react-icons/md";
import { RiAdminLine, RiListSettingsLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BiMessageSquareError, BiSolidTrashAlt } from "react-icons/bi";
import { BsHousesFill } from "react-icons/bs";
import { FaShuttleVan } from "react-icons/fa";
import { GrTask } from "react-icons/gr";
import { MdEdit, MdOutlineCancel, MdOutlineChangeCircle } from "react-icons/md";
import { MdOutlineEditCalendar } from "react-icons/md";

import {
	AiOutlineArrowRight,
	AiOutlineDownload,
	AiOutlineFileText,
	AiOutlineMail
} from "react-icons/ai";

import { TbMessage } from "react-icons/tb";
import { GiCheckMark } from "react-icons/gi";
import { RxCopy, RxExternalLink } from "react-icons/rx";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { BsCardText } from "react-icons/bs";
import { GrGrid } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { LiaCommentsSolid } from "react-icons/lia";
import { MdOutlinePassword } from "react-icons/md";
import { IoImagesOutline } from "react-icons/io5";
import { LuArchive } from "react-icons/lu";
import { TfiList, TfiViewList } from "react-icons/tfi";
import { IoIosTimer } from "react-icons/io";
import { IconProps } from "./types";

const Icons: React.FC<IconProps> = ({ icon, color }) => {
	if (icon === "delete") {
		return <FaTrash color={color || "inherit"} />;
	}
	if (icon === "edit") {
		return <MdEdit color={color || "inherit"} />;
	}
	if (icon === "cancel") {
		return <MdOutlineCancel color={color || "inherit"} />;
	}
	if (icon === "save") {
		return <FaSave color={color || "inherit"} />;
	}
	if (icon === "arrow") {
		return <AiOutlineArrowRight color={color || "inherit"} />;
	}
	if (icon === "download") {
		return <AiOutlineDownload color={color || "inherit"} />;
	}
	if (icon === "view") {
		return <FaRegEye color={color || "inherit"} />;
	}
	if (icon === "email") {
		return <AiOutlineMail color={color || "inherit"} />;
	}
	if (icon === "message") {
		return <TbMessage color={color || "inherit"} />;
	}
	if (icon === "settings") {
		return <IoSettingsOutline color={color || "inherit"} />;
	}
	if (icon === "check") {
		return <GiCheckMark color={color || "inherit"} />;
	}
	if (icon === "copy") {
		return <RxCopy color={color || "inherit"} />;
	}
	if (icon === "info") {
		return <FaInfo color={color || "inherit"} />;
	}
	if (icon === "link") {
		return <RxExternalLink color={color || "inherit"} />;
	}
	if (icon === "change") {
		return <MdOutlineChangeCircle color={color || "inherit"} />;
	}
	if (icon === "chart") {
		return <HiOutlineChartBarSquare color={color || "inherit"} />;
	}
	if (icon === "page") {
		return <AiOutlineFileText color={color || "inherit"} />;
	}
	if (icon === "text") {
		return <BsCardText color={color || "inherit"} />;
	}
	if (icon === "grid") {
		return <GrGrid color={color || "inherit"} />;
	}
	if (icon === "documents") {
		return <IoDocumentsOutline color={color || "inherit"} />;
	}
	if (icon === "comments") {
		return <LiaCommentsSolid color={color || "inherit"} />;
	}
	if (icon === "password") {
		return <MdOutlinePassword color={color || "inherit"} />;
	}
	if (icon === "images") {
		return <IoImagesOutline color={color || "inherit"} />;
	}
	if (icon === "projects") {
		return <GrProjects color={color || "inherit"} />;
	}
	if (icon === "participants") {
		return <BsPeople color={color || "inherit"} />;
	}
	if (icon === "users") {
		return <FaUsers color={color || "inherit"} />;
	}
	if (icon === "project") {
		return <RiListSettingsLine color={color || "inherit"} />;
	}
	if (icon === "admin") {
		return <RiAdminLine color={color || "inherit"} />;
	}
	if (icon === "templates") {
		return <AiFillCopy color={color || "inherit"} />;
	}
	if (icon === "dashboard") {
		return <BsFillBarChartFill color={color || "inherit"} />;
	}
	if (icon === "products") {
		return <HiOutlineShoppingBag color={color || "inherit"} />;
	}
	if (icon === "contact") {
		return <MdOutlineContactPage color={color || "inherit"} />;
	}
	if (icon === "orders") {
		return <IoReceiptOutline color={color || "inherit"} />;
	}
	if (icon === "content") {
		return <BsLayoutTextWindowReverse color={color || "inherit"} />;
	}
	if (icon === "shop") {
		return <AiOutlineShoppingCart color={color || "inherit"} />;
	}
	if (icon === "profile") {
		return <CgProfile color={color || "inherit"} />;
	}
	if (icon === "waste") {
		return <BiSolidTrashAlt color={color || "inherit"} />;
	}
	if (icon === "tasks") {
		return <GrTask color={color || "inherit"} />;
	}
	if (icon === "tickets") {
		return <BiMessageSquareError color={color || "inherit"} />;
	}
	if (icon === "objects") {
		return <BsHousesFill color={color || "inherit"} />;
	}
	if (icon === "tours") {
		return <FaShuttleVan color={color || "inherit"} />;
	}
	if (icon === "workers") {
		return <CgProfile color={color || "inherit"} />;
	}
	if (icon === "staff") {
		return <CgProfile color={color || "inherit"} />;
	}
	if (icon === "services") {
		return <MdOutlineCleaningServices color={color || "inherit"} />;
	}
	if (icon === "extended_list") {
		return <TfiViewList color={color || "inherit"} />;
	}
	if (icon === "small_list") {
		return <TfiList color={color || "inherit"} />;
	}
	if (icon === "calendar") {
		return <MdOutlineEditCalendar color={color || "inherit"} />;
	}
	if (icon === "close") {
		return <GrClose color={color || "inherit"} />;
	}
	if (icon === "archive") {
		return <LuArchive color={color || "inherit"} />;
	}
	if (icon === "time") {
		return <IoIosTimer color={color || "inherit"} />;
	}
	if (icon === "plus") {
		return <BsPlusLg color={color || "inherit"} />;
	}
	if (icon === "minus") {
		return <AiOutlineMinus color={color || "inherit"} />;
	}

	return null;
};

export default Icons;
