import { TeamScores } from "@prisma/client";

export type TeamScoreResult = {
  teamId: string;
  timeInterval: Date;
  cumulativeScore: number;
};

export const calculateCumulativeScores = (
  teamScores: TeamScores[]
): TeamScoreResult[] => {
  const sortedScores = teamScores.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

  const result: TeamScoreResult[] = [];

  if (sortedScores.length === 0) {
    return result;
  }
  const firstScoreTime = sortedScores[0] as TeamScores;

  let currentTimeInterval = new Date(
    Math.floor(firstScoreTime.createdAt.getTime() / fifteenMinutes) *
      fifteenMinutes
  );
  let currentCumulativeScore = 0;

  for (const score of sortedScores) {
    const scoreTime = score.createdAt.getTime();
    const timeDifference = scoreTime - currentTimeInterval.getTime();

    if (timeDifference >= fifteenMinutes) {
      result.push({
        teamId: score.teamId,
        timeInterval: currentTimeInterval,
        cumulativeScore: currentCumulativeScore,
      });

      currentTimeInterval = new Date(
        Math.floor(scoreTime / fifteenMinutes) * fifteenMinutes
      );
    }

    currentCumulativeScore += score.score;
  }
  const lastItem = sortedScores[sortedScores.length - 1] as TeamScores;

  result.push({
    teamId: lastItem.teamId,
    timeInterval: currentTimeInterval,
    cumulativeScore: currentCumulativeScore,
  });

  return result;
};

export function groupByAndAggregate(data: TeamScores[]): {
  [key: string]: number;
} {
  data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return data.reduce((result: { [key: string]: number }, item) => {
    const timestamp = item.createdAt;
    const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
    const roundedTimestamp = new Date(
      Math.floor(timestamp.getTime() / interval) * interval
    );

    const key = `${roundedTimestamp.toISOString()}-${item.teamId}`;
    const aggregateValue = item.score;

    if (!result[key]) {
      result[key] = 0;
    }

    result[key] += aggregateValue;

    return result;
  }, {});
}
