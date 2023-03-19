import styled, { css } from "styled-components";
import React, { FC, MouseEventHandler } from "react";

interface IMyButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  primary?: boolean;
  secondary?: boolean;
  outline?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
}

const Button = styled.button<IMyButtonProps>`
  /* Default styles */
  padding: 0.8rem 1rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
  justify-content: center;
  display: flex;

  /* Primary style */
  ${({ primary }) =>
    primary &&
    css`
      color: #fff;
      background-color: #282828;
      border: 1tpx solid #282828;

      &:active {
        background-color: #1e1e1e;
        border-color: #1e1e1e;
      }
    `}

  /* Outline style */
  ${({ outline }) =>
    outline &&
    css`
      color: var(--text-color);
      background-color: white;
      border: 1px solid #282828;

      &:active {
        background-color: #f0f0f0;
      }
    `}

  /* Disabled style */
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const MyButton: FC<IMyButtonProps> = (props) => {
  return (
    <Button
      className={props.className}
      onClick={props.onClick}
      primary={props.primary}
      secondary={props.secondary}
      outline={props.outline}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      type={props.type}
    >
      {props.children}
    </Button>
  );
};

export default MyButton;
