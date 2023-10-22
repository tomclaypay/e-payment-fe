import NodeRSA from "node-rsa";

export const genKeyPair = () => {
  const key = new NodeRSA({ b: 2048 }); // Độ dài khóa 2048-bit

  // Tạo cặp khóa công khai và riêng tư
  const publicKey = key.exportKey("pkcs8-public-pem"); // Xuất khóa công khai dưới định dạng PKCS#8 PEM
  const privateKey = key.exportKey("pkcs8-private-pem"); // Xuất khóa riêng tư dưới định dạng PKCS#8 PEM

  // In ra cặp khóa
  console.log(btoa(publicKey));
  console.log(btoa(privateKey));
};

export const rsaEncrypt = (publicKey, data) => {
  const rsa = new NodeRSA();
  rsa.importKey(atob(publicKey), "public");
  return rsa.encrypt(data, "base64");
};
