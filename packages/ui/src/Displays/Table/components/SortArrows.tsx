import React from "react";
import PropTypes from "prop-types";
import FlexBox from "@clientComponents/layout/FlexBox";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { ArrowContainer, arrowIcon } from "../styles";

const SortArrows = ({ column }) => {
  if (column.isSortable === true) {
    if (column.isSorted === true) {
      return (
        <FlexBox direction="column">
          <ArrowContainer isSortedDesc={!column.isSortedDesc}>
            <MdArrowDropUp size="24px" style={arrowIcon} />
          </ArrowContainer>
          <ArrowContainer isSortedDesc={column.isSortedDesc}>
            <MdArrowDropDown size="24px" style={arrowIcon} />
          </ArrowContainer>
        </FlexBox>
      );
    }
    if (column.isSorted === false) {
      return (
        <FlexBox direction="column">
          <ArrowContainer isSortedDesc>
            <MdArrowDropUp size="24px" style={arrowIcon} />
          </ArrowContainer>
          <ArrowContainer isSortedDesc>
            <MdArrowDropDown size="24px" style={arrowIcon} />
          </ArrowContainer>
        </FlexBox>
      );
    }
  }
  return null;
};

SortArrows.propTypes = {
  column: PropTypes.object.isRequired,
};

export default SortArrows;
