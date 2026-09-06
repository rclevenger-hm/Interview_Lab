import { disciplines as baseDisciplines } from "./data";
import { extraChallengesByDiscipline } from "./extraChallenges";

export const disciplines = baseDisciplines.map((discipline) => ({
  ...discipline,
  tests: [...discipline.tests, ...(extraChallengesByDiscipline[discipline.id] ?? [])],
}));
