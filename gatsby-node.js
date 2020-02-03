const { exec } = require("child_process");
exec(process.env.NODE_ENV === "development" ? "tcm src -c -w" : "tcm src -c");
