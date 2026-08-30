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
import { LanguageValue } from "./Project";
import { ChampionshipClass } from "./Championship";

export type ClassCategories = string[];

export type ClassState = {
	value: string | number | object;
	label: string;
	color: string;
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
	lang?: LanguageValue;
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
	| ChampionshipClass;
