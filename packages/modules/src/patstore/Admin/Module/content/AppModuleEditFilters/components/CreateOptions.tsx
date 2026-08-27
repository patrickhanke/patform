import { FC } from "react";
import { CreateButton } from "@repo/ui";
import { CreateOptionsProps } from "../types";

const CreateOptions: FC<CreateOptionsProps> = ({ filter, changeHandler }) => {
	const selectOptions = filter.options?.select_options || [];

	return (
		<div>
			<label>Optionen</label>
			<CreateButton
				text="Neue Option hinzufügen"
				size="small"
				onClick={() => {
					changeHandler(
						["options.select_options"],
						[
							[
								...selectOptions,
								{
									label: "",
									value: ""
								}
							]
						]
					);
				}}
			/>
			<div>
				{selectOptions.map((option, index) => (
					<div
						key={`option-${index}`}
						className="app_module_option_container"
					>
						<div className="app_module_option">
							<label>Label</label>
							<input
								type="text"
								defaultValue={option.label}
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
								type="text"
								defaultValue={option.value}
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
				))}
			</div>
		</div>
	);
};

export default CreateOptions;
