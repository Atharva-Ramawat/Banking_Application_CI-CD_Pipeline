import React from 'react';
import { StyledCopyright } from './styles';

export default function Copyright() {
  return (
    <StyledCopyright>
      Copyright &copy; {new Date().getFullYear()}. Made by{' '}
      <a href="https://github.com/apurvanand" target="_blank">
        Apurv Anand
      </a>
    </StyledCopyright>
  );
}
