import { FunctionComponent } from "react";
import { MakePost } from "./MakePost";
import { Post } from "./Post";
import { useSolidAuth } from "@ldo/solid-react";

export const Blog: FunctionComponent = () => {
  const { session } = useSolidAuth();
  if (!session.isLoggedIn) return <p>No blog available. Log in first.</p>;

  return (
    <main>
      <MakePost />
      <hr />
      <Post />
    </main>
  );
};
