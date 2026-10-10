import {
	SeoAlternateLanguage,
	SeoAuthor,
	SeoData,
	SeoFaqItem,
	SeoImage,
	SeoOffer,
	SeoOpenGraphType,
	SeoPostalAddress,
	SeoSocialMeta,
	SeoStructuredData,
	SeoTwitterMeta,
	TwitterCardType
} from "@repo/types";

export const NONE = "none";

export type SocialFormValues = {
	type: string;
	url: string;
	siteName: string;
	locale: string;
	title: string;
	description: string;
	imageUrl: string;
	imageAlt: string;
	publishedTime: string;
	modifiedTime: string;
	expirationTime: string;
	author: string;
	section: string;
	tag: string;
	priceAmount: string;
	priceCurrency: string;
	availability: string;
};

export type TwitterFormValues = {
	card: string;
	site: string;
	creator: string;
	title: string;
	description: string;
	image: string;
	imageAlt: string;
};

export type StructuredFormValues = {
	type: string;
	name: string;
	headline: string;
	description: string;
	url: string;
	image: string;
	logo: string;
	datePublished: string;
	dateModified: string;
	isPartOf: string;
	authorName: string;
	authorUrl: string;
	publisherName: string;
	publisherLogo: string;
	articleSection: string;
	keywords: string;
	wordCount: string;
	sku: string;
	gtin: string;
	brand: string;
	price: string;
	priceCurrency: string;
	availability: string;
	startDate: string;
	endDate: string;
	eventStatus: string;
	eventAttendanceMode: string;
	location: string;
	organizerName: string;
	telephone: string;
	email: string;
	contactType: string;
	streetAddress: string;
	addressLocality: string;
	addressRegion: string;
	postalCode: string;
	addressCountry: string;
	priceRange: string;
	jobTitle: string;
	sameAs: string;
	thumbnailUrl: string;
	uploadDate: string;
	duration: string;
	contentUrl: string;
	embedUrl: string;
	searchTarget: string;
};

export type GeneralFormValues = {
	title: string;
	description: string;
	canonical: string;
	robots: string;
	language: string;
};

const emptySocialForm = (): SocialFormValues => ({
	type: NONE,
	url: "",
	siteName: "",
	locale: "",
	title: "",
	description: "",
	imageUrl: "",
	imageAlt: "",
	publishedTime: "",
	modifiedTime: "",
	expirationTime: "",
	author: "",
	section: "",
	tag: "",
	priceAmount: "",
	priceCurrency: "",
	availability: NONE
});

const emptyTwitterForm = (): TwitterFormValues => ({
	card: NONE,
	site: "",
	creator: "",
	title: "",
	description: "",
	image: "",
	imageAlt: ""
});

const emptyStructuredForm = (): StructuredFormValues => ({
	type: NONE,
	name: "",
	headline: "",
	description: "",
	url: "",
	image: "",
	logo: "",
	datePublished: "",
	dateModified: "",
	isPartOf: "",
	authorName: "",
	authorUrl: "",
	publisherName: "",
	publisherLogo: "",
	articleSection: "",
	keywords: "",
	wordCount: "",
	sku: "",
	gtin: "",
	brand: "",
	price: "",
	priceCurrency: "",
	availability: NONE,
	startDate: "",
	endDate: "",
	eventStatus: NONE,
	eventAttendanceMode: NONE,
	location: "",
	organizerName: "",
	telephone: "",
	email: "",
	contactType: "",
	streetAddress: "",
	addressLocality: "",
	addressRegion: "",
	postalCode: "",
	addressCountry: "",
	priceRange: "",
	jobTitle: "",
	sameAs: "",
	thumbnailUrl: "",
	uploadDate: "",
	duration: "",
	contentUrl: "",
	embedUrl: "",
	searchTarget: ""
});

export const cleanString = (value?: string): string | undefined => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

