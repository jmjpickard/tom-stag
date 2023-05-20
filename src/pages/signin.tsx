import React from "react";
import {
  getSession,
  getProviders,
  signIn,
  getCsrfToken,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { Session } from "next-auth";

import styles from "./index.module.css";

interface SignInProps {
  providers?: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  csrfToken?: string;
  session?: Session;
}

const SignIn: NextPage = ({ providers }: SignInProps) => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} className={styles.signInButton}>
              <a onClick={() => void signIn(provider.id)}>
                Sign in with {provider.name}
              </a>
            </div>
          ))}
      </div>
    </main>
  );
};

SignIn.getInitialProps = async (context): Promise<SignInProps> => {
  const { req, res } = context;
  const session = await getSession({ req });
  if (session && res) {
    res.writeHead(302, { Location: "/scores" });
    res.end();
    return {
      session,
      providers: undefined,
      csrfToken: undefined,
    };
  }

  return {
    session: undefined,
    providers: await getProviders(),
    csrfToken: await getCsrfToken({ req }),
  };
};

export default SignIn;
