"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "@repo/ui";
import { ModuleOverviewProps } from "@repo/types";
import { parseScreen } from "./constants/screens";
import { SavingsGroupProvider } from "./hooks/SavingsGroupContext";
import useSavingsGroupData from "./hooks/useSavingsGroupData";
import Pinnwand from "./content/Pinnwand";
import Verein from "./content/Verein";
import Sparregeln from "./content/Sparregeln";
import Sparfachbelegung from "./content/Sparfachbelegung";
import Leerungen from "./content/Leerungen";
import Lotto from "./content/Lotto";
import Sonderbuchungen from "./content/Sonderbuchungen";
import Auszahlungen from "./content/Auszahlungen";
import Gemeinschaftskasse from "./content/Gemeinschaftskasse";
import Konto from "./content/Konto";
import Kassenbericht from "./content/Kassenbericht";
import Sparkoenig from "./content/Sparkoenig";

const SavingsGroup = ({ module }: ModuleOverviewProps<"/savings-group">) => {
	const pathname = usePathname();
	const slug = pathname.replace(/^\/savings-group\/?/, "").split("/")[0];
	const screen = parseScreen(slug);
	const value = useSavingsGroupData(module);

	return (
		<SavingsGroupProvider value={value}>
			<Suspense fallback={<Loader width="100%" height="100%" />}>
				{screen === "pinnwand" && <Pinnwand />}
				{screen === "verein" && <Verein />}
				{screen === "sparregeln" && <Sparregeln />}
				{screen === "sparfachbelegung" && <Sparfachbelegung />}
				{screen === "leerungen" && <Leerungen />}
				{screen === "lotto" && <Lotto />}
				{screen === "sonderbuchungen" && <Sonderbuchungen />}
				{screen === "auszahlungen" && <Auszahlungen />}
				{screen === "gemeinschaftskasse" && <Gemeinschaftskasse />}
				{screen === "konto" && <Konto />}
				{screen === "kassenbericht" && <Kassenbericht />}
				{(screen === "sparkoenig-auszahlung" ||
					screen === "sparkoenig-einwurf" ||
					screen === "sparkoenig-lottogewinn" ||
					screen === "sparkoenig-strafgeld") && (
					<Sparkoenig screen={screen} />
				)}
			</Suspense>
		</SavingsGroupProvider>
	);
};

export default SavingsGroup;
