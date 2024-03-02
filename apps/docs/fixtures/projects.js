// @ts-check

/**
 * @typedef {{
 *  sidebar: (string|[{type: string, dirName: string}])[],
 *  imageUrl: string,
 *  description: string,
 *  packageName: string,
 *  href: string,
 *  title: string
 *  }} Project
 */

/**
 * @type {[Project]}
 */
const projects = [
  defineProjectByConvention("react-async-modal-hook", {
    description:
      "React hook for improved DX with async UI flows like modals, toasts, drawers, etc.",
    imageUrl: "/img/steps.webp",
  }),
];

/**
 * @param {string} packageName
 * @param {{imageUrl: string, description: string}} options
 * @returns {Project}
 */
function defineProjectByConvention(packageName, { imageUrl, description }) {
  return {
    packageName,
    title: packageName,
    href: `/docs/${packageName}/`,
    imageUrl,
    description,
    sidebar: [packageName, [{ type: "autogenerated", dirName: packageName }]],
  };
}

module.exports = { projects };
