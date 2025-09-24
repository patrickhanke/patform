"use client";

import {
	Button,
	Checkbox,
	CheckboxGroup,
	Code,
	Fieldset
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import { CheckboxGroupProps } from "./types";

const CheckboxGroupComponent: FC<CheckboxGroupProps> = ({
	items,
	onChange,
	defaultValue
}) => {
	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<FormData>();

	const framework = useController({
		control,
		name: "framework",
		defaultValue: defaultValue || []
	});

	const invalid = !!errors.framework;

	console.log({ errors });
	console.log({ framework });

	useEffect(() => {
		console.log({ framework });
		onChange(framework.field.value as unknown as string[]);
	}, [framework]);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				console.log(data);
				onChange(data);
			})}
		>
			<Fieldset.Root invalid={invalid}>
				<Fieldset.Legend>Select your framework</Fieldset.Legend>
				<CheckboxGroup
					size="sm"
					invalid={invalid}
					value={framework.field.value}
					onValueChange={framework.field.onChange}
					name={framework.field.name}
				>
					<Fieldset.Content>
						{items.map((item) => (
							<Checkbox.Root
								size="xs"
								key={item.value}
								value={item.value}
								gap={2}
							>
								<Checkbox.HiddenInput />
								<Checkbox.Control />
								<Checkbox.Label>{item.label}</Checkbox.Label>
							</Checkbox.Root>
						))}
					</Fieldset.Content>
				</CheckboxGroup>

				{errors.framework && (
					<Fieldset.ErrorText>
						{errors.framework.message}
					</Fieldset.ErrorText>
				)}

				<Button size="sm" type="submit" alignSelf="flex-start">
					Submit
				</Button>

				<Code>
					Values: {JSON.stringify(framework.field.value, null, 2)}
				</Code>
			</Fieldset.Root>
		</form>
	);
};

export default CheckboxGroupComponent;
