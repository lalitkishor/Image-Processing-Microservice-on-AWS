import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

/**************************************************************************** */
const getFilteredImage = async (req, res) => {
  try {
    if (!req.query?.image_url)
      return res.status(404).send({
        error: true,
        message: "URL missed",
      });
    const imgPath = await filterImageFromURL(req.query.image_url);
    res.status(200).sendFile(imgPath, () => {
      deleteLocalFiles([imgPath]);
    });
  } catch (err) {
    res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  }
};

app.get("/filteredimage", (req, res) => {
  getFilteredImage(req, res);
});

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
