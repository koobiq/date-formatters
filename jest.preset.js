const nxPreset = require('@nx/jest/preset').default;

// The adapters build dates in the ambient zone and several assertions compare against a fixed
// instant, so the suite is only reproducible with the zone pinned. Set here rather than in each
// package config: every packages/*/jest.config.js loads this preset, and jest workers inherit
// process.env, so this reaches them too. UTC is the neutral choice — the expectations used to
// encode the authors' local zone and only passed there.
process.env.TZ = 'UTC';

module.exports = { ...nxPreset };
