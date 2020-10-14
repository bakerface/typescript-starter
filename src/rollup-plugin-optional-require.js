const REGEX_OPTIONAL_REQUIRE = /try\s*{.*?require\(.*?\).*?}\s+catch[^{]*/gs;

function transform(input) {
  const code = input.replace(REGEX_OPTIONAL_REQUIRE, "");
  return { code };
}

export default function optionalRequire() {
  return {
    name: "optional-require",
    transform,
  };
}
