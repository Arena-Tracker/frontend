"use client";

import * as React from "react";

// Pentru a nu da eroare mai jos, am inlocuit <Span> cu un element HTML normal <span>
// (Daca in varianta originala <Span> era importat de undeva anume, pastreaza acel import)

export function ColorModeProvider(props) {
  return <>{props.children}</>;
}

export function useColorMode() {
  const [colorMode] = React.useState("light");

  return {
    colorMode: colorMode,
    setColorMode: () => {},
    toggleColorMode: () => {},
  };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

// Aici erau liniile "orfane" pe care le-am sters

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      ref={ref}
      {...props}
    />
  );
});

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  );
});