export const splitList = (value?: string): string[] | undefined => {
	const items = (value ?? "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
	return items.length ? items : undefined;
};

export const joinList = (value?: string | string[]): string => {
	if (!value) return "";
	return Array.isArray(value) ? value.join(", ") : value;
};

const parseNumber = (value?: string): number | undefined => {
	const normalized = value?.trim().replace(",", ".");
	if (!normalized) return undefined;
	const number = Number(normalized);
	return Number.isFinite(number) ? number : undefined;
};

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
	if (typeof value === "string") {
		try {
			return asRecord(JSON.parse(value) as unknown);
		} catch {
			return undefined;
		}
	}
	if (typeof value === "object" && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return undefined;
};

const firstImage = (image?: SeoImage | SeoImage[]): SeoImage | undefined => {
	if (!image) return undefined;
	return Array.isArray(image) ? image[0] : image;
};

const nextImage = (
	url: string,
	alt: string,
	previous?: SeoImage | SeoImage[]
): SeoImage | SeoImage[] | undefined => {
	const cleanUrl = cleanString(url);
	const previousList = !previous
		? []
		: Array.isArray(previous)
			? previous
			: [previous];

	if (!cleanUrl) {
		const rest = previousList.slice(1);
		return rest.length ? rest : undefined;
	}

	const current = previousList[0];
	const image: SeoImage = { url: cleanUrl };
	const imageAlt = cleanString(alt);
	if (imageAlt) image.alt = imageAlt;
	if (current?.url === cleanUrl) {
		if (current.width) image.width = current.width;
		if (current.height) image.height = current.height;
		if (current.type) image.type = current.type;
	}

	const rest = previousList.slice(1);
	return rest.length ? [image, ...rest] : image;
};

const stringList = (value: unknown): string[] | undefined => {
	if (!Array.isArray(value)) return undefined;
	const items = value.filter(
		(item): item is string => typeof item === "string"
	);
	return items.length ? items : undefined;
};

const normalizeAlternates = (
	value: unknown
): SeoAlternateLanguage[] | undefined => {
	if (!Array.isArray(value)) return undefined;
	const items = value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const record = item as Partial<SeoAlternateLanguage>;
		if (
			typeof record.hreflang !== "string" ||
			typeof record.href !== "string"
		) {
			return [];
		}
		return [{ hreflang: record.hreflang, href: record.href }];
	});
	return items.length ? items : undefined;
};

export const primaryStructuredData = (
	value: SeoData["structuredData"]
): SeoStructuredData | undefined => (Array.isArray(value) ? value[0] : value);

export const writeStructuredData = (
	current: SeoData["structuredData"],
	next: SeoStructuredData | undefined
): SeoData["structuredData"] => {
	if (!Array.isArray(current)) return next;
	const rest = current.slice(1);
	if (!next) return rest.length ? rest : undefined;
	return [next, ...rest];
};

export const normalizeSeo = (
	value: unknown,
	fallback?: { language?: string }
): SeoData => {
	const source = asRecord(value);
	if (!source) {
		return {
			title: "",
			...(fallback?.language ? { language: fallback.language } : {})
		};
	}

	return {
		title: typeof source.title === "string" ? source.title : "",
		description:
			typeof source.description === "string"
				? source.description
				: undefined,
		canonical:
			typeof source.canonical === "string" ? source.canonical : undefined,
		robots: typeof source.robots === "string" ? source.robots : undefined,
		keywords: stringList(source.keywords),
		language:
			typeof source.language === "string"
				? source.language
				: fallback?.language,
		alternateLanguages: normalizeAlternates(source.alternateLanguages),
		social:
			source.social && typeof source.social === "object"
				? (source.social as SeoSocialMeta)
				: undefined,
		structuredData: source.structuredData as SeoData["structuredData"]
	};
};

export const toGeneralForm = (seo: SeoData): GeneralFormValues => ({
	title: seo.title ?? "",
	description: seo.description ?? "",
	canonical: seo.canonical ?? "",
	robots: seo.robots || NONE,
	language: seo.language ?? ""
});

export const toSocialForm = (social?: SeoSocialMeta): SocialFormValues => {
	const image = firstImage(social?.image);
	const article = social?.article;
	const product = social?.product;
	return {
		...emptySocialForm(),
		type: social?.type || NONE,
		url: social?.url ?? "",
		siteName: social?.siteName ?? "",
		locale: social?.locale ?? "",
		title: social?.title ?? "",
		description: social?.description ?? "",
		imageUrl: image?.url ?? "",
		imageAlt: image?.alt ?? "",
		publishedTime: article?.publishedTime ?? "",
		modifiedTime: article?.modifiedTime ?? "",
		expirationTime: article?.expirationTime ?? "",
		author: joinList(article?.author),
		section: article?.section ?? "",
		tag: joinList(article?.tag),
		priceAmount:
			product?.priceAmount != null ? String(product.priceAmount) : "",
		priceCurrency: product?.priceCurrency ?? "",
		availability: product?.availability || NONE
	};
};

