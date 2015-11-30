const context = require.context('./src', true, /(.)(test|spec)\.jsx?$/);
context.keys().forEach(context);
