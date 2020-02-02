import React from "react";
import Head from "../components/head";
import { Router } from "@reach/router";
import Home from "../components/home";

const IndexPage = () => {
  return (
    <>
      <Head />
      <Router>
        <Home path="/" />
      </Router>
    </>
  );
};

export default IndexPage;
