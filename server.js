const { app } = require('./app');

//Utils
const { initModels } = require('./models/initModels');
const { db } = require('./utils/database.util');

const startServer = async () => {
  try {
    await db.authenticate();

    //Establish relations between models
    initModels();

    await db.sync();

    // Set server to listen
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log('Express app running! on PORT', PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();