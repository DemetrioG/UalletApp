import _ from "lodash";

export function stringToPath(string: string) {
  string = _.lowerCase(string);
  string = _.deburr(string);
  string = _.replace(string, / /g, "_");
  return string;
}
