const {
  withEntitlementsPlist,
  withInfoPlist,
  createRunOncePlugin,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withNikWatchHr = (config) => {
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.NSHealthShareUsageDescription =
      cfg.modResults.NSHealthShareUsageDescription ||
      'NIK reads heart rate from your Apple Watch during food–pulse tests.';
    cfg.modResults.NSHealthUpdateUsageDescription =
      cfg.modResults.NSHealthUpdateUsageDescription ||
      'NIK may record a short workout session while measuring heart rate.';
    return cfg;
  });

  config = withEntitlementsPlist(config, (cfg) => {
    cfg.modResults['com.apple.developer.healthkit'] = true;
    cfg.modResults['com.apple.developer.healthkit.background-delivery'] = true;
    return cfg;
  });

  const projectRootHint = config._internal?.projectRoot;
  if (projectRootHint) {
    try {
      const src = path.join(__dirname, '..', 'watch-app');
      const dest = path.join(projectRootHint, 'ios', 'NIKWatchApp');
      if (fs.existsSync(src)) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
          fs.copyFileSync(path.join(src, file), path.join(dest, file));
        }
      }
    } catch {
    }
  }

  return config;
};

module.exports = createRunOncePlugin(withNikWatchHr, 'nik-watch-hr', '1.0.0');
