"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Spinner, Status } from "@chakra-ui/react";
import { useAppContext } from "@repo/provider";
import {
	fetchWebsiteBuildState,
	notifyWebsiteAdministrator,
	retryWebsiteBuild
} from "./actions";
import { BuildList, Links } from "./components";
import { WebsiteBuildStatus, WebsiteDeployment } from "./types";

const POLL_INTERVAL = 10_000;

const HEADER_LABEL: Record<WebsiteBuildStatus, string> = {
	success: "Webseite aktuell",
	building: "Webseite wird aktualisiert",
	failed: "Aktualisierung fehlgeschlagen"
};

const STATUS_PALETTE: Record<WebsiteBuildStatus, "green" | "yellow" | "red"> = {
	success: "green",
	building: "yellow",
	failed: "red"
};

// yellow.solid is yellow.400 and disappears on white. 800 stays yellow and stays readable.
const STATUS_COLOR: Record<WebsiteBuildStatus, string> = {
	success: "green",
	building: "yellow.600",
	failed: "red"
};

type RetryRecord = {
	previousDeploymentId: string;
	notified: boolean;
};

const retryKey = (projectId: string) =>
	`patstore-website-build-retry:${projectId}`;

const readRetry = (projectId: string): RetryRecord | null => {
	try {
		const raw = sessionStorage.getItem(retryKey(projectId));
		if (!raw) {
			return null;
		}
		const parsed = JSON.parse(raw) as RetryRecord;
		if (!parsed?.previousDeploymentId) {
			return null;
		}
		return {
			previousDeploymentId: parsed.previousDeploymentId,
			notified: parsed.notified === true
		};
	} catch {
		return null;
	}
};

const writeRetry = (projectId: string, record: RetryRecord) => {
	sessionStorage.setItem(retryKey(projectId), JSON.stringify(record));
};

const clearRetry = (projectId: string) => {
	sessionStorage.removeItem(retryKey(projectId));
};

const Website = () => {
	const { project } = useAppContext<"patstore">();
	const projectKey = project ? project.settings?.uuid : null;
	const projectId = project?.objectId;
	const [deployments, setDeployments] = useState<WebsiteDeployment[]>([]);
	const [pending, setPending] = useState(false);
	const [open, setOpen] = useState(false);
	const [retry, setRetry] = useState<RetryRecord | null>(null);
	const [retrying, setRetrying] = useState(false);
	const [notifying, setNotifying] = useState(false);
	const [actionError, setActionError] = useState<string>();

	const load = useCallback(async () => {
		if (!projectKey) {
			return [];
		}
		const result = await fetchWebsiteBuildState();
		if (!result.applicable) {
			return [];
		}
		return result.deployments;
	}, [projectKey]);

	useEffect(() => {
		if (!projectId) {
			setRetry(null);
			return;
		}
		setRetry(readRetry(projectId));
	}, [projectId]);

	useEffect(() => {
		let cancelled = false;
		setDeployments([]);
		setPending(!!projectKey);
		if (!projectKey) {
			return;
		}

		const run = async () => {
			const next = await load();
			if (cancelled) {
				return;
			}
			if (next.length > 0) {
				setDeployments(next);
			}
			setPending(false);
		};

		void run();
		const pollInterval = window.setInterval(() => {
			void run();
		}, POLL_INTERVAL);

		return () => {
			cancelled = true;
			window.clearInterval(pollInterval);
		};
	}, [projectKey, load]);

	const latest = deployments[0];

	useEffect(() => {
		if (!projectId || !latest || latest.status !== "success") {
			return;
		}
		clearRetry(projectId);
		setRetry(null);
	}, [projectId, latest]);

	const retryFailed =
		!!retry &&
		!!latest &&
		latest.status === "failed" &&
		latest.id !== retry.previousDeploymentId;

	const retryBuild = async () => {
		if (!projectId || !latest || retrying) {
			return;
		}
		setRetrying(true);
		setActionError(undefined);
		const result = await retryWebsiteBuild();
		setRetrying(false);
		if (!result.ok) {
			setActionError(
				result.error || "Der Build konnte nicht gestartet werden."
			);
			return;
		}
		const next = {
			previousDeploymentId: latest.id,
			notified: false
		};
		writeRetry(projectId, next);
		setRetry(next);
		const refreshed = await load();
		if (refreshed.length > 0) {
			setDeployments(refreshed);
		}
	};

	const notifyAdministrator = async () => {
		if (!projectId || !retry || notifying) {
			return;
		}
		setNotifying(true);
		setActionError(undefined);
		const result = await notifyWebsiteAdministrator();
		setNotifying(false);
		if (!result.ok) {
			setActionError(
				result.error ||
					"Die Benachrichtigung konnte nicht gesendet werden."
			);
			return;
		}
		const next = { ...retry, notified: true };
		writeRetry(projectId, next);
		setRetry(next);
	};

	if (!project) {
		return null;
	}

	return (
		<>
			<Links project={project} />
			{projectKey && pending && !latest && (
				<Spinner size="sm" aria-label="Build-Status wird geladen" />
			)}
			{projectKey && latest && (
				<>
					<Button
						variant="plain"
						size="sm"
						h="auto"
						minW="unset"
						px={1}
						fontWeight="medium"
						onClick={() => setOpen(true)}
						borderRadius="full"
						border="1px solid"
						paddingX={2}
						paddingY={1}
						borderColor={STATUS_COLOR[latest.status]}
						color={STATUS_COLOR[latest.status]}
					>
						<Status.Root
							colorPalette={STATUS_PALETTE[latest.status]}
							size="sm"
						>
							{latest.status === "building" ? (
								<Spinner size="xs" color="yellow.800" />
							) : (
								<Status.Indicator />
							)}
							{HEADER_LABEL[latest.status]}
						</Status.Root>
					</Button>

					<BuildList
						isOpen={open}
						onClose={() => setOpen(false)}
						deployments={deployments}
						latestStatus={latest.status}
						retryFailed={retryFailed}
						notified={retry?.notified === true}
						retrying={retrying}
						notifying={notifying}
						actionError={actionError}
						onRetry={() => void retryBuild()}
						onNotify={() => void notifyAdministrator()}
					/>
				</>
			)}
		</>
	);
};

export default Website;
