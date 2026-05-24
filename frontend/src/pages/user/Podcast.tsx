import Layout from "../../components/layout/Layout";
import EmptyState from "../../components/ui/EmptyState";
import { FaMicrophone } from "react-icons/fa";

const Podcasts = () => {
  return (
    <Layout>
      <EmptyState
        icon={<FaMicrophone size={24} />}
        title="Podcasts coming soon"
        description="We are working on bringing you the best podcasts. Check back later."
      />
    </Layout>
  );
};

export default Podcasts;
