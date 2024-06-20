import { useContext, useEffect, useMemo, useState } from "react";
import { PostList as PostListData } from "../store/Post-List-store";
import WelcomeMessage from "./WelcomeMessage";
import Post from "./Post";
import LoadingSpinner from "./Loading-Spinner";

const PostList = () => {
  const { postlist, addinitialposts } = useContext(PostListData);
  const [featching, setfeatching] = useState(false);

  useEffect(() => {
    setfeatching(true);
    const controller = new AbortController();
    const signal = controller.signal;

    fetch("https://dummyjson.com/posts", { signal })
      .then((res) => res.json())
      .then((data) => {
        // Ensure reactions field has both likes and dislikes
        const formattedPosts = data.posts.map((post) => ({
          ...post,
          reactions: {
            likes: post.reactions.likes || 0,
            dislikes: post.reactions.dislikes || 0,
          },
          tags: post.tags || [],
        }));
        addinitialposts(formattedPosts);
        setfeatching(false);
      });

    return () => {
      console.log("Cleaning up");
      controller.abort();
    };
  }, []);

  const arr = [1, 2, 3, 4, 5, 6];
  const sortedarr = useMemo(() => arr.sort(), [arr]);

  return (
    <>
      {featching && <LoadingSpinner />}
      {!featching && postlist.length === 0 && <WelcomeMessage />}
      {!featching &&
        postlist.map((posts) => <Post key={posts.id} posts={posts} />)}
    </>
  );
};

export default PostList;
