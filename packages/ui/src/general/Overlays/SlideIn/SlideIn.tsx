"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./styles.scss";

import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "motion/react";
import { SlideInProps } from "./types";
import { ErrorDisplay, IconButton } from "@repo/ui";
import { Button } from "@chakra-ui/react";

const SlideIn: React.FC<SlideInProps> = ({
	header,
	preventClickOutside = false,
	children,
	isOpen,
	cancel,
	confirm,
	secondaryContent = null,
	showSecondaryContent = false,
	showConfirmButton = true,
	disabled = [false, false],
	errors,
	confirmText,
	loading = false
}) => {
	const ref = useRef(null);
	const [mounted, setMounted] = useState(false);

	useOnClickOutside(ref, () => {
		if (preventClickOutside === true) return;
		cancel();
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	// Rendered into the body because a transformed ancestor (e.g. Modal) would
	// otherwise become the containing block of the fixed positioned panel.
	return createPortal(
		<>
			{isOpen && (
				<div className={"overlay_container"} data-isopen={isOpen} />
			)}
			<AnimatePresence initial={true}>
				{isOpen && (
					<motion.div
						initial={{ right: -300 }}
						animate={{ right: 60 }}
						exit={{ right: -300 }}
						ref={ref}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={"slidein_container"}
					>
						<div className={"slidein_header"}>
							<h3>{header}</h3>
							<IconButton icon="close" onClick={() => cancel()} />
						</div>
						<div className="slidein_main_content">
							<div className={"slidein_content"}>
								<div className="children-container">
									{isOpen && children}
								</div>
								<div className="errors-container">
									<ErrorDisplay errors={errors} />
								</div>
							</div>

							<motion.div
								initial={{
									width: 0
								}}
								animate={{ width: 420 }}
								exit={{ width: 0 }}
								transition={{
									duration: 0.3,
									ease: "easeOut",
									delay: 0.1
								}}
								className={"slidein_secondary_content"}
								style={{
									display:
										secondaryContent && showSecondaryContent
											? "block"
											: "none"
								}}
								data-open={
									showSecondaryContent && isOpen
										? true
										: false
								}
							>
								{secondaryContent}
							</motion.div>
						</div>
						<div className="slidein_footer">
							<div className="button_container">
								<Button
									className="full_button md light"
									disabled={disabled[0]}
									onClick={() => cancel()}
									loading={loading}
								>
									Abbrechen
								</Button>
								{showConfirmButton && confirm && (
									<Button
										className="full_button md primary"
										disabled={disabled[1]}
										onClick={() => confirm()}
										loading={loading}
									>
										{confirmText
											? confirmText
											: "Speichern"}
									</Button>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>,
		document.body
	);
};

export default SlideIn;
