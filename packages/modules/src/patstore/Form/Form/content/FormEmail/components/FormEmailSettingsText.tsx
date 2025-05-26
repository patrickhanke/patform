import { FC, useState } from "react";
import { FormEmailSettingsTextProps } from "../types";
import { get } from "lodash-es";
import { useDebounceCallback } from "usehooks-ts";
import { Eye, EyeOff } from "lucide-react";

const FormEmailSettingsText: FC<FormEmailSettingsTextProps> = ({
	settingsKey,
	settings,
	updateSettings,
	isPassword = false
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const onChange = useDebounceCallback(updateSettings, 1000);

	return (
		<div style={{ position: "relative" }}>
			<input
				defaultValue={
					get(settings, settingsKey, "") as unknown as string
				}
				onChange={(e) => onChange(settingsKey, e.target.value)}
				disabled={settings["response"] === false}
				type={isPassword && !showPassword ? "password" : "text"}
				style={isPassword ? { paddingRight: 32 } : {}}
			/>
			{isPassword && (
				<button
					type="button"
					onClick={() => setShowPassword((v) => !v)}
					tabIndex={-1}
					style={{
						position: "absolute",
						right: 4,
						top: "50%",
						transform: "translateY(-50%)",
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0
					}}
					aria-label={
						showPassword
							? "Passwort verbergen"
							: "Passwort anzeigen"
					}
				>
					{showPassword ? (
						<Eye size={12} color="#444444" />
					) : (
						<EyeOff size={12} color="#444444" />
					)}
				</button>
			)}
		</div>
	);
};

export default FormEmailSettingsText;
