import React from "react";
import { Route } from "react-router-dom";

import HomeContent2 from "../pages/HomeContent2";
import SearchContent2 from "../pages/SearchContent2";
import FilterContent2 from "../pages/FilterContent2";

export const RoutesAlin = () => [
  <Route key="home" path="home" element={<HomeContent2 />} />,
  <Route key="search" path="search" element={<SearchContent2 />} />,
  <Route key="filter" path="search/filter/:sportType" element={<FilterContent2 />} />
];