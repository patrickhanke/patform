"use client";

import { useMemo, useState } from "react";
import {
	createListCollection,
	Icon,
	Portal,
	Select,
	Status
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import Cookies from "js-cookie";
import { PatstoreProject } from "@repo/types";

type LinkOption = {
	label: string;
	value: "live" | "preview";
	color: string;
	palette: "green" | "yellow";
	disabled?: boolean;
};

const toHref = (value?: string) => {
	const trimmed = value?.trim();
	if (!trimmed) {
		return undefined;
	}
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}
	return `https://${trimmed}`;
};

const sessionToken = () =>
	Cookies.get(process.env.SESSION_TOKEN || "patstore_token");

/** First hop onto a draft host. The preview app stores the token and redirects to `next`. */
const toPreviewHref = (previewUrl?: string) => {
	const token = sessionToken();
	if (!previewUrl || !token) {
		return undefined;
	}
	const endpoint = new URL("/api/preview", previewUrl);
	endpoint.searchParams.set("sessionToken", token);
	endpoint.searchParams.set("next", "/");
	return endpoint.toString();
};

const Links = ({ project }: { project: PatstoreProject }) => {
	const url = toHref(project.settings?.url);
	const previewUrl = toHref(project.settings?.preview_url);
	const canPreview = Boolean(previewUrl && sessionToken());
	const [value, setValue] = useState<string[]>([]);

	const collection = useMemo(
		() =>
			createListCollection<LinkOption>({
				items: [
					{
						label: "Live",
						value: "live",
						color: "green.600",
						palette: "green"
					},
					{
						label: "Vorschau",
						value: "preview",
						color: "yellow.600",
						palette: "yellow",
						disabled: !canPreview
					}
				]
			}),
		[canPreview]
	);

	if (!url) {
		return null;
	}

	return (
		<Select.Root
			collection={collection}
			size="xs"
			width="140px"
			value={value}
			positioning={{ sameWidth: true }}
			onValueChange={(details) => {
				const selected = details.value[0];
				const href =
					selected === "preview" ? toPreviewHref(previewUrl) : url;
				if (href) {
					window.open(href, "_blank", "noopener,noreferrer");
				}
				setValue([]);
			}}
		>
			<Select.Trigger>
				<Select.ValueText placeholder="Webseite" />
				<Select.Indicator />
			</Select.Trigger>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						{collection.items.map((item) => (
							<Select.Item
								key={item.value}
								item={item}
								color={item.color}
							>
								<Status.Root
									colorPalette={item.palette}
									size="sm"
								>
									<Status.Indicator
										bg={
											item.palette === "yellow"
												? "yellow.600"
												: undefined
										}
									/>
								</Status.Root>
								<Select.ItemText flex="1">
									{item.label}
								</Select.ItemText>
								<Icon size="xs" aria-hidden>
									<ExternalLink />
								</Icon>
							</Select.Item>
						))}
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	);
};

export default Links;
