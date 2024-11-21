import { useCallback, useMemo } from "react";
import { ContainerUri, LeafUri } from "@ldo/solid";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { PostShShapeType } from "../.ldo/post.shapeTypes";

export const Post = ({ postUri }: { postUri: ContainerUri }) => {
  const postIndexUri = `${postUri}index.ttl`;
  const postResource = useResource(postIndexUri);
  const post = useSubject(PostShShapeType, postIndexUri);
  const { getResource } = useLdo();
  const imageResource = useResource(
    post?.image?.["@id"] as LeafUri | undefined
  );

  const blobUrl = useMemo(() => {
    if (imageResource && imageResource.isBinary()) {
      return URL.createObjectURL(imageResource.getBlob()!);
    }
    return undefined;
  }, [imageResource]);

  const deletePost = useCallback(async () => {
    const postContainer = getResource(postUri);
    await postContainer.delete();
  }, [postUri, getResource]);

  if (postResource.status.isError) {
    return <p className="text-red-500">Error: {postResource.status.message}</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
      <div className="p-4">
        <p className="text-gray-700">{post.articleBody}</p>
      </div>
      {blobUrl && (
        <img
          src={blobUrl}
          alt={post.articleBody}
          className="w-full object-contain max-h-96"
        />
      )}
      <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Posted on: {new Date(post.uploadDate).toLocaleString()}
        </span>
        <button
          onClick={deletePost}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded"
        >
          Delete Post
        </button>
      </div>
    </div>
  );
};
