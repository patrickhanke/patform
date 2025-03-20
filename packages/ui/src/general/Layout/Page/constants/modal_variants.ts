const modal_variants = {
  visible: { opacity: 1, top: 0, transition: { when: "beforeChildren" } },
  hidden: { opacity: 0, top: -100, transition: { when: "afterChildren" } },
};

export default modal_variants;
