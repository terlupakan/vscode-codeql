import * as React from "react";
import * as Sarif from "sarif";
import { parseSarifPlainTextMessage } from "../../../common/sarif-utils";
import { SarifLocation } from "./SarifLocation";

/**
 * Parses a SARIF message and populates clickable locations.
 */
export function SarifMessageWithLocations({
  msg,
  relatedLocations,
  sourceLocationPrefix,
  databaseUri,
  jumpToLocationCallback,
}: {
  msg: string;
  relatedLocations: Sarif.Location[];
  sourceLocationPrefix: string;
  databaseUri: string;
  jumpToLocationCallback: () => void;
}) {
  const relatedLocationsById: Map<number, Sarif.Location> = new Map();
  for (const loc of relatedLocations) {
    if (loc.id !== undefined) {
      relatedLocationsById.set(loc.id, loc);
    }
  }

  return (
    <>
      {parseSarifPlainTextMessage(msg).map((part, i) => {
        if (typeof part === "string") {
          return <span key={i}>{part}</span>;
        } else {
          return (
            <SarifLocation
              key={i}
              text={part.text}
              loc={relatedLocationsById.get(part.dest)}
              sourceLocationPrefix={sourceLocationPrefix}
              databaseUri={databaseUri}
              jumpToLocationCallback={jumpToLocationCallback}
            />
          );
        }
      })}
    </>
  );
}
