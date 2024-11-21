import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { SolidProfileShapeShapeType } from "../.ldo/solidProfile.shapeTypes";

export const Header = () => {
  const { session, login, logout } = useSolidAuth();
  const webIdResource = useResource(session.webId);
  const profile = useSubject(SolidProfileShapeShapeType, session.webId);

  const loggedInName = webIdResource?.isReading()
    ? "Loading..."
    : profile?.fn
      ? profile.fn
      : session.webId;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/solid.png"
            alt="Decentralized Blog Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800">Solid Blog</h1>
        </div>
        <div>
          {session.isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Logged in as {loggedInName}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const issuer = prompt(
                  "Enter your Solid Issuer",
                  "https://solidweb.me"
                );
                if (!issuer) return;
                login(issuer);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
