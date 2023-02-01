import Script from "next/script";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FacebookPagePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      `https://graph.facebook.com/v15.0/me?fields=posts%7Bcreated_time%2Cid%2Cpermalink_url%7D&access_token=EAAHXTLSPZBeABAHcM1WZBbHsze0syED7MANg0hQrdOQj0HGx8LEgToyOAUQIKrDg7mUn1bv9EqtqXxkVfA00DcnFsioUBEpK8HU2vhyzulqKMZBVwhk44cQZAHYgbVjjQfsnxiZAt4rtQhDRMLpXAH2RXPsgeoaNdQnz1HEHcfylU4Tc78hIimkq9cpFEmdaJUWHQV1vy5XxMdflAmyMU`
    )
      .then((response) => response.json())
      .then((data) => setPosts(data.posts.data));
  }, []);

  useEffect(() => {
    if (posts && (window as any).FB) {
      setTimeout(() => {
        (window as any).FB.XFBML.parse();
      }, 3000);
    }
  }, [posts]);

  return (
    <Style>
      <Script
        async
        defer
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0&appId=518199423531488&autoLogAppEvents=1"
        nonce="Crzdub8M"
      />
      <ul>
        {posts?.map((post) => (
          <li key={post.id} className="mb-2">
            <div
              className="fb-post"
              data-href={post.permalink_url}
              data-width="500"
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
  .fb-post {
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
