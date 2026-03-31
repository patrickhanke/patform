import React from "react";
import {
	AiFillCopy,
	AiOutlineMinus,
	AiOutlineSearch,
	AiOutlineShoppingCart,
	AiOutlineUpload
} from "react-icons/ai";
import {
	BsFillBarChartFill,
	BsLayoutTextWindowReverse,
	BsPeople,
	BsPlusLg
} from "react-icons/bs";
import {
	FaInfo,
	FaRegBuilding,
	FaRegEye,
	FaRegEyeSlash,
	FaSave,
	FaTrash,
	FaUsers
} from "react-icons/fa";
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
import { LuArchive, LuRefreshCcw } from "react-icons/lu";
import { TfiList, TfiViewList } from "react-icons/tfi";
import { IoIosTimer } from "react-icons/io";
import { IconProps } from "./types";

const Icons: React.FC<IconProps> = ({ icon, color, size }) => {
	if (icon === "property") {
		return (
			<FaRegBuilding color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "delete") {
		return <FaTrash color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "edit") {
		return <MdEdit color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "cancel") {
		return (
			<MdOutlineCancel color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "save") {
		return <FaSave color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "arrow") {
		return (
			<AiOutlineArrowRight
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "download") {
		return (
			<AiOutlineDownload
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "view") {
		return <FaRegEye color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "email") {
		return (
			<AiOutlineMail color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "message") {
		return <TbMessage color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "settings") {
		return (
			<IoSettingsOutline
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "check") {
		return <GiCheckMark color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "copy") {
		return <RxCopy color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "info") {
		return <FaInfo color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "link") {
		return (
			<RxExternalLink color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "change") {
		return (
			<MdOutlineChangeCircle
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "chart") {
		return (
			<HiOutlineChartBarSquare
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "page") {
		return (
			<AiOutlineFileText
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "text") {
		return <BsCardText color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "grid") {
		return <GrGrid color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "documents") {
		return (
			<IoDocumentsOutline
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "comments") {
		return (
			<LiaCommentsSolid
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "password") {
		return (
			<MdOutlinePassword
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "images") {
		return (
			<IoImagesOutline color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "projects") {
		return <GrProjects color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "participants") {
		return <BsPeople color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "users") {
		return <FaUsers color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "project") {
		return (
			<RiListSettingsLine
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "admin") {
		return <RiAdminLine color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "templates") {
		return <AiFillCopy color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "dashboard") {
		return (
			<BsFillBarChartFill
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "products") {
		return (
			<HiOutlineShoppingBag
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "contact") {
		return (
			<MdOutlineContactPage
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "orders") {
		return (
			<IoReceiptOutline
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "content") {
		return (
			<BsLayoutTextWindowReverse
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "shop") {
		return (
			<AiOutlineShoppingCart
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "profile") {
		return <CgProfile color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "waste") {
		return (
			<BiSolidTrashAlt color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "tasks") {
		return <GrTask color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "tickets") {
		return (
			<BiMessageSquareError
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "objects") {
		return (
			<BsHousesFill color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "tours") {
		return (
			<FaShuttleVan color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "workers") {
		return <CgProfile color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "staff") {
		return <CgProfile color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "services") {
		return (
			<MdOutlineCleaningServices
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "extended_list") {
		return <TfiViewList color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "small_list") {
		return <TfiList color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "calendar") {
		return (
			<MdOutlineEditCalendar
				color={color || "inherit"}
				fontSize={size || 12}
			/>
		);
	}
	if (icon === "close") {
		return <GrClose color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "archive") {
		return <LuArchive color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "time") {
		return <IoIosTimer color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "plus") {
		return <BsPlusLg color={color || "inherit"} fontSize={size || 12} />;
	}
	if (icon === "minus") {
		return (
			<AiOutlineMinus color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "upload") {
		return (
			<AiOutlineUpload color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "refresh") {
		return (
			<LuRefreshCcw color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "search") {
		return (
			<AiOutlineSearch color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "eye-off") {
		return (
			<FaRegEyeSlash color={color || "inherit"} fontSize={size || 12} />
		);
	}
	if (icon === "eye") {
		return <FaRegEye color={color || "inherit"} fontSize={size || 12} />;
	}
	return null;
};

export default Icons;
