import styled from 'styled-components'

import * as Colors from '../../assets/styles/colors'

export const Title = styled.h1`
  color: ${Colors.ABOUT_TITLE_COLOR};
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 0;
  transition: color 0.1s ease;
`

export const Text = styled.p`
  font-size: 1rem;
  color: ${Colors.ABOUT_TEXT_COLOR};
  line-height: 1.7rem;
`

export const List = styled.ul`
  padding-left: 1rem;
`
