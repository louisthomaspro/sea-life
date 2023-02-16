import Script from "next/script";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Skeleton } from "primereact/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SkeletonFacebookPost = () => (
  <div
    className="p-3"
    style={{
      border: "1px solid #dddfe2",
      borderRadius: "3px",
    }}
  >
    <div className="flex mb-3">
      <Skeleton shape="circle" size="2.8rem" className="mr-2"></Skeleton>
      <div>
        <Skeleton width="6rem" className="mb-2"></Skeleton>
        <Skeleton width="5rem" height=".5rem"></Skeleton>
      </div>
    </div>
    <Skeleton width="100%" height="150px"></Skeleton>
    <div className="flex justify-content-between mt-3">
      <Skeleton width="8rem" height="1rem"></Skeleton>
    </div>
  </div>
);

const FacebookPagePosts = () => {
  const { data, error, isLoading } = useSWR("/api/getFacebookPosts", fetcher);
  const [hideSkeleton, setHideSkeleton] = useState(false);

  useEffect(() => {
    if (data && (window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, [data]);

  if (isLoading) return <SkeletonFacebookPost />;
  if (error) return <div>Posts indisponibles</div>;

  return (
    <Style>
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v14.0&appId=518199423531488&autoLogAppEvents=1"
        nonce="3p7nM35w"
      />
      <div
        className={`absolute w-full h-20rem`}
      ></div>

      <ul>
        {data?.map((post: any) => (
          <li key={post.id} className="mb-2">
            <div
              className="fb-post"
              data-href={post.permalink_url}
              data-show-text="true"
            >
              <blockquote
                cite={post.permalink_url}
                className="fb-xfbml-parse-ignore"
              ></blockquote>
            </div>
          </li>
        ))}
      </ul>
    </Style>
  );
};

const Style = styled.div`
  position: relative;
  min-height: 276px;

  .fb-post {
    z-index: 2;
    width: 100% !important;
    > span {
      width: 100% !important;
      > iframe {
        width: 100% !important;
      }
    }
  }
`;

export default FacebookPagePosts;
