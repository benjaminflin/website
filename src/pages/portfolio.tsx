import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Head from "../components/head";
import { slides, slide } from "../components/slide.module.css";
import Exhibit from "../components/exhibit";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/prism";
import { md } from "./portfolio.module.css";
const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {value}
  </SyntaxHighlighter>
);

const text = `
\`\`\`haskell
module Main where

import Prelude
import Data.AffStream (fromCallback, fromFoldable, subscribe)
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay, launchAff_)
import Effect.Class (liftEffect)
import Effect.Console (log)

main :: Effect Unit
main = do
  let
    s =
      fromCallback \emit -> do
        delay $ Milliseconds 10.0
        emit 1
        delay $ Milliseconds 10.0
        emit 2

    s' = do
      x <- s
      fromFoldable [ x, x * 2 ]
  launchAff_ $ subscribe (liftEffect <<< log <<< show) s'
\`\`\`
`;

const Portfolio = () => {
  return (
    <>
      <Head page="portfolio" />
      <div className={slides}>
        <div className={slide}>
          <Exhibit
            src="https://astarvis.netlify.com/"
            title="A* Algorithm visualization"
            subtitle="Note: Still in active development"
            date="Winter 2020"
            link={{
              text: "github",
              href: "https://github.com/benjaminflin/astarvis"
            }}
          />
        </div>
        <div className={slide}>
          <Exhibit
            src="https://iccwebsite.netlify.com/"
            title="International Criminal Court Exhibit"
            subtitle="Trauma, healing and hope"
            date="Summer 2018"
            link={{
              text: "github",
              href: "https://github.com/benjaminflin/icc-webiste"
            }}
          />
        </div>
        <div className={slide}>
          <Exhibit
            custom={
              <ReactMarkdown
                source={text}
                className={md}
                renderers={{ code: CodeBlock }}
              />
            }
            title="Purescript Aff Streams"
            subtitle="A Purescript Streaming library based on AVars"
            date="Winter 2019"
            link={{
              href: "https://github.com/benjaminflin/purescript-aff-streams",
              text: "github"
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Portfolio;
