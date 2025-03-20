import { PageState } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import { PageProps } from "../../types";

export type PageNavigationProps = {
  pageState: PageState[];
  activeState: PageState;
  onClick: Dispatch<SetStateAction<PageState>>;
};

export type PageHeaderButton = {
  text: string;
  onClick: () => void;
  is_add_button?: boolean;
  is_reset_button?: boolean;
  color?: string;
  disabled?: boolean;
};

export type PageHeaderButtons = PageHeaderButton[];

type PageHeaderContent = React.JSX.Element;

export type PageHeaderComponent = {
  title: PageProps["title"];
  description?: string;
  pageStates?: PageNavigationProps["pageState"];
  pageState?: PageNavigationProps["activeState"];
  setPageState?: PageNavigationProps["onClick"];
  pageHeaderContent?: PageProps["pageHeaderContent"];
  pageHeaderButtons?: PageProps["pageHeaderButtons"];
  emptyContent?: PageProps["emptyContent"];
  refetch?: PageProps["refetch"];
  createClass?: PageProps["createClass"];
};

export type PageHeaderRegularProps = {
  title?: PageProps["title"];
  description?: string;
  pageStates?: PageNavigationProps["pageState"];
  pageState?: PageNavigationProps["activeState"];
  setPageState?: PageNavigationProps["onClick"];
  pageHeaderContent?: PageProps["pageHeaderContent"];
  pageHeaderButtons?: PageProps["pageHeaderButtons"];
  emptyContent?: PageProps["emptyContent"];
  refetch?: PageProps["refetch"];
  createClass?: PageProps["createClass"];
};

export type PageHeaderScrollProps = {
  title: PageProps["title"];
  pageStates?: PageNavigationProps["pageState"];
  pageState?: PageNavigationProps["activeState"];
  setPageState?: PageNavigationProps["onClick"];
  pageHeaderContent?: PageProps["pageHeaderContent"];
  pageHeaderButtons?: PageProps["pageHeaderButtons"];
  emptyContent?: PageProps["emptyContent"];
  refetch?: PageProps["refetch"];
  createClass?: PageProps["createClass"];
};

export type PageNavigationComponent = {
  items: PageHeaderComponent["navItems"];
  currentItem: PageHeaderComponent["navCurrentItem"];
  onClick: PageHeaderComponent["navOnClick"];
};
