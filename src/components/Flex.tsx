import styled from "@emotion/styled";
import React from "react";
import { color, layout, border, display, flexbox } from "styled-system";
import Box, { BoxProps } from "./Box";

const Flex = styled(Box)<BoxProps>`
  display: flex;
  ${display}
`;

export default Flex;
