"use client";

import { PageHeaderComponent } from "./types";
import "./styles.scss";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useResizeObserver } from "usehooks-ts";
import { motion, AnimatePresence } from "motion/react";
import PageHeaderRegular from "./components/PageHeaderRegular";
import PageHeaderScroll from "./components/PageHeaderScroll";
import { ScrollTop } from "@repo/ui";

const modalVariants = {
  visible: { opacity: 1, top: 0, transition: { when: "beforeChildren" } },
  hidden: { opacity: 0, top: -100, transition: { when: "afterChildren" } },
};

const PageHeader = ({
  title,
  description,
  pageHeaderButtons,
  pageStates = [],
  pageState,
  setPageState,
  pageHeaderContent,
  emptyContent,
  createClass,
  refetch,
}: PageHeaderComponent) => {
  const pageHeader = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { width = 0 } = useResizeObserver({
    ref: pageHeader,
    box: "border-box",
  });

  return (
    <>
      <div ref={ref} style={{ width: "100%", position: "relative" }}>
        <PageHeaderRegular
          ref={pageHeader}
          title={title}
          description={description}
          pageHeaderButtons={pageHeaderButtons}
          pageStates={pageStates}
          pageState={pageState}
          setPageState={setPageState}
          pageHeaderContent={pageHeaderContent}
          emptyContent={emptyContent}
          createClass={createClass}
          refetch={refetch}
        />
      </div>
      <AnimatePresence>
        {!inView && (
          <motion.div
            className="pageheader_scroll_container"
            key="pageheader"
            id="pageheader"
            style={{ width }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <PageHeaderScroll
              title={title}
              pageHeaderButtons={pageHeaderButtons}
              pageStates={pageStates}
              pageState={pageState}
              setPageState={setPageState}
              pageHeaderContent={pageHeaderContent}
              emptyContent={emptyContent}
              createClass={createClass}
              refetch={refetch}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollTop show={!inView} />
    </>
  );
};

export default PageHeader;
