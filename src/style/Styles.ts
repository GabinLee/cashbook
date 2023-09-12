export const Colors = {
  main: 'var(--main)',
  main_hover: 'var(--main_hover)',
  light_main: 'var(--light_main)',
  light_main_hover: 'var(--light_main_hover)',


  light_red: `var(--light_red)`,
  red: `var(--red)`,
  light_peach: `var(--light_peach)`,
  peach: `var(--peach)`,
  light_yellow: `var(--light_yellow)`,
  yellow: `var(--yellow)`,
  light_green: `var(--light_green)`,
  green: `var(--green)`,
  light_blue: `var(--light_blue)`,
  blue: `var(--blue)`,
  extra_light_purple : `var(--extra_light_blue)`,
  light_purple: `var(--light_purple)`,
  purple: `var(--purple)`,
  pink: 'var(--pink)',

  gray_5: '#555',
  gray_be: `var(--gray_be)`,
  gray_c: `var(--gray_c)`,
  gray_e5: `var(--gray_e5)`,
  gray_e: 'var(--gray_e)',
  // gray_f5: `var(--gray_f5)`
}

export const Font = {
  // size_12: '12px',
  // size_16: '16px'
}


export const Flex = (direction='row', align='stretch', justify='flex-start') => `
  display: flex;
  flex-direction: ${direction};
  align-items: ${align};
  justify-content: ${justify};
`;


// export const Mixins = {
//   flexBox: (direction = 'row', align = 'stretch', justify = 'flex-start') => `
//     display: flex;
//     flex-direction: ${direction};
//     align-items: ${align};
//     justify-content: ${justify};
//   `
// }



// [
//   '#fe7877bf',
//   '#fd925ebf',
//   '#f7d021bf',
//   '#88e18ebf',
//   '#2dcc70bf',
//   '#99e1ffbf',
//   '#5fa9ffbf',
//   '#c29effbf',
//   '#fb6a87bf'
//   // '#fcb100',
//   // '#9ff23a',
//   // '#6ad922',
//   // '#2acec6',
//   // '#04e6f7',
//   // '#70ffd9',
//   // '#55cdff',
//   // '#fb88ff',
//   // '#fc889f',
//   // '#fb6a87',
//   // '#b79470',
// ]