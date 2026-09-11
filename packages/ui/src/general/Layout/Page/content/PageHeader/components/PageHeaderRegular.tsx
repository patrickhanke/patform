import { Dispatch, forwardRef, SetStateAction } from "react";
import { PageNavigation } from "../../PageNavigation";
import { Plus, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { isArray } from "lodash-es";
import CreateClass from "../content/CreateClass";
import { PageHeaderButton, PageHeaderRegularProps } from "../types";
import "../styles.scss";
import { languages_short, useUnsavedChangesGuard } from "@repo/provider";
import { PageState } from "@repo/types";
import { SwitchButtons } from "@repo/ui";

const PageHeaderRegular = forwardRef<HTMLDivElement, PageHeaderRegularProps>(
	(
		{
			title,
			description,
			pageHeaderButtons,
			pageHeaderContent,
			emptyContent,
			createClass,
			refetch,
			pageStates = [],
			pageState,
			setPageState,
			languages,
			activeLang,
			setActiveLang
		},
		ref
	) => {
		const { guard, unsavedChangesModal } = useUnsavedChangesGuard();

		const handleButtonClick = (button: PageHeaderButton) => {
			guard(() => button.onClick());
		};

		const handlePageStateChange: Dispatch<SetStateAction<PageState>> = (
			nextState
		) => {
			if (!setPageState) return;
			const resolved =
				typeof nextState === "function"
					? nextState(pageState as PageState)
					: nextState;
			if (pageState && resolved.value === pageState.value) return;
			guard(() => setPageState(resolved));
		};

		const languageButtons =
			languages?.map((language) => ({
				value: language,
				label:
					languages_short.find((l) => l.value === language)?.label ||
					"",
				disabled: false
			})) || [];

		return (
			<div ref={ref} className="pageheader_content">
				<div className={"pageheader_content_container"}>
					<div>
						<h2>{title}</h2>
						{description && (
							<p style={{ marginTop: "18px" }}>{description}</p>
						)}
					</div>
					<div className="button_container">
						{languages && languages.length > 1 && (
							<SwitchButtons
								currentStates={languageButtons?.find(
									(l) => l.value === activeLang
								)}
								buttonStates={languageButtons}
								changeHandler={(language) =>
									setActiveLang(language.value)
								}
							/>
						)}
						{isArray(pageHeaderButtons) &&
							pageHeaderButtons?.length > 0 && (
								<div className={"pageheader_button_container"}>
									{isArray(pageHeaderButtons) &&
										pageHeaderButtons.map((button) => (
											<button
												key={button.text}
												data-color={
													button.color || "primary"
												}
												className={clsx(
													"full_button",
													"md",
													"primary",
													"pageheader_createbutton"
												)}
												onClick={() =>
													handleButtonClick(button)
												}
												disabled={button.disabled}
											>
												{button.is_add_button && (
													<div className={"add_icon"}>
														<Plus
															strokeWidth={1}
															size={12}
														/>
													</div>
												)}
												{button.is_reset_button && (
													<div className={"add_icon"}>
														<RotateCcw
															strokeWidth={1}
															size={12}
														/>
													</div>
												)}
												<span>{`${button.text}`}</span>
											</button>
										))}
								</div>
							)}
						{(pageHeaderContent || emptyContent) && (
							<>
								<div>{pageHeaderContent}</div>
							</>
						)}
						{createClass?.className && (
							<CreateClass
								initialData={createClass.initialData}
								fields={createClass.fields}
								text={
									createClass.text || "Neues Objekt erstellen"
								}
								className={createClass.className}
								refetch={refetch}
								languages={createClass.languages}
								initialState={createClass.initialState}
							/>
						)}
					</div>
				</div>
				{pageStates.length > 0 && pageState && setPageState && (
					<PageNavigation
						siteStates={pageStates}
						activeState={pageState}
						onClick={handlePageStateChange}
					/>
				)}
				{unsavedChangesModal}
			</div>
		);
	}
);

PageHeaderRegular.displayName = "PageHeaderRegular";

export default PageHeaderRegular;
