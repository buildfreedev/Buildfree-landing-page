// The buildfree SDK on npm: https://www.npmjs.com/package/buildfree
// One place for the install line, the link and the code samples, so the
// landing page and the docs always show the same thing.
// (Samples follow the package README: CommonJS, key read from an environment variable.)

export const NPM_URL = 'https://www.npmjs.com/package/buildfree';
export const INSTALL_CMD = 'npm install buildfree';

const SETUP = `const { BuildFree } = require("buildfree");

const buildfree = new BuildFree({ apiKey: process.env.BUILDFREE_KEY });
`;

// `project` and `collection` come from the "make it yours" boxes in the docs.
export const sdkSamples = ({ project = 'my-shop', collection = 'products', form = 'contact-form' } = {}) => ({
  read: {
    label: 'Read a list',
    file: 'products.js',
    code: `${SETUP}
// inside any async function
const products = await buildfree.getRecords({
  projectSlug: "${project}",
  collectionSlug: "${collection}",
});

console.log(products.data); // your entries, ready to show`,
  },
  one: {
    label: 'Read one item',
    file: 'product.js',
    code: `${SETUP}
const product = await buildfree.getRecord({
  projectSlug: "${project}",
  collectionSlug: "${collection}",
  recordId: "record-id",
});`,
  },
  form: {
    label: 'Send a form',
    file: 'contact.js',
    code: `${SETUP}
await buildfree.submitForm({
  projectSlug: "${project}",
  formSlug: "${form}",
  data: { name: "Rahul", email: "rahul@mail.com", message: "Hello!" },
});`,
  },
});
