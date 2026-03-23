import { Fragment } from "react/jsx-runtime";
import "./styles.scss";
import { ModalProps } from "./types";
import clsx from "clsx";
import { ErrorDisplay } from "@repo/ui";
import React from "react";
import { Button } from "@chakra-ui/react";

const Modal: React.FC<ModalProps> = ({
	children,
	header,
	isOpen = false,
	cancelButtonHandler,
	confirmButtonHandler,
	buttonDisabled = [false, false],
	errors = [],
	confirmButtonText = "Bestätigen",
	cancelButtonText = "Abbrechen",
	styles = {},
	loading = false
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
					<div className={"modal_content"} style={styles}>
						{isOpen && children}
						<ErrorDisplay errors={errors} />
					</div>
					<div className={"modal_footer"}>
						<Button
							className="full_button md light"
							onClick={() => cancelButtonHandler()}
							disabled={buttonDisabled[0]}
							loading={loading}
						>
							{cancelButtonText}
						</Button>
						{confirmButtonHandler && (
							<Button
								className="full_button md primary"
								onClick={() => confirmButtonHandler()}
								disabled={buttonDisabled[1]}
								loading={loading}
							>
								{confirmButtonText}
							</Button>
						)}
					</div>
				</div>
			</Fragment>
		);
	return null;
};

export default Modal;
