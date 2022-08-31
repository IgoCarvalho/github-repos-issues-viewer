import styled, { css, keyframes } from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
  max-width: 750px;
  background-color: #fff;
  border-radius: 5px;
  margin: 80px auto;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 1px solid rgba(0, 0, 0, 0.24);

  h1 {
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;

  input {
    flex: 1;
    border-radius: 4px;
    border: 2px solid #ddd;
    padding: 10px 15px;
    outline: none;

    &:active,
    &:focus {
      border-color: #0d2636;
    }
  }
`;

const spinAnimation = keyframes`
  from {
    rotate: 0deg;
  }

  to {
    rotate: 360deg;
  }
`;

type SubmitButtonProps = { isLoading: boolean };

export const SubmitButton = styled.button<SubmitButtonProps>`
  background-color: #0d2636;
  border: none;
  border-radius: 4px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 300ms;

  &:hover {
    background-color: ${lighten(0.1)('#0d2636')};
  }

  &:not(:disabled):active {
    scale: 0.95;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:last-child {
    margin-left: 10px;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      svg {
        animation: ${spinAnimation} 2s linear infinite;
      }
    `}
`;

export const ReposList = styled.ul`
  margin-top: 20px;
  list-style: none;

  a {
    text-decoration: none;
  }
`;

export const ReposListHeader = styled.div`
  text-align: right;
  padding: 10px;

  p {
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

export const ReposListItem = styled.li`
  padding: 0px 15px;
  border: 2px solid transparent;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  transition: border 200ms;

  a {
    flex: 1;
    text-decoration: none;
    font-weight: bold;
    color: #222;
    padding: 20px 0;
  }

  & + li {
    margin-top: 10px;
  }

  &:hover {
    border-color: #0d2636;
  }

  &:active {
    scale: 0.99;
  }
`;

export const RemoveRepoButton = styled.button`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
  transition: background 200ms;

  &:hover {
    background-color: #f8d7da;
    border-color: #842029;
    color: #842029;
  }
`;
