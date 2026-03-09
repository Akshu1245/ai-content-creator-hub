import { describe, expect, it } from "vitest";
import { calculateRevenue, getAffiliatesForNiche, NICHE_RPM_DATA } from "@/lib/revenue-data";

describe("revenue-data", () => {
  it("returns null for unsupported niche", () => {
    expect(calculateRevenue("Unknown Niche", 3)).toBeNull();
  });

  it("calculates deterministic YPP ETA for valid niche", () => {
    const result = calculateRevenue("Finance", 4);
    expect(result).not.toBeNull();
    expect(result?.yppEta.videosNeeded).toBe(67);
    expect(result?.yppEta.daysEstimated).toBe(118);
  });

  it("keeps realistic revenue within niche average RPM formula", () => {
    const result = calculateRevenue("Technology", 5);
    expect(result).not.toBeNull();

    const rpm = NICHE_RPM_DATA.Technology.avg_rpm;
    const monthlyVideos = 20;
    const expectedMonth3 = (monthlyVideos * 2500 / 1000) * rpm;

    expect(result?.realistic.month3Revenue).toBe(expectedMonth3);
    expect(result?.competitionLevel).toBe("High");
  });

  it("returns affiliates sorted by commission descending", () => {
    const affiliates = getAffiliatesForNiche("Finance");
    expect(affiliates.length).toBeGreaterThan(1);

    for (let i = 1; i < affiliates.length; i += 1) {
      expect(affiliates[i - 1].commissionNumeric).toBeGreaterThanOrEqual(affiliates[i].commissionNumeric);
    }
  });
});
