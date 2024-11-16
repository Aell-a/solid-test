import { useSolidAuth } from "@ldo/solid-react";
import { FunctionComponent } from "react";

export const Header: FunctionComponent = () => {
  const { session, login, logout } = useSolidAuth();

  return (
    <header>
      {session.isLoggedIn ? (
        <p>
          You are logged in with the webId {session.webId}.{" "}
          <button onClick={logout}>Log Out</button>
        </p>
      ) : (
        <p>
          You are not Logged In{" "}
          <button
            onClick={() => {
              const issuer = prompt(
                "Enter your Solid Issuer",
                "https://solidweb.me"
              );
              if (!issuer) return;
              login(issuer);
            }}
          >
            Log In
          </button>
        </p>
      )}
      <hr />
    </header>
  );
};
