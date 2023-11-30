export default function (hextropy) {
  var bytes = [];
  for (var c = 0; c < hextropy.length; c += 2) {
    const int = parseInt(hextropy.substr(c, 2), 16)
    if (isNaN(int)) throw new Error("Entropy is not valid hex")
    bytes.push(int);
  }
  return bytes;
}