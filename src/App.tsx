import React from "react";
import { BrowserSolidLdoProvider } from "@ldo/solid-react";
import { Layout } from "./components/Layout";
import { Blog } from "./components/Blog";

const App: React.FC = () => {
  return (
    <BrowserSolidLdoProvider>
      <Layout>
        <Blog />
      </Layout>
    </BrowserSolidLdoProvider>
  );
};

export default App;
