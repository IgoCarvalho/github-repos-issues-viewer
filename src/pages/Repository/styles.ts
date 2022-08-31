import { lighten, readableColor } from 'polished';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

export const Loading = styled.div`
  height: 100vh;
  color: #fff;
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  max-width: 700px;
  border-radius: 4px;
  margin: 80px auto;
  padding: 30px;
  padding-top: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 1px solid rgba(0, 0, 0, 0.24);
`;

export const RepoHeader = styled.header`
  nav {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

export const GoBackButton = styled(Link)`
  padding: 10px 15px;
  margin-right: 10px;
  border: 2px solid transparent;
  background-color: #fff;
  color: #222;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 10, 0.05);
  }

  &:active {
    scale: 0.95;
  }

  &:focus {
    border-color: #222;
  }

  svg {
    margin-right: 10px;
  }
`;

export const RepoInfo = styled.div`
  display: flex;

  img {
    width: 105px;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: block;
    margin-right: 10px;
    align-self: flex-start;
  }
`;

export const RepoActivity = styled.div`
  display: flex;
  gap: 10px;

  p {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 3px 5px;
    border-radius: 3px;

    :hover {
      background-color: #eee;
    }
  }
`;

export const IssuesList = styled.ul`
  margin-top: 30px;

  list-style: none;
`;

const listItemPadding = 5;
const userImageTop = 21;

export const IssuesListItem = styled.li`
  display: flex;
  padding: ${listItemPadding}px;
  border-radius: 0 3px 3px 3px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px;

  & + li {
    margin-top: ${userImageTop + 10}px;
  }

  a {
    text-decoration: none;
    color: #000;
    display: block;
    font-weight: bold;
    font-size: 1.8rem;

    &:hover {
      color: ${lighten(0.2)('#0d2636')};
    }
  }

  span {
    font-size: 1.4rem;
  }
`;

type IssueLabelProps = {
  color: string | null;
};

export const UserImageCard = styled.div`
  position: relative;
  top: -${userImageTop}px;

  & p {
    display: block;
    position: absolute;
    top: -${listItemPadding}px;
    left: -${listItemPadding + 1}px;
    height: ${userImageTop}px;
    padding-left: 65px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom-width: 0;
    padding-right: ${listItemPadding * 2}px;
    border-radius: 4px 4px 0 0;
    background-color: #fff;
    white-space: nowrap;
  }

  img {
    display: block;
    width: 50px;
    border-radius: 3px;
    border: 1px solid #eee;
    margin-right: 10px;
    align-self: flex-start;
    position: relative;
    z-index: 10;
  }
`;

export const IssueLabelsList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

export const IssueLabel = styled.li<IssueLabelProps>`
  /* display: inline-block; */
  /* padding: 5px; */
  border-radius: 4px;
  padding: 0 5px;
  color: ${({ color }) => readableColor(color ? `#${color}` : '#000')};
  background-color: ${({ color }) => (color ? css`#${color}` : css`#000`)};
`;

const spinAnimation = keyframes`
  from {
    rotate: 0deg;
  }

  to {
    rotate: 360deg;
  }
`;

export const LoadMoreIssuesButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin: 0 auto;
  margin-top: 15px;
  border: 2px solid transparent;
  background-color: ${lighten(0.1)('#0d2636')};
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: ${lighten(0.2)('#0d2636')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  & svg {
    margin-right: 10px;
    animation: ${spinAnimation} 1s linear infinite;
  }
`;
