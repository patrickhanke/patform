import { IconProps } from "./types";
import {
	Archive,
	Clock,
	Info,
	ListTodo,
	Plus,
	Home,
	CalendarDays,
	ChevronDown,
	Tag,
	Calendar,
	ChevronUp,
	CircleCheck,
	Circle,
	CircleUserRound
} from "lucide-react";

const Icon = ({ size = 18, strokeWidth = 1, type, color }: IconProps) => {
	return (
		<>
			{type === "calendar" && (
				<Calendar
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "weeks" && (
				<CalendarDays
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "clock" && (
				<Clock
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "task" && (
				<ListTodo
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "info" && (
				<Info
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "archive" && (
				<Archive
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "plus" && (
				<Plus
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "house" && (
				<Home
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "arrow-down" && (
				<ChevronDown
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "arrow-up" && (
				<ChevronUp
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "ticket" && (
				<Tag
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "circle-check" && (
				<CircleCheck
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "circle" && (
				<Circle
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
			{type === "circle-user-round" && (
				<CircleUserRound
					width={size}
					height={size}
					strokeWidth={strokeWidth}
					color={color}
				/>
			)}
		</>
	);
};

export default Icon;
