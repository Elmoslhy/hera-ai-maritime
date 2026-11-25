import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../routes/intelligence.tsx", import.meta.url), "utf8");
const capabilityData = page.split("const CAPS: Cap[] = [")[1]?.split("];", 1)[0] ?? "";
const capabilities = [...capabilityData.matchAll(/\{ t: "([^"]+)".*?s: "([^"]+)"/g)];

describe("HERA AI availability", () => {
  test("all sixteen capabilities are live", () => {
    assert.equal(capabilities.length, 16);
    assert.equal(capabilities.filter((entry) => entry[2] === "live").length, 16);
  });

  for (const title of ["Meetings at sea", "Network exposure", "Coverage gaps", "Load line and cargo", "Flag-state profile", "Pilot boarding risk", "Port calls and voyage replay", "Satellite and drone tasking"]) {
    test(`${title} is live`, () => {
      assert.equal(capabilities.find((entry) => entry[1] === title)?.[2], "live");
    });
  }

  for (const title of ["Coverage gaps", "Meetings at sea"]) {
    test(`${title} is live in dark fleet detection`, () => {
      const row = [...page.matchAll(/\["(live|built|dev)", "([^"]+)"/g)].find((entry) => entry[2] === title);
      assert.equal(row?.[1], "live");
    });
  }

  test("the homepage live capability figure is sixteen", () => {
    const source = readFileSync(new URL("../components/seker/Sections.tsx", import.meta.url), "utf8");
    const proofData = source.split("const PROOF: [string, string][] = [")[1]?.split("];", 1)[0] ?? "";
    assert.equal(Number(proofData.match(/\["(\d+)"/)?.[1]), 16);
  });
});