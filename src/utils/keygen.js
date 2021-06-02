import openpgp from "openpgp"; // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({ path: "openpgp.worker.js" }); // set the relative web worker path

// Set Firebase Admin options
// let serviceAccount = require("./fraser-votes-5da49fb5e231.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// Generate Keys
export const genKeys = async (name, email) => {
  // Set Key Options
  const genOptions = {
    userIds: [{ name, email }], // multiple user IDs
  };

  const keys = await openpgp.generateKey(genOptions);

  return keys;
};

// Encrypt Data
export const encrypt = async (plaintext, pubkey) => {
  // Encrypt a test string with public key
  const encOptions = {
    message: await openpgp.message.fromText(plaintext),
    publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
  };

  const encrypted = await openpgp.encrypt(encOptions).then((ciphertext) => {
    return ciphertext.data;
  });

  return encrypted;
};

// Upload keys to server, print private key to console
// TODO: Implement

// Ask user for private key again
// TODO: Implement

// Decrypt Data
export const decrypt = async (ciphertext, privkey) => {
  // Decrypt test string, check if it matches
  const decOptions = {
    message: await openpgp.message.readArmored(ciphertext),
    privateKeys: (await openpgp.key.readArmored(privkey)).keys,
  };

  const decrypted = await openpgp.decrypt(decOptions).then((plaintext) => {
    return plaintext.data;
  });

  return decrypted;
};

const test = async () => {
  const testString = "Fraser Votes 2020";
  console.log(testString);

  const keys = await genKeys("Jon Smith", "jon@example.com");
  console.log(keys.publicKeyArmored);
  console.log(keys.privateKeyArmored);

  const ciphertext = await encrypt(testString, keys.publicKeyArmored);
  console.log(ciphertext);

  const plaintext = await decrypt(ciphertext, keys.privateKeyArmored);
  console.log(plaintext);

  if (plaintext === testString) {
    console.log("Check Succeeded!");
  } else {
    console.log("Check Failed!");
  }

  console.log("DONE");
};
