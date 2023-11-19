export default function service(type: string, service: string) {
  return require(`./${type}/${service}`).default;
}
