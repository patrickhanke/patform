"use client";

import { LanguageValue, SeoData, WebpageClass } from "@repo/types";
import { Divider, Form, IconButton, SlideInForm, usePageData } from "@repo/ui";
import { isEqual } from "lodash-es";
import {
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import SeoRecordList from "./components/SeoRecordList";
import {
	getGeneralFields,
	getSocialFields,
	getStructuredFields,
	getTwitterFields,
	openGraphTypeLabel,
	twitterCardTypeLabel
} from "./constants/seoFields";
import {
	NONE,
	SocialFormValues,
	TwitterFormValues,
	breadcrumbEntries,
	cleanString,
	compactSeo,
	draftSeo,
	faqEntries,
	fromSocialForm,
	fromStructuredForm,
	fromTwitterForm,
	normalizeSeo,
	primaryStructuredData,
	splitList,
	toGeneralForm,
	toSocialForm,
	toStructuredForm,
	toTwitterForm,
	writeStructuredData
} from "./utils/seoForm";

type WebpageSeoProps = {
	webpage: WebpageClass;
	language?: LanguageValue;
};

type FormValues = { [key: string]: unknown };

const readStrings = (values: FormValues): Record<string, string> => {
	const result: Record<string, string> = {};
	Object.entries(values).forEach(([key, value]) => {
		if (typeof value === "string") result[key] = value;
	});
	return result;
};

const SeoSection = ({
	title,
	action,
	children
}: {
	title: string;
	action?: ReactNode;
	children?: ReactNode;
}) => (
	<section>
		<div className="flex row a-ce j-sb gap-sm">
			<h3>{title}</h3>
			{action}
		</div>
		{children}
	</section>
);

const summarizeSocial = (values: SocialFormValues) => {
	const typeLabel =
		values.type !== NONE ? openGraphTypeLabel(values.type) : undefined;
	const summary = [typeLabel, values.title || values.siteName]
		.filter(Boolean)
		.join(" · ");
	return summary || "Keine Angaben";
};

const summarizeTwitter = (values: TwitterFormValues) => {
	const cardLabel =
		values.card !== NONE ? twitterCardTypeLabel(values.card) : undefined;
	const summary = [cardLabel, values.title || values.site]
		.filter(Boolean)
		.join(" · ");
	return summary || "Keine Angaben";
};

const KeywordField = ({
	keywords,
	onChange
}: {
	keywords?: string[];
	onChange: (keywords: string[]) => void;
}) => {
	const [value, setValue] = useState((keywords ?? []).join(", "));
	const focused = useRef(false);

	useEffect(() => {
		if (focused.current) return;
		setValue((keywords ?? []).join(", "));
	}, [keywords]);

	return (
		<div>
			<label htmlFor="seo-keywords">Schlüsselwörter</label>
			<input
				id="seo-keywords"
				value={value}
				placeholder="cms, website, patstore"
				onFocus={() => {
					focused.current = true;
				}}
				onBlur={() => {
					focused.current = false;
					setValue((keywords ?? []).join(", "));
				}}
				onChange={(event) => {
					setValue(event.target.value);
					onChange(splitList(event.target.value) ?? []);
				}}
			/>
			<p>Mehrere Begriffe mit Komma trennen.</p>
		</div>
	);
};

const WebpageSeo: FC<WebpageSeoProps> = ({ webpage, language }) => {
	const [isOpenGraphOpen, setIsOpenGraphOpen] = useState(false);
	const [isTwitterOpen, setIsTwitterOpen] = useState(false);
	const initialSeo = useMemo(() => normalizeSeo(webpage.seo), [webpage.seo]);
	const { data, setData } = usePageData<{ seo: SeoData }>(
		{
			initialData: { seo: initialSeo },
			objectId: webpage.objectId
		},
		{
			className: "Webpage",
			updateObject: (pageData) => ({
				seo: compactSeo(pageData.seo)
			}),
			message: "SEO-Daten wurden aktualisiert"
		}
	);
	const seo = data?.seo;
	const seoRef = useRef(seo);
	seoRef.current = seo;

	const updateSeo = useCallback(
		(next: SeoData) => {
			const current = seoRef.current;
			const drafted = draftSeo(next);
			if (!current || isEqual(drafted, current)) return;
			setData("seo", drafted);
		},
		[setData]
	);

	const generalForm = useMemo(
		() => (seo ? toGeneralForm(seo) : undefined),
		[seo]
	);
	const socialForm = useMemo(() => toSocialForm(seo?.social), [seo?.social]);
	const twitterForm = useMemo(
		() => toTwitterForm(seo?.social?.twitter),
		[seo?.social?.twitter]
	);
	const structuredForm = useMemo(
		() => toStructuredForm(seo?.structuredData),
		[seo?.structuredData]
	);
	const questions = useMemo(
		() => faqEntries(seo?.structuredData).map((item) => ({ ...item })),
		[seo?.structuredData]
	);
	const breadcrumbs = useMemo(
		() => breadcrumbEntries(seo?.structuredData),
		[seo?.structuredData]
	);
	const alternates = useMemo(
		() =>
			(seo?.alternateLanguages ?? []).map((item) => ({
				hreflang: item.hreflang,
				href: item.href
			})),
		[seo?.alternateLanguages]
	);

	const handleGeneralChange = useCallback(
		(changed: FormValues) => {
			const current = seoRef.current;
			if (!current) return;
			const values = {
				...toGeneralForm(current),
				...readStrings(changed)
			};
			updateSeo({
				...current,
				title: "title" in changed ? values.title : current.title,
				description:
					"description" in changed
						? cleanString(values.description)
						: current.description,
				canonical:
					"canonical" in changed
						? cleanString(values.canonical)
						: current.canonical,
				robots:
					"robots" in changed
						? values.robots !== NONE
							? values.robots
							: undefined
						: current.robots,
				language:
					"language" in changed
						? cleanString(values.language)
						: current.language
			});
		},
		[updateSeo]
	);

	const handleSocialChange = useCallback(
		(formValues: FormValues) => {
			const current = seoRef.current;
			if (!current) return;
			const values = {
				...toSocialForm(current.social),
				...readStrings(formValues)
			} as SocialFormValues;
			updateSeo({
				...current,
				social: fromSocialForm(values, current.social)
			});
		},
		[updateSeo]
	);

	const handleTwitterChange = useCallback(
		(formValues: FormValues) => {
			const current = seoRef.current;
			if (!current) return;
			const values = {
				...toTwitterForm(current.social?.twitter),
				...readStrings(formValues)
			} as TwitterFormValues;
			const twitter = fromTwitterForm(values);
			const social = { ...(current.social ?? {}) };
			if (twitter) social.twitter = twitter;
			else delete social.twitter;
			updateSeo({
				...current,
				social: Object.keys(social).length ? social : undefined
			});
		},
		[updateSeo]
	);

	const handleStructuredChange = useCallback(
		(changed: FormValues) => {
			const current = seoRef.current;
			if (!current) return;
			const values = {
				...toStructuredForm(current.structuredData),
				...readStrings(changed)
			};
			const previous = primaryStructuredData(current.structuredData);
			updateSeo({
				...current,
				structuredData: writeStructuredData(
					current.structuredData,
					fromStructuredForm(values, previous)
				)
			});
		},
		[updateSeo]
	);

	const handleKeywords = useCallback(
		(keywords: string[]) => {
			const current = seoRef.current;
			if (!current) return;
			updateSeo({
				...current,
				keywords: keywords.length ? keywords : undefined
			});
		},
		[updateSeo]
	);

	const handleAlternates = useCallback(
		(entries: { hreflang: string; href: string }[]) => {
			const current = seoRef.current;
			if (!current) return;
			updateSeo({
				...current,
				alternateLanguages: entries.length ? entries : undefined
			});
		},
		[updateSeo]
	);

	const handleQuestions = useCallback(
		(entries: { question: string; answer: string }[]) => {
			const current = seoRef.current;
			if (!current) return;
			updateSeo({
				...current,
				structuredData: writeStructuredData(current.structuredData, {
					type: "FAQPage",
					questions: entries
				})
			});
		},
		[updateSeo]
	);

	const handleBreadcrumbs = useCallback(
		(entries: { name: string; url: string }[]) => {
			const current = seoRef.current;
			if (!current) return;
			updateSeo({
				...current,
				structuredData: writeStructuredData(current.structuredData, {
					type: "BreadcrumbList",
					items: entries.map((entry, index) => ({
						name: entry.name,
						url: entry.url || undefined,
						position: index + 1
					}))
				})
			});
		},
		[updateSeo]
	);

	if (!seo || !generalForm) return null;

	const structuredType = primaryStructuredData(seo.structuredData)?.type;

	return (
		<div className="flex col gap-md">
			<SeoSection title="Allgemein">
				<Form
					fields={getGeneralFields(seo.robots, language)}
					data={generalForm}
					formSubmitHandler={handleGeneralChange}
					useWithDebounce
					showRequired={false}
				/>
				<KeywordField
					keywords={seo.keywords}
					onChange={handleKeywords}
				/>
			</SeoSection>
			<Divider size="large" showLine={false} />
			<SeoSection
				title="Open Graph"
				action={
					<IconButton
						icon="edit"
						text="Bearbeiten"
						onClick={() => setIsOpenGraphOpen(true)}
					/>
				}
			>
				<p>{summarizeSocial(socialForm)}</p>
				<SlideInForm
					title="Open Graph"
					confirmButtonText="Übernehmen"
					isOpen={isOpenGraphOpen}
					setIsOpen={setIsOpenGraphOpen}
					fields={getSocialFields(socialForm.type)}
					data={socialForm}
					dataHandler={handleSocialChange}
				/>
			</SeoSection>
			<Divider size="large" showLine={false} />
			<SeoSection
				title="Twitter"
				action={
					<IconButton
						icon="edit"
						text="Bearbeiten"
						onClick={() => setIsTwitterOpen(true)}
					/>
				}
			>
				<p>{summarizeTwitter(twitterForm)}</p>
				<SlideInForm
					title="Twitter"
					confirmButtonText="Übernehmen"
					isOpen={isTwitterOpen}
					setIsOpen={setIsTwitterOpen}
					fields={getTwitterFields(twitterForm.card)}
					data={twitterForm}
					dataHandler={handleTwitterChange}
				/>
			</SeoSection>
			<Divider size="large" showLine={false} />
			<SeoSection title="Alternativsprachen">
				<SeoRecordList
					addLabel="Sprache hinzufügen"
					entries={alternates}
					emptyEntry={{ hreflang: "", href: "" }}
					columns={[
						{
							key: "hreflang",
							label: "Sprache",
							placeholder: "de-DE"
						},
						{
							key: "href",
							label: "URL",
							placeholder: "https://"
						}
					]}
					onChange={handleAlternates}
				/>
			</SeoSection>
			<Divider size="large" showLine={false} />
			<SeoSection title="Strukturierte Daten">
				<Form
					fields={getStructuredFields(structuredForm.type)}
					data={structuredForm}
					formSubmitHandler={handleStructuredChange}
					useWithDebounce
					showRequired={false}
				/>
				{structuredType === "FAQPage" && (
					<SeoRecordList
						addLabel="Frage hinzufügen"
						entries={questions}
						emptyEntry={{ question: "", answer: "" }}
						columns={[
							{ key: "question", label: "Frage" },
							{ key: "answer", label: "Antwort" }
						]}
						onChange={handleQuestions}
					/>
				)}
				{structuredType === "BreadcrumbList" && (
					<SeoRecordList
						addLabel="Eintrag hinzufügen"
						entries={breadcrumbs}
						emptyEntry={{ name: "", url: "" }}
						columns={[
							{ key: "name", label: "Name" },
							{
								key: "url",
								label: "URL",
								placeholder: "https://"
							}
						]}
						onChange={handleBreadcrumbs}
					/>
				)}
			</SeoSection>
		</div>
	);
};

export default WebpageSeo;
