/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/000',
                permanent: true
            }
        ]
    }
};


export default nextConfig;
