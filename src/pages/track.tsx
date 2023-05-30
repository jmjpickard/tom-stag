import { api } from "~/utils/api";
import { NextPage } from "next";
import styles from "./scores.module.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TrackPage: NextPage = () => {
  const { data: teams, isLoading } = api.example.getAllTeams.useQuery();
  const teamNames = teams?.map((team) => team.teamName) ?? [];
  const { data } = api.example.getTeamScores.useQuery();
  console.log(data);
  const scores = data?.map((score) => {
    const team = teams?.find((team) => team.id === score.teamId);
    return {
      date: new Date(score.timeInterval),
      [team?.teamName ?? "Team"]: score.cumulativeScore,
    };
  });
  return (
    <main className={styles.main}>
      {isLoading ? (
        <div>Loading chart...</div>
      ) : (
        <div>
          <LineChart
            width={730}
            height={250}
            data={scores}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={teamNames[0]} stroke="#8884d8" />
            <Line type="monotone" dataKey={teamNames[1]} stroke="#82ca9d" />
          </LineChart>
        </div>
      )}
    </main>
  );
};

export default TrackPage;
