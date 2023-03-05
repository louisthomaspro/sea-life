import { NextPage } from "next";
import BottomNavigation from "../../components/commons/BottomNavigation";
import styled from "styled-components";
import {
  GoogleSignIn,
  GoogleSignOut,
} from "../../components/commons/GoogleAuth";
import Link from "next/link";
import { m } from "framer-motion";
import { shader } from "../../utils/helper";
import useUser from "../../iron-session/useUser";
import { withSessionSsr } from "../../iron-session/withSession";
import { IUser } from "../../types/User";
import { useEffect, useState } from "react";

const Profile: NextPage<{
  user: IUser;
}> = ({ user }) => {
  const [sessionUser, setSessionUser] = useState(user);
  const { user: contextUser } = useUser();

  useEffect(() => {
    if (contextUser && contextUser !== sessionUser) {
      setSessionUser(contextUser);
    }
  }, [contextUser]);

  return (
    <>
      <BottomNavigation />
      <HeaderSection className="global-padding">
        <div className="title py-3">Mon compte</div>
      </HeaderSection>
      <Style className="bottom-navigation">
        {sessionUser?.isLoggedIn ? (
          <div>
            <ListMenu className="max-width-500">
              {/* <ListItem title="Admin" link="/profile/admin/news" /> */}
            </ListMenu>
            <div className="flex justify-content-center p-5">
              <GoogleSignOut />
            </div>
          </div>
        ) : (
          <div className="flex justify-content-center p-5">
            <GoogleSignIn />
          </div>
        )}
        <Feedback>
          <div>Une question ou une suggestion ?</div>
          <Link
            className="contact-link"
            href="mailto:louisthomas.pro@gmail.com"
          >
            Contactez-nous!
          </Link>
        </Feedback>
      </Style>
    </>
  );
};

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
  return {
    props: {
      user: req.session.user ?? null,
    },
  };
});

export default Profile;

// Style
const Style = styled.div`
  position: relative;
`;

const Feedback = styled.div`
  margin-top: 1rem;
  text-align: center;

  > .contact-link {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(301.08deg, #317074 6.63%, #034c82 82.39%);

  > .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    text-align: center;
  }
`;

const ListMenu = styled.ul`
  list-style: none;
`;

// ListItem component //

const ListItem = ({ title, link }: any) => {
  return (
    <ItemStyle
      whileTap={{
        backgroundColor: shader(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--primary-color")
            .trim(),
          1
        ),
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
      className="global-padding"
    >
      <Link href={link}>
        <div className="title">{title}</div>
      </Link>
    </ItemStyle>
  );
};

const ItemStyle = styled(m.li)`
  border-bottom: 1px solid var(--border-color);

  > a {
    display: block;
    padding: 1rem 0;

    > .title {
      font-size: 1rem;
      font-weight: 600;
    }
  }
`;
