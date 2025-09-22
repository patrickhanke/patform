"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Response } from "@repo/types";
import Feedback from "./components/Feedback";
import DataContext, { DataContextProps } from "./DataContext";
import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig
} from "@chakra-ui/react";

export const DataContextProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [feedback, setFeedback] = useState<Response | null>(null);
	const [loading, setLoading] = useState(false);

	const feedbackHandler = useCallback((response: Response) => {
		setFeedback(response);
		setTimeout(() => {
			setFeedback(null);
		}, 4000);
	}, []);

	const loadingHandler = useCallback(
		(loadingValue: boolean) => {
			if (loadingValue !== loading) {
				setLoading(loadingValue);
			}
			if (loadingValue) {
				setTimeout(() => {
					if (loading === true) {
						setLoading(false);
					}
				}, 10000);
			}
		},
		[loading]
	);

	const appContextObject: DataContextProps = useMemo(
		() => ({
			feedbackHandler,
			loadingHandler
		}),
		[feedbackHandler, loadingHandler]
	);

	const customConfig = defineConfig({
		theme: {
			semanticTokens: {
				colors: {
					blue: {
						solid: { value: "{colors.blue.500}" },
						contrast: { value: "{colors.blue.100}" },
						fg: { value: "{colors.blue.700}" },
						muted: { value: "{colors.blue.100}" },
						subtle: { value: "{colors.blue.200}" },
						emphasized: { value: "{colors.blue.300}" },
						focusRing: { value: "{colors.blue.500}" }
					},
					blue_shaded: {
						solid: { value: "{colors.blue.700}" },
						contrast: { value: "{colors.blue.300}" },
						fg: { value: "{colors.blue.900}" },
						muted: { value: "{colors.blue.300}" },
						subtle: { value: "{colors.blue.500}" },
						emphasized: { value: "{colors.blue.500}" },
						focusRing: { value: "{colors.blue.700}" }
					},
					blue_tintend: {
						solid: { value: "{colors.blue.300}" },
						contrast: { value: "{colors.blue.700}" },
						fg: { value: "{colors.blue.100}" },
						muted: { value: "{colors.blue.700}" },
						subtle: { value: "{colors.blue.900}" },
						emphasized: { value: "{colors.blue.900}" },
						focusRing: { value: "{colors.blue.300}" }
					},
					green: {
						solid: { value: "{colors.green.500}" },
						contrast: { value: "{colors.green.100}" },
						fg: { value: "{colors.green.700}" },
						muted: { value: "{colors.green.100}" },
						subtle: { value: "{colors.green.200}" },
						emphasized: { value: "{colors.green.300}" },
						focusRing: { value: "{colors.green.500}" }
					},
					green_shaded: {
						solid: { value: "{colors.green.700}" },
						contrast: { value: "{colors.green.300}" },
						fg: { value: "{colors.green.900}" },
						muted: { value: "{colors.green.300}" },
						subtle: { value: "{colors.green.500}" },
						emphasized: { value: "{colors.green.500}" },
						focusRing: { value: "{colors.green.700}" }
					},
					green_tintend: {
						solid: { value: "{colors.green.300}" },
						contrast: { value: "{colors.green.700}" },
						fg: { value: "{colors.green.100}" },
						muted: { value: "{colors.green.700}" },
						subtle: { value: "{colors.green.900}" },
						emphasized: { value: "{colors.green.900}" },
						focusRing: { value: "{colors.green.300}" }
					},
					grey: {
						solid: { value: "{colors.grey.500}" },
						contrast: { value: "{colors.grey.100}" },
						fg: { value: "{colors.grey.700}" },
						muted: { value: "{colors.grey.100}" },
						subtle: { value: "{colors.grey.200}" },
						emphasized: { value: "{colors.grey.300}" },
						focusRing: { value: "{colors.grey.500}" }
					},
					grey_shaded: {
						solid: { value: "{colors.grey.700}" },
						contrast: { value: "{colors.grey.300}" },
						fg: { value: "{colors.grey.900}" },
						muted: { value: "{colors.grey.300}" },
						subtle: { value: "{colors.grey.500}" },
						emphasized: { value: "{colors.grey.500}" },
						focusRing: { value: "{colors.grey.700}" }
					},
					grey_tintend: {
						solid: { value: "{colors.grey.300}" },
						contrast: { value: "{colors.grey.700}" },
						fg: { value: "{colors.grey.100}" },
						muted: { value: "{colors.grey.700}" },
						subtle: { value: "{colors.grey.900}" },
						emphasized: { value: "{colors.grey.900}" },
						focusRing: { value: "{colors.grey.300}" }
					},
					pink: {
						solid: { value: "{colors.pink.500}" },
						contrast: { value: "{colors.pink.500}" },
						fg: { value: "{colors.pink.900}" },
						muted: { value: "{colors.pink.500}" },
						subtle: { value: "{colors.pink.500}" },
						emphasized: { value: "{colors.pink.500}" },
						focusRing: { value: "{colors.pink.500}" }
					},
					pink_shaded: {
						solid: { value: "{colors.pink.700}" },
						contrast: { value: "{colors.pink.300}" },
						fg: { value: "{colors.pink.900}" },
						muted: { value: "{colors.pink.300}" },
						subtle: { value: "{colors.pink.500}" },
						emphasized: { value: "{colors.pink.500}" },
						focusRing: { value: "{colors.pink.700}" }
					},
					pink_tintend: {
						solid: { value: "{colors.pink.300}" },
						contrast: { value: "{colors.pink.700}" },
						fg: { value: "{colors.pink.100}" },
						muted: { value: "{colors.pink.700}" },
						subtle: { value: "{colors.pink.900}" },
						emphasized: { value: "{colors.pink.900}" },
						focusRing: { value: "{colors.pink.300}" }
					},
					red: {
						solid: { value: "{colors.red.400}" },
						contrast: { value: "{colors.red.500}" },
						fg: { value: "{colors.red.900}" },
						muted: { value: "{colors.red.500}" },
						subtle: { value: "{colors.red.400}" },
						emphasized: { value: "{colors.red.500}" },
						focusRing: { value: "{colors.red.500}" }
					},
					red_shaded: {
						solid: { value: "{colors.red.700}" },
						contrast: { value: "{colors.red.300}" },
						fg: { value: "{colors.red.900}" },
						muted: { value: "{colors.red.300}" },
						subtle: { value: "{colors.red.500}" },
						emphasized: { value: "{colors.red.500}" },
						focusRing: { value: "{colors.red.700}" }
					},
					red_tintend: {
						solid: { value: "{colors.red.300}" },
						contrast: { value: "{colors.red.700}" },
						fg: { value: "{colors.red.100}" },
						muted: { value: "{colors.red.700}" },
						subtle: { value: "{colors.red.900}" },
						emphasized: { value: "{colors.red.900}" },
						focusRing: { value: "{colors.red.300}" }
					},
					violet: {
						solid: { value: "{colors.violet.500}" },
						contrast: { value: "{colors.violet.500}" },
						fg: { value: "{colors.violet.900}" },
						muted: { value: "{colors.violet.500}" },
						subtle: { value: "{colors.violet.500}" },
						emphasized: { value: "{colors.violet.500}" },
						focusRing: { value: "{colors.violet.500}" }
					},
					violet_shaded: {
						solid: { value: "{colors.violet.700}" },
						contrast: { value: "{colors.violet.300}" },
						fg: { value: "{colors.violet.900}" },
						muted: { value: "{colors.violet.300}" },
						subtle: { value: "{colors.violet.500}" },
						emphasized: { value: "{colors.violet.500}" },
						focusRing: { value: "{colors.violet.700}" }
					},
					violet_tintend: {
						solid: { value: "{colors.violet.300}" },
						contrast: { value: "{colors.violet.700}" },
						fg: { value: "{colors.violet.100}" },
						muted: { value: "{colors.violet.700}" },
						subtle: { value: "{colors.violet.900}" },
						emphasized: { value: "{colors.violet.900}" },
						focusRing: { value: "{colors.violet.300}" }
					},
					yellow: {
						solid: { value: "{colors.yellow.400}" },
						contrast: { value: "{colors.yellow.500}" },
						fg: { value: "{colors.yellow.900}" },
						muted: { value: "{colors.yellow.500}" },
						subtle: { value: "{colors.yellow.400}" },
						emphasized: { value: "{colors.yellow.500}" },
						focusRing: { value: "{colors.yellow.500}" }
					},
					yellow_shaded: {
						solid: { value: "{colors.yellow.700}" },
						contrast: { value: "{colors.yellow.300}" },
						fg: { value: "{colors.yellow.900}" },
						muted: { value: "{colors.yellow.300}" },
						subtle: { value: "{colors.yellow.500}" },
						emphasized: { value: "{colors.yellow.500}" },
						focusRing: { value: "{colors.yellow.700}" }
					},
					yellow_tintend: {
						solid: { value: "{colors.yellow.300}" },
						contrast: { value: "{colors.yellow.700}" },
						fg: { value: "{colors.yellow.100}" },
						muted: { value: "{colors.yellow.700}" },
						subtle: { value: "{colors.yellow.900}" },
						emphasized: { value: "{colors.yellow.900}" },
						focusRing: { value: "{colors.yellow.300}" }
					},
					orange: {
						solid: { value: "{colors.orange.500}" },
						contrast: { value: "{colors.orange.500}" },
						fg: { value: "{colors.orange.900}" },
						muted: { value: "{colors.orange.500}" },
						subtle: { value: "{colors.orange.500}" },
						emphasized: { value: "{colors.orange.500}" },
						focusRing: { value: "{colors.orange.500}" }
					},
					orange_shaded: {
						solid: { value: "{colors.orange.700}" },
						contrast: { value: "{colors.orange.300}" },
						fg: { value: "{colors.orange.900}" },
						muted: { value: "{colors.orange.300}" },
						subtle: { value: "{colors.orange.500}" },
						emphasized: { value: "{colors.orange.500}" },
						focusRing: { value: "{colors.orange.700}" }
					},
					orange_tintend: {
						solid: { value: "{colors.orange.300}" },
						contrast: { value: "{colors.orange.700}" },
						fg: { value: "{colors.orange.100}" },
						muted: { value: "{colors.orange.700}" },
						subtle: { value: "{colors.orange.900}" },
						emphasized: { value: "{colors.orange.900}" },
						focusRing: { value: "{colors.orange.300}" }
					},
					teal: {
						solid: { value: "{colors.teal.500}" },
						contrast: { value: "{colors.teal.500}" },
						fg: { value: "{colors.teal.900}" },
						muted: { value: "{colors.teal.500}" },
						subtle: { value: "{colors.teal.500}" },
						emphasized: { value: "{colors.teal.500}" },
						focusRing: { value: "{colors.teal.500}" }
					},
					teal_shaded: {
						solid: { value: "{colors.teal.700}" },
						contrast: { value: "{colors.teal.300}" },
						fg: { value: "{colors.teal.900}" },
						muted: { value: "{colors.teal.300}" },
						subtle: { value: "{colors.teal.500}" },
						emphasized: { value: "{colors.teal.500}" },
						focusRing: { value: "{colors.teal.700}" }
					},
					teal_tintend: {
						solid: { value: "{colors.teal.300}" },
						contrast: { value: "{colors.teal.700}" },
						fg: { value: "{colors.teal.100}" },
						muted: { value: "{colors.teal.700}" },
						subtle: { value: "{colors.teal.900}" },
						emphasized: { value: "{colors.teal.900}" },
						focusRing: { value: "{colors.teal.300}" }
					},
					cyan: {
						solid: { value: "{colors.cyan.500}" },
						contrast: { value: "{colors.cyan.500}" },
						fg: { value: "{colors.cyan.900}" },
						muted: { value: "{colors.cyan.500}" },
						subtle: { value: "{colors.cyan.500}" },
						emphasized: { value: "{colors.cyan.500}" },
						focusRing: { value: "{colors.cyan.500}" }
					},
					cyan_shaded: {
						solid: { value: "{colors.cyan.700}" },
						contrast: { value: "{colors.cyan.300}" },
						fg: { value: "{colors.cyan.900}" },
						muted: { value: "{colors.cyan.300}" },
						subtle: { value: "{colors.cyan.500}" },
						emphasized: { value: "{colors.cyan.500}" },
						focusRing: { value: "{colors.cyan.700}" }
					},
					cyan_tintend: {
						solid: { value: "{colors.cyan.300}" },
						contrast: { value: "{colors.cyan.700}" },
						fg: { value: "{colors.cyan.100}" },
						muted: { value: "{colors.cyan.700}" },
						subtle: { value: "{colors.cyan.900}" },
						emphasized: { value: "{colors.cyan.900}" },
						focusRing: { value: "{colors.cyan.300}" }
					}
				}
			}
		}
	});

	return (
		<DataContext.Provider value={appContextObject}>
			<ChakraProvider value={createSystem(defaultConfig, customConfig)}>
				<Feedback feedback={feedback} />
				{children}
			</ChakraProvider>
		</DataContext.Provider>
	);
};

export const useDataContext = () => {
	return React.useContext(DataContext) as DataContextProps;
};