export const fromSocialForm = (
	values: SocialFormValues,
	previous?: SeoSocialMeta
): SeoSocialMeta | undefined => {
	const social: SeoSocialMeta = {};
	if (values.type && values.type !== NONE) {
		social.type = values.type as SeoOpenGraphType;
	}
	const url = cleanString(values.url);
	const siteName = cleanString(values.siteName);
	const locale = cleanString(values.locale);
	const title = cleanString(values.title);
	const description = cleanString(values.description);
	if (url) social.url = url;
	if (siteName) social.siteName = siteName;
	if (locale) social.locale = locale;
	if (title) social.title = title;
	if (description) social.description = description;

	const image = nextImage(values.imageUrl, values.imageAlt, previous?.image);
	if (image) social.image = image;

	if (values.type === "article") {
		const author = splitList(values.author);
		const tag = splitList(values.tag);
		const article = {
			publishedTime: cleanString(values.publishedTime),
			modifiedTime: cleanString(values.modifiedTime),
			expirationTime: cleanString(values.expirationTime),
			author: author?.length === 1 ? author[0] : author,
			section: cleanString(values.section),
			tag: tag?.length === 1 ? tag[0] : tag
		};
		if (Object.values(article).some(Boolean)) social.article = article;
	}

	if (values.type === "product") {
		const priceAmount = parseNumber(values.priceAmount);
		const product = {
			priceAmount,
			priceCurrency: cleanString(values.priceCurrency),
			availability:
				values.availability && values.availability !== NONE
					? (values.availability as
							| "instock"
							| "outofstock"
							| "preorder")
					: undefined
		};
		if (
			product.priceAmount != null ||
			product.priceCurrency ||
			product.availability
		) {
			social.product = product;
		}
	}

	if (previous?.twitter && hasTwitterContent(previous.twitter)) {
		social.twitter = previous.twitter;
	}

	return Object.keys(social).length ? social : undefined;
};

const hasTwitterContent = (twitter: SeoTwitterMeta): boolean =>
	Boolean(
		twitter.card ||
			cleanString(twitter.site) ||
			cleanString(twitter.creator) ||
			cleanString(twitter.title) ||
			cleanString(twitter.description) ||
			cleanString(twitter.image) ||
			cleanString(twitter.imageAlt)
	);

export const toTwitterForm = (twitter?: SeoTwitterMeta): TwitterFormValues => ({
	...emptyTwitterForm(),
	card: twitter?.card || NONE,
	site: twitter?.site ?? "",
	creator: twitter?.creator ?? "",
	title: twitter?.title ?? "",
	description: twitter?.description ?? "",
	image: twitter?.image ?? "",
	imageAlt: twitter?.imageAlt ?? ""
});

export const fromTwitterForm = (
	values: TwitterFormValues
): SeoTwitterMeta | undefined => {
	const twitter: SeoTwitterMeta = {};
	if (values.card && values.card !== NONE) {
		twitter.card = values.card as TwitterCardType;
	}
	const site = cleanString(values.site);
	const creator = cleanString(values.creator);
	const title = cleanString(values.title);
	const description = cleanString(values.description);
	const image = cleanString(values.image);
	const imageAlt = cleanString(values.imageAlt);
	if (site) twitter.site = site;
	if (creator) twitter.creator = creator;
	if (title) twitter.title = title;
	if (description) twitter.description = description;
	if (image) twitter.image = image;
	if (imageAlt) twitter.imageAlt = imageAlt;
	return Object.keys(twitter).length ? twitter : undefined;
};

const imageUrl = (
	image?: string | string[] | SeoImage | SeoImage[]
): string => {
	if (!image) return "";
	if (typeof image === "string") return image;
	if (Array.isArray(image)) {
		const first = image[0];
		if (!first) return "";
		return typeof first === "string" ? first : first.url;
	}
	return image.url;
};

const brandName = (brand?: string | { name: string }): string => {
	if (!brand) return "";
	return typeof brand === "string" ? brand : brand.name;
};

const authorName = (
	author?: SeoAuthor | SeoAuthor[] | { name: string }
): string => {
	if (!author) return "";
	if (Array.isArray(author)) return author[0]?.name ?? "";
	return author.name ?? "";
};

