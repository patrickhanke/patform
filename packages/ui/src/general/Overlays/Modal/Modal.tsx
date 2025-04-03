import { Fragment } from "react/jsx-runtime";
import "./styles.scss";
import { ModalProps } from "./types";
import clsx from "clsx";
import { ErrorDisplay } from "@repo/ui";
import React from "react";

const Modal: React.FC<ModalProps> = ({
	children,
	header,
	isOpen = false,
	cancelButtonHandler,
	confirmButtonHandler,
	buttonDisabled = [false, false],
	errors = [],
	confirmButtonText = "Bestätigen"
}) => {
	if (isOpen === true)
		return (
			<Fragment key={header}>
				<div
					className={clsx("modal_overlay_container", "modal_animate")}
				/>

				<div className={clsx("modal_container", "animate")}>
					<div className={"modal_header"}>
						<h3>{header}</h3>
					</div>
					<div className={"modal_content"}>
						{isOpen && children}
						<ErrorDisplay errors={errors} />
					</div>
					<div className={"modal_footer"}>
						<button
							className={clsx("full_button", "md", "light")}
							onClick={() => cancelButtonHandler()}
							disabled={buttonDisabled[0]}
						>
							Abbrechen
						</button>
						{confirmButtonHandler && (
							<button
								className={clsx("full_button", "md", "dark")}
								onClick={() => confirmButtonHandler()}
								disabled={buttonDisabled[1]}
							>
								{confirmButtonText}
							</button>
						)}
					</div>
				</div>
			</Fragment>
		);
	return null;
};

export default Modal;
