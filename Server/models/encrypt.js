function encrypt(string) {
  return require("crypto").createHash("sha1").update(string).digest("hex");
}

export default encrypt;
