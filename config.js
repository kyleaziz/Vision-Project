settings = {
  "username": "Kyle",
  "password": "KylesPass",
  "iniFolder": "./files",
  "numPorts": 6,
  "port1": "./Port1/config.yaml",
  "port2": "./Port2/config.yaml",
  "port3": "./Port3/config.yaml",
  "port4": "./Port4/config.yaml",
  "port5": "./Port5/config.yaml"
};

exports.readSetting = function(property) {
  return settings[property];
};
