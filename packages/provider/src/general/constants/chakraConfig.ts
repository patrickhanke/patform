import { defineConfig } from "@chakra-ui/react";

export const chakraConfig = defineConfig({
	theme: {
		tokens: {
			colors: {
				blue: {
					100: { value: "#EBF8FF" },
					200: { value: "#BEE3F8" },
					300: { value: "#90CDF4" },
					400: { value: "#63B3ED" },
					500: { value: "#4299E1" },
					600: { value: "#3182CE" },
					700: { value: "#2B6CB0" },
					800: { value: "#2C5282" },
					900: { value: "#2A4365" }
				},
				green: {
					100: { value: "#F0FFF4" },
					200: { value: "#C6F6D5" },
					300: { value: "#9AE6B4" },
					400: { value: "#68D391" },
					500: { value: "#48BB78" },
					600: { value: "#38A169" },
					700: { value: "#2F855A" },
					800: { value: "#276749" },
					900: { value: "#22543D" }
				},
				gray: {
					100: { value: "#F7FAFC" },
					200: { value: "#EDF2F7" },
					300: { value: "#E2E8F0" },
					400: { value: "#CBD5E0" },
					500: { value: "#A0AEC0" },
					600: { value: "#718096" },
					700: { value: "#4A5568" },
					800: { value: "#2D3748" },
					900: { value: "#1A202C" }
				},
				red: {
					100: { value: "#FFF5F5" },
					200: { value: "#FED7D7" },
					300: { value: "#FEB2B2" },
					400: { value: "#FC8181" },
					500: { value: "#F56565" },
					600: { value: "#E53E3E" },
					700: { value: "#C53030" },
					800: { value: "#9B2C2C" },
					900: { value: "#742A2A" }
				},
				yellow: {
					100: { value: "#FFFFF0" },
					200: { value: "#FEFCBF" },
					300: { value: "#FAF089" },
					400: { value: "#F6E05E" },
					500: { value: "#ECC94B" },
					600: { value: "#D69E2E" },
					700: { value: "#B7791F" },
					800: { value: "#975A16" },
					900: { value: "#744210" }
				},
				pink: {
					100: { value: "#FFF5F7" },
					200: { value: "#FED7E2" },
					300: { value: "#FBB6CE" },
					400: { value: "#F687B3" },
					500: { value: "#ED64A6" },
					600: { value: "#D53F8C" },
					700: { value: "#B83280" },
					800: { value: "#97266D" },
					900: { value: "#702459" }
				},
				violet: {
					100: { value: "#FAF5FF" },
					200: { value: "#E9D8FD" },
					300: { value: "#D6BCFA" },
					400: { value: "#B794F4" },
					500: { value: "#9F7AEA" },
					600: { value: "#805AD5" },
					700: { value: "#6B46C1" },
					800: { value: "#553C9A" },
					900: { value: "#44337A" }
				},
				orange: {
					100: { value: "#FFFAF0" },
					200: { value: "#FEEBC8" },
					300: { value: "#FBD38D" },
					400: { value: "#F6AD55" },
					500: { value: "#ED8936" },
					600: { value: "#DD6B20" },
					700: { value: "#C05621" },
					800: { value: "#9C4221" },
					900: { value: "#7B341E" }
				},
				teal: {
					100: { value: "#E6FFFA" },
					200: { value: "#B2F5EA" },
					300: { value: "#81E6D9" },
					400: { value: "#4FD1C5" },
					500: { value: "#38B2AC" },
					600: { value: "#319795" },
					700: { value: "#2C7A7B" },
					800: { value: "#285E61" },
					900: { value: "#234E52" }
				},
				cyan: {
					100: { value: "#E6FFFA" },
					200: { value: "#B2F5EA" },
					300: { value: "#81E6D9" },
					400: { value: "#4FD1C5" },
					500: { value: "#38B2AC" },
					600: { value: "#319795" },
					700: { value: "#2C7A7B" },
					800: { value: "#285E61" },
					900: { value: "#234E52" }
				}
			}
		},

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
				// green: {
				// 	solid: { value: "{colors.green.500}" },
				// 	contrast: { value: "{colors.green.100}" },
				// 	fg: { value: "{colors.green.700}" },
				// 	muted: { value: "{colors.green.100}" },
				// 	subtle: { value: "{colors.green.200}" },
				// 	emphasized: { value: "{colors.green.300}" },
				// 	focusRing: { value: "{colors.green.500}" }
				// },
				// green_shaded: {
				// 	solid: { value: "{colors.green.700}" },
				// 	contrast: { value: "{colors.green.300}" },
				// 	fg: { value: "{colors.green.900}" },
				// 	muted: { value: "{colors.green.300}" },
				// 	subtle: { value: "{colors.green.500}" },
				// 	emphasized: { value: "{colors.green.500}" },
				// 	focusRing: { value: "{colors.green.700}" }
				// },
				// green_tintend: {
				// 	solid: { value: "{colors.green.300}" },
				// 	contrast: { value: "{colors.green.700}" },
				// 	fg: { value: "{colors.green.100}" },
				// 	muted: { value: "{colors.green.700}" },
				// 	subtle: { value: "{colors.green.900}" },
				// 	emphasized: { value: "{colors.green.900}" },
				// 	focusRing: { value: "{colors.green.300}" }
				// },
				gray: {
					solid: { value: "{colors.gray.500}" },
					contrast: { value: "{colors.gray.100}" },
					fg: { value: "{colors.gray.700}" },
					muted: { value: "{colors.gray.100}" },
					subtle: { value: "{colors.gray.200}" },
					emphasized: { value: "{colors.gray.300}" },
					focusRing: { value: "{colors.gray.500}" }
				},
				gray_shaded: {
					solid: { value: "{colors.gray.700}" },
					contrast: { value: "{colors.gray.300}" },
					fg: { value: "{colors.gray.900}" },
					muted: { value: "{colors.gray.300}" },
					subtle: { value: "{colors.gray.500}" },
					emphasized: { value: "{colors.gray.500}" },
					focusRing: { value: "{colors.gray.700}" }
				},
				gray_tintend: {
					solid: { value: "{colors.gray.300}" },
					contrast: { value: "{colors.gray.700}" },
					fg: { value: "{colors.gray.100}" },
					muted: { value: "{colors.gray.700}" },
					subtle: { value: "{colors.gray.900}" },
					emphasized: { value: "{colors.gray.900}" },
					focusRing: { value: "{colors.gray.300}" }
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
