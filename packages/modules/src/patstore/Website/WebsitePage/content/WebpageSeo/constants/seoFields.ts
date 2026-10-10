import { Field } from "@repo/types";
import { NONE } from "../utils/seoForm";

type Option = { label: string; value: string };

const input = (
	name: string,
	label: string,
	extra?: Partial<Extract<Field, { type: "input" | "url" | "textarea" }>>
): Field => ({
	id: `seo-${name}`,
	name,
	label,
	type: "input",
	...extra
});

const textarea = (
	name: string,
	label: string,
	extra?: Partial<Extract<Field, { type: "textarea" }>>
): Field => ({
	id: `seo-${name}`,
	name,
	label,
	type: "textarea",
	...extra
});

const select = (
	name: string,
	label: string,
	options: Option[],
	description?: string
): Field => ({
	id: `seo-${name}`,
	name,
	label,
	type: "select",
	dataType: "string",
	select_options: options,
	description,
	width: 320
});

const image = (name: string, label: string, description?: string): Field => ({
	id: `seo-${name}`,
	name,
	label,
	type: "image_select",
	description,
	options: {
		return_type: "string",
		max_file_count: 1
	}
});

const withCurrent = (options: Option[], current?: string): Option[] => {
	if (
		!current ||
		current === NONE ||
		options.some((option) => option.value === current)
	) {
		return options;
	}
	return [...options, { label: current, value: current }];
};

const noneOption = (label = "Keine Angabe"): Option => ({
	label,
	value: NONE
});

const ROBOT_OPTIONS: Option[] = [
	noneOption("Suchmaschine entscheidet"),
	{ label: "Index, Follow", value: "index, follow" },
	{ label: "Noindex, Follow", value: "noindex, follow" },
	{ label: "Index, Nofollow", value: "index, nofollow" },
	{ label: "Noindex, Nofollow", value: "noindex, nofollow" }
];

const OPEN_GRAPH_OPTIONS: Option[] = [
	noneOption(),
	{ label: "Website", value: "website" },
	{ label: "Artikel", value: "article" },
	{ label: "Buch", value: "book" },
	{ label: "Profil", value: "profile" },
	{ label: "Song", value: "music.song" },
	{ label: "Album", value: "music.album" },
	{ label: "Playlist", value: "music.playlist" },
	{ label: "Radiosender", value: "music.radio_station" },
	{ label: "Film", value: "video.movie" },
	{ label: "Episode", value: "video.episode" },
	{ label: "Serie", value: "video.tv_show" },
	{ label: "Video", value: "video.other" },
	{ label: "Produkt", value: "product" }
];

const TWITTER_CARD_OPTIONS: Option[] = [
	noneOption(),
	{ label: "Zusammenfassung", value: "summary" },
	{ label: "Großes Bild", value: "summary_large_image" },
	{ label: "App", value: "app" },
	{ label: "Player", value: "player" }
];

const PRODUCT_AVAILABILITY: Option[] = [
	noneOption(),
	{ label: "Auf Lager", value: "instock" },
	{ label: "Nicht auf Lager", value: "outofstock" },
	{ label: "Vorbestellung", value: "preorder" }
];

const OFFER_AVAILABILITY: Option[] = [
	noneOption(),
	{ label: "Auf Lager", value: "InStock" },
	{ label: "Nicht auf Lager", value: "OutOfStock" },
	{ label: "Vorbestellung", value: "PreOrder" },
	{ label: "Nicht mehr verfügbar", value: "Discontinued" }
];

const EVENT_STATUS: Option[] = [
	noneOption(),
	{ label: "Geplant", value: "EventScheduled" },
	{ label: "Abgesagt", value: "EventCancelled" },
	{ label: "Verschoben", value: "EventPostponed" },
	{ label: "Online verlegt", value: "EventMovedOnline" }
];

const EVENT_ATTENDANCE: Option[] = [
	noneOption(),
	{ label: "Vor Ort", value: "OfflineEventAttendanceMode" },
	{ label: "Online", value: "OnlineEventAttendanceMode" },
	{ label: "Gemischt", value: "MixedEventAttendanceMode" }
];

export const STRUCTURED_OPTIONS: Option[] = [
	noneOption("Kein Markup"),
	{ label: "Webseite", value: "WebPage" },
	{ label: "Website", value: "WebSite" },
	{ label: "Artikel", value: "Article" },
	{ label: "Blogbeitrag", value: "BlogPosting" },
	{ label: "Nachrichtenartikel", value: "NewsArticle" },
	{ label: "Organisation", value: "Organization" },
	{ label: "Person", value: "Person" },
	{ label: "Produkt", value: "Product" },
	{ label: "Veranstaltung", value: "Event" },
	{ label: "Lokales Unternehmen", value: "LocalBusiness" },
	{ label: "Restaurant", value: "Restaurant" },
	{ label: "Geschäft", value: "Store" },
	{ label: "Medizinischer Betrieb", value: "MedicalBusiness" },
	{ label: "Video", value: "VideoObject" },
	{ label: "FAQ", value: "FAQPage" },
	{ label: "Brotkrumen", value: "BreadcrumbList" }
];

