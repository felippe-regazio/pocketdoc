const themesHelp = `
Pocket Doc uses Plume CSS as base design micro framework.
Here is a list of all pre defined themes you can use on your build.
For custom themes creation, please read the docs at: ---

Usage:
  Add the "theme" key on your "pocketdoc.config.json" 
  with the desired theme name, Ex:

  {
    (...)
    "theme": "default-dark"
  }
  
  Or pass the theme name on command line prefixed by a --
  Ex: pocketdoc generate {target} --default-dark

  Themes passed by command live has precedence over themes
  passed via config file.

Built-in Themes:
  default-dark
  sweet-carnival
  solar-theme
  dark-blue-ocean
  skinny-theme
  fluorescent-green
  black-and-white
  wooden-theme
  solid-pink
`;

console.log(themesHelp);
