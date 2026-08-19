"use client";

import {
	ComponentProps,
	MouseEvent as ReactMouseEvent,
	useCallback,
	useRef,
	useState
} from "react";
import { Modal, usePageData } from "@repo/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

const resolveHref = (href: ComponentProps<typeof Link>["href"]): string => {
	if (typeof href === "string") return href;
	if (href.href) return href.href;

	const search =
		typeof href.search === "string"
			? href.search.startsWith("?")
				? href.search
				: `?${href.search}`
			: "";

	return `${href.pathname ?? ""}${search}${href.hash ?? ""}`;
};

const useUnsavedChangesGuard = () => {
	const { dataHasChanged, resetData } = usePageData();
	const [isOpen, setIsOpen] = useState(false);
	const pendingActionRef = useRef<(() => void) | null>(null);

	const guard = useCallback(
		(action: () => void) => {
			if (dataHasChanged) {
				pendingActionRef.current = action;
				setIsOpen(true);
				return;
			}
			action();
		},
		[dataHasChanged]
	);

	const handleCancel = useCallback(() => {
		pendingActionRef.current = null;
		setIsOpen(false);
	}, []);

	const handleConfirm = useCallback(() => {
		const action = pendingActionRef.current;
		pendingActionRef.current = null;
		setIsOpen(false);
		resetData();
		action?.();
	}, [resetData]);

	const unsavedChangesModal = (
		<Modal
			header="Ungespeicherte Änderungen"
			isOpen={isOpen}
			cancelButtonHandler={handleCancel}
			confirmButtonHandler={handleConfirm}
			confirmButtonText="Änderungen verwerfen"
			cancelButtonText="Abbrechen"
		>
			<p>
				Sie haben ungespeicherte Änderungen. Wenn Sie fortfahren, gehen
				diese verloren.
			</p>
		</Modal>
	);

	return { guard, unsavedChangesModal };
};

const isModifiedClick = (event: ReactMouseEvent<HTMLAnchorElement>): boolean =>
	event.button !== 0 ||
	event.metaKey ||
	event.altKey ||
	event.ctrlKey ||
	event.shiftKey;

export const PatstoreLink = ({
	href,
	replace,
	scroll,
	onClick,
	children,
	...props
}: ComponentProps<typeof Link>) => {
	const router = useRouter();
	const { guard, unsavedChangesModal } = useUnsavedChangesGuard();

	return (
		<>
			<Link
				href={href}
				replace={replace}
				scroll={scroll}
				{...props}
				onClick={(event) => {
					onClick?.(event);
					if (event.defaultPrevented || isModifiedClick(event)) {
						return;
					}

					event.preventDefault();
					guard(() => {
						const path = resolveHref(href);
						const options =
							scroll === undefined ? undefined : { scroll };
						if (replace) {
							router.replace(path, options);
							return;
						}
						router.push(path, options);
					});
				}}
			>
				{children}
			</Link>
			{unsavedChangesModal}
		</>
	);
};

export default useUnsavedChangesGuard;
