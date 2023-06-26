import Head from "next/head";
import { FC, ReactNode, useState } from "react";
import Carousal from "~/component/Carousal";
import { ReactHookForm } from "~/component/Form";
import useResize from "~/utils/useResize";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Container>
        <Counter label={<Logger />} />
      </Container> */}
      <Carousal />
      <Box number={5000} />
    </>
  );
}

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-screen place-items-start pt-8">{children}</div>
  );
};

const Box = ({ number }: { number: number }) => {
  const device = useResize();
  return (
    <div className="rounded-sm border border-[#ddd] p-2">
      {device}--{number}
    </div>
  );
};

type Props = {
  label: ReactNode;
};
const Logger = () => {
  return <div>Logging....</div>;
};
function Counter(props: Props) {
  const [count, setCount] = useState(0);
  const doubleCount = count * 2;
  return (
    <div>
      <button onClick={() => setCount(count + 1)}> +</button>
      {count},{props.label}
      <button onClick={() => setCount(count - 1)}> -</button>
      <div>{doubleCount}</div>
    </div>
  );
}
Box.displayName = "BoxBOb";