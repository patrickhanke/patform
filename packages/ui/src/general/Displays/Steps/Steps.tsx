import React from "react";
import { Steps as ChakraSteps } from "@chakra-ui/react";
import { StepsProps } from "./types";

const Steps: React.FC<StepsProps> = ({
	steps,
	step,
	orientation = "horizontal",
	colorPalette = "green"
}) => {
	return (
		<ChakraSteps.Root
			size={"xs"}
			step={step}
			colorPalette={colorPalette}
			defaultStep={1}
			count={steps.length}
			orientation={orientation}
		>
			<ChakraSteps.List>
				{steps.map((step, index) => (
					<ChakraSteps.Item
						key={step.value}
						index={index}
						title={step.label}
					>
						<ChakraSteps.Indicator />
						<ChakraSteps.Title>{step.label}</ChakraSteps.Title>
						<ChakraSteps.Separator />
					</ChakraSteps.Item>
				))}
			</ChakraSteps.List>

			{steps.map(
				(step, index) =>
					step.description && (
						<ChakraSteps.Content key={step.value} index={index}>
							{step.description}
						</ChakraSteps.Content>
					)
			)}
		</ChakraSteps.Root>
	);
};

export default Steps;