const locationName = (
	location?: string | { name?: string; address?: string | SeoPostalAddress }
): string => {
	if (!location) return "";
	if (typeof location === "string") return location;
	return location.name ?? "";
};

const offerOf = (offers?: SeoOffer | SeoOffer[]): SeoOffer | undefined =>
	Array.isArray(offers) ? offers[0] : offers;

export const toStructuredForm = (
	data: SeoData["structuredData"]
): StructuredFormValues => {
	const values = emptyStructuredForm();
	const entry = primaryStructuredData(data);
	if (!entry?.type) return values;

	values.type = entry.type;
	if ("name" in entry && typeof entry.name === "string")
		values.name = entry.name;
	if ("headline" in entry && typeof entry.headline === "string") {
		values.headline = entry.headline;
	}
	if ("description" in entry && typeof entry.description === "string") {
		values.description = entry.description;
	}
	if ("url" in entry && typeof entry.url === "string") values.url = entry.url;
	if ("image" in entry) values.image = imageUrl(entry.image);
	if ("logo" in entry && typeof entry.logo === "string")
		values.logo = entry.logo;
	if ("datePublished" in entry && typeof entry.datePublished === "string") {
		values.datePublished = entry.datePublished;
	}
	if ("dateModified" in entry && typeof entry.dateModified === "string") {
		values.dateModified = entry.dateModified;
	}
	if ("isPartOf" in entry && typeof entry.isPartOf === "string") {
		values.isPartOf = entry.isPartOf;
	}
	if ("author" in entry) {
		values.authorName = authorName(entry.author);
		const author = Array.isArray(entry.author)
			? entry.author[0]
			: entry.author;
		if (author && "url" in author && typeof author.url === "string") {
			values.authorUrl = author.url;
		}
	}
	if ("publisher" in entry && entry.publisher) {
		values.publisherName = entry.publisher.name ?? "";
		if (
			"logo" in entry.publisher &&
			typeof entry.publisher.logo === "string"
		) {
			values.publisherLogo = entry.publisher.logo;
		}
	}
	if ("articleSection" in entry && typeof entry.articleSection === "string") {
		values.articleSection = entry.articleSection;
	}
	if ("keywords" in entry) values.keywords = joinList(entry.keywords);
	if ("wordCount" in entry && typeof entry.wordCount === "number") {
		values.wordCount = String(entry.wordCount);
	}
	if ("sku" in entry && typeof entry.sku === "string") values.sku = entry.sku;
	if ("gtin" in entry && typeof entry.gtin === "string")
		values.gtin = entry.gtin;
	if ("brand" in entry) values.brand = brandName(entry.brand);
	if ("offers" in entry) {
		const offer = offerOf(entry.offers);
		if (offer) {
			values.price = String(offer.price);
			values.priceCurrency = offer.priceCurrency ?? "";
			values.availability = offer.availability || NONE;
		}
	}
	if ("startDate" in entry && typeof entry.startDate === "string") {
		values.startDate = entry.startDate;
	}
	if ("endDate" in entry && typeof entry.endDate === "string") {
		values.endDate = entry.endDate;
	}
	if ("eventStatus" in entry && entry.eventStatus) {
		values.eventStatus = entry.eventStatus;
	}
	if ("eventAttendanceMode" in entry && entry.eventAttendanceMode) {
		values.eventAttendanceMode = entry.eventAttendanceMode;
	}
	if ("location" in entry) values.location = locationName(entry.location);
	if ("organizer" in entry)
		values.organizerName = authorName(entry.organizer);
	if ("telephone" in entry && typeof entry.telephone === "string") {
		values.telephone = entry.telephone;
	}
	if ("email" in entry && typeof entry.email === "string")
		values.email = entry.email;
	if ("contactPoint" in entry && entry.contactPoint) {
		values.telephone = entry.contactPoint.telephone ?? values.telephone;
		values.email = entry.contactPoint.email ?? values.email;
		values.contactType = entry.contactPoint.contactType ?? "";
	}
	if (
		"address" in entry &&
		entry.address &&
		typeof entry.address === "object"
	) {
		values.streetAddress = entry.address.streetAddress ?? "";
		values.addressLocality = entry.address.addressLocality ?? "";
		values.addressRegion = entry.address.addressRegion ?? "";
		values.postalCode = entry.address.postalCode ?? "";
		values.addressCountry = entry.address.addressCountry ?? "";
	}
	if ("priceRange" in entry && typeof entry.priceRange === "string") {
		values.priceRange = entry.priceRange;
	}
	if ("jobTitle" in entry && typeof entry.jobTitle === "string") {
		values.jobTitle = entry.jobTitle;
	}
	if ("sameAs" in entry) values.sameAs = joinList(entry.sameAs);
	if ("thumbnailUrl" in entry)
		values.thumbnailUrl = joinList(entry.thumbnailUrl);
	if ("uploadDate" in entry && typeof entry.uploadDate === "string") {
		values.uploadDate = entry.uploadDate;
	}
	if ("duration" in entry && typeof entry.duration === "string") {
		values.duration = entry.duration;
	}
	if ("contentUrl" in entry && typeof entry.contentUrl === "string") {
		values.contentUrl = entry.contentUrl;
	}
	if ("embedUrl" in entry && typeof entry.embedUrl === "string") {
		values.embedUrl = entry.embedUrl;
	}
	if ("potentialAction" in entry && entry.potentialAction) {
		values.searchTarget = entry.potentialAction.target ?? "";
	}

	return values;
};

