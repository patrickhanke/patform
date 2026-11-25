import { InfoBox } from "@repo/ui";
import Image from "next/image";
import imagePath from "../images/spielgemeinschaften_1.png";
import imagePath2 from "../images/spielgemeinschaften_2.png";
import styles from "../Dashboard.module.scss";

const PrellballContent = () => {
	return (
		<div>
			<InfoBox
				status="warning"
				text="Änderuungen bei den Spielgemeinschaften, bitte lesen"
			/>
			<div className={styles.prellball_list}>
				<h3>Spielgemeinschaften</h3>
				<ul>
					<li>
						Die Spielgemeinschaften setzen sich in Zukunft aus zwei
						Vereinen zusammen. Dabie Gibt es einen Hauptvereine und
						einen Zweitverein. Die Verantwortlichen für den
						Hauptverein haben das Recht, auch auf die
						Spielgemeineschaft zuzugreifen.
					</li>
					<li>
						Um zu sehen, welche Spielgemeinschaften mit dem eigenen
						Verein verknüpft sind, gibt es in der Vereinsübersicht
						den Reiter <b>Spielgemeinschaften</b>. Dort werden alle
						aktiv verknüpften Spielgemeinschagten des Vereins
						angezeigt.
						<Image
							src={imagePath}
							alt="Spielgemeinschaften"
							width={600}
							height={300}
						/>
					</li>
					<li>
						Ist ein Verein der Hauptverein, kann er die
						Spielgemeinschaft über den Button{" "}
						<b>Spielgemeinschaft bearbeiten</b> bearbeite und
						darüber auch die Meldung vornhemen.
					</li>
					<li>
						Initial ist eine Spielgemeinschaft ohne Spieler. Damit
						eine Spielgemeinschaft Spieler melden kann, müssen{" "}
						<b>beide</b> Vereine der Spielgemeinschaft Spieler
						hinzufügen. Dies geschieht über den Button{" "}
						<b>Spieler:innen auswählen</b>.
						<Image
							src={imagePath2}
							alt="Spielgemeinschaften"
							width={600}
							height={300}
						/>
					</li>
				</ul>
				<p>
					Nachdem beide Vereine der Spielgemeinschaft Spieler
					hinzugefügt haben, kann diese bei der Meldung auswählen und
					dann für die SG melden.
				</p>
			</div>
		</div>
	);
};

export default PrellballContent;
