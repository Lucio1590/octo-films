import { Box, styled, Typography } from '@mui/material'

import octoFilmsLogo from '/logo.svg'

const ImageLogo = styled('img')({
  width: 50,
  height: 50,
  //   filter: 'drop-shadow(0 0 16px #8e24aa88)',
})

const StyledNavbarLogoContainer = styled(Box)<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: 10,
  [theme.breakpoints.down('md')]: {
    display: isMobile ? 'flex' : 'none',
  },
  [theme.breakpoints.up('md')]: {
    display: isMobile ? 'none' : 'flex',
  },
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontWeight: 700,
  color: 'inherit',
  textDecoration: 'none',
}))

interface NavbarLogoProps {
  isMobile?: boolean
}

const NavbarLogo = ({ isMobile }: NavbarLogoProps) => {
  return (
    <StyledNavbarLogoContainer isMobile={isMobile}>
      <ImageLogo src={octoFilmsLogo} alt="Octo Films Logo" aria-label="Octo Films Logo" />
      <StyledTypography variant="h6" noWrap component="a" href="#">
        Octo Films
      </StyledTypography>
    </StyledNavbarLogoContainer>
  )
}
export default NavbarLogo
