/* eslint-disable no-console */

import React, { useState, useEffect, useContext } from "react";
import { getWorldMapInfo } from "../services/dashboard-api";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { RangesContext } from "../../contexts/ranges";

const CustomWorldMap = (ratings) => {
  const [data, setData] = useState([]);

  const { ranges, updateRanges } = useContext(RangesContext);

  const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

  useEffect(() => {
    getWorldMapInfo(ratings.getRatings, ratings.years).then((response) => {
      setData(response);
    });
  }, [ratings.getRatings, ratings.getRatings.length, ratings.years]);

  return (
    <ComposableMap className="left-map">
      <ZoomableGroup
        //<ZoomableGroup center={[10, 50]} zoom={1}>
        zoom={1}
        translateExtent={[
          [-(ratings.mapWidth / 2), -(ratings.mapHeight / 2)],
          [ratings.mapWidth + 100, ratings.mapHeight],
        ]}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              let geoMap = new Map();

              if (Array.isArray(data)) {
                data.forEach((s) => {
                  if (s.country === geo.properties.name) {
                    if (s.score >= ranges[2][0]) {
                      geoMap.set("color", "green");
                      geoMap.set(geo, geo);
                    } else if (
                      s.score >= ranges[1][0] &&
                      s.score < ranges[2][0]
                    ) {
                      geoMap.set("color", "yellow");
                      geoMap.set(geo, geo);
                    } else if (s.score < ranges[1][0] && s.score > 0) {
                      geoMap.set(geo, geo);
                      geoMap.set("color", "red");
                    } else if (s.score <= 0) {
                      geoMap.set(geo, geo);
                      geoMap.set("color", "#F5F4F6");
                    }
                  }
                });
              }
              return (
                <Geography
                  key={geoMap.size > 0 ? geoMap.get(geo).rsmKey : geo.rsmKey}
                  geography={geoMap.size > 0 ? geoMap.get(geo) : geo}
                  fill={geoMap.size > 0 ? geoMap.get("color") : "#F5F4F6"}
                  style={{
                    default: {
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      stroke: "#607D8B",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    pressed: {
                      stroke: "#607D8B",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default CustomWorldMap;
