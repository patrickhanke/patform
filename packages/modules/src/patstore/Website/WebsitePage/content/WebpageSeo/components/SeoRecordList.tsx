"use client";

import { CreateButton, IconButton } from "@repo/ui";
import { isEqual } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export type SeoRecordColumn = {
	key: string;
	label: string;
	placeholder?: string;
};

type SeoRecordListProps<T extends Record<string, string>> = {
	addLabel: string;
	entries: T[];
	columns: SeoRecordColumn[];
	emptyEntry: T;
	onChange: (entries: T[]) => void;
};

const SeoRecordList = <T extends Record<string, string>>({
	addLabel,
	entries,
	columns,
	emptyEntry,
	onChange
}: SeoRecordListProps<T>) => {
	const [draft, setDraft] = useState(entries);
	const [rowIds, setRowIds] = useState<string[]>(() =>
		entries.map(() => v4())
	);
	const draftRef = useRef(entries);

	useEffect(() => {
		if (isEqual(entries, draftRef.current)) return;
		draftRef.current = entries;
		setDraft(entries);
		setRowIds(entries.map(() => v4()));
	}, [entries]);

	const updateDraft = (next: T[], nextIds?: string[]) => {
		draftRef.current = next;
		setDraft(next);
		if (nextIds) setRowIds(nextIds);
		onChange(next);
	};

	return (
		<div className="flex col gap-sm">
			{draft.map((entry, index) => (
				<div
					key={rowIds[index] ?? `seo-row-${index}`}
					className="flex row a-fe gap-sm"
				>
					{columns.map((column) => (
						<div key={column.key} className="flex col gap-xs">
							<label htmlFor={`${rowIds[index]}-${column.key}`}>
								{column.label}
							</label>
							<input
								id={`${rowIds[index]}-${column.key}`}
								value={entry[column.key] ?? ""}
								placeholder={column.placeholder}
								onChange={(event) => {
									updateDraft(
										draft.map((item, itemIndex) =>
											itemIndex === index
												? {
														...item,
														[column.key]:
															event.target.value
													}
												: item
										)
									);
								}}
							/>
						</div>
					))}
					<IconButton
						icon="delete"
						text="Entfernen"
						size={16}
						onClick={() =>
							updateDraft(
								draft.filter(
									(_, itemIndex) => itemIndex !== index
								),
								rowIds.filter(
									(_, itemIndex) => itemIndex !== index
								)
							)
						}
					/>
				</div>
			))}
			<CreateButton
				text={addLabel}
				size="small"
				onClick={() =>
					updateDraft(
						[...draft, { ...emptyEntry }],
						[...rowIds, v4()]
					)
				}
			/>
		</div>
	);
};

export default SeoRecordList;
