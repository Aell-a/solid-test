import { FormEvent, useCallback, useState } from "react";
import { Container, Leaf, LeafUri } from "@ldo/solid";
import { useLdo } from "@ldo/solid-react";
import { PostShShapeType } from "../.ldo/post.shapeTypes";

export const MakePost = ({ mainContainer }: { mainContainer?: Container }) => {
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
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Post
        </button>
      </div>
    </form>
  );
};
