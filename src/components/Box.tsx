import styled from "@emotion/styled";
import React from "react";
import {
  color,
  layout,
  LayoutProps,
  ColorProps,
  border,
  display,
  BorderProps,
  DisplayProps,
  FlexboxProps,
  flexbox,
  TypographyProps,
  typography,
  space,
  SpaceProps,
  position,
  PositionProps,
} from "styled-system";

export type BoxProps = LayoutProps &
  ColorProps &
  BorderProps &
  DisplayProps &
  FlexboxProps &
  TypographyProps &
  SpaceProps &
  PositionProps;

const Box = styled.div<BoxProps>`
  ${layout}
  ${color}
  ${border}
  ${display}
  ${flexbox}
  ${typography}
  ${space}
  ${position}
`;

export default Box;
