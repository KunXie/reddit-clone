import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";
import { useSWRInfinite } from "swr";
// import { GetServerSideProps } from "next";

import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import { useAuthState } from "../context/auth";
import { fileURLToPath } from "node:url";

dayjs.extend(relativeTime);

export default function Home() {
  // client side rendering
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  // Axios.get("/posts")
  // .then((res) => setPosts(res.data))
  // .catch((err) => console.log(err));
  // }, []);
  const [observedPost, setObservedPost] = useState("");
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const description =
    "This is the personal project (Reddit Clone) made by Kun Xie";
  const title = "Reddit: the front page of the internet";

  const { authenticated } = useAuthState();

  // infinite loading
  // const { data: posts } = useSWR<Post[]>("/posts");
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);
  const posts: Post[] = data ? [].concat(...data) : [];
  const isInitialLoading = !data && !error;

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // reach the end
        if (entries[0].isIntersecting === true) {
          console.log("Reach bottom of post");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:description" content={description}></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="twitter:description" content={description}></meta>
        <meta property="twitter:title" content={title}></meta>
      </Head>
      <div className="container flex pt-4">
        {/* Posts Feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && (
            <p className="text-lg text-center">Loading...</p>
          )}

          {posts?.map((post: Post) => (
            <PostCard
              post={post}
              key={post.identifier}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading More...</p>
          )}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        className="rounded-full cursor-pointer"
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// server side rendering
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("/posts");

//     return { props: { posts: res.data } };
//   } catch (err) {
//     return { props: { error: "Can't fetch posts: " + err.message } };
//   }
// };
