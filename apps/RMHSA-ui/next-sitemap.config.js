module.exports = {
  siteUrl: "https://www.rmhsagulu.com/",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin", "/api/*"],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/admission'),
    await config.transform(config, '/contactUs'),
    await config.transform(config, '/gallery'),
    await config.transform(config, '/school-life'),
    await config.transform(config, '/give-to-RMHS'),
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api/"] },
    ],
    additionalSitemaps: [
      'https://www.rmhsagulu.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Set higher priority for important pages
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    } else if (['/about', '/admission', '/contactUs'].includes(path)) {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'weekly';
    } else if (['/gallery', '/school-life', '/give-to-RMHS'].includes(path)) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'monthly';
    }

    return customConfig;
  },
};
