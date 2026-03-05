import React, { FC } from "react";
import { CreateButton } from "@repo/ui";
import { get } from "lodash-es";
import { CreateOptionsProps } from "../types";

const CreateOptions: FC<CreateOptionsProps> = ({ filter, changeHandler }) => {
	return (
		<div>
			<label>Optionen</label>
			<CreateButton
				text="Neue Option hinzufügen"
				size="small"
				onClick={() => {
					const newOption = {
						label: "",
						value: ""
					};
					const existingOptions =
						filter.options?.select_options || [];
					const newOptions = [...existingOptions, newOption];
					console.log({ newOptions });
					changeHandler(["options.select_options"], [newOptions]);
				}}
			/>
			<div>
				{filter.options?.select_options?.map(
					(
						option: { value: string; label: string },
						index: number
					) => (
						<div
							key={option.value}
							className="app_module_option_container"
						>
							<div className="app_module_option">
								<label>Label</label>
								<input
									key={get(
										filter,
										`select_options[${index}].label`
									)}
									defaultValue={get(
										filter,
										`select_options[${index}].label`,
										""
									)}
									type="text"
									placeholder="Label"
									onChange={(e) =>
										changeHandler(
											[
												`options.select_options[${index}].label`
											],
											[e.target.value]
										)
									}
								/>
							</div>
							<div className="app_module_option">
								<label>Wert</label>
								<input
									key={get(
										filter,
										`options.select_options[${index}].value`
									)}
									defaultValue={get(
										filter,
										`options.select_options[${index}].value`,
										""
									)}
									type="text"
									placeholder="Value"
									onChange={(e) =>
										changeHandler(
											[
												`options.select_options[${index}].value`
											],
											[e.target.value]
										)
									}
								/>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default CreateOptions;
