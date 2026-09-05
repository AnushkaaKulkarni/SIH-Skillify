import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCompetencyScore,
  calculateSkillGap,
  scoreToLevel,
} from "./competencyEngine.js";

test("scoreToLevel uses the prototype 0-100 scale", () => {
  assert.equal(scoreToLevel(0), 0);
  assert.equal(scoreToLevel(20), 1);
  assert.equal(scoreToLevel(40), 2);
  assert.equal(scoreToLevel(60), 3);
  assert.equal(scoreToLevel(75), 4);
  assert.equal(scoreToLevel(90), 5);
});

test("calculateSkillGap classifies open and addressed gaps", () => {
  assert.deepEqual(calculateSkillGap({ requiredLevel: 4, currentLevel: 2 }), {
    requiredLevel: 4,
    currentLevel: 2,
    gap: 2,
    status: "open",
  });
  assert.equal(calculateSkillGap({ requiredLevel: 3, currentLevel: 3 }).status, "addressed");
});

test("first evidence uses the latest score without inventing prior evidence", () => {
  assert.equal(calculateCompetencyScore({ latestScore: 80 }), 80);
  assert.equal(calculateCompetencyScore({ latestScore: 0 }), 0);
  assert.equal(calculateCompetencyScore({}), null);
});

test("subsequent evidence uses the centralized 70/30 update", () => {
  assert.equal(calculateCompetencyScore({ previousScore: 60, latestScore: 100 }), 72);
});