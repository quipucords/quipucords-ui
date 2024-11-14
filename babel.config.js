
module.exports = (api) => {
    api.cache(true)
    const presets = ["@babel/preset-react", "@babel/preset-env"];
    const plugins = ["@babel/plugin-transform-modules-commonjs"];

    return {
        presets,
        plugins
    };
}
