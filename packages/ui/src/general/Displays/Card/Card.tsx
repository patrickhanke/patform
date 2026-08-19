import React, { FC } from "react";
import { Card as ChakraCard } from "@chakra-ui/react";
import { IconButton } from "@repo/ui";

type CardProps = {
	title?: string;
	description?: string;
	saveButtonHandler?: () => void;
	editButtonHandler?: () => void;
	deleteButtonHandler?: () => void;
	children?: React.ReactNode;
};

const Card: FC<CardProps> = ({
	title,
	description,
	saveButtonHandler,
	editButtonHandler,
	deleteButtonHandler,
	children
}) => {
	return (
		<ChakraCard.Root width="320px">
			<ChakraCard.Body gap="2">
				<ChakraCard.Title mt="2">{title}</ChakraCard.Title>
				{description && (
					<ChakraCard.Description>
						{description}
					</ChakraCard.Description>
				)}
				{children}
			</ChakraCard.Body>
			<ChakraCard.Footer justifyContent="flex-end">
				<div className="flex gap-sm">
					{saveButtonHandler && (
						<IconButton
							icon="save"
							onClick={saveButtonHandler}
							text="Speichern"
						/>
					)}
					{editButtonHandler && (
						<IconButton
							icon="edit"
							onClick={editButtonHandler}
							text="Bearbeiten"
						/>
					)}
					{deleteButtonHandler && (
						<IconButton
							icon="delete"
							onClick={deleteButtonHandler}
							text="Löschen"
						/>
					)}
				</div>
			</ChakraCard.Footer>
		</ChakraCard.Root>
	);
};

export default Card;
