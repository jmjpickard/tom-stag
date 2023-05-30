import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import styles from "./scores.module.css";
import { api } from "~/utils/api";
import { Team } from "~/components/Team";
import Link from "next/link";
import LoadingTeams from "~/components/LodingTeams";
import type { Teams } from "@prisma/client";

interface TeamInput {
  name: string;
  image: string;
  members: string[];
}

const TEAMS = [
  {
    name: "Team United",
    image:
      "https://upload.wikimedia.org/wikipedia/sco/7/7a/Manchester_United_FC_crest.svg",
    members: ["Jack K (Capt.)", "Harry S", "Caleb", "Jim C", "Jack P"],
  },
  {
    name: "Team City",
    image:
      "https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg",
    members: ["Joe B (Capt.)", "Mark D", "Tom S", "Alex D", "Dave G"],
  },
];

const ScoresPage: NextPage = () => {
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.example.getAllTeams.useQuery();
  const teams = data ?? [];
  const teamIds = teams.map((team: Teams) => team.id);

  const addTeam = api.example.addTeam.useMutation();
  const deleteRows = api.example.deleteRowsByTeamId.useMutation({
    onSuccess: () => refetch(),
  });

  const handleBuildTeams = (teams: TeamInput[]) => {
    teams.forEach((team) => {
      addTeam.mutate({
        name: team.name,
        logo: team.image,
        members: team.members,
      });
    });
  };

  return (
    <main className={styles.main}>
      {isLoading ? (
        <LoadingTeams />
      ) : (
        <div className={styles.content}>
          <div className={styles.teams}>
            {teams.length === 0 ? (
              !isLoading && (
                <button onClick={() => handleBuildTeams(TEAMS)}>
                  Build teams
                </button>
              )
            ) : (
              <div className={styles.teams}>
                {teams.map((team) => (
                  <Team
                    key={team.id}
                    id={team.id}
                    name={team.teamName}
                    image={team.teamLogo}
                    team={team.teamMembers}
                    session={session}
                  />
                ))}
              </div>
            )}
          </div>
          <Link href="/track">
            <div className={styles.trackButton}>Track scores</div>
          </Link>
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
            <p>
              Points may be rewarded or taken away at the discretion of Jack
              Pickard alone.
            </p>
          </div>
          {session && (
            <button onClick={() => deleteRows.mutate({ teamId: teamIds })}>
              Delete all rows
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default ScoresPage;
