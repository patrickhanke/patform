/**
 * Parses the `time` string stored on a `DateObject`. The field is a plain
 * string so we accept either `"HH:MM"` for a single start time (default
 * duration is 60 minutes) or `"HH:MM-HH:MM"` for a start/end range.
 *
 * Returns the start and end of the event in minutes from midnight. Returns
 * `null` for full-day events (empty string or unparseable input).
 */
const parseEventTime = (
	time: string | undefined | null,
	full_day: boolean,
	default_duration = 60
): { start_minutes: number | null; end_minutes: number | null } => {
	if (full_day || !time) {
		return { start_minutes: null, end_minutes: null };
	}

	const parts = time.split("-").map((part) => part.trim());
	const start = toMinutes(parts[0]);
	if (start === null) {
		return { start_minutes: null, end_minutes: null };
	}

	const end =
		parts.length > 1 ? toMinutes(parts[1]) : start + default_duration;

	const safeEnd = end === null ? start + default_duration : end;

	return {
		start_minutes: start,
		end_minutes: Math.max(safeEnd, start + 15)
	};
};

const toMinutes = (hhmm: string | undefined): number | null => {
	if (!hhmm) return null;
	const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
	if (!match) return null;
	const hours = Math.min(23, Math.max(0, Number(match[1])));
	const minutes = Math.min(59, Math.max(0, Number(match[2])));
	return hours * 60 + minutes;
};

export const formatMinutes = (minutes: number): string => {
	const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(minutes)));
	const h = Math.floor(clamped / 60);
	const m = clamped % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const formatTimeRange = (
	start_minutes: number,
	end_minutes: number
): string => `${formatMinutes(start_minutes)}-${formatMinutes(end_minutes)}`;

export default parseEventTime;