const ARTICLE_TYPES = new Set(["Article", "BlogPosting", "NewsArticle"]);
const LOCAL_TYPES = new Set([
	"LocalBusiness",
	"Restaurant",
	"Store",
	"MedicalBusiness"
]);
const NAMED_TYPES = new Set([
	"WebPage",
	"WebSite",
	"Organization",
	"Person",
	"Product",
	"Event",
	"VideoObject",
	...LOCAL_TYPES
]);

export const getGeneralFields = (
	robots?: string,
	languagePlaceholder?: string
): Field[] => [
	input("title", "Titel", {
		placeholder: "Titel für Suchergebnisse",
		description: "Empfohlen sind etwa 50–60 Zeichen."
	}),
	textarea("description", "Beschreibung", {
		placeholder: "Kurzbeschreibung der Seite",
		description: "Empfohlen sind etwa 150–160 Zeichen."
	}),
	input("canonical", "Kanonische URL", {
		type: "url",
		placeholder: "https://",
		description:
			"Bevorzugte Adresse dieser Seite, falls sie unter mehreren URLs erreichbar ist."
	}),
	select(
		"robots",
		"Robots",
		withCurrent(ROBOT_OPTIONS, robots),
		"Legt fest, ob Suchmaschinen die Seite indexieren und Links folgen."
	),
	input("language", "Sprache", {
		placeholder: languagePlaceholder || "de-DE",
		description: "Sprachcode der Seite, zum Beispiel de-DE."
	})
];

export const openGraphTypeLabel = (type?: string) =>
	OPEN_GRAPH_OPTIONS.find((option) => option.value === type)?.label;

export const twitterCardTypeLabel = (card?: string) =>
	TWITTER_CARD_OPTIONS.find((option) => option.value === card)?.label;

export const getSocialFields = (type?: string): Field[] => [
	select("type", "Typ", withCurrent(OPEN_GRAPH_OPTIONS, type)),
	input("url", "URL", { type: "url", placeholder: "https://" }),
	input("siteName", "Website-Name"),
	input("locale", "Locale", { placeholder: "de_DE" }),
	input("title", "Titel", {
		description: "Überschreibt den Seitentitel in Social-Media-Vorschauen."
	}),
	textarea("description", "Beschreibung"),
	image("imageUrl", "Vorschaubild"),
	input("imageAlt", "Alternativtext zum Bild"),
	input("publishedTime", "Veröffentlicht am", {
		placeholder: "2026-10-06T08:00:00Z",
		description: "Wird nur bei Typ Artikel gespeichert."
	}),
	input("modifiedTime", "Geändert am", {
		placeholder: "2026-10-06T08:00:00Z"
	}),
	input("expirationTime", "Gültig bis", {
		placeholder: "2026-12-31T23:59:59Z"
	}),
	input("author", "Autoren", {
		placeholder: "Name, weiter Name",
		description: "Mehrere Autoren mit Komma trennen."
	}),
	input("section", "Rubrik"),
	input("tag", "Tags", {
		placeholder: "cms, website",
		description: "Mehrere Tags mit Komma trennen."
	}),
	input("priceAmount", "Preis", {
		placeholder: "19.90",
		description: "Wird nur bei Typ Produkt gespeichert."
	}),
	input("priceCurrency", "Währung", { placeholder: "EUR" }),
	select("availability", "Verfügbarkeit", PRODUCT_AVAILABILITY)
];

export const getTwitterFields = (card?: string): Field[] => [
	select("card", "Kartentyp", withCurrent(TWITTER_CARD_OPTIONS, card)),
	input("site", "Website-Account", { placeholder: "@patstore" }),
	input("creator", "Autor-Account", { placeholder: "@name" }),
	input("title", "Titel"),
	textarea("description", "Beschreibung"),
	image("image", "Bild"),
	input("imageAlt", "Alternativtext zum Bild")
];

