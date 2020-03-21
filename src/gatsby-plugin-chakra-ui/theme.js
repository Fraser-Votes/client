import { theme } from "@chakra-ui/core";

export default {
    ...theme,
    fonts: {
        ...theme.fonts,
        heading: "Averta Std",
        body: "Averta Std"
    },
    letterSpacings: {
        ...theme.letterSpacings,
        normal: "0.015em"
    },
    colors: {
        ...theme.colors,
        black: "#102A43",
        primary: {
            50: "#D5FFFF",
            100: "#B8FEFF",
            200: "#7CF2FF",
            300: "#48DBFF",
            400: "#1FB7FD",
            500: "#0084F4",
            600: "#0054DE",
            700: "#0023C4",
            800: "#0400A6",
            900: "#1D0087"
        },
        blueGray: {
            50: "#F0F4F8",
            100: "#D9E2EC",
            200: "#84C5F4",
            300: "#9FB3C8",
            400: "#829AB1",
            500: "#627D98",
            600: "#486581",
            700: "#334E68",
            800: "#243B53",
            900: "#102A43"
        },
        blue: {
            50: "#DCEEFB",
            100: "#B6E0FE",
            200: "#84C5F4",
            300: "#62B0E8",
            400: "#4098D7",
            500: "#2680C2",
            600: "#186FAF",
            700: "#0F609B",
            800: "#0A558C",
            900: "#003E6B"
        },
        yellow: {
            50: "#FFFBEA",
            100: "#FFF3C4",
            200: "#FCE588",
            300: "#FADB5F",
            400: "#F7C948",
            500: "#F0B429",
            600: "#DE911D",
            700: "#CB6E17",
            800: "#B44D12",
            900: "#8D2B0B"
        },
        teal: {
            50: "#E0FCFF",
            100: "#BEF8FD",
            200: "#87EAF2",
            300: "#54D1DB",
            400: "#38BEC9",
            500: "#2CB1BC",
            600: "#14919B",
            700: "#0E7C86",
            800: "#0A6C74",
            900: "#044E54"
        },
        red: {
            50: "#FFEEEE",
            100: "#FACDCD",
            200: "#F29B9B",
            300: "#E66A6A",
            400: "#D64545",
            500: "#BA2525",
            600: "#A61B1B",
            700: "#911111",
            800: "#780A0A",
            900: "#610404"
        }

    }
}