import { FaTrash, FaSave, FaRegEye, FaInfo } from "react-icons/fa";
import { MdEdit, MdOutlineCancel, MdOutlineChangeCircle } from "react-icons/md";

import {
	AiOutlineArrowRight,
	AiOutlineDownload,
	AiOutlineFileText,
	AiOutlineMail
} from "react-icons/ai";

import { TbMessage } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { RxCopy, RxExternalLink } from "react-icons/rx";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { BsCardText } from "react-icons/bs";
import { GrGrid } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";
import { LiaCommentsSolid } from "react-icons/lia";
import { MdOutlinePassword } from "react-icons/md";
import { IconTypes } from "../types";

const IconRenderHandler = ({ icon }: { icon: IconTypes }) => {
	if (icon === "delete") {
		return <FaTrash />;
	}
	if (icon === "edit") {
		return <MdEdit />;
	}
	if (icon === "cancel") {
		return <MdOutlineCancel />;
	}
	if (icon === "save") {
		return <FaSave />;
	}
	if (icon === "arrow") {
		return <AiOutlineArrowRight />;
	}
	if (icon === "download") {
		return <AiOutlineDownload />;
	}
	if (icon === "view") {
		return <FaRegEye />;
	}
	if (icon === "email") {
		return <AiOutlineMail />;
	}
	if (icon === "message") {
		return <TbMessage />;
	}
	if (icon === "settings") {
		return <IoSettingsOutline />;
	}
	if (icon === "check") {
		return <GiCheckMark />;
	}
	if (icon === "copy") {
		return <RxCopy />;
	}
	if (icon === "info") {
		return <FaInfo />;
	}
	if (icon === "link") {
		return <RxExternalLink />;
	}
	if (icon === "change") {
		return <MdOutlineChangeCircle />;
	}
	if (icon === "chart") {
		return <HiOutlineChartBarSquare />;
	}
	if (icon === "page") {
		return <AiOutlineFileText />;
	}
	if (icon === "text") {
		return <BsCardText />;
	}
	if (icon === "grid") {
		return <GrGrid />;
	}
	if (icon === "documents") {
		return <IoDocumentsOutline />;
	}
	if (icon === "comments") {
		return <LiaCommentsSolid />;
	}
	if (icon === "password") {
		return <MdOutlinePassword />;
	}
	return null;
};

export default IconRenderHandler;