const postalAddress = (
	values: StructuredFormValues
): SeoPostalAddress | undefined => {
	const address: SeoPostalAddress = {};
	const streetAddress = cleanString(values.streetAddress);
	const addressLocality = cleanString(values.addressLocality);
	const addressRegion = cleanString(values.addressRegion);
	const postalCode = cleanString(values.postalCode);
	const addressCountry = cleanString(values.addressCountry);
	if (streetAddress) address.streetAddress = streetAddress;
	if (addressLocality) address.addressLocality = addressLocality;
	if (addressRegion) address.addressRegion = addressRegion;
	if (postalCode) address.postalCode = postalCode;
	if (addressCountry) address.addressCountry = addressCountry;
	return Object.keys(address).length ? address : undefined;
};

const authorFrom = (values: StructuredFormValues): SeoAuthor | undefined => {
	const name = cleanString(values.authorName);
	if (!name) return undefined;
	const url = cleanString(values.authorUrl);
	return url ? { name, url } : { name };
};

const singleOffer = (values: StructuredFormValues): SeoOffer | undefined => {
	const price = parseNumber(values.price);
	const priceCurrency = cleanString(values.priceCurrency);
	if (price == null || !priceCurrency) return undefined;
	const offer: SeoOffer = { price, priceCurrency };
	if (values.availability && values.availability !== NONE) {
		offer.availability = values.availability;
	}
	return offer;
};

