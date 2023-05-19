import { NextPage } from "next";
import { useSession } from "next-auth/react";
import styles from "./scores.module.css";
import { ManUnited } from "~/svg/manUnited";
import { ManCity } from "~/svg/manCity";
import { api } from "~/utils/api";

const ScoresPage: NextPage = () => {
  const { data: session } = useSession();
  const scores = api.example.getTeamScores.useQuery();

  const addPoints = api.example.addTenPoints.useMutation({
    onSuccess: () => {
      scores.refetch();
    },
  });
  const removePoints = api.example.removeTenPoints.useMutation({
    onSuccess: () => {
      scores.refetch();
    },
  });
  const united =
    scores.data?.find((team) => team.teamId === 1)?._sum.score ?? 0;
  const city = scores.data?.find((team) => team.teamId === 2)?._sum.score ?? 0;

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.teams}>
          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <ManUnited />
            </div>
            <div className={styles.teamName}>Team United</div>
            {session ? (
              <div className={styles.adminScorer}>
                <div
                  className={styles.addRemoveButton}
                  onClick={() => removePoints.mutate({ teamId: 1 })}
                >
                  -
                </div>
                <div className={styles.teamScore}>{united}</div>
                <div
                  className={styles.addRemoveButton}
                  onClick={() => addPoints.mutate({ teamId: 1 })}
                >
                  +
                </div>
              </div>
            ) : (
              <div className={styles.teamScore}>{united}</div>
            )}
            <div className={styles.teamList}>
              <div>Joe B (Capt.)</div>
              <div>Mark D</div>
              <div>Tom S</div>
              <div>Alex D</div>
              <div>Dave G</div>
            </div>
          </div>
          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <ManCity />
            </div>
            <div className={styles.teamName}>Team City</div>
            {session ? (
              <div className={styles.adminScorer}>
                <div
                  className={styles.addRemoveButton}
                  onClick={() => removePoints.mutate({ teamId: 2 })}
                >
                  -
                </div>
                <div className={styles.teamScore}>{city}</div>
                <div
                  className={styles.addRemoveButton}
                  onClick={() => addPoints.mutate({ teamId: 2 })}
                >
                  +
                </div>
              </div>
            ) : (
              <div className={styles.teamScore}>{city}</div>
            )}
            <div className={styles.teamList}>
              <div>Jack K (Capt.)</div>
              <div>Harry S</div>
              <div>Caleb</div>
              <div>Jim C</div>
              <div>Jack P</div>
            </div>
          </div>
        </div>
        <div className={styles.scoringRules}>
          <div className={styles.teamName}>Scoring rules</div>
          <div>
            <div>Go-Kart @12pm (2x8 lap races)</div>
            <ul>
              <li>50 points winner</li>
              <li>40 points 2nd</li>
              <li>30 points 3rd</li>
              <li>20 points 4th</li>
              <li>30 points to worst driver</li>
            </ul>
          </div>
          <div>
            <div>Darts @2pm</div>
            <ul>
              <li>30 points to winner of each game</li>
            </ul>
          </div>
          <div>
            <div>FA cup final @3pm</div>
            <ul>
              <li>£10 bet per team {"->"} points per pound won</li>
              <li>50 points to winning team</li>
            </ul>
          </div>
          <div>
            <div>Casino @9:30pm</div>
            <ul>
              <li>£15 per person {"->"} points per pound won</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ScoresPage;
