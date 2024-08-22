import "../../style.scss";
import Header from "../../components/header.jsx";
import Cursor from '../../buttons/cursor/cursor.jsx';
import Footer from '../../components/footer/footer.jsx';
import Spacer from '../../buttons/spacer.jsx';

export const metadata = {
  title: 'BSN Cosmetics | Fotografía de producto',
  description: 'Fotografía de producto para Private Label BSN Cosmetics realizada en 2023.',
};

export default function BsnLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Spacer className="spacer-xxl" />
      <Footer />
      <Cursor />
    </>
  );
}