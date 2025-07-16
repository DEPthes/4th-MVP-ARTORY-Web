import RouterProvider from "./RouterProvider";
import TanstackProvider from "./TanstackProvider";

const RootProvider: React.FC = () => {
  return (
    <TanstackProvider>
      <RouterProvider />
    </TanstackProvider>
  );
};

export default RootProvider;
