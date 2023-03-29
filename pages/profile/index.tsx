import { NextPage } from "next";
import BottomNavigation from "../../components/commons/BottomNavigation";
import styled from "styled-components";
import {
  GoogleSignIn,
  GoogleSignOut,
} from "../../components/commons/GoogleAuth";
import Link from "next/link";
import { m } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Spinner from "../../components/commons/Spinner";
import jwtDecode from "jwt-decode";

const Profile: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  let decodedToken: any = null;
  if (user) {
    decodedToken = jwtDecode((user as any).accessToken);
  }

  return (
    <>
      <BottomNavigation />
      <HeaderSection className="global-padding">
        <div className="title py-3">Mon compte</div>
      </HeaderSection>
      <Style className="bottom-navigation">
        {loading ? (
          <div className="flex my-4">
            <Spinner />
          </div>
        ) : (
          <>
            {user ? (
              <div>
                <ListMenu className="max-width-500">
                  {decodedToken?.isAdmin && (
                    <>
                      <ListItem
                        title="Ajouter une espèce"
                        link="/profile/admin/new-species"
                      />
                      <ListItem
                        title="Espèces supprimées"
                        link="/profile/admin/deleted-species"
                      />
                    </>
                  )}
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
          </>
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

// export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
//   async (context: GetServerSidePropsContext, decodedToken: string) => {
//     // your existing implementation goes here
//     return {
//       props: {},
//     };
//   }
// );

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

const ListMenu = styled.div`
  list-style: none;
`;

// ListItem component //

const ListItem = ({ title, link }: any) => {
  return (
    <ItemStyle className="global-padding">
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
