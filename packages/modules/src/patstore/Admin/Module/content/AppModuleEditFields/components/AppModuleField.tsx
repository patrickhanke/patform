import { Divider, Form, IconButton, SlideInForm } from "@repo/ui";
import { Field, ModuleFieldTimesSettings } from "@repo/types";

import { AppModuleFieldProps } from "../types";
import { useMemo, useState } from "react";

const readOnlyFields = ["createdAt", "updatedAt", "slug"];

const AppModuleField = ({ field, changeField }: AppModuleFieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const formFields = useMemo(
		() => [
			{
				id: "active",
				label: "Aktiv",
				name: "active",
				type: "toggle" as const,
				value: field.active,
				disabled: field.default
			},
			{
				id: "required",
				label: "Pflichtfeld",
				name: "required",
				type: "toggle" as const,
				value: field.required,
				disabled: readOnlyFields.includes(field.id)
			},
			{
				id: "hidden",
				label: "Versteckt",
				name: "hidden",
				type: "toggle" as const,
				value: field.hidden,
				disabled: !readOnlyFields.includes(field.id)
			},
			{
				id: "label",
				label: "Label",
				name: "label",
				type: "input",
				value: field.label,
				disabled: !field.active
			}
		],
		[field]
	);

	const settingsFields: Field[] = useMemo(() => {
		if (!field.settings) return [];
		const settings = field.settings as Record<string, boolean>;
		return Object.keys(settings).map((key) => ({
			id: key,
			label: key,
			name: key,
			type: "toggle" as const,
			value: settings[key] ?? false
		}));
	}, [field.settings]);

	return (
		<>
			<div>
				<h3>
					{field.default === false
						? field.label
						: ` ${field.label} (Standardfeld)`}
				</h3>
			</div>
			<Form
				fields={formFields as Field[]}
				data={field}
				formSubmitHandler={(values) =>
					changeField({ ...field, ...values })
				}
				showRequired={false}
				isHorizontal
				useWithDebounce
			/>
			{field.settings && Object.keys(field.settings).length > 0 && (
				<>
					<Divider showLine />
					<div className="flex row a-ce j-sb">
						<label data-is_horizontal="true" htmlFor="settings">
							Einstellungen
						</label>
						<IconButton
							key="settings"
							icon="settings"
							onClick={() => {
								setIsOpen(true);
							}}
							text="Einstellungen"
						/>
					</div>
				</>
			)}
			{field.settings && Object.keys(field.settings).length > 0 && (
				<div>
					<SlideInForm
						title="Einstellungen"
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						dataHandler={(values) => {
							if (field.id === "times") {
								changeField({
									...field,
									settings: {
										...field.settings,
										...(values as Partial<ModuleFieldTimesSettings>)
									}
								});
								return;
							}

							changeField({
								...field,
								settings: {
									...field.settings,
									...(values as Record<string, boolean>)
								}
							});
						}}
						fields={settingsFields}
						isHorizontal
						data={field.settings}
					/>
				</div>
			)}
		</>
	);
};

export default AppModuleField;
