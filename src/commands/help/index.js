const help = `
Pocket Doc is a dead simple static site generator meant to build documentations.
For further information, please read the docs at: ---

Usage:
  pdoc {command} {arguments}

Commands:
  g | generate {source} {dest}   build a new site from source to dest dir
  s | serve {source} {dest}      start a simple development server
  v | -v | version               show version information
  h | -h | help                  show this message
  t | themes                     show information about themes

Options:
  -d | --debug                   show errors
  -q | --quiet                   turn off outputs from commands
  --{theme-name}                 assign a --theme-name to "generate" or "serve"
`;

console.log(help);