export const fromStructuredForm = (
	values: StructuredFormValues,
	previous: SeoStructuredData | undefined
): SeoStructuredData | undefined => {
	const type = values.type;
	if (!type || type === NONE) return undefined;

	const description = cleanString(values.description);
	const url = cleanString(values.url);
	const image = cleanString(values.image);
	const name = values.name.trim();

	switch (type) {
		case "WebPage":
			return {
				type,
				name,
				...(description ? { description } : {}),
				...(url ? { url } : {}),
				...(cleanString(values.datePublished)
					? { datePublished: cleanString(values.datePublished) }
					: {}),
				...(cleanString(values.dateModified)
					? { dateModified: cleanString(values.dateModified) }
					: {}),
				...(cleanString(values.isPartOf)
					? { isPartOf: cleanString(values.isPartOf) }
					: {})
			};
		case "WebSite": {
			const target = cleanString(values.searchTarget);
			return {
				type,
				name,
				url: url ?? "",
				...(description ? { description } : {}),
				...(target
					? {
							potentialAction: {
								target,
								queryInput: "required name=search_term_string"
							}
						}
					: {})
			};
		}
		case "Organization": {
			const sameAs = splitList(values.sameAs);
			const telephone = cleanString(values.telephone);
			const email = cleanString(values.email);
			const contactType = cleanString(values.contactType);
			const logo = cleanString(values.logo);
			return {
				type,
				name,
				...(url ? { url } : {}),
				...(logo ? { logo } : {}),
				...(description ? { description } : {}),
				...(sameAs ? { sameAs } : {}),
				...(telephone || email || contactType
					? { contactPoint: { telephone, contactType, email } }
					: {})
			};
		}
		case "Article":
		case "BlogPosting":
		case "NewsArticle": {
			const author = authorFrom(values);
			const publisherName = cleanString(values.publisherName);
			const keywords = splitList(values.keywords);
			const wordCount = parseNumber(values.wordCount);
			return {
				type,
				headline: values.headline.trim(),
				...(description ? { description } : {}),
				...(url ? { url } : {}),
				...(image ? { image } : {}),
				...(cleanString(values.datePublished)
					? { datePublished: cleanString(values.datePublished) }
					: {}),
				...(cleanString(values.dateModified)
					? { dateModified: cleanString(values.dateModified) }
					: {}),
				...(author ? { author } : {}),
				...(publisherName
					? {
							publisher: {
								name: publisherName,
								...(cleanString(values.publisherLogo)
									? {
											logo: cleanString(
												values.publisherLogo
											)
										}
									: {})
							}
						}
					: {}),
				...(cleanString(values.articleSection)
					? { articleSection: cleanString(values.articleSection) }
					: {}),
				...(keywords ? { keywords } : {}),
				...(wordCount != null ? { wordCount } : {})
			};
		}
		case "Person": {
			const sameAs = splitList(values.sameAs);
			return {
				type,
				name,
				...(url ? { url } : {}),
				...(image ? { image } : {}),
				...(cleanString(values.jobTitle)
					? { jobTitle: cleanString(values.jobTitle) }
					: {}),
				...(sameAs ? { sameAs } : {})
			};
		}
		case "Product": {
			const offer = singleOffer(values);
			return {
				type,
				name,
				...(description ? { description } : {}),
				...(url ? { url } : {}),
				...(image ? { image } : {}),
				...(cleanString(values.sku)
					? { sku: cleanString(values.sku) }
					: {}),
				...(cleanString(values.gtin)
					? { gtin: cleanString(values.gtin) }
					: {}),
				...(cleanString(values.brand)
					? { brand: cleanString(values.brand) }
					: {}),
				...(offer ? { offers: offer } : {})
			};
		}
		case "Event": {
			const offer = singleOffer(values);
			const organizer = cleanString(values.organizerName);
			return {
				type,
				name,
				startDate: values.startDate.trim(),
				...(description ? { description } : {}),
				...(url ? { url } : {}),
				...(image ? { image } : {}),
				...(cleanString(values.endDate)
					? { endDate: cleanString(values.endDate) }
					: {}),
				...(values.eventStatus && values.eventStatus !== NONE
					? {
							eventStatus: values.eventStatus as
								| "EventScheduled"
								| "EventCancelled"
								| "EventPostponed"
								| "EventMovedOnline"
						}
					: {}),
				...(values.eventAttendanceMode &&
				values.eventAttendanceMode !== NONE
					? {
							eventAttendanceMode: values.eventAttendanceMode as
								| "OfflineEventAttendanceMode"
								| "OnlineEventAttendanceMode"
								| "MixedEventAttendanceMode"
						}
					: {}),
				...(cleanString(values.location)
					? { location: cleanString(values.location) }
					: {}),
				...(organizer ? { organizer: { name: organizer } } : {}),
				...(offer ? { offers: offer } : {})
			};
		}
		case "LocalBusiness":
		case "Restaurant":
		case "Store":
		case "MedicalBusiness": {
			const address = postalAddress(values);
			return {
				type,
				name,
				...(description ? { description } : {}),
				...(url ? { url } : {}),
				...(image ? { image } : {}),
				...(cleanString(values.telephone)
					? { telephone: cleanString(values.telephone) }
					: {}),
				...(cleanString(values.email)
					? { email: cleanString(values.email) }
					: {}),
				...(address ? { address } : {}),
				...(cleanString(values.priceRange)
					? { priceRange: cleanString(values.priceRange) }
					: {})
			};
		}
		case "VideoObject":
			return {
				type,
				name,
				...(description ? { description } : {}),
				...(cleanString(values.thumbnailUrl)
					? { thumbnailUrl: cleanString(values.thumbnailUrl) }
					: {}),
				...(cleanString(values.uploadDate)
					? { uploadDate: cleanString(values.uploadDate) }
					: {}),
				...(cleanString(values.duration)
					? { duration: cleanString(values.duration) }
					: {}),
				...(cleanString(values.contentUrl)
					? { contentUrl: cleanString(values.contentUrl) }
					: {}),
				...(cleanString(values.embedUrl)
					? { embedUrl: cleanString(values.embedUrl) }
					: {})
			};
		case "FAQPage":
			return {
				type,
				questions:
					previous?.type === "FAQPage" ? previous.questions : []
			};
		case "BreadcrumbList":
			return {
				type,
				items: previous?.type === "BreadcrumbList" ? previous.items : []
			};
		default:
			return previous;
	}
};

