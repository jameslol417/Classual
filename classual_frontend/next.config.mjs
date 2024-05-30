import dotenv from 'dotenv';

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.tsv$/,
            use: 'raw-loader',
        });

        return config;
    },
};

export default nextConfig;