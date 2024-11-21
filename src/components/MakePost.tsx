import { FormEvent, FunctionComponent, useCallback, useState } from "react";
import { Container, Leaf, LeafUri } from "@ldo/solid";
import { useLdo } from "@ldo/solid-react";
import { PostShShapeType } from "../.ldo/post.shapeTypes";

export const MakePost: FunctionComponent<{ mainContainer?: Container }> = ({
  mainContainer,
}) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const { createData, commitData } = useLdo();

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!mainContainer) return;

      const postContainerResult = await mainContainer.createChildAndOverwrite(
        `${crypto.randomUUID()}/`
      );

      if (postContainerResult.isError) {
        alert(postContainerResult.message);
        return;
      }
      const postContainer = postContainerResult.resource;

      let uploadedImage: Leaf | undefined;
      if (selectedFile) {
        const result = await postContainer.uploadChildAndOverwrite(
          selectedFile.name as LeafUri,
          selectedFile,
          selectedFile.type
        );
        if (result.isError) {
          alert(result.message);
          await postContainer.delete();
          return;
        }
        uploadedImage = result.resource;
      }

      const indexResource = postContainer.child("index.ttl");
      const post = createData(
        PostShShapeType,
        indexResource.uri,
        indexResource
      );
      post.articleBody = message;
      if (uploadedImage) {
        post.image = { "@id": uploadedImage.uri };
      }
      post.type = { "@id": "SocialMediaPosting" };
      post.uploadDate = new Date().toISOString();
      const result = await commitData(post);
      if (result.isError) {
        alert(result.message);
      }
    },
    [mainContainer, message, selectedFile, createData, commitData]
  );
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Make a Post"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0])}
      />
      <input type="submit" value="Post" />
    </form>
  );
};
