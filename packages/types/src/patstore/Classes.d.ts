import { FormDataElement } from "@repo/ui";
import { CategoryClass } from "./Category";
import { PatstoreUser } from "./User";
import { VideoClass } from "./Video";
import { ItemClass } from "./Item";
import { ImageClass } from "./Image";
import { NewsClass } from "./News";
import { PersonClass } from "./Person";
import { EventClass } from "./Event";
import { ArticleClass } from "./Article";
import { GroupClass } from "./Group";
import { AppointmentClass } from "./Date";
import { TemplateClass } from "./Template";
import { Module } from "./Module";
import { ContentClass } from "./Content";
import { LanguageValue, PatstoreProject } from "./Project";
import { CompetitionClass } from "./Competition";
import { ClubClass } from "./Club";
import { EmailClass } from "./Email";
import { BookingClass } from "./Booking";

export type ClassCategories = string[];

export type ClassState = {
	value: string | number | object;
	label: string;
	color: string;
};

export type ClassTranslation = {
	[key in LanguageValue]: {
		title?: string;
		text?: string;
		description?: string;
		seo_title?: string;
		seo_description?: string;
		seo_keywords?: string;
		seo_image?: string;
	};
};

export type ClassProperties = {
	objectId: string;
	createdAt: string;
	updatedAt: string;
	data?: FormDataElement;
	module: Module;
	categories: ClassCategories;
	label: string;
	created_by: PatstoreUser;
	updated_by: PatstoreUser;
	project: PatstoreProject;
	translations?: ClassTranslation;
};

export type Classes =
	| ImageClass
	| NewsClass
	| PersonClass
	| CategoryClass
	| EventClass
	| ArticleClass
	| GroupClass
	| CategoryClass
	| AppointmentClass
	| TemplateClass
	| VideoClass
	| ItemClass
	| ContentClass
	| CompetitionClass
	| ClubClass
	| EmailClass
	| BookingClass;