export const getStructuredFields = (type?: string): Field[] => {
	const fields: Field[] = [
		select(
			"type",
			"Typ",
			withCurrent(STRUCTURED_OPTIONS, type),
			"Schema.org-Markup, das als JSON-LD ausgegeben wird."
		)
	];

	if (!type || type === NONE) return fields;

	if (NAMED_TYPES.has(type)) {
		fields.push(input("name", "Name"));
	}
	if (ARTICLE_TYPES.has(type)) {
		fields.push(input("headline", "Überschrift"));
	}
	if (type !== "BreadcrumbList" && type !== "FAQPage") {
		fields.push(textarea("description", "Beschreibung"));
	}
	if (
		type !== "VideoObject" &&
		type !== "BreadcrumbList" &&
		type !== "FAQPage"
	) {
		fields.push(
			input("url", "URL", { type: "url", placeholder: "https://" })
		);
	}
	if (
		ARTICLE_TYPES.has(type) ||
		type === "Product" ||
		type === "Event" ||
		type === "Person" ||
		LOCAL_TYPES.has(type)
	) {
		fields.push(image("image", "Bild"));
	}
	if (type === "Organization") {
		fields.push(image("logo", "Logo"));
	}
	if (type === "WebPage" || ARTICLE_TYPES.has(type)) {
		fields.push(
			input("datePublished", "Veröffentlicht am", {
				placeholder: "2026-10-06"
			}),
			input("dateModified", "Geändert am", { placeholder: "2026-10-06" })
		);
	}
	if (type === "WebPage") {
		fields.push(
			input("isPartOf", "Teil von", {
				placeholder: "https://example.com",
				description: "URL der übergeordneten Website."
			})
		);
	}
	if (type === "WebSite") {
		fields.push(
			input("searchTarget", "Such-URL", {
				placeholder: "https://example.com/suche?q={search_term_string}",
				description:
					"Ziel der Sitelinks-Suche. {search_term_string} als Platzhalter verwenden."
			})
		);
	}
	if (ARTICLE_TYPES.has(type)) {
		fields.push(
			input("authorName", "Autor"),
			input("authorUrl", "Autor-URL", {
				type: "url",
				placeholder: "https://"
			}),
			input("publisherName", "Herausgeber"),
			image("publisherLogo", "Logo des Herausgebers"),
			input("articleSection", "Rubrik"),
			input("keywords", "Schlüsselwörter", {
				description: "Mehrere Begriffe mit Komma trennen."
			}),
			input("wordCount", "Wortanzahl")
		);
	}
	if (type === "Organization") {
		fields.push(
			input("telephone", "Telefon"),
			input("email", "E-Mail"),
			input("contactType", "Kontaktart", {
				placeholder: "Kundenservice"
			}),
			input("sameAs", "Profile", {
				placeholder: "https://..., https://...",
				description: "Weitere Profile, mit Komma getrennt."
			})
		);
	}
	if (type === "Person") {
		fields.push(
			input("jobTitle", "Berufsbezeichnung"),
			input("sameAs", "Profile", {
				placeholder: "https://..., https://...",
				description: "Weitere Profile, mit Komma getrennt."
			})
		);
	}
	if (type === "Product" || type === "Event") {
		fields.push(
			input("price", "Preis", { placeholder: "19.90" }),
			input("priceCurrency", "Währung", { placeholder: "EUR" }),
			select("availability", "Verfügbarkeit", OFFER_AVAILABILITY)
		);
	}
	if (type === "Product") {
		fields.push(
			input("sku", "SKU"),
			input("gtin", "GTIN"),
			input("brand", "Marke")
		);
	}
	if (type === "Event") {
		fields.push(
			input("startDate", "Beginn", {
				placeholder: "2026-10-06T18:00:00Z"
			}),
			input("endDate", "Ende", { placeholder: "2026-10-06T20:00:00Z" }),
			select("eventStatus", "Status", EVENT_STATUS),
			select("eventAttendanceMode", "Teilnahme", EVENT_ATTENDANCE),
			input("location", "Ort"),
			input("organizerName", "Veranstalter")
		);
	}
	if (LOCAL_TYPES.has(type)) {
		fields.push(
			input("telephone", "Telefon"),
			input("email", "E-Mail"),
			input("streetAddress", "Straße"),
			input("postalCode", "Postleitzahl"),
			input("addressLocality", "Ort"),
			input("addressRegion", "Region"),
			input("addressCountry", "Land", { placeholder: "DE" }),
			input("priceRange", "Preisspanne", { placeholder: "€€" })
		);
	}
	if (type === "VideoObject") {
		fields.push(
			image("thumbnailUrl", "Vorschaubild"),
			input("uploadDate", "Hochgeladen am", {
				placeholder: "2026-10-06"
			}),
			input("duration", "Dauer", {
				placeholder: "PT2M30S",
				description: "Dauer im ISO-8601-Format, zum Beispiel PT2M30S."
			}),
			input("contentUrl", "Videodatei", {
				type: "url",
				placeholder: "https://"
			}),
			input("embedUrl", "Einbettungs-URL", {
				type: "url",
				placeholder: "https://"
			})
		);
	}

	return fields;
};
