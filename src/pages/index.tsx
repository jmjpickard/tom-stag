import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { MainBackground } from "~/svg/main";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scottys Stag</title>
        <meta name="description" content="It is Tommy's stag!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h4>The stag of</h4>
            <h3>Mr Thomas Scott</h3>
          </div>
          <MainBackground />
          <div className={styles.date}>2nd-3rd June 2023</div>
          <Link href="/scores">
            <div className={styles.enterButton}>Enter</div>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
