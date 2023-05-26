import { Session } from "next-auth";
import { api } from "~/utils/api";
import styles from "../pages/scores.module.css";
import Image from "next/image";
import { LoadingDots } from "./LoadingDots";

interface TeamProps {
  id: string;
  name: string;
  image: string;
  team: string[];
  session: Session | null;
}

export const Team: React.FC<TeamProps> = ({
  id,
  name,
  image,
  team,
  session,
}) => {
  const { data, isLoading, refetch } = api.example.getScoreByTeamId.useQuery({
    teamId: id,
  });
  const addPoints = api.example.addTenPoints.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const removePoints = api.example.removeTenPoints.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const score = data?._sum.score ?? 0;
  return (
    <div className={styles.team}>
      <Image src={image} alt={name} width={100} height={100} />
      <div className={styles.teamName}>{name}</div>
      {session ? (
        <div className={styles.adminScorer}>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <>
              <div
                className={styles.addRemoveButton}
                onClick={() => removePoints.mutate({ teamId: id })}
              >
                -
              </div>
              <div className={styles.teamScore}>{score}</div>
              <div
                className={styles.addRemoveButton}
                onClick={() => addPoints.mutate({ teamId: id })}
              >
                +
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <div className={styles.teamScore}>{score}</div>
          )}
        </>
      )}
      <div className={styles.teamList}>
        {team.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>
    </div>
  );
};
