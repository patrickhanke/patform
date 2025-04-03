"use client";

import React, { useRef } from "react";
import "./styles.scss";

import { useOnClickOutside } from "usehooks-ts";
import { motion, AnimatePresence } from "motion/react";
import { SlideInProps } from "./types";
import { ErrorDisplay, IconButton } from "@repo/ui";

const SlideIn: React.FC<SlideInProps> = ({
	header,
	preventClickOutside = false,
	children,
	isOpen,
	cancel,
	confirm,
	secondaryContent = null,
	showSecondaryContent = false,
	showCancelButton = true,
	disabled = [false, false],
	errors,
	confirmText
}) => {
	const ref = useRef(null);
	useOnClickOutside(ref, () => {
		if (preventClickOutside === true) return;
		cancel();
	});

	return (
		<>
			<div className={"overlay_container"} data-isopen={isOpen} />
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
								{children}
								<ErrorDisplay errors={errors} />
							</div>

							<motion.div
								animate={{
									width: showSecondaryContent ? 360 : 0
								}}
								transition={{ duration: 0.3, ease: "easeOut" }}
								className={"slidein_secondary_content"}
								data-open={showSecondaryContent ? true : false}
							>
								{secondaryContent}
							</motion.div>
						</div>
						<div className="slidein_footer">
							<div className="button_container">
								{showCancelButton && (
									<button
										className="full_button md light"
										disabled={disabled[0]}
										onClick={() => cancel()}
									>
										Abbrechen
									</button>
								)}
								<button
									className="full_button md primary"
									disabled={disabled[1]}
									onClick={() => confirm()}
								>
									{confirmText ? confirmText : "Speichern"}
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default SlideIn;
