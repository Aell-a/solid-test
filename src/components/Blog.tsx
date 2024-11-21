import { Fragment, useEffect, useState } from "react";
import { MakePost } from "./MakePost";
import { Post } from "./Post";
import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import { ContainerUri, Container } from "@ldo/solid";

export const Blog = () => {
  const { session } = useSolidAuth();
  const { getResource } = useLdo();
  const [mainContainerUri, setMainContainerUri] = useState<
    ContainerUri | undefined
  >();

  useEffect(() => {
    if (session.webId) {
      const webIdResource = getResource(session.webId);
      webIdResource.getRootContainer().then((rootContainerResult) => {
        if (rootContainerResult.isError) return;
        const mainContainer = rootContainerResult.child("solid-blog/");
        setMainContainerUri(mainContainer.uri);
        mainContainer.createIfAbsent();
      });
    }
  }, [getResource, session.webId]);

  const mainContainer = useResource(mainContainerUri);

  if (!session.isLoggedIn)
    return (
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        role="alert"
      >
        <p className="font-bold">Not Logged In</p>
        <p>Please log in to view and create blog posts.</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <MakePost mainContainer={mainContainer} />
      <div className="space-y-4">
        {mainContainer
          ?.children()
          .filter((child): child is Container => child.type === "container")
          .map((child) => <Post key={child.uri} postUri={child.uri} />)}
      </div>
    </div>
  );
};