export const faqEntries = (data: SeoData["structuredData"]): SeoFaqItem[] => {
	const entry = primaryStructuredData(data);
	if (entry?.type !== "FAQPage") return [];
	return entry.questions ?? [];
};

export const breadcrumbEntries = (
	data: SeoData["structuredData"]
): { name: string; url: string }[] => {
	const entry = primaryStructuredData(data);
	if (entry?.type !== "BreadcrumbList") return [];
	return (entry.items ?? []).map((item) => ({
		name: item.name ?? "",
		url: item.url ?? ""
	}));
};

export const draftSeo = (seo: SeoData): SeoData => {
	const next: SeoData = { title: seo.title ?? "" };
	if (seo.description) next.description = seo.description;
	if (seo.canonical) next.canonical = seo.canonical;
	if (seo.robots && seo.robots !== NONE) next.robots = seo.robots;
	if (seo.language) next.language = seo.language;
	if (seo.keywords?.length) next.keywords = seo.keywords;
	if (seo.alternateLanguages?.length) {
		next.alternateLanguages = seo.alternateLanguages;
	}
	if (seo.social) {
		const social =
			seo.social.twitter == null && "twitter" in seo.social
				? Object.fromEntries(
						Object.entries(seo.social).filter(
							([key]) => key !== "twitter"
						)
					)
				: seo.social;
		if (Object.keys(social).length) next.social = social as SeoSocialMeta;
	}
	if (seo.structuredData) next.structuredData = seo.structuredData;
	return next;
};

export const compactSeo = (seo: SeoData): SeoData => {
	const next: SeoData = {
		title: seo.title?.trim() ?? ""
	};
	const description = cleanString(seo.description);
	const canonical = cleanString(seo.canonical);
	const robots = cleanString(
		typeof seo.robots === "string" ? seo.robots : undefined
	);
	const language = cleanString(seo.language);
	const keywords = seo.keywords
		?.map((keyword) => keyword.trim())
		.filter(Boolean);
	const alternateLanguages = seo.alternateLanguages?.filter(
		(item) => cleanString(item.hreflang) && cleanString(item.href)
	);

	if (description) next.description = description;
	if (canonical) next.canonical = canonical;
	if (robots && robots !== NONE) next.robots = robots;
	if (language) next.language = language;
	if (keywords?.length) next.keywords = keywords;
	if (alternateLanguages?.length) {
		next.alternateLanguages = alternateLanguages.map((item) => ({
			hreflang: item.hreflang.trim(),
			href: item.href.trim()
		}));
	}
	const social = compactSocial(seo.social);
	if (social) next.social = social;
	if (seo.structuredData) {
		const structured = compactStructured(seo.structuredData);
		if (structured) next.structuredData = structured;
	}
	return next;
};

const compactSocial = (social?: SeoSocialMeta): SeoSocialMeta | undefined => {
	if (!social) return undefined;
	const { twitter, ...rest } = social;
	const next: SeoSocialMeta = {};
	(Object.keys(rest) as (keyof typeof rest)[]).forEach((key) => {
		const value = rest[key];
		if (value == null) return;
		if (typeof value === "string" && !value.trim()) return;
		next[key] = value as never;
	});
	if (twitter && hasTwitterContent(twitter)) next.twitter = twitter;
	return Object.keys(next).length ? next : undefined;
};

const compactStructured = (
	data: SeoStructuredData | SeoStructuredData[]
): SeoStructuredData | SeoStructuredData[] | undefined => {
	const compactEntry = (
		entry: SeoStructuredData
	): SeoStructuredData | undefined => {
		if (entry.type === "FAQPage") {
			const questions = entry.questions.filter(
				(item) => cleanString(item.question) && cleanString(item.answer)
			);
			return questions.length ? { ...entry, questions } : undefined;
		}
		if (entry.type === "BreadcrumbList") {
			const items = entry.items.filter((item) => cleanString(item.name));
			return items.length ? { ...entry, items } : undefined;
		}
		return entry;
	};

	if (Array.isArray(data)) {
		const items = data.flatMap((entry) => {
			const next = compactEntry(entry);
			return next ? [next] : [];
		});
		return items.length ? items : undefined;
	}
	return compactEntry(data);
};
