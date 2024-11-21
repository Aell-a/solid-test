import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { FunctionComponent } from "react";
import { SolidProfileShapeShapeType } from "../.ldo/solidProfile.shapeTypes";

export const Header: FunctionComponent = () => {
  const { session, login, logout } = useSolidAuth();
  const webIdResource = useResource(session.webId);
  const profile = useSubject(SolidProfileShapeShapeType, session.webId);

  const loggedInName = webIdResource?.isReading()
    ? "LOADING..."
    : profile?.fn
      ? profile.fn
      : session.webId;

  return (
    <header>
      {session.isLoggedIn ? (
        <p>
          You are logged in as {loggedInName}.{" "}
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
