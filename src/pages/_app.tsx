import { type AppType } from "next/dist/shared/lib/utils";
import { ModalProvider } from "~/component/Context";
import "~/styles/globals.css";
import "~/styles/carousal.css";
import { useResizeParent } from "~/utils/useResize";

const MyApp: AppType = ({ Component, pageProps }) => {
  useResizeParent();
  return (
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  );
};

export default MyApp;
