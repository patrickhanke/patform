"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { formatISO9075 } from "date-fns";
import type { CalendarDateObject } from "@repo/types";
import { SlideIn } from "../../../Overlays/SlideIn";
import type { CalendarEventSlideInProps } from "../../types";
import {
	formatMinutes
} from "../../functions/parseEventTime";

const CalendarEventSlideIn: FC<CalendarEventSlideInProps> = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	event,
	users,
	mode
}) => {
	const [draft, setDraft] = useState<CalendarDateObject | null>(event);

	useEffect(() => {
		setDraft(event);
	}, [event]);

	const firstDate = useMemo(() => {
		if (!draft) return "";
		const raw = draft.time.dates?.[0];
		if (!raw) return "";
		try {
			return formatISO9075(new Date(raw), { representation: "date" });
		} catch {
			return "";
		}
	}, [draft]);

	const { startTime, endTime } = useMemo(() => {
		if (!draft || draft.full_day)
			return { startTime: "09:00", endTime: "10:00" };
		const parts = (draft.time.time || "").split("-");
		const start = (parts[0] || "09:00").trim();
		const end = (parts[1] || addMinutes(start, 60)).trim();
		return { startTime: start, endTime: end };
	}, [draft]);

	if (!draft) {
		return (
			<SlideIn
				isOpen={isOpen}
				cancel={onClose}
				confirm={onClose}
				header="Termin"
			>
				<div />
			</SlideIn>
		);
	}

	const update = (patch: Partial<CalendarDateObject>) => {
		setDraft((current: CalendarDateObject | null) =>
			current ? { ...current, ...patch } : current
		);
	};

	const updateTime = (
		patch: Partial<CalendarDateObject["time"]>
	) => {
		setDraft((current: CalendarDateObject | null) =>
			current
				? {
						...current,
						time: { ...current.time, ...patch }
					}
				: current
		);
	};

	const setDate = (iso: string) => {
		updateTime({
			dates: iso ? [iso] : [],
			start_date: iso,
			end_date: iso
		});
	};

	const setTimes = (start: string, end: string) => {
		updateTime({ time: `${start}-${end}` });
	};

	const toggleUser = (userId: string) => {
		const current = draft.assigned_users || [];
		const next = current.includes(userId)
			? current.filter((id: string) => id !== userId)
			: [...current, userId];
		update({ assigned_users: next });
	};

	return (
		<SlideIn
			isOpen={isOpen}
			cancel={onClose}
			confirm={() => onSave(draft)}
			header={mode === "create" ? "Termin erstellen" : "Termin bearbeiten"}
			size="small"
			confirmText={mode === "create" ? "Erstellen" : "Speichern"}
		>
			<div className="calendar_form">
				<div className="calendar_form_field">
					<label htmlFor="calendar-event-label">Titel</label>
					<input
						id="calendar-event-label"
						type="text"
						value={draft.label}
						onChange={(e) =>
							update({ label: e.target.value })
						}
						placeholder="Titel des Termins"
					/>
				</div>

				<div className="calendar_form_checkbox">
					<input
						id="calendar-event-fullday"
						type="checkbox"
						checked={draft.full_day}
						onChange={(e) =>
							update({ full_day: e.target.checked })
						}
					/>
					<label htmlFor="calendar-event-fullday">Ganztägig</label>
				</div>

				<div className="calendar_form_field">
					<label htmlFor="calendar-event-date">Datum</label>
					<input
						id="calendar-event-date"
						type="date"
						value={firstDate}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>

				{!draft.full_day && (
					<div className="calendar_form_row">
						<div className="calendar_form_field">
							<label htmlFor="calendar-event-start">Von</label>
							<input
								id="calendar-event-start"
								type="time"
								value={startTime}
								onChange={(e) =>
									setTimes(e.target.value, endTime)
								}
							/>
						</div>
						<div className="calendar_form_field">
							<label htmlFor="calendar-event-end">Bis</label>
							<input
								id="calendar-event-end"
								type="time"
								value={endTime}
								onChange={(e) =>
									setTimes(startTime, e.target.value)
								}
							/>
						</div>
					</div>
				)}

				<div className="calendar_form_field">
					<label htmlFor="calendar-event-address">Ort</label>
					<input
						id="calendar-event-address"
						type="text"
						value={draft.place?.address || ""}
						onChange={(e) =>
							update({
								place: {
									...draft.place,
									type: "address",
									address: e.target.value
								}
							})
						}
						placeholder="Adresse / Raum"
					/>
				</div>

				<div className="calendar_form_field">
					<label htmlFor="calendar-event-text">Notizen</label>
					<textarea
						id="calendar-event-text"
						value={draft.text}
						onChange={(e) => update({ text: e.target.value })}
					/>
				</div>

				{users && users.length > 0 && (
					<div className="calendar_form_field">
						<label>Zuweisen</label>
						<div className="calendar_form_users">
							{users.map((user) => (
								<button
									type="button"
									key={user.objectId}
									className="calendar_form_user_chip"
									data-active={draft.assigned_users?.includes(
										user.objectId
									)}
									style={{
										borderColor: user.color,
										backgroundColor:
											draft.assigned_users?.includes(
												user.objectId
											)
												? user.color
												: undefined
									}}
									onClick={() => toggleUser(user.objectId)}
								>
									{user.label || user.objectId}
								</button>
							))}
						</div>
					</div>
				)}

				{mode === "edit" && onDelete && (
					<button
						type="button"
						className="calendar_form_delete_button"
						onClick={() => onDelete(draft.id)}
					>
						Termin löschen
					</button>
				)}
			</div>
		</SlideIn>
	);
};

const addMinutes = (hhmm: string, minutes: number): string => {
	const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
	if (!match) return hhmm;
	const total = Number(match[1]) * 60 + Number(match[2]) + minutes;
	return formatMinutes(total);
};

export default CalendarEventSlideIn;
