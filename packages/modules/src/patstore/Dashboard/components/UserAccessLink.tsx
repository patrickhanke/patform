"use client";

import Link from "next/link";
import { Classes } from "@repo/types";
import { useGetData } from "@repo/provider";

type UserAccessLinkProps = {
	href: string;
	className: string;
	id: string;
	moduleName: string;
	expiresAt?: string | null;
};

const UserAccessLink = ({
	href,
	className,
	id,
	moduleName,
	expiresAt
}: UserAccessLinkProps) => {
	const { data } = useGetData({
		objectName: className as Classes,
		id,
		fields: ["objectId", "title"]
	});
	const record = data as { title?: string } | null;
	const title = record?.title || moduleName;
	const expiry = expiresAt
		? new Date(expiresAt).toLocaleDateString("de-DE")
		: null;

	return (
		<Link href={href} className="flex row j-sb a-ce">
			<span>{title}</span>
			<span>
				{moduleName}
				{expiry ? ` · bis ${expiry}` : ""}
			</span>
		</Link>
	);
};

export default UserAccessLink;
