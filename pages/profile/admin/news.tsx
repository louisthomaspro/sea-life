import { NextPage } from "next";

const News: NextPage = () => {
  return <>News</>;
};

News.getInitialProps = async (context) => {
  // // Check if the user is an admin
  // const isAdmin = await checkIfAdmin();

  // // If the user is not an admin, redirect them to a different page
  // if (!isAdmin) {
  //   context.res.writeHead(302, { Location: "/profile" });
  //   context.res.end();
  // }

  return {};
};

export default News;
