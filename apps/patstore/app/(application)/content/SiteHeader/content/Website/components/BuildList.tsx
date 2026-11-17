"use client";

import { format } from "date-fns";
import { Button, Spinner, Stack, Text, Timeline } from "@chakra-ui/react";
import { InfoBox, SlideIn } from "@repo/ui";
import { WebsiteBuildStatus, WebsiteDeployment } from "../types";

const HISTORY_LABEL: Record<WebsiteBuildStatus, string> = {
	success: "Erfolgreich",
	building: "Wird gebaut",
	failed: "Fehlgeschlagen"
};

const STATUS_PALETTE: Record<WebsiteBuildStatus, "green" | "yellow" | "red"> = {
	success: "green",
	building: "yellow",
	failed: "red"
};

const formatWhen = (value: string) => {
	const date = new Date(
		value.includes("T") ? value : value.replace(" ", "T")
	);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return format(date, "dd.MM.yyyy, HH:mm");
};

export type BuildListProps = {
	isOpen: boolean;
	onClose: () => void;
	deployments: WebsiteDeployment[];
	latestStatus: WebsiteBuildStatus;
	retryFailed: boolean;
	notified: boolean;
	retrying: boolean;
	notifying: boolean;
	actionError?: string;
	onRetry: () => void;
	onNotify: () => void;
};

const BuildList = ({
	isOpen,
	onClose,
	deployments,
	latestStatus,
	retryFailed,
	notified,
	retrying,
	notifying,
	actionError,
	onRetry,
	onNotify
}: BuildListProps) => (
	<SlideIn
		header="Letzte Builds"
		isOpen={isOpen}
		cancel={onClose}
		showConfirmButton={false}
		cancelText="Schließen"
	>
		<Stack gap={4} align="stretch">
			{latestStatus === "failed" && !retryFailed && (
				<Stack gap={3} align="flex-start">
					<InfoBox
						status="error"
						maxWidth="100%"
						text="Der letzte Build ist fehlgeschlagen. Bitte versuchen Sie, die Seite erneut zu bauen."
					/>
					<Button
						className="full_button md primary"
						onClick={onRetry}
						loading={retrying}
					>
						Erneut bauen
					</Button>
				</Stack>
			)}

			{retryFailed && !notified && (
				<Stack gap={3} align="flex-start">
					<InfoBox
						status="error"
						maxWidth="100%"
						text="Der Build schlägt derzeit fehl."
					/>
					<Button
						className="full_button md primary"
						onClick={onNotify}
						loading={notifying}
					>
						Administrator kontaktieren
					</Button>
				</Stack>
			)}

			{retryFailed && notified && (
				<InfoBox
					status="success"
					maxWidth="100%"
					text="Der Administrator wurde benachrichtigt"
				/>
			)}

			{actionError && (
				<Text margin={0} color="red.fg" fontSize="xs">
					{actionError}
				</Text>
			)}

			<Timeline.Root size="sm" variant="subtle">
				{deployments.map((deployment) => (
					<Timeline.Item key={deployment.id}>
						<Timeline.Connector>
							<Timeline.Separator />
							<Timeline.Indicator
								colorPalette={STATUS_PALETTE[deployment.status]}
								bg={
									deployment.status === "building"
										? "yellow.600"
										: undefined
								}
							>
								{deployment.status === "building" ? (
									<Spinner size="xs" color="white" />
								) : null}
							</Timeline.Indicator>
						</Timeline.Connector>
						<Timeline.Content>
							<Timeline.Title>
								{HISTORY_LABEL[deployment.status]}
							</Timeline.Title>
							<Timeline.Description>
								{formatWhen(deployment.createdAt)}
								{deployment.commit
									? ` · ${deployment.commit.slice(0, 7)}`
									: ""}
							</Timeline.Description>
							{deployment.message && (
								<Text
									fontSize="xs"
									color="fg.muted"
									lineClamp={2}
								>
									{deployment.message}
								</Text>
							)}
						</Timeline.Content>
					</Timeline.Item>
				))}
			</Timeline.Root>
		</Stack>
	</SlideIn>
);

export default BuildList;
