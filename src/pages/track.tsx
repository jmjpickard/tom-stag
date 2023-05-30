import { api } from "~/utils/api";
import { NextPage } from "next";
import styles from "./scores.module.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TrackPage: NextPage = () => {
  const { data: teams, isLoading } = api.example.getAllTeams.useQuery();
  const { data } = api.example.getTeamScores.useQuery();
  const dataWithTeamNames = data?.map((team) => {
    const name = teams?.find((t) => t.id === team.teamId);
    return {
      ...team,
      teamId: name?.teamName ?? team.teamId,
    };
  });
  const colors = ["red", "lightblue"];

  return (
    <main className={styles.main}>
      {isLoading ? (
        <div>Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data[0].timeInterval" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataWithTeamNames?.map(({ teamId, teamScores }, index) => (
              <Line
                key={teamId}
                type="monotone"
                dataKey="cumulativeScore"
                name={teamId}
                data={teamScores}
                stroke={colors[index] ?? "#8884d8"}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </main>
  );
};

export default TrackPage;
