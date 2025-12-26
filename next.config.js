/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname
    return config
  },
  images: {
    domains: [ "img.clerk.com", "dummyimage.com", "ik.imagekit.io"], // add ImageKit too
  },
}

module.exports = nextConfig